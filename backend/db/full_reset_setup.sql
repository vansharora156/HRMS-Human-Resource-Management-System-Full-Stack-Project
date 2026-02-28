-- HRMS PRO: TOTAL RESET & SETUP SCRIPT
-- This script WIPES all tables and recreates them from scratch with sample data.
-- Run this in the Supabase SQL Editor.

-- 1. NUKE EVERYTHING (Ordered to handle dependencies)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS performance_cycles CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS interviews CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS job_openings CASCADE;
DROP TABLE IF EXISTS asset_allocations CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS training_programs CASCADE;
DROP TABLE IF EXISTS holidays CASCADE;
DROP TABLE IF EXISTS leave_approvals CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_balances CASCADE;
DROP TABLE IF EXISTS leave_types CASCADE;
DROP TABLE IF EXISTS attendance_logs CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS user_accounts CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS system_roles CASCADE;
DROP TABLE IF EXISTS status_history CASCADE;
DROP TABLE IF EXISTS salary_structure CASCADE;
DROP TABLE IF EXISTS bank_details CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS personal_details CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS work_locations CASCADE;
DROP TABLE IF EXISTS employment_types CASCADE;
DROP TABLE IF EXISTS designations CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;

-- 2. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. CREATE TABLES

-- Organization
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    registration_no TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT
);

CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

CREATE TABLE designations (
    designation_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    level INTEGER,
    grade TEXT
);

CREATE TABLE employment_types (
    emp_type_id SERIAL PRIMARY KEY,
    type_name TEXT NOT NULL
);

CREATE TABLE work_locations (
    location_id SERIAL PRIMARY KEY,
    location_type TEXT NOT NULL
);

CREATE TABLE shifts (
    shift_id SERIAL PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- Employees
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    emp_id SERIAL UNIQUE,
    company_id INTEGER REFERENCES companies(company_id),
    dept_id INTEGER REFERENCES departments(dept_id),
    designation_id INTEGER REFERENCES designations(designation_id),
    emp_type_id INTEGER REFERENCES employment_types(emp_type_id),
    manager_id INTEGER,
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    join_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Sub-tables
CREATE TABLE personal_details (emp_id INTEGER PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE, dob DATE, gender TEXT, marital_status TEXT);
CREATE TABLE contacts (contact_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, phone TEXT, email TEXT);
CREATE TABLE addresses (address_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, address_type TEXT, address TEXT);
CREATE TABLE documents (doc_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, doc_type TEXT, file_path TEXT);
CREATE TABLE bank_details (bank_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, account_no TEXT, ifsc TEXT);
CREATE TABLE salary_structure (salary_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, basic NUMERIC, hra NUMERIC, allowances NUMERIC);

-- Attendance & Leave
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status TEXT,
    UNIQUE(emp_id, attendance_date)
);

CREATE TABLE leave_types (leave_type_id SERIAL PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE leave_balances (balance_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, leave_type_id INTEGER REFERENCES leave_types(leave_type_id), balance INTEGER, UNIQUE(emp_id, leave_type_id));
CREATE TABLE leave_requests (request_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, leave_type_id INTEGER REFERENCES leave_types(leave_type_id), from_date DATE, to_date DATE, status TEXT DEFAULT 'PENDING');

-- Assets & Recruitment
CREATE TABLE assets (asset_id SERIAL PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE asset_allocations (allocation_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, asset_id INTEGER REFERENCES assets(asset_id) ON DELETE CASCADE, allocated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());
CREATE TABLE job_openings (job_id SERIAL PRIMARY KEY, dept_id INTEGER REFERENCES departments(dept_id), title TEXT NOT NULL);
CREATE TABLE candidates (candidate_id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL);
CREATE TABLE applications (application_id SERIAL PRIMARY KEY, candidate_id INTEGER REFERENCES candidates(candidate_id) ON DELETE CASCADE, job_id INTEGER REFERENCES job_openings(job_id) ON DELETE CASCADE, status TEXT DEFAULT 'APPLIED');

-- Performance & Finance
CREATE TABLE performance_cycles (cycle_id SERIAL PRIMARY KEY, year INTEGER NOT NULL);
CREATE TABLE goals (goal_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, description TEXT NOT NULL);
CREATE TABLE reviews (review_id SERIAL PRIMARY KEY, emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE, cycle_id INTEGER REFERENCES performance_cycles(cycle_id));
CREATE TABLE ratings (rating_id SERIAL PRIMARY KEY, review_id INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE, score INTEGER);
CREATE TABLE expenses (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), employee_id INTEGER REFERENCES employees(id), category TEXT, amount NUMERIC, status TEXT DEFAULT 'Pending');

-- 4. INSERT DATA (Force IDs to match)

-- Companies
INSERT INTO companies (company_id, name, registration_no) OVERRIDING SYSTEM VALUE VALUES (1, 'Quantum Systems', 'QS-001'), (2, 'Nexus Digital', 'ND-002');

-- Branches
INSERT INTO branches (branch_id, company_id, name, location) OVERRIDING SYSTEM VALUE VALUES 
(1, 1, 'Bangalore HQ', 'India'), (2, 2, 'London Office', 'UK');

-- Departments
INSERT INTO departments (dept_id, branch_id, name) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Engineering'), (2, 1, 'HR'), (3, 2, 'Sales');

-- Designations & Types
INSERT INTO designations (designation_id, title, level) OVERRIDING SYSTEM VALUE VALUES (1, 'Software Engineer', 1), (2, 'HR Manager', 2);
INSERT INTO employment_types (emp_type_id, type_name) OVERRIDING SYSTEM VALUE VALUES (1, 'Full-Time'), (2, 'Contract');

-- Employees
INSERT INTO employees (id, emp_id, company_id, dept_id, designation_id, emp_type_id, first_name, last_name, email) OVERRIDING SYSTEM VALUE VALUES 
(1, 101, 1, 1, 1, 1, 'Sarah', 'Connor', 'sarah@quantum.com'),
(2, 102, 1, 2, 2, 1, 'John', 'Wick', 'john@quantum.com'),
(3, 103, 2, 3, 1, 2, 'Thomas', 'Anderson', 'neo@nexus.com');

-- Leave Types
INSERT INTO leave_types (leave_type_id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'Annual Leave'), (2, 'Sick Leave');

-- Assets
INSERT INTO assets (asset_id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'MacBook Pro'), (2, 'Dell Monitor');

-- Performance
INSERT INTO performance_cycles (cycle_id, year) OVERRIDING SYSTEM VALUE VALUES (1, 2025);
INSERT INTO goals (goal_id, emp_id, description) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Complete the HRMS Project');

-- 5. RESTART SEQUENCES (So new IDs work normally)
SELECT setval('companies_company_id_seq', (SELECT MAX(company_id) FROM companies));
SELECT setval('branches_branch_id_seq', (SELECT MAX(branch_id) FROM branches));
SELECT setval('employees_id_seq', (SELECT MAX(id) FROM employees));
SELECT setval('leave_types_leave_type_id_seq', (SELECT MAX(leave_type_id) FROM leave_types));
