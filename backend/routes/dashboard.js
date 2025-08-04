// routes/dashboard.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Example: GET /api/dashboard/bdm
router.get("/bdm", async (req, res) => {
  try {
    const [pending] = await db.promise().query(`SELECT COUNT(*) AS count FROM expenses WHERE status = 'pending'`);
    const [approved] = await db.promise().query(`SELECT COUNT(*) AS count FROM expenses WHERE status = 'approved'`);
    const [verified] = await db.promise().query(`SELECT COUNT(*) AS count FROM expenses WHERE status = 'verified'`);

    res.json({ 
      pending: pending[0].count,
      approved: approved[0].count,
      verified: verified[0].count
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

//notificxation
router.get("/notifications", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT message FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [1] // Replace with dynamic user_id from session/jwt if implemented
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});


module.exports = router;
