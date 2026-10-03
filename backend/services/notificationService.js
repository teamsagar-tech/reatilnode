const { Resend } = require('resend');
const axios = require('axios');
const webpush = require('web-push');
const db = require('../config/db');

// Configure Web Push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:support@retailnode.in',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}
// const nodemailer = require('nodemailer'); // For future SMTP

// Initialize default providers based on ENV
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send an Email using dynamic gateways
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email body
 * @param {string} gateway - Gateway to use ('resend', 'smtp', etc.)
 * @param {object} customConfig - Optional custom firm-level config
 */
async function sendEmailNotification(to, subject, htmlContent, gateway = 'resend', customConfig = null) {
    switch (gateway) {
        case 'resend':
            return await _sendViaResend(to, subject, htmlContent, customConfig);
        case 'smtp':
            return await _sendViaSMTP(to, subject, htmlContent, customConfig);
        default:
            throw new Error(`Unsupported Email Gateway: ${gateway}`);
    }
}

async function _sendViaResend(to, subject, htmlContent, customConfig) {
    const client = customConfig?.apiKey ? new Resend(customConfig.apiKey) : resend;
    if (!client) throw new Error('Resend API Key not configured');

    const fromDomain = customConfig?.fromDomain || 'RetailNode Support <support@resend.dev>';
    
    try {
        const data = await client.emails.send({
            from: fromDomain,
            to: [to],
            subject: subject,
            html: htmlContent
        });
        console.log('[EMAIL:RESEND] Sent successfully:', data);
        return data;
    } catch (error) {
        console.error('[EMAIL:RESEND] Failed to send email:', error);
        throw error;
    }
}

async function _sendViaSMTP(to, subject, htmlContent, customConfig) {
    if (!customConfig) throw new Error('SMTP requires custom configuration (host, port, user, pass)');
    // Placeholder for nodemailer transport
    console.warn('[EMAIL:SMTP] SMTP Gateway not fully implemented yet');
    return { status: 'mock_success', gateway: 'smtp' };
}

/**
 * Send a WhatsApp Message using dynamic gateways
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message - Message body
 * @param {string} gateway - Gateway to use ('waba_custom', 'waba_graph', 'twilio')
 * @param {object} customConfig - Optional custom firm-level config
 */
async function sendWhatsAppNotification(phoneNumber, message, gateway = 'waba_custom', customConfig = null) {
    const toPhone = phoneNumber.replace(/[^0-9]/g, '');

    switch (gateway) {
        case 'waba_custom':
            return await _sendViaWabaCustom(toPhone, message, customConfig);
        case 'waba_graph':
            return await _sendViaWabaGraph(toPhone, message, customConfig);
        default:
            throw new Error(`Unsupported WhatsApp Gateway: ${gateway}`);
    }
}

async function _sendViaWabaCustom(toPhone, message, customConfig) {
    const token = customConfig?.token || process.env.WHATSAPP_API_TOKEN;
    const apiUrl = customConfig?.apiUrl || 'https://waba.mpocket.in/messages';

    if (!token) throw new Error('WHATSAPP_API_TOKEN not configured');

    try {
        const response = await axios.post(apiUrl, {
            messaging_product: 'whatsapp',
            to: toPhone,
            type: 'text',
            text: { body: message }
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('[WHATSAPP:CUSTOM] Sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('[WHATSAPP:CUSTOM] Failed:', error.response?.data || error.message);
        throw error;
    }
}

async function _sendViaWabaGraph(toPhone, message, customConfig) {
    const token = customConfig?.token || process.env.WHATSAPP_API_TOKEN;
    const phoneId = customConfig?.phoneId || process.env.WHATSAPP_PHONE_ID;
    
    if (!token || !phoneId) throw new Error('WHATSAPP_API_TOKEN or PHONE_ID missing for Graph API');

    try {
        const response = await axios.post(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
            messaging_product: 'whatsapp',
            to: toPhone,
            type: 'text',
            text: { body: message }
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('[WHATSAPP:GRAPH] Sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('[WHATSAPP:GRAPH] Failed:', error.response?.data || error.message);
        throw error;
    }
}

/**
 * Send an SMS using dynamic gateways
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message - Message body
 * @param {string} gateway - Gateway to use ('msg91', 'twilio')
 * @param {object} customConfig - Optional custom config
 */
async function sendSmsNotification(phoneNumber, message, gateway = 'msg91', customConfig = null) {
    const toPhone = phoneNumber.replace(/[^0-9]/g, '');

    switch (gateway) {
        case 'msg91':
            return await _sendViaMsg91(toPhone, message, customConfig);
        default:
            throw new Error(`Unsupported SMS Gateway: ${gateway}`);
    }
}

async function _sendViaMsg91(toPhone, message, customConfig) {
    console.warn('[SMS:MSG91] SMS Gateway not fully implemented yet');
    return { status: 'mock_success', gateway: 'msg91' };
}

async function sendWebNotification(firmId, userId, roleId, title, message, linkUrl = null) {
    try {
        // 1. Store in In-App Notification History
        const [result] = await db.execute(
            `INSERT INTO InAppNotifications (firm_id, user_id, role_id, title, message, link_url) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [firmId, userId || null, roleId || null, title, message, linkUrl]
        );

        // 2. Fetch Active Push Subscriptions for the User/Role
        let query = `SELECT id, endpoint, p256dh, auth FROM PushSubscriptions WHERE user_id = ?`;
        let queryParams = [userId];

        // Advanced logic: If targeted at a role, fetch all user_ids belonging to that role in the firm.
        if (!userId && roleId) {
            query = `
                SELECT ps.id, ps.endpoint, ps.p256dh, ps.auth 
                FROM PushSubscriptions ps
                JOIN Users u ON u.id = ps.user_id
                WHERE u.firm_id = ? AND u.role_id = ? AND u.is_deleted = FALSE
            `;
            queryParams = [firmId, roleId];
        } else if (!userId && !roleId) {
            // Target everyone in the firm
            query = `
                SELECT ps.id, ps.endpoint, ps.p256dh, ps.auth 
                FROM PushSubscriptions ps
                JOIN Users u ON u.id = ps.user_id
                WHERE u.firm_id = ? AND u.is_deleted = FALSE
            `;
            queryParams = [firmId];
        }

        const [subscriptions] = await db.execute(query, queryParams);

        // 3. Dispatch to Browser (Chrome/Safari)
        const payload = JSON.stringify({
            title: title,
            body: message,
            url: linkUrl || '/notifications',
            icon: '/icon.png' // Usually path to PWA logo
        });

        const pushPromises = subscriptions.map(async (sub) => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth }
            };
            try {
                await webpush.sendNotification(pushConfig, payload);
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    // Subscription has expired or is no longer valid, delete it
                    await db.execute('DELETE FROM PushSubscriptions WHERE id = ?', [sub.id]);
                } else {
                    console.error('[WEB-PUSH] Error sending to endpoint:', err);
                }
            }
        });

        await Promise.all(pushPromises);
        console.log(`[WEB-PUSH] Dispatched to ${subscriptions.length} active devices.`);
        
        return { status: 'success', inAppId: result.insertId, devicesNotified: subscriptions.length };
    } catch (error) {
        console.error('[WEB-PUSH] Core Notification Dispatch Error:', error);
        throw error;
    }
}

module.exports = {
    sendEmailNotification,
    sendWhatsAppNotification,
    sendSmsNotification,
    sendWebNotification
};
