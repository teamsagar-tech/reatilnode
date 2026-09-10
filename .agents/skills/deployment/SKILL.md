---
name: retailnode-deployment
description: Standard Operating Procedure for deploying frontend and backend code to the RetailNode production server.
---

# RetailNode Deployment SOP

When instructed to deploy, upload, or push code to the live server, you **MUST** use these exact commands. Do not deviate from these paths or SSH credentials.

## Server Details
- **Host**: 162.19.81.108
- **Port**: 20005
- **User**: root
- **Password**: H-ABvSGw93024Lrs

## 1. Frontend Deployment (React/Vite)
The production frontend is hosted at `/var/www/RetailNodeV2/FrontEndV2/` on the remote server.

To deploy the frontend, navigate to `/Users/ratan/Downloads/RetailNodeV2/FrontEndV2` and execute the following exact command:
```bash
npm run build && \
sshpass -p 'H-ABvSGw93024Lrs' rsync -avz -e "ssh -o StrictHostKeyChecking=no -p 20005" dist/ root@162.19.81.108:/var/www/RetailNodeV2/FrontEndV2/dist/ && \
sshpass -p 'H-ABvSGw93024Lrs' ssh -o StrictHostKeyChecking=no -p 20005 root@162.19.81.108 "cp -r /var/www/RetailNodeV2/FrontEndV2/dist/* /var/www/RetailNodeV2/FrontEndV2/"
```

## 2. Backend Deployment (Node.js/Express)
The production backend API is hosted at `/var/www/RetailNodeV2/backend/` and managed by PM2 under the name `retailnode-api`.

To deploy backend files (e.g., controllers or routes), use `rsync` from the local `backend` directory, then restart the PM2 process:

```bash
# Example for deploying controllers:
sshpass -p 'H-ABvSGw93024Lrs' rsync -avz -e "ssh -o StrictHostKeyChecking=no -p 20005" controllers/ root@162.19.81.108:/var/www/RetailNodeV2/backend/controllers/

# Example for deploying routes:
sshpass -p 'H-ABvSGw93024Lrs' rsync -avz -e "ssh -o StrictHostKeyChecking=no -p 20005" routes/ root@162.19.81.108:/var/www/RetailNodeV2/backend/routes/

# Restart the backend API (Mandatory after ANY backend change)
sshpass -p 'H-ABvSGw93024Lrs' ssh -o StrictHostKeyChecking=no -p 20005 root@162.19.81.108 "pm2 restart retailnode-api"
```

## 3. Database Execution
If you need to run schema changes (CREATE TABLE, ALTER) or diagnostic queries, you can run node scripts directly on the server via SSH without needing to install MySQL clients locally:

```bash
sshpass -p 'H-ABvSGw93024Lrs' ssh -o StrictHostKeyChecking=no -p 20005 root@162.19.81.108 "cd /var/www/RetailNodeV2/backend && node -e \"const mysql = require('mysql2/promise'); require('dotenv').config(); async function run() { const db = await mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME }); /* YOUR QUERY HERE */ process.exit(0); } run();\""
```
