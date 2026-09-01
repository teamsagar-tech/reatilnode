# Advanced Authentication & Security System Documentation

This document explains the architecture and API usage of the RetailNodeV2 advanced authentication system, implemented to meet Enterprise SaaS standards.

## 1. Authentication Methods

The system supports three login methods, anchored by the user's `email`.

### A. Standard Login (Password)
- **Endpoint:** `POST /api/auth/login`
- **Payload:** `{ "email": "user@firm.com", "password": "password123" }`
- **Behavior:** 
  - If TOTP is disabled, returns JWT Token.
  - If TOTP is enabled, returns `{ requires_totp: true, email: "user@firm.com" }`.

### B. Google Authenticator (TOTP 2FA)
Optional security layer for users.
- **Setup:** `POST /api/auth/totp/setup` (Requires Auth Token)
  - Returns a `qrCodeUrl` and a `secret`. The user scans the QR code in their Google Authenticator app.
- **Login:** `POST /api/auth/login/totp`
  - **Payload:** `{ "email": "user@firm.com", "token": "123456" }`
  - Returns the JWT token if the 6-digit code matches.

### C. Mobile OTP Login
Integration with WhatsApp via `waba.mpocket.in`.
- **Step 1 (Send OTP):** `POST /api/auth/otp/send`
  - **Payload:** `{ "mobileNo": "919876543210" }`
  - Stores a temporary 6-digit OTP in `OtpVerification` (expires in 5 minutes).
- **Step 2 (Verify OTP):** `POST /api/auth/otp/verify`
  - **Payload:** `{ "mobileNo": "919876543210", "otp": "123456" }`
  - Returns the JWT token. (Requires the user's mobile number to be registered).

---

## 2. Security Mechanisms

### A. Account Lockout
Brute-force protection is enforced on standard password logins.
- **Rule:** 5 consecutive failed login attempts.
- **Action:** The account is locked for exactly 15 minutes (`locked_until`).
- **Database Fields:** `failed_login_attempts` (INT), `locked_until` (TIMESTAMP).

### B. Device Binding & Browser Security
Prevents session hijacking and unauthorized API access.
- **Middleware:** `deviceMiddleware.js`
- **Behavior:**
  - Upon first authenticated request, if no `x-device-token` header is found, the server generates a UUID and sets it in the response header `x-device-token`.
  - The frontend MUST store this token (e.g., `localStorage`) and send it as `x-device-token` in all subsequent API requests.
  - An admin can revoke a device by setting `is_trusted = false` in the `UserDevices` table.

### C. Audit Logging
Comprehensive tracking of all API calls.
- **Middleware:** `auditMiddleware.js` (Global)
- **Behavior:** Intercepts every incoming request, masks sensitive payloads (passwords, OTPs, TOTP tokens), and logs the event asynchronously to the `ApiAuditLogs` table.
- **Logged Data:** `firm_id`, `user_id`, `method`, `endpoint`, `request_payload`, `ip_address`, `user_agent`, `status_code`.

### D. Email Notification Groups
Allows users to subscribe to different email alerts.
- **Tables:** `NotificationGroups` (e.g., 'Security Alerts', 'Daily Reports') and `UserNotificationPreferences`.
