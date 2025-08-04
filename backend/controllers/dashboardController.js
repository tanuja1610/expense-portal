const db = require("../db");


exports.getEmployeeDashboard = (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) AS unsubmitted,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved,
            SUM(CASE WHEN status != 'Draft' THEN amount ELSE 0 END) AS totalAmount
        FROM expenses
        WHERE role = 'employee'
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

// Dashboard summary data for BDM
exports.getBdmDashboard = (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approved,
            SUM(CASE WHEN status = 'Verified' THEN 1 ELSE 0 END) AS verified
        FROM expenses
        WHERE role = 'bdm'
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
};

// Latest 5 notifications (mock logic or based on your schema)
exports.getNotifications = (req, res) => {
    const query = `
        SELECT id, message, created_at, read
        FROM notifications
        ORDER BY created_at DESC
        LIMIT 5
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
