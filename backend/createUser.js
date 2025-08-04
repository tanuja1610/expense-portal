const db = require("./db");
const bcrypt = require("bcrypt");

// List of users to insert
const users = [
  {
    name: "Tanu BDM",
    email: "tanu@fulore.com",
    mobile: "991990001",
    password: "tanu123",
    role: "bdm"
  },
  {
    name: " Manager",
    email: "manager@example.com",
    mobile: "9992396502",
    password: "manager123",
    role: "manager"
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    mobile: "2229990003",
    password: "admin123",
    role: "admin"
  }
];

let insertedCount = 0;

users.forEach((user) => {
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error("❌ Error hashing password for", user.email);
      return;
    }

    const sql = `
      INSERT INTO users (name, email, mobile_no, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [user.name, user.email, user.mobile, hash, user.role];

    db.query(sql, values, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Duplicate entry skipped: ${user.email}`);
        } else {
          console.error(`❌ Error inserting ${user.email}:`, err);
        }
      } else {
        console.log(`✅ Inserted user: ${user.email}`);
      }

      insertedCount++;
      if (insertedCount === users.length) {
        process.exit();
      }
    });
  });
});
