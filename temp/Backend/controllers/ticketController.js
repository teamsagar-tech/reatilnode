const pool = require('../config/db');
const { sendEmailNotification, sendWhatsAppNotification } = require('../services/notificationService');

exports.createTicket = async (req, res) => {
    try {
        const { ticket_type, on_behalf_of_user_id, on_behalf_of_customer_id, subject, priority, initial_message } = req.body;
        const created_by = req.user.id;
        const firm_id = req.firm_id; // Added by tenantMiddleware

        // Validate basic inputs
        if (!subject || !initial_message) {
            return res.status(400).json({ message: 'Subject and initial message are required.' });
        }

        // Insert Ticket
        const [ticketResult] = await pool.query(
            `INSERT INTO Tickets 
            (firm_id, ticket_type, created_by, on_behalf_of_user_id, on_behalf_of_customer_id, subject, priority) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firm_id, ticket_type || 'SaaS_Support', created_by, on_behalf_of_user_id || null, on_behalf_of_customer_id || null, subject, priority || 'Medium']
        );
        const ticketId = ticketResult.insertId;

        // Insert initial message
        await pool.query(
            `INSERT INTO TicketMessages (ticket_id, sender_id, message) VALUES (?, ?, ?)`,
            [ticketId, created_by, initial_message]
        );

        // Optional: Trigger Notifications asynchronously
        setImmediate(async () => {
            try {
                // Determine who to notify based on ticket type
                // For SaaS_Support, maybe notify Superadmin
                // For Customer_Support, maybe notify Customer via WA
                
                // Example Notification logic (To be customized further based on DB queries for emails/phones):
                // const user = await getUserById(created_by);
                // await sendEmailNotification(user.email, 'Ticket Created: ' + subject, '<p>Your ticket has been received.</p>');
                // await sendWhatsAppNotification(user.mobile, 'Your support ticket #' + ticketId + ' has been created successfully.');
            } catch (notifyErr) {
                console.error("Background notification error on create:", notifyErr);
            }
        });

        res.status(201).json({ message: 'Ticket created successfully', ticketId });
    } catch (error) {
        console.error('Create Ticket Error:', error);
        res.status(500).json({ message: 'Failed to create ticket', error: error.message });
    }
};

exports.getTickets = async (req, res) => {
    try {
        const firm_id = req.firm_id;
        
        // Basic fetching for now. We join with Users to get creator name.
        const [rows] = await pool.query(
            `SELECT t.*, u.name as creator_name 
             FROM Tickets t
             LEFT JOIN Users u ON t.created_by = u.id
             WHERE t.firm_id = ?
             ORDER BY t.created_at DESC`,
            [firm_id]
        );
        
        res.status(200).json(rows);
    } catch (error) {
        console.error('Get Tickets Error:', error);
        res.status(500).json({ message: 'Failed to fetch tickets' });
    }
};

exports.getTicketMessages = async (req, res) => {
    try {
        const ticket_id = req.params.id;
        const firm_id = req.firm_id;

        // Ensure ticket belongs to firm
        const [ticket] = await pool.query(`SELECT id FROM Tickets WHERE id = ? AND firm_id = ?`, [ticket_id, firm_id]);
        if (ticket.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const [messages] = await pool.query(
            `SELECT tm.*, u.name as sender_name 
             FROM TicketMessages tm
             LEFT JOIN Users u ON tm.sender_id = u.id
             WHERE tm.ticket_id = ?
             ORDER BY tm.created_at ASC`,
            [ticket_id]
        );

        res.status(200).json(messages);
    } catch (error) {
        console.error('Get Ticket Messages Error:', error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

exports.replyToTicket = async (req, res) => {
    try {
        const ticket_id = req.params.id;
        const { message } = req.body;
        const sender_id = req.user.id;
        const firm_id = req.firm_id;

        if (!message) return res.status(400).json({ message: 'Message cannot be empty' });

        // Ensure ticket belongs to firm
        const [ticket] = await pool.query(`SELECT id, status FROM Tickets WHERE id = ? AND firm_id = ?`, [ticket_id, firm_id]);
        if (ticket.length === 0) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await pool.query(
            `INSERT INTO TicketMessages (ticket_id, sender_id, message) VALUES (?, ?, ?)`,
            [ticket_id, sender_id, message]
        );

        // If ticket was closed, reopen it? Optional logic.
        if (ticket[0].status === 'Closed' || ticket[0].status === 'Resolved') {
            await pool.query(`UPDATE Tickets SET status = 'Open' WHERE id = ?`, [ticket_id]);
        } else {
            // Update updated_at timestamp
            await pool.query(`UPDATE Tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [ticket_id]);
        }

        res.status(201).json({ message: 'Reply added successfully' });
    } catch (error) {
        console.error('Reply Ticket Error:', error);
        res.status(500).json({ message: 'Failed to reply to ticket' });
    }
};

exports.updateTicketStatus = async (req, res) => {
    try {
        const ticket_id = req.params.id;
        const { status } = req.body;
        const firm_id = req.firm_id;

        // Ensure ticket belongs to firm
        const [result] = await pool.query(`UPDATE Tickets SET status = ? WHERE id = ? AND firm_id = ?`, [status, ticket_id, firm_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ticket not found or no change made' });
        }

        res.status(200).json({ message: 'Ticket status updated' });
    } catch (error) {
        console.error('Update Ticket Error:', error);
        res.status(500).json({ message: 'Failed to update ticket' });
    }
};
