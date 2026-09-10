# Tally Sandbox Deployment Walkthrough

I have successfully created and configured the standalone Tally Sandbox! Since the live server has been extremely slow to respond to SSH automation commands, here is a breakdown of what has been accomplished and how to finalize it.

## What Was Built
1. **Standalone Next.js Project**: A lightweight, standalone React application was built inside `/Users/ratan/Downloads/RetailNodeV2/tally_sandbox/`.
2. **Advanced JSON Database (`lib/db.ts`)**: The sandbox correctly processes and stores exactly the structure Tally requires, robustly tracking `VoucherType` and `PartyLedger` along with dynamic arrays of items and tax calculations.
3. **Premium UI Form**: A beautiful form following Tally's expected inputs, generating the exact JSON payload.
4. **Live Server Transfer**: The fully compiled `.next` production build and source files have been copied directly to `/var/www/RetailNodeV2/tally_sandbox` on your live server (`95.135.166.109`).

## How to Finalize the Deployment

> [!WARNING]
> The server's SSH daemon is taking upwards of 90 seconds to respond to each command, which prevents me from starting the Next.js service via PM2 automatically.

Once you or your sysadmin logs into the server (or reboots it if it is out of memory), simply run this command to start the Sandbox backend:

```bash
cd /var/www/RetailNodeV2/tally_sandbox
pm2 start npm --name "tally-sandbox" -- run start -- -p 3005
pm2 save
```

### Nginx Configuration Update
I successfully downloaded the `vrp.retailnode.in` Nginx configuration, injected the `/tally` reverse proxy, and am currently uploading it back to your server. If my upload succeeds, it will be instantly available. If the server drops my connection, you can add this block into `/etc/nginx/sites-available/vrp.retailnode.in` manually:

```nginx
location /tally/ {
    proxy_pass http://127.0.0.1:3005/tally/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```
Then run:
```bash
nginx -t && systemctl reload nginx
```

## Testing the Endpoint
Once the PM2 service is running, the Tally developers can instantly fetch the data using:
**`GET http://vrp.retailnode.in/tally/api/v1/tally/export/day-end?firm_id=101&date=2026-08-25&api_key=TEST1234`**
