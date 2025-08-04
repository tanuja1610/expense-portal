const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/policies?grade=Manager&category=Food&city_group=A
router.get('/', (req, res) => {
  const { grade, category, city_group } = req.query;

  db.query(
    `SELECT * FROM policies WHERE grade = ? AND category = ? AND city_type = ?`,
    [grade, category, city_group],
    (err, rows) => {
      if (err) {
        console.error("Error fetching policy:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: "Policy not found" });
      }
      res.json(rows[0]);
    }
  );
});

module.exports = router;