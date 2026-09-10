# Rewrite Sandbox to React + Node.js

Since you prefer a standard React (frontend) and Node.js (backend) architecture over Next.js, we will pivot the standalone sandbox architecture.

## User Review Required

> [!IMPORTANT]
> To keep the deployment extremely simple (just like Next.js), I propose we run the Node.js Express server on Port 3005, and have it **automatically serve the built React frontend**. This way, you don't need two separate domains or complex Nginx setups. Both the UI and the API will be available under `/tally`.

## Proposed Changes

We will restructure the `/tally_sandbox` directory into a unified Node.js project containing a React folder.

### 1. Node.js Backend (`tally_sandbox/`)
- **[DELETE]** All Next.js specific files (`next.config.ts`, `.next`, `app/` folder).
- **[NEW]** `server.js`: An Express server that handles the two required endpoints (`GET /api/v1/tally/export/day-end` and `POST /api/sandbox/entry`).
- **[NEW]** `db.js`: The same local JSON persistence logic we used previously.
- **[MODIFY]** `package.json`: Update to standard Node.js dependencies (`express`, `cors`).

### 2. React Frontend (`tally_sandbox/frontend/`)
- **[NEW]** A Vite-based React application initialized in the `frontend` folder.
- **[NEW]** `src/App.tsx`: We will port the exact same premium UI we built for Next.js over to standard React.
- **[NEW]** `vite.config.ts`: Configured with `base: '/tally/'` to ensure all assets load correctly when proxied behind Nginx on the live server.

## Verification Plan

### Automated Tests
1. Run `npm run build` in the `frontend` folder.
2. Run `node server.js` in the root folder.
3. Verify that `http://localhost:3005/tally` serves the React UI.
4. Verify that `http://localhost:3005/tally/api/sandbox/entry` correctly saves data.

### Manual Verification
- We will deploy this back to the live server (`95.135.166.109`), restarting the PM2 process, and ensure it works flawlessly under the `vrp.retailnode.in/tally` Nginx reverse proxy.
