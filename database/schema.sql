
-- Created on 2025-07-03 05:19:47
-- Database: expense_portal

CREATE DATABASE IF NOT EXISTS expense_portal;
USE expense_portal;

-- Organization Table
CREATE TABLE organization (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('bdm', 'manager', 'admin') NOT NULL,
    mobile_no VARCHAR(15),
    dob DATE,
    gender ENUM('male', 'female', 'other'),
    user_status ENUM('active', 'inactive') DEFAULT 'active',
    grade VARCHAR(50),
    organization_id INT,
    FOREIGN KEY (organization_id) REFERENCES organization(id)
);

-- Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Expenses Table
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    merchant VARCHAR(100),
    description TEXT,
    status ENUM('submitted', 'approved_manager', 'approved_admin', 'rejected', 'sent_back') DEFAULT 'submitted',
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    time_of_expense TIME,
    city VARCHAR(100),
    is_multi_day BOOLEAN DEFAULT FALSE,
    customer_nature VARCHAR(100),
    business_category VARCHAR(100),
    expense_type VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'INR',
    conversion_rate DECIMAL(10, 4) DEFAULT 1.0,
    wallet_type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Approvals Table
CREATE TABLE approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    action ENUM('approved', 'rejected', 'sent_back') NOT NULL,
    action_by INT NOT NULL,
    action_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id),
    FOREIGN KEY (action_by) REFERENCES users(id)
);

-- Attachments Table
CREATE TABLE attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(255),
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expense_id) REFERENCES expenses(id)
);

-- Wallets Table
CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    wallet_date DATE,
    wallet_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data
INSERT INTO organization (name) VALUES
('lubrikote'), ('crosskote'), ('equismart');

INSERT INTO users (name, email, password, role, mobile_no, dob, gender, user_status, grade, organization_id)
VALUES
('tanu', 'tanu16@gmail.com', 'tanu16', 'bdm', '9876543210', '2004-10-16', 'female', 'active', 'L2', 1),
('Tanuja Ashok', 'tanuja@gmail.com', 'tanuja123', 'manager', '9876500000', '1985-06-15', 'female', 'active', 'L3', 1),
('Admin User', 'admin@lubrikote.com', 'admin123', 'admin', '9876599999', '1980-02-20', 'male', 'active', 'L5', 1);


INSERT INTO categories (name) VALUES
('Travel'), ('Food'), ('Hotel'), ('Mobile Recharge'), ('Office Supplies');

INSERT INTO expenses (user_id, category_id, expense_date, amount, merchant, description, status)
VALUES
(1, 1, '2025-06-01', 1500.00, 'Uber', 'Cab from client site', 'submitted'),
(1, 2, '2025-06-01', 300.00, 'Swiggy', 'Lunch with client', 'approved_manager'),
(1, 3, '2025-06-02', 2200.00, 'Rooms', 'Hotel for 1 night', 'approved_admin');

INSERT INTO approvals (expense_id, action, action_by)
VALUES
(2, 'approved', 2),
(3, 'approved', 3);

INSERT INTO attachments (expense_id, file_name, file_path)
VALUES
(1, 'uber_bill.jpg', 'uploads/uber_bill.jpg'),
(2, 'swiggy_invoice.pdf', 'uploads/swiggy_invoice.pdf');

INSERT INTO wallets (user_id, wallet_date, wallet_amount)
VALUES
(1, '2025-06-30', 3500.00),
(1, '2025-07-01', 1500.00);


INSERT INTO categories (id, name) VALUES
(1, 'Travel'),
(2, 'Food & Dining'),
(3, 'Hotel & Accommodation'),
(4, 'Mobile Recharge'),
(5, 'Office Supplies');
