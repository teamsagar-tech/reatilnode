const { Resend } = require('resend');
const axios = require('axios');

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send an Email using Resend
 */
async function sendEmailNotification(to, subject, htmlContent) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not configured, skipping email.');
        return;
    }
    
    try {
        const data = await resend.emails.send({
            from: 'RetailNode Support <support@resend.dev>', // Replace with verified domain
            to: [to],
            subject: subject,
            html: htmlContent
        });
        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

/**
 * Send a WhatsApp Message using Official Cloud API
 * Assuming process.env variables or DB records for the WABA token.
 */
async function sendWhatsAppNotification(phoneNumber, message) {
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    
    if (!token || !phoneId) {
        console.warn('WHATSAPP_API_TOKEN or WHATSAPP_PHONE_ID not configured, skipping WhatsApp notification.');
        return;
    }

    try {
        // Strip non-numeric characters from phone number for WABA
        const toPhone = phoneNumber.replace(/[^0-9]/g, '');
        
        const response = await axios.post(
            `https://graph.facebook.com/v18.0/${phoneId}/messages`,
            {
                messaging_product: 'whatsapp',
                to: toPhone,
                type: 'text',
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('WhatsApp message sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    sendEmailNotification,
    sendWhatsAppNotification
};
