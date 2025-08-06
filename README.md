# Expense Portal

A streamlined web application for managing, submitting, and approving company expenses with role-based access and real-time tracking.

## 🚀 Features

* ✅ Role-based login: Admin, Manager, Employee
* 💸 Submit and approve expense claims
* 📁 Upload receipts and supporting documents
* 📊 View reports by user and  timeframe
* 🔔 Email notifications for approvals/rejectiom

## 🛠 Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js + Express
* **Database:** MySQL (via XAMPP)
* **Auth:** JWT + bcrypt


## 🧱 Installation

```bash
git clone https://github.com/tanuja1610/expense-portal.git
cd expense-portal
npm install
```

Set up environment variables in `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""//empty or null
DB_NAME=expense_portal
JWT_SECRET=your_jwt_secret
S3_BUCKET=your_bucket
```

### 🛠 Setting up MySQL with XAMPP

1. Start **Apache** and **MySQL** from the XAMPP Control Panel
2. Open **phpMyAdmin** at [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. Create a new database named `expense_portal`
4. Import the provided SQL schema (if available) or create tables manually

Start the Node.js server:

```bash
npm start
cd backend
node  server.js

```

Use a live server (e.g., VS Code Live Server) to serve the HTML frontend from the `/client` directory.

## 📂 Project Structure

```bash
.
├── backend/             # HTML/CSS/JS frontend
├── server/             # Node.js backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── utils/
├── frontend
└── README.md
```



Frontend testing can be done manually via browser or tools like Cypress.

## 🛡 Security

* Passwords hashed using bcrypt
* JWT for session management
* Input validation with Joi
* HTTPS in production

## 📈 Roadmap

* [x] Setup backend with Node.js, Express, and MySQL
* [x] Design frontend using HTML/CSS/JavaScript
* [x] Implement role-based authentication (JWT)
* [x] Create expense submission and approval workflow
* [x] Integrate file uploads (receipts)
* [ ] Add data filtering and search (by date/user/status)
* [ ] Implement export to PDF/CSV for reports
* [ ] Add dashboard charts and analytics (e.g., Chart.js)
* [ ] Make frontend mobile responsive
* [ ] Add email notifications (e.g., via Nodemailer)
* [ ] Deploy to production (e.g., Render, Railway, or VPS)

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



