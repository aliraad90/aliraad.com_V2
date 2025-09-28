# VPN Management MVP

This is a simple MVP web app to manage VPN users for companies.

- Backend: Node.js (Express) + MongoDB (Mongoose)
- Frontend: React (Vite)
- VPN Server: MikroTik CHR via SSH (RouterOS). MVP uses PPP Secrets (username/password) and provides a TXT config for clients.

## Features (Milestone 1)
- Admin and Company login (JWT)
- Admin: create/enable/disable companies
- Auto-generate VPN credentials on company creation
- Company: download client config (TXT) with credentials
- Connected clients list and status (basic)

## Prerequisites
- Node.js 18+
- MongoDB 6+
- Access to MikroTik CHR (SSH enabled)

## Setup

1) Backend env

Create `server/.env` (copy from `.env.example`):

```
PORT=4000
JWT_SECRET=change_me
MONGODB_URI=mongodb://localhost:27017/vpn_mvp

# MikroTik CHR (RouterOS) connection
MIKROTIK_HOST=1.2.3.4
MIKROTIK_PORT=22
MIKROTIK_USERNAME=admin
MIKROTIK_PASSWORD=your_router_password
MIKROTIK_PPP_SERVICE=l2tp
MIKROTIK_PPP_PROFILE=default-encryption
```

2) Install deps

Backend:
```
cd server
npm install
```

Frontend:
```
cd client
npm install
```

3) Seed admin user
```
cd server
npm run seed
```
This creates tables and a default admin:
- email: admin@example.com
- password: admin123

4) Run services

Backend:
```
cd server
npm run dev
```

Frontend:
```
cd client
npm run dev
```

5) Login and test
- Open the frontend URL printed by Vite (usually http://localhost:5173)
- Login as Admin
- Create a company
- Download company config from Company dashboard
- View connected clients in Status

## Notes
- If MikroTik env vars are missing, the app uses a mock and returns sample data. Set env vars to activate real SSH integration.
- Storing VPN passwords in plaintext is for MVP only. Replace with a KMS or one-time download flow later.
- Subscription expiry is manual (admin sets `expires_at`); expired companies cannot login.
