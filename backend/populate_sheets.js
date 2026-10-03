const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'config/google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function populateSheets() {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = '18bsJsZ4Y5gK8B8Zx_j0hqZWuYlnF4Ll90NJKkmzcyKw';

    // 1. Create the new worksheets
    const requests = [
      { addSheet: { properties: { title: 'Communication Templates' } } }
    ];

    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: { requests }
      });
      console.log('Worksheets created successfully.');
    } catch (e) {
      console.log('Worksheets might already exist, proceeding to update data...', e.message);
    }

    // 2. Data for Backend
    const backendData = [
      ['Module / System', 'Detailed Description', 'Current Status', 'Key Database Tables'],
      ['SaaS Multi-Tenancy', 'Strict firm_id isolation via tenantMiddleware, 1:N user-firm switching, UserFirms mapping', 'Production Ready', 'Firms, Users, UserFirms'],
      ['Security & RBAC', 'Dynamic roles, field-level security (Cost Price masking), Account Lockout, JWT Auth', 'Production Ready', 'Roles, RolePermissions'],
      ['Master Data API', 'CRUD APIs for Items, Brands, Categories, HSNSAC, Parties, Size Groups, Cuts', 'Production Ready', 'Items, Parties, Sizes, Categories'],
      ['Procurement Engine', 'Purchase Invoices, Purchase Orders, Interactive CSV/Excel Importer with Aliasing', 'Production Ready', 'PurchaseInvoices, PurchaseOrders'],
      ['Logistics & LRs', 'LR Pending Tracking, Auto-linking Transporters to Invoices, bulk inwarding', 'Production Ready', 'LRs, Transporters, Hundekaris'],
      ['Sales & POS', 'High-concurrency POS, ACID transactions for billing/inventory, Split pieces', 'Production Ready', 'Sales, SalesReturns, Inventory'],
      ['OCR & Price Lists', 'Standalone Tesseract OCR prototype, PDF tabular price list importer (Python/pdfplumber)', 'Prototype / Built', 'Items, Designs, Colors']
    ];

    // 3. Data for Frontend
    const frontendData = [
      ['Component / Architecture', 'Layout Style', 'Detailed Features', 'Tally Shortcuts'],
      ['Global App Structure', 'React + Vite', 'Zustand state management, useKeyboardStore, ConfirmDialog global modals', 'Y/N, Esc'],
      ['Master Forms (20+ Pages)', 'Tally 3-Column', 'Auto-Focus on load, Safe Resets, Enter-to-skip, Form Accessibility', 'Alt+C, Ctrl+A, Esc'],
      ['Purchase Invoice Voucher', 'Tally Split View', 'Horizontal Size Matrix Modal, Active row highlighting (dark yellow), visual fake rows', 'F10 (Delete), Alt+S'],
      ['Point of Sale (POS)', 'Supermarket Grid', 'Barcode scanner debouncing, dynamic cart, credit sales support', 'F2, F3'],
      ['Data Importers', 'Interactive Hub', 'CSV error reconciliation, One-click missing master generation', 'Alt+I'],
      ['UI Design System', 'Glassmorphism', 'Thick bold typography globally, premium animated Toast notifications', 'N/A']
    ];

    // 4. Data for Frontend V3
    const v3Data = [
      ['Next-Gen Architecture', 'Proposed Implementation', 'Status'],
      ['Framework Upgrade', 'Next.js 15 App Router / Server Components for extreme SEO and speed', 'Planning Phase'],
      ['Real-Time WebSockets', 'Socket.IO integration for live inventory decrementing across cashiers', 'Planning Phase'],
      ['Advanced BI Dashboard', 'Enterprise-grade charting for multi-store analytics', 'Planning Phase'],
      ['Offline-First POS', 'IndexedDB integration to allow billing during internet outages', 'Planning Phase']
    ];

    // 5. Data for Infrastructure
    const infrastructureData = [
      ['Resource', 'Details', 'Notes / Nginx Paths'],
      ['Live Server IP', '95.135.166.109', 'Running Nginx + PM2 Node Server'],
      ['Modern Frontend URL', 'https://retailnode.in (and www)', 'Path: /var/www/RetailNodeV2/FrontEnd'],
      ['Tally Frontend URL', 'https://app.retailnode.in', 'Path: /var/www/RetailNodeV2/FrontEndV2'],
      ['Backend API URL', 'https://api.retailnode.in', 'Proxy: localhost:7189'],
      ['Temp App URL', 'https://onevastra.technfest.com', 'Path: /var/www/onevastra/FrontEndV2/dist'],
      ['CORS Allowed Origins', 'app.retailnode.in, retailnode.in, onevastra.technfest.com', 'Explicitly whitelisted in server.js'],
      ['Resend Email API Key', 'process.env.RESEND_API_KEY', 'Used in notificationService.js'],
      ['WhatsApp API Token', 'Vpv6mesdUaY3XHS6BKrM0XOdIoQu4ygTVaHmpKMNb29bc1c7', 'Used for WABA integrations'],
      ['WhatsApp Phone ID', '361462453714220', 'WABA Phone ID'],
      ['WhatsApp API URL', 'https://waba.mpocket.in/messages', 'waba.mpocket.in endpoint']
    ];

    // 6. Data for Changelog
    const changelogData = [
      ['Date & Time', 'Component', 'Changes Made'],
      ['2026-10-02 10:00:00', 'Users', 'Added Soft Delete functionality and Audit Logging for all firm users.'],
      ['2026-10-02 10:15:00', 'Auth', 'Fixed password reset API to account for firm context and soft-delete checks.'],
      ['2026-10-02 10:20:00', 'Documentation', 'Populated Google Sheet with Resend Email API and WhatsApp WABA API tokens.'],
      ['2026-10-02 11:00:00', 'Architecture', 'Drafted Enterprise Omni-channel Communication Templates for Godowns and Budgeting.'],
      ['2026-10-02 11:10:00', 'Architecture', 'Upgraded Email Templates to include Rich HTML Tables and PDF Attachment workflows.']
    ];

    // 7. Data for Communication Templates
    const templatesData = [
      ['Category', 'Template Name', 'Channel (Format)', 'Trigger Event', 'Variables & Attachments'],
      ['Security', 'New User Welcome & OTP', 'Email (Text)/SMS', 'User created', '{{user_name}}, {{otp}}, {{firm_name}}'],
      ['Security', 'Password Reset OTP', 'Email (Text)/WA/SMS', 'Forgot Password', '{{user_name}}, {{reset_otp}}'],
      ['Security', 'New Device Login Alert', 'Email (Text)', 'New IP/Device Login', '{{user_name}}, {{ip_address}}, {{device_info}}, {{time}}'],
      ['Tenant', 'Firm Onboarding Success', 'Email (Text)/WA', 'New Firm Registered', '{{firm_name}}, {{owner_name}}, {{login_url}}'],
      ['Tenant', 'Subscription Expiring Alert', 'Email (Text)/WA', '7 & 1 day before expiry', '{{firm_name}}, {{expiry_date}}, {{renewal_link}}'],
      ['Omni-Channel', 'Omni-Channel Order Confirmation', 'Email (HTML)/WA', 'Order placed via E-com/POS', '{{customer_name}}, {{order_id}}, {{channel_name}}, {{total_amount}}'],
      ['Omni-Channel', 'BOPIS Ready Alert', 'WA/SMS', 'Online order packed at store', '{{customer_name}}, {{order_id}}, {{location_name}}'],
      ['Sales', 'Digital E-Invoice', 'WA/Email (HTML)', 'Sales Bill generated', '{{invoice_items}}, {{amount}} + [invoice.pdf]'],
      ['Sales', 'Credit Note / Sales Return', 'WA/Email (Text)', 'Goods returned by customer', '{{customer_name}}, {{return_no}}, {{refund_amount}}'],
      ['Purchase', 'Purchase Order (PO) Dispatch', 'Email (HTML)/WA', 'PO approved', '{{po_items}}, {{total_amount}} + [PO.pdf]'],
      ['Purchase', 'Debit Note / Purchase Return', 'Email (Text)/WA', 'Defective goods returned', '{{vendor_name}}, {{debit_note_no}}, {{return_amount}}'],
      ['Logistics', 'Bulk Warehouse Inward (GRN)', 'Email (Text)', 'Goods arrive at Warehouse', '{{godown_name}}, {{grn_number}}, {{po_number}}, {{box_count}}'],
      ['Logistics', 'Godown to Store Dispatch', 'WA', 'Stock transfer dispatched', '{{stoprocess.env.RESEND_API_KEY}}, {{transfer_id}}, {{godown_name}}, {{stoprocess.env.RESEND_API_KEY}}'],
      ['Logistics', 'Goods Dispatched (To Customer)', 'WA/SMS', 'LR generated', '{{customer_name}}, {{lr_no}}, {{transporter_name}}, {{eta}}'],
      ['Approvals', 'PO Approval Request', 'Email (HTML)/App', 'PO requires Manager approval', '{{po_number}}, {{employee_name}}, {{po_amount}}, {{department_name}}'],
      ['Approvals', 'Discount Override Request', 'WA', 'Discount beyond limit', '{{employee_name}}, {{discount_percent}}, {{customer_name}}, {{draft_bill_no}}'],
      ['Budgeting', 'Purchase Budget Warning', 'Email (Text)', 'Department budget > 80%', '{{manager_name}}, {{department_name}}, {{utilized_percent}}, {{remaining_budget}}'],
      ['Alerts', 'Low Stock Reorder Alert', 'Email (Text)/WA', 'Item < min_stock_level', '{{admin_name}}, {{item_name}}, {{current_stock}}'],
      ['Alerts', 'Style Fast-Seller Alert', 'Email (Text)', 'High sell-through detected', '{{merchandiser_name}}, {{style_name}}, {{location_name}}'],
      ['Alerts', 'Daily EOD Sales Digest', 'Email (HTML)/WA', '11:59 PM cron job', '{{location_metrics}}, {{total_sales}} + [EOD_Report.pdf]']
    ];

    // 8. Push data to sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Backend!A1:D10',
      valueInputOption: 'USER_ENTERED',
      resource: { values: backendData }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Frontend!A1:D10',
      valueInputOption: 'USER_ENTERED',
      resource: { values: frontendData }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Frontend V3!A1:C10',
      valueInputOption: 'USER_ENTERED',
      resource: { values: v3Data }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Infrastructure!A1:C20',
      valueInputOption: 'USER_ENTERED',
      resource: { values: infrastructureData }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Changelog!A1:C100',
      valueInputOption: 'USER_ENTERED',
      resource: { values: changelogData }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Communication Templates!A1:E50',
      valueInputOption: 'USER_ENTERED',
      resource: { values: templatesData }
    });

    console.log('Data successfully populated into all worksheets.');
  } catch (err) {
    console.error('Error executing sheet update:', err.message);
  }
}

populateSheets();
