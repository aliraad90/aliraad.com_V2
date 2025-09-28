import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createPPPUser } from '../lib/mikrotik.js';
import { Company } from '../models/company.js';
import { VpnAccount } from '../models/vpnAccount.js';
import { User } from '../models/user.js';

const router = express.Router();

// Admin: list companies
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ createdAt: -1 }).lean();
    res.json(companies.map((c) => ({
      id: String(c._id),
      name: c.name,
      contact_email: c.contactEmail || null,
      plan: c.plan || null,
      enabled: c.enabled,
      expires_at: c.expiresAt || null,
      created_at: c.createdAt,
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Company: iOS One-Click Connect profile (.mobileconfig)
router.get('/:id/oneclick/ios', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === 'company' && req.user.companyId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const company = await Company.findById(id).lean();
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const acct = await VpnAccount.findOne({ companyId: company._id }).sort({ createdAt: -1 }).lean();
    if (!acct) return res.status(404).json({ error: 'No VPN account found' });

    const host = process.env.MIKROTIK_HOST || 'vpn.example.com';
    const svc = (process.env.MIKROTIK_PPP_SERVICE || 'l2tp').toLowerCase();
    const psk = process.env.MIKROTIK_IPSEC_PSK || '';
    if (svc !== 'l2tp') {
      return res.status(400).json({ error: 'iOS profile currently supports L2TP only' });
    }
    if (!psk) {
      return res.status(400).json({ error: 'Server missing MIKROTIK_IPSEC_PSK for L2TP/IPsec' });
    }

    const name = `${company.name}-VPN`;
    const profile = buildIOSL2tpMobileconfig({
      name,
      organization: 'VPN Manager',
      server: host,
      psk,
      username: acct.username,
      password: acct.password,
    });

    res.setHeader('Content-Disposition', `attachment; filename="${company.name}-ios.mobileconfig"`);
    res.setHeader('Content-Type', 'application/x-apple-aspen-config');
    res.send(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Company: Windows One-Click Connect script (PowerShell)
router.get('/:id/oneclick/windows', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === 'company' && req.user.companyId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const company = await Company.findById(id).lean();
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const acct = await VpnAccount.findOne({ companyId: company._id }).sort({ createdAt: -1 }).lean();
    if (!acct) return res.status(404).json({ error: 'No VPN account found' });

    const host = process.env.MIKROTIK_HOST || 'vpn.example.com';
    const svc = (process.env.MIKROTIK_PPP_SERVICE || 'l2tp').toLowerCase();
    const psk = process.env.MIKROTIK_IPSEC_PSK || '';
    if (svc !== 'l2tp') {
      return res.status(400).json({ error: 'One-click script currently supports L2TP only' });
    }
    if (!psk) {
      return res.status(400).json({ error: 'Server missing MIKROTIK_IPSEC_PSK for L2TP/IPsec' });
    }

    const name = `${company.name}-VPN`;
    const script = buildWindowsL2tpPskScript({
      name,
      server: host,
      psk,
      username: acct.username,
      password: acct.password,
    });

    res.setHeader('Content-Disposition', `attachment; filename="${company.name}-oneclick-win.ps1"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(script);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: create new company (auto-generate VPN credentials and company login)
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { name, contact_email, plan } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const clientUsername = `c_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(Math.random()*10000)}`;
  const clientPassword = uuidv4().slice(0, 12);
  const companyLoginEmail = `${clientUsername}@example.com`;
  const companyLoginPassword = uuidv4().slice(0, 12);

  try {
    // Create company
    const companyDoc = await Company.create({ name, contactEmail: contact_email || null, plan: plan || null });

    // Create VPN account on MikroTik
    await createPPPUser({ username: clientUsername, password: clientPassword });

    await VpnAccount.create({
      companyId: companyDoc._id,
      username: clientUsername,
      password: clientPassword,
      type: 'ppp',
      configText: buildPPPConfigText(clientUsername, clientPassword),
    });

    // Create company user login
    const bcrypt = (await import('bcryptjs')).default;
    const hash = await bcrypt.hash(companyLoginPassword, 10);
    await User.create({ email: companyLoginEmail, passwordHash: hash, role: 'company', companyId: companyDoc._id });

    res.status(201).json({
      company: {
        id: String(companyDoc._id),
        name: companyDoc.name,
        enabled: companyDoc.enabled,
        expires_at: companyDoc.expiresAt || null,
      },
      vpn: { username: clientUsername, password: clientPassword },
      companyLogin: { email: companyLoginEmail, password: companyLoginPassword },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: enable/disable company
router.patch('/:id/status', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { enabled, expires_at } = req.body;
  try {
    const update = {};
    if (enabled !== undefined) update.enabled = enabled;
    if (expires_at !== undefined) update.expiresAt = expires_at ? new Date(expires_at) : null;
    const c = await Company.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!c) return res.status(404).json({ error: 'Not found' });
    res.json({
      id: String(c._id),
      name: c.name,
      contact_email: c.contactEmail || null,
      plan: c.plan || null,
      enabled: c.enabled,
      expires_at: c.expiresAt || null,
      created_at: c.createdAt,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Company: download config
router.get('/:id/config', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    // Ensure company user can only access their own
    if (req.user.role === 'company' && req.user.companyId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const company = await Company.findById(id).lean();
    if (!company) return res.status(404).json({ error: 'Company not found' });
    const acct = await VpnAccount.findOne({ companyId: company._id }).sort({ createdAt: -1 }).lean();
    if (!acct) return res.status(404).json({ error: 'No config found' });
    res.setHeader('Content-Disposition', `attachment; filename="${company.name}-vpn.txt"`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(acct.configText);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function buildPPPConfigText(username, password) {
  const host = process.env.MIKROTIK_HOST || 'vpn.example.com';
  const svc = process.env.MIKROTIK_PPP_SERVICE || 'l2tp';
  return `MikroTik VPN Credentials\n\nServer: ${host}\nService: ${svc}\n\nUsername: ${username}\nPassword: ${password}\n\nWindows: Add a new ${svc.toUpperCase()} VPN connection with the above server and credentials.\nmacOS: Add VPN (L2TP over IPSec) and enter credentials.\nAndroid/iOS: Add VPN with server and credentials.`;
}

function buildWindowsL2tpPskScript({ name, server, psk, username, password }) {
  // PowerShell script: requires admin, creates L2TP connection with PSK, connects using rasdial
  return `
<#
  One-Click Connect (Windows, L2TP/IPsec, MikroTik)
  Connection: ${name}
  Server: ${server}
#>

$ErrorActionPreference = 'Stop'

function Ensure-Admin {
  $currentIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($currentIdentity)
  if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host 'Requesting administrative privileges...'
    $psi = New-Object System.Diagnostics.ProcessStartInfo 'powershell'
    $psi.Arguments = '-NoProfile -ExecutionPolicy Bypass -File "' + $MyInvocation.MyCommand.Path + '"'
    $psi.Verb = 'runas'
    [System.Diagnostics.Process]::Start($psi) | Out-Null
    exit
  }
}

Ensure-Admin

$connectionName = '${name}'
$serverAddress = '${server}'
$psk = '${psk}'
$vpnUser = '${username}'
$vpnPass = '${password}'

try {
  # Remove existing connection if present
  if (Get-VpnConnection -Name $connectionName -AllUserConnection -ErrorAction SilentlyContinue) {
    Remove-VpnConnection -Name $connectionName -Force -AllUserConnection
  }

  Add-VpnConnection -Name $connectionName \
    -ServerAddress $serverAddress \
    -TunnelType L2tp \
    -L2tpPsk $psk \
    -AuthenticationMethod Pap,Chap,MSChapv2 \
    -EncryptionLevel Required \
    -SplitTunneling $true \
    -AllUserConnection \
    -Force | Out-Null

  # Connect using provided credentials (not persisted)
  rasdial "$connectionName" $vpnUser $vpnPass | Out-Null
  Write-Host "Connected to $connectionName"
} catch {
  Write-Error $_
  exit 1
}
`;
}

function buildIOSL2tpMobileconfig({ name, organization, server, psk, username, password }) {
  const idBase = `com.vpnmgr.${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const payloadUUID = uuidv4().toUpperCase();
  const vpnUUID = uuidv4().toUpperCase();
  // Apple mobileconfig (XML plist)
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key><string>com.apple.vpn.managed</string>
      <key>PayloadVersion</key><integer>1</integer>
      <key>PayloadIdentifier</key><string>${idBase}.vpn</string>
      <key>PayloadUUID</key><string>${vpnUUID}</string>
      <key>PayloadDisplayName</key><string>${name}</string>
      <key>UserDefinedName</key><string>${name}</string>
      <key>VPNType</key><string>L2TP</string>
      <key>Proxies</key><dict/>
      <key>IPSec</key>
      <dict>
        <key>AuthenticationMethod</key><string>SharedSecret</string>
        <key>SharedSecret</key><string>${psk}</string>
        <key>LocalIdentifierType</key><string>KeyID</string>
        <key>LocalIdentifier</key><string></string>
      </dict>
      <key>PPP</key>
      <dict>
        <key>AuthName</key><string>${username}</string>
        <key>AuthPassword</key><string>${password}</string>
        <key>CommRemoteAddress</key><string>${server}</string>
        <key>TokenCard</key><false/>
        <key>CCPMPPE40Enabled</key><true/>
        <key>CCPMPPE128Enabled</key><true/>
      </dict>
    </dict>
  </array>
  <key>PayloadType</key><string>Configuration</string>
  <key>PayloadVersion</key><integer>1</integer>
  <key>PayloadIdentifier</key><string>${idBase}.root</string>
  <key>PayloadUUID</key><string>${payloadUUID}</string>
  <key>PayloadDisplayName</key><string>${name}</string>
  <key>PayloadOrganization</key><string>${organization}</string>
  <key>PayloadDescription</key><string>${name} VPN configuration</string>
</dict>
</plist>`;
}

export default router;
