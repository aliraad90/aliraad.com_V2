import { Client as SSHClient } from 'ssh2';

const cfg = {
  host: process.env.MIKROTIK_HOST,
  port: Number(process.env.MIKROTIK_PORT || 22),
  username: process.env.MIKROTIK_USERNAME,
  password: process.env.MIKROTIK_PASSWORD,
};

function isConfigured() {
  return !!(cfg.host && cfg.username && cfg.password);
}

function runRouterOS(cmd) {
  return new Promise((resolve, reject) => {
    if (!isConfigured()) {
      // Mock response in dev
      return resolve({ stdout: `MOCK: ${cmd}`, stderr: '' });
    }
    const conn = new SSHClient();
    let stdout = '';
    let stderr = '';
    conn
      .on('ready', () => {
        conn.exec(cmd, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }
          stream
            .on('close', () => {
              conn.end();
              resolve({ stdout, stderr });
            })
            .on('data', (data) => (stdout += data.toString()))
            .stderr.on('data', (data) => (stderr += data.toString()));
        });
      })
      .on('error', (e) => reject(e))
      .connect(cfg);
  });
}

export async function createPPPUser({ username, password, service, profile }) {
  const svc = service || process.env.MIKROTIK_PPP_SERVICE || 'l2tp';
  const prof = profile || process.env.MIKROTIK_PPP_PROFILE || 'default-encryption';
  const cmd = `/ppp secret add name=${username} password=${password} service=${svc} profile=${prof}`;
  return runRouterOS(cmd);
}

export async function revokePPPUser({ username }) {
  const cmd = `/ppp secret remove [find name=${username}]`;
  return runRouterOS(cmd);
}

export async function listActivePPP() {
  const cmd = `/ppp active print detail without-paging`;
  const { stdout } = await runRouterOS(cmd);
  // Very naive parse for MVP; expect lines with name, address, uptime
  const lines = stdout.split('\n').map((l) => l.trim()).filter(Boolean);
  const items = [];
  for (const l of lines) {
    // Example (approx): "0 name=corp1 address=10.0.0.10 uptime=1h2m caller-id=..."
    const nameMatch = l.match(/name=([^\s]+)/);
    const addrMatch = l.match(/address=([^\s]+)/);
    const upMatch = l.match(/uptime=([^\s]+)/);
    if (nameMatch) {
      items.push({
        name: nameMatch[1],
        address: addrMatch ? addrMatch[1] : null,
        uptime: upMatch ? upMatch[1] : null,
        lastSeen: new Date().toISOString(),
      });
    }
  }
  if (!isConfigured()) {
    return [
      { name: 'demo-company', address: '10.0.0.10', uptime: '5m12s', lastSeen: new Date().toISOString() },
    ];
  }
  return items;
}
