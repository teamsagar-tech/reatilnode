const db = require('../config/db');
const webpush = require('web-push');

// Configure Web Push with VAPID keys
webpush.setVapidDetails(
    'mailto:support@retailnode.in',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

exports.subscribeToPush = async (req, res) => {
    const { subscription, device_info } = req.body;
    const user_id = req.user.id; // From authMiddleware

    if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Invalid subscription object' });
    }

    try {
        await db.execute(
            `INSERT INTO PushSubscriptions (user_id, endpoint, p256dh, auth, device_info)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE p256dh = VALUES(p256dh), auth = VALUES(auth), device_info = VALUES(device_info), user_id = VALUES(user_id)`,
            [
                user_id,
                subscription.endpoint,
                subscription.keys.p256dh,
                subscription.keys.auth,
                device_info || 'Unknown Browser'
            ]
        );
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Error saving push subscription:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getInAppNotifications = async (req, res) => {
    const user_id = req.user.id;
    const firm_id = req.firm_id;
    const role_id = req.user.role_id;
    
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const [rows] = await db.execute(
            `SELECT id, title, message, link_url, is_read, created_at 
             FROM InAppNotifications 
             WHERE firm_id = ? AND (user_id = ? OR role_id = ? OR (user_id IS NULL AND role_id IS NULL))
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [firm_id, user_id, role_id || null, limit.toString(), offset.toString()]
        );
        
        const [unreadCountRow] = await db.execute(
            `SELECT COUNT(*) as unreadCount 
             FROM InAppNotifications 
             WHERE firm_id = ? AND (user_id = ? OR role_id = ? OR (user_id IS NULL AND role_id IS NULL)) AND is_read = FALSE`,
            [firm_id, user_id, role_id || null]
        );

        res.json({
            notifications: rows,
            unreadCount: unreadCountRow[0].unreadCount
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;
    const firm_id = req.firm_id;

    try {
        await db.execute(
            'UPDATE InAppNotifications SET is_read = TRUE WHERE id = ? AND firm_id = ? AND (user_id = ? OR user_id IS NULL)',
            [id, firm_id, user_id]
        );
        res.json({ message: 'Marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.markAllAsRead = async (req, res) => {
    const user_id = req.user.id;
    const firm_id = req.firm_id;

    try {
        await db.execute(
            'UPDATE InAppNotifications SET is_read = TRUE WHERE firm_id = ? AND (user_id = ? OR user_id IS NULL) AND is_read = FALSE',
            [firm_id, user_id]
        );
        res.json({ message: 'All marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
