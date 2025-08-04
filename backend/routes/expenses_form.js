const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST /api/expenses
router.post('/', upload.array('bills', 5), (req, res) => {
  console.log("Form Body:", req.body);
  console.log("📎 Uploaded Files:", req.files);
  const {
    expense_mode,
    amount,
    vehicle_type,
    distance_km,
    category_id,
    subcategory_id,
    description,
    expense_date,
    transaction_id,
    city,
    user_id,
    merchant,
    expense_type,
    is_multi_day,
    time_of_expense,
    customer_name,
    customer_nature,
    business_category,
    currency,
    conversion_rate,
    wallet_type
  } = req.body;
  const expenseQuery = `
    INSERT INTO expenses (
      user_id, category_id, subcategory_id, expense_date, time_of_expense,
      amount, merchant, description, city, expense_mode, vehicle_type, distance_km,
      is_multi_day, customer_name, wallet_type, customer_nature, business_category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const customerNameString = Array.isArray(customer_name) ? customer_name.filter(Boolean).join(', ') : customer_name;

  const values = [
    user_id, category_id, subcategory_id, expense_date, time_of_expense,
    amount, merchant, description, city, expense_mode, vehicle_type || null,
    distance_km || null, is_multi_day ? 1 : 0, customerNameString,
    wallet_type, customer_nature, business_category
  ];

  db.query(expenseQuery, values, (err, result) => {
    console.log("📥 Inserting Expense Values:", values); // log values
    if (err) {
      console.error("❌ ERROR inserting into expenses:", err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ Expense Inserted ID:", result.insertId);

    const expenseId = result.insertId;
    const files = req.files;

    if (files && files.length > 0) {
      const attachmentQuery = `
        INSERT INTO attachments (expense_id, file_name, file_path)
        VALUES ?
      `;
      const attachments = files.map(file => [
        expenseId,
        file.originalname,
        file.path
      ]);
      db.query(attachmentQuery, [attachments], (fileErr) => {
        if (fileErr) {
          console.error("❌ Error inserting attachment:", fileErr.message);
          return res.status(500).json({ error: fileErr.message });
        }
        return res.status(200).json({ message: 'Expense submitted successfully with files.' });
      });
    } else {
      return res.status(200).json({ message: 'Expense submitted successfully without files.' });
    }
  });
});

// GET cities autocomplete
router.get('/cities', (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);

  const sql = `
    SELECT DISTINCT GroupName 
    FROM customer_staging 
    WHERE GroupName LIKE ?
    LIMIT 10
  `;

  db.query(sql, [`%${query}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const suggestions = rows.map(r => r.GroupName);
    res.json(suggestions);
  });
});

router.get('/customers', (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);

  const sql = `
    SELECT DISTINCT CardCode, CardName, DatabaseName 
    FROM customer_staging 
    WHERE CardName LIKE ? OR DatabaseName LIKE ? OR CardCode LIKE ?
    LIMIT 10
  `;

  db.query(sql, [`%${query}%`, `%${query}%`, `%${query}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const suggestions = rows.map(r => ({
      display: `${r.DatabaseName} - ${r.CardCode} - ${r.CardName}`,
      value: r.CardName
    }));

    res.json(suggestions);
  });
});

router.get('/categories', (req, res) => {
  db.query('SELECT id, name FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// policy route fixed to use callback style
router.post('/policies', (req, res) => {
  // Replace ... with your actual WHERE clause and parameters
  db.query(
    'SELECT * FROM policies WHERE ...', // <-- add your WHERE clause
    [], // <-- add your parameters here if needed
    (err, policyRows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(policyRows);
    }
  );
});

router.get('/subcategories', (req, res) => {
  const { category_id } = req.query;
  db.query(
    'SELECT id, name FROM subcategories WHERE category_id = ?',
    [category_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

module.exports = router;