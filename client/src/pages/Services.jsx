import React from 'react';

export default function Services() {
  const services = [
    {
      title: 'Networking (Cisco/MikroTik)',
      items: [
        'Routing, switching, VLANs, QoS, HA',
        'VPN (L2TP/IPsec, site-to-site), PPPoE',
        'Firewalling and policy design',
        'MikroTik configuration: firewall, routing, VPN (IPSec, L2TP, OpenVPN)',
        'Bandwidth management (queues, hotspot, load balancing)',
        'Remote network monitoring and troubleshooting',
      ],
    },
    {
      title: 'Security & Compliance Configuration',
      items: [
        'Implementing IAM (Identity & Access Management), MFA, and Conditional Access',
        'Setting up data protection, encryption, and compliance policies',
        'Hardening and baselines (servers, network)',
        'Vulnerability remediation & patching',
        'SIEM/logging and incident response playbooks',
      ],
    },
    {
      title: 'Backup, Monitoring & Disaster Recovery',
      items: [
        'Configuring backup strategies (Azure Backup, AWS Backup, Veeam)',
        'Setting up monitoring and alerts (CloudWatch, Azure Monitor, Sentinel)',
        'Designing disaster recovery and business continuity plans',
      ],
    },
    {
      title: 'IT Infrastructure',
      items: [
        'Server and storage planning (Windows/Linux)',
        'Active Directory, DNS, DHCP, GPO',
      ],
    },
    {
      title: 'Cloud Infrastructure Setup & Migration',
      items: [
        'Designing and deploying secure, scalable environments on Azure or AWS',
        'Migrating on-premises servers, applications, or databases to the cloud',
      ],
    },
    {
      title: 'Microsoft 365 Deployment & Administration',
      items: [
        'Setting up Microsoft 365 tenants (Exchange Online, Teams, SharePoint, OneDrive)',
        'Managing licenses, user accounts, and policies for organizations',
      ],
    },
    {
      title: 'Automation & Cost Optimization',
      items: [
        'Using tools like Azure Automation, AWS Lambda, or PowerShell to reduce manual tasks',
        'Optimizing cloud resources to lower costs (e.g., reserved instances, rightsizing VMs)',
      ],
    },
    {
      title: 'Project Management (PMP)',
      items: [
        'Scope, timelines, stakeholder comms',
        'Leading 5-30 person teams',
        'KPIs: downtime reduction, risk mitigation',
      ],
    },
  ];
  return (
    <div className="stack" style={{ padding: '24px 0' }}>
      <section className="stack card" style={{ padding: 20 }}>
        <div className="section-title">Services</div>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {services.map((s, i) => (
            <div key={i} className="card" style={{ padding: 16 }}>
              <div className="section-title" style={{ marginBottom: 8 }}>{s.title}</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
                {s.items.map((it, idx) => (
                  <li key={idx} style={{ marginBottom: 6 }}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
