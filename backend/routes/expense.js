const express = require("express");
const router = express.Router();
const db = require("../db");

router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id;

    let query = `
      SELECT 
        e.id,
        e.expense_date,
        e.submitted_at,
        e.amount,
        e.merchant,
        e.transaction_id,
        e.expense_type,
        e.description,
        e.city,
        e.status,
        u.name AS username,
        u.grade,
        u.city_group,
        c.id AS category,
        c.name AS category_name,
        sc.name AS subcategory_name,
        sc.id AS subcategory,
        w.wallet_amount,
        a.file_path AS bill_file,

        CASE 
          WHEN p.id IS NULL THEN '✅'
          WHEN p.rate_per_km IS NOT NULL AND e.distance_km IS NOT NULL AND (e.amount > (p.rate_per_km * e.distance_km)) THEN '❌'
          WHEN p.max_amount_per_day IS NOT NULL AND e.amount > p.max_amount_per_day THEN '❌'
          ELSE '✅'
        END AS policy_violation

      FROM expenses e
      JOIN users u ON e.user_id = u.id
      JOIN categories c ON e.category_id = c.id
      LEFT JOIN subcategories sc ON e.subcategory_id = sc.id
      LEFT JOIN wallets w ON w.user_id = e.user_id
      LEFT JOIN attachments a ON a.expense_id = e.id
      LEFT JOIN policies p ON 
        p.grade = u.grade AND
        p.category_id = e.category_id AND
        (p.subcategory_id IS NULL OR p.subcategory_id = e.subcategory_id)
    `;

    const params = [];

    if (userId) {
      query += ` WHERE e.user_id = ?`;
      params.push(userId);
    }

    query += ` ORDER BY e.submitted_at DESC`;

    const [rows] = await db.execute(query, params); 

    // ✅ Moved this part inside the async function
    for (let expense of rows) {
      const [policyRows] = await db.execute(`
        SELECT * FROM policies WHERE grade = ? AND category_id = ? AND city_type = ?
      `, [expense.grade, expense.category, expense.city_group]);

      if (policyRows.length > 0) {
        const policy = policyRows[0];
        expense.policy_violation = expense.amount > policy.max_amount_per_day ? "❌" : "✅";
      } else {
        expense.policy_violation = "-";
      }
    }

    res.json({ expenses: rows });

  } catch (error) {
    console.error('Error fetching expenses:', error.message); 
    console.error(error);  // log full stack
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;