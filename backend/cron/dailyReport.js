const cron = require('node-cron');
const { Resend } = require('resend');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const resend = new Resend(process.env.RESEND_API_KEY);

const formatEntityName = (str) => {
  if (!str) return 'Other';
  // convert something like 'purchase-orders' to 'Purchase Orders'
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const sendDailyReport = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    // Query ApiAuditLogs for today 
    // We only care about mutations (POST, PUT, PATCH)
    const [auditRows] = await db.execute(`
      SELECT 
        firm_id, 
        endpoint,
        method
      FROM ApiAuditLogs
      WHERE created_at >= ? AND created_at <= ?
        AND method IN ('POST', 'PUT', 'PATCH')
    `, [today, now]);

    if (!auditRows || auditRows.length === 0) {
      console.log('No activities found for today. Skipping daily report.');
      return;
    }

    // Group data by firm
    const firmDataMap = {};
    
    auditRows.forEach(row => {
      if (!row.firm_id) return;
      
      // parse endpoint like "/api/items" -> "items"
      const parts = row.endpoint.split('?')[0].split('/');
      // Usually parts[0] is '', parts[1] is 'api', parts[2] is entity
      let entityRaw = parts[2] || 'other';
      if (entityRaw === 'auth') return; // Ignore logins/auth

      const entityName = formatEntityName(entityRaw);
      
      if (!firmDataMap[row.firm_id]) {
        firmDataMap[row.firm_id] = { totalNew: 0, totalUpdated: 0, breakdowns: {} };
      }
      
      const firmStats = firmDataMap[row.firm_id];
      if (!firmStats.breakdowns[entityName]) {
        firmStats.breakdowns[entityName] = { added: 0, updated: 0 };
      }

      if (row.method === 'POST') {
        firmStats.totalNew++;
        firmStats.breakdowns[entityName].added++;
      } else {
        firmStats.totalUpdated++;
        firmStats.breakdowns[entityName].updated++;
      }
    });

    for (const firmId of Object.keys(firmDataMap)) {
      const stats = firmDataMap[firmId];
      if (stats.totalNew === 0 && stats.totalUpdated === 0) continue;

      const [superAdmins] = await db.execute(`SELECT email FROM Users WHERE role = 'superadmin' AND email IS NOT NULL AND email != ''`);
      const [firmAdmins] = await db.execute(`
        SELECT u.email FROM Users u
        JOIN UserFirms uf ON uf.user_id = u.id
        WHERE uf.firm_id = ? AND uf.role = 'admin' AND u.email IS NOT NULL AND u.email != ''
      `, [firmId]);

      const [firmInfo] = await db.execute(`SELECT name FROM Firms WHERE id = ?`, [firmId]);
      const firmName = firmInfo[0]?.name || `Firm #${firmId}`;

      const emailSet = new Set();
      superAdmins.forEach(u => emailSet.add(u.email));
      firmAdmins.forEach(u => emailSet.add(u.email));
      const toEmails = Array.from(emailSet);

      if (toEmails.length === 0) {
        if (process.env.ADMIN_EMAIL) toEmails.push(process.env.ADMIN_EMAIL);
        else continue;
      }

      // Generate breakdown HTML
      let breakdownHtml = '<table width="100%" cellpadding="10" cellspacing="0" style="margin-top: 20px; border-collapse: collapse;">';
      breakdownHtml += `
        <tr style="background-color: #f1f5f9; text-align: left;">
          <th style="border-bottom: 2px solid #e2e8f0; font-size: 14px; color: #475569;">Module / Category</th>
          <th style="border-bottom: 2px solid #e2e8f0; font-size: 14px; color: #475569; text-align: center;">Added</th>
          <th style="border-bottom: 2px solid #e2e8f0; font-size: 14px; color: #475569; text-align: center;">Updated</th>
        </tr>
      `;
      
      for (const [entity, counts] of Object.entries(stats.breakdowns)) {
        breakdownHtml += `
          <tr>
            <td style="border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #334155; font-weight: 500;">${entity}</td>
            <td style="border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #0284c7; text-align: center; font-weight: bold;">${counts.added > 0 ? counts.added : '-'}</td>
            <td style="border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #059669; text-align: center; font-weight: bold;">${counts.updated > 0 ? counts.updated : '-'}</td>
          </tr>
        `;
      }
      breakdownHtml += '</table>';

      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'reports@retailnode.in', 
        to: toEmails,
        subject: `Daily Activity Update - ${firmName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Activity Update</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; color: #333333; }
    .email-wrapper { width: 100%; background-color: #f4f7fa; padding: 40px 0; }
    .email-content { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); }
    .header { background-color: #dfdfdf; padding: 30px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; }
    .header span { color: #38bdf8; }
    .body-section { padding: 40px; }
    .body-section h2 { margin-top: 0; font-size: 20px; color: #0f172a; }
    .body-section p { font-size: 15px; line-height: 1.6; color: #475569; }
    .metrics-container { display: table; width: 100%; margin: 30px 0; }
    .metric-card { display: table-cell; width: 50%; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; text-align: center; }
    .metric-card.spacer { width: 4%; background: none; border: none; padding: 0; }
    .metric-value { font-size: 32px; font-weight: bold; color: #0284c7; margin-bottom: 8px; }
    .metric-label { font-size: 13px; text-transform: uppercase; font-weight: 600; color: #64748b; letter-spacing: 0.5px; }
    .footer { background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
    .footer p { margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .footer a { color: #0284c7; text-decoration: none; }
  </style>
</head>
<body>
  <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table class="email-content" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td class="header" style="background-color: #dfdfdf; padding: 30px 40px; text-align: center; border-bottom: none;">
              <div style="display: inline-block; vertical-align: middle; margin-right: 12px;">
                <img src="https://app.retailnode.in/logo3.png" alt="RetailNode Logo" width="55" height="55" style="display: block;" />
              </div>
              <h1 style="display: inline-block; vertical-align: middle; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 0.5px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                <span style="color: #1e293b;">RETAIL</span><span style="color: #38bdf8;">NODE</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td class="body-section">
              <h2>Daily Activity Summary</h2>
              <p>Hello,</p>
              <p>Here is the automated summary of system activities processed today for <strong>${firmName}</strong>.</p>
              
              <table class="metrics-container" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="metric-card">
                    <div class="metric-value">${stats.totalNew}</div>
                    <div class="metric-label">Total Records Added</div>
                  </td>
                  <td class="metric-card spacer"></td>
                  <td class="metric-card">
                    <div class="metric-value" style="color: #059669;">${stats.totalUpdated}</div>
                    <div class="metric-label">Total Records Updated</div>
                  </td>
                </tr>
              </table>
              
              <h3 style="margin-top: 35px; margin-bottom: 5px; color: #0f172a; font-size: 16px;">Detailed Breakdown</h3>
              ${breakdownHtml}
              
              <p style="margin-top: 35px;">This report ensures you have a high-level overview of daily operations and data entry occurring within your tenant environment.</p>
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p>Powered by <strong>RetailNode</strong></p>
              <p>Empowering Retailers to Scale Smarter &middot; <a href="https://retailnode.in">retailnode.in</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
      });

      if (error) {
        console.error(`Resend Error for ${firmName}:`, error);
      } else {
        console.log(`Daily report email sent for ${firmName} via Resend:`, data);
      }
    }

  } catch (error) {
    console.error('Error sending daily report:', error);
  }
};

const initCronJobs = () => {
  cron.schedule('0 18 * * *', () => {
    console.log('Running daily evening report job...');
    sendDailyReport();
  });
  console.log('Daily report cron job scheduled for 18:00.');
};

module.exports = { initCronJobs, sendDailyReport };
