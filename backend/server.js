const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./db");
const dashboardRoutes = require("./routes/dashboard");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expense");
const expenseFormRoutes = require("./routes/expenses_form");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔧 Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/expenses_form", expenseFormRoutes); // <-- changed path to avoid conflict
app.use('/api/policies', require('./routes/policies'));

// Serve uploads
app.use("/uploads", express.static("uploads"));

// Default route
app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});