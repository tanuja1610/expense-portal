const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// ==========================
// LOGIN ROUTE
// ==========================
router.post("/login", (req, res) => {
  const { email, mobile, password } = req.body;

  if (!password || (!email && !mobile)) {
    return res.status(400).json({ message: "Email or mobile and password required." });
  }

  const field = email ? "email" : "mobile_no";
  const value = email || mobile;

  const sql = `SELECT * FROM users WHERE ${field} = ?`;

  db.query(sql, [value], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(401).json({ message: "User not found" });

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

  res.status(200).json({
  message: "Login successful",
  user_id: user.id,   
  role: user.role,
  name: user.name
});

  });
});

// ==========================
// FORGOT PASSWORD - SEND OTP
// ==========================
router.post("/forgot-password", (req, res) => {
  const { identifier } = req.body;

  if (!identifier) {
    return res.status(400).json({ message: "Please provide email or mobile number." });
  }

  const sql = `SELECT * FROM users WHERE email = ? OR mobile_no = ?`;

  db.query(sql, [identifier, identifier], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No user found with this email or mobile." });
    }

    const user = results[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP and expiry in DB
    const updateSql = `UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?`;
    db.query(updateSql, [otp, expiryTime, user.id], (updateErr) => {
      if (updateErr) {
        console.error("Failed to store OTP:", updateErr);
        return res.status(500).json({ message: "Error saving OTP." });
      }

  const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: "mis2@lubrikote.com",
    pass: "L$plmum!@2025"
  }
});


const resetLink = `http://localhost:3000/reset-password.html?email=${encodeURIComponent(user.email)}`;

const mailOptions = {
  from: '"Lubrikote MIS2" <mis2@lubrikote.com>',
  to: user.email,
  subject: "Expense Portal - Password Reset",
 html: `
  <p>Hi ${user.name || user.email},</p>
  <p>Your OTP for password reset is: <b>${otp}</b></p>
  <p>This OTP will expire in 10 minutes.</p>
  <p> reset your password  using the following link:</p>
  <p>
    <a href="${resetLink}" style="
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;">
      Reset Password
    </a>
  </p>
`

};


      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Failed to send OTP email" });
        } else {
          console.log("Email sent:", info.response);
          return res.status(200).json({
            message: "OTP sent successfully to your email.",
            success: true
          });
        }
      });
    });
  });
});

// ==========================
// VERIFY OTP
// ==========================
router.post("/verify-otp", (req, res) => {
  const { identifier, otp } = req.body;

  if (!identifier || !otp) {
    return res.status(400).json({ message: "Email/Mobile and OTP are required." });
  }

  const sql = `SELECT * FROM users WHERE (email = ? OR mobile_no = ?) AND otp = ?`;

  db.query(sql, [identifier, identifier, otp], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (results.length === 0) return res.status(400).json({ message: "Invalid OTP" });

    const user = results[0];
    const now = new Date();

    if (new Date(user.otp_expiry) < now) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    res.status(200).json({ message: "OTP verified successfully", success: true });
  });
});

// ==========================
// RESET PASSWORD
// ==========================
router.post("/reset-password", async (req, res) => {
  const { identifier, newPassword } = req.body;

  if (!identifier || !newPassword) {
    return res.status(400).json({ message: "Identifier and new password are required." });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const sql = `
    UPDATE users 
    SET password = ?, otp = NULL, otp_expiry = NULL 
    WHERE email = ? OR mobile_no = ?
  `;

  db.query(sql, [hashedPassword, identifier, identifier], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    res.status(200).json({ message: "Password reset successfully", success: true });
  });
});

module.exports = router;
