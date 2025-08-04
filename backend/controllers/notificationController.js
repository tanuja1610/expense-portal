const db = require("../db");

// Get all notifications for a user
exports.getNotifications = (req, res) => {
    const userId = req.query.user_id; // or use req.params if needed

    if (!userId) return res.status(400).json({ error: "Missing user_id" });

    const query = `
        SELECT id, message, read_status, created_at 
        FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Mark a notification as read
exports.markAsRead = (req, res) => {
    const { id } = req.params;

    const query = `UPDATE notifications SET read_status = 1 WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Notification marked as read" });
    });
};

// Create a new notification
exports.createNotification = (req, res) => {
    const { user_id, message } = req.body;

    if (!user_id || !message) {
        return res.status(400).json({ error: "user_id and message required" });
    }

    const query = `
        INSERT INTO notifications (user_id, message) 
        VALUES (?, ?)
    `;

    db.query(query, [user_id, message], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
    });
};
