# Network Status Indicator

I've implemented and deployed a global Network Status Indicator for the frontend application. 

### What it does
- The system now continuously monitors the user's internet speed using the browser's `navigator.connection` API.
- If the detected download speed drops below **0.5 Mbps** (500 kbps) or changes to a `2g` equivalent network type, it automatically displays a warning.
- A red, pulsating banner appears at the bottom-left of the screen globally across all pages, stating:
  > ⚠️ Slow Internet Connection Detected! The system may take longer to respond.

### How it was implemented
1. Created `NetworkStatusIndicator.tsx` which handles the speed threshold logic (`downlink < 0.5`) and event listeners for network changes.
2. Injected the component into the root layout inside `App.tsx` so that the warning is persistent across all routes (Dashboard, LR List, Purchase Invoices, etc.) when the connection is slow.
3. The banner uses `pointer-events-none` so it doesn't block users from clicking on anything underneath it.

> [!TIP]
> **Try it out!** Do a hard refresh (`Cmd+Shift+R`) in your browser to pull the latest UI code. If you want to simulate a slow network to see it in action, open Chrome Developer Tools (F12) -> Network tab -> Change the throttling dropdown from "No throttling" to "Slow 3G".
