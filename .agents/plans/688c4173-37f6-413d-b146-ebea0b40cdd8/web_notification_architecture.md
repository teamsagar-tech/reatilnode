# Web & Browser Notification Architecture Plan

To support a multi-user, multi-level SaaS environment, the notification engine must handle both **In-App Notifications** (the bell icon & history page) and **Browser Push Notifications** (Chrome/Edge/Safari popups even when the tab is closed).

Here is the robust, standard architecture required to implement this natively (without paying for third-party services like OneSignal).

---

## Phase 1: Database Architecture (MySQL)

We need two new tables to manage this statefully across devices.

### 1. `InAppNotifications` Table
Stores the actual notification history so users can see a chronological list on their Notification Page.
- `id` (INT, Primary Key)
- `firm_id` (INT) - For tenant isolation.
- `user_id` (INT, Nullable) - If targeted at a specific user.
- `role_id` (INT, Nullable) - If targeted at a role (e.g., "All Store Managers").
- `title` (VARCHAR)
- `message` (TEXT)
- `link_url` (VARCHAR) - Where clicking the notification takes them.
- `is_read` (BOOLEAN DEFAULT FALSE)
- `created_at` (TIMESTAMP)

### 2. `PushSubscriptions` Table
Stores the unique browser tokens for each user's device so we can send background push notifications.
- `id` (INT)
- `user_id` (INT)
- `endpoint` (TEXT) - The unique browser endpoint URL.
- `p256dh` (VARCHAR) - Web push encryption key.
- `auth` (VARCHAR) - Web push auth secret.
- `device_info` (VARCHAR) - e.g., "Chrome on Windows", "Safari on Mac".
- `created_at` (TIMESTAMP)

---

## Phase 2: Backend Implementation (Node.js)

### 1. VAPID Keys Setup
We will install the standard `web-push` NPM package. We will generate VAPID keys (Public and Private keys) that allow our backend to securely authenticate with Google/Apple push servers.
- `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` will be stored in `.env`.

### 2. Notification Controller (`notificationController.js`)
We will create the following REST APIs:
- `POST /api/notifications/subscribe` - The frontend sends the browser's push subscription token here to save in `PushSubscriptions`.
- `GET /api/notifications` - Fetches the user's historical in-app notifications.
- `PUT /api/notifications/:id/read` - Marks a notification as read.
- `PUT /api/notifications/read-all` - Marks all as read.

### 3. Unified Dispatcher Update
We will update our existing `notificationService.js` so that `sendWebNotification(userId, title, message)` automatically:
1. Inserts a record into `InAppNotifications`.
2. Queries `PushSubscriptions` for that user's active devices.
3. Fires the payload via `web-push` to trigger the Chrome popup.

---

## Phase 3: Frontend Implementation (React / Vite)

### 1. The Service Worker (`sw.js`)
We will add a Service Worker to the `public/` directory. This script runs in the background of the browser. When a push event hits the browser, the Service Worker intercepts it and triggers the OS-level notification popup (even if the RetailNode tab is minimized).

### 2. The Subscription Hook
On successful login (or on the dashboard mount), the React app will:
1. Ask the user for permission: *"RetailNode wants to send you notifications [Allow] [Block]"*.
2. If allowed, it generates a subscription token using the `VAPID_PUBLIC_KEY`.
3. Sends that token to `POST /api/notifications/subscribe`.

### 3. The UI Components
1. **The Bell Icon (Navbar):** A bell icon that polls or uses WebSockets to show a red badge with the unread count (e.g., 🔴 3). Clicking it opens a dropdown of recent notifications.
2. **Notification Page (`/notifications`):** A dedicated page showing the full historical feed of alerts, segmented by "Unread" and "All".

---

## Execution Strategy

1. **Step 1:** Generate VAPID keys and execute the MySQL schema changes.
2. **Step 2:** Build the Backend APIs and update `notificationService.js` to utilize the `web-push` library.
3. **Step 3:** Implement the frontend Service Worker and Notification Page.

Would you like me to proceed with Step 1 and execute the MySQL commands?
