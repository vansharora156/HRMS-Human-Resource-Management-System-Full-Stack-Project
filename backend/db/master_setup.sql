-- Master Supabase Setup Script for HRMS Pro
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 0. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organization Module
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    registration_no TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branches (
    branch_id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
    dept_id SERIAL PRIMARY KEY,
    branch_id INTEGER REFERENCES branches(branch_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS designations (
    designation_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    level INTEGER,
    grade TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employment_types (
    emp_type_id SERIAL PRIMARY KEY,
    type_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_locations (
    location_id SERIAL PRIMARY KEY,
    location_type TEXT NOT NULL, -- HOME / OFFICE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shifts (
    shift_id SERIAL PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Employees Module
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY, -- Used as standard ID in some routers
    emp_id SERIAL UNIQUE, -- Also used as ID in CrudPage
    company_id INTEGER REFERENCES companies(company_id),
    dept_id INTEGER REFERENCES departments(dept_id),
    designation_id INTEGER REFERENCES designations(designation_id),
    emp_type_id INTEGER REFERENCES employment_types(emp_type_id),
    manager_id INTEGER, -- Self-reference if needed
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    join_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS personal_details (
    emp_id INTEGER PRIMARY KEY REFERENCES employees(id) ON DELETE CASCADE,
    dob DATE,
    gender TEXT,
    marital_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
    contact_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    address_type TEXT, -- HOME / OFFICE
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    doc_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    doc_type TEXT,
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank_details (
    bank_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    account_no TEXT,
    ifsc TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS salary_structure (
    salary_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    basic NUMERIC DEFAULT 0,
    hra NUMERIC DEFAULT 0,
    allowances NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS status_history (
    status_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    status TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Attendance & Leave Module
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status TEXT, -- PRESENT / ABSENT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(emp_id, attendance_date)
);

CREATE TABLE IF NOT EXISTS attendance_logs (
    log_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    log_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_types (
    leave_type_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_balances (
    balance_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id INTEGER REFERENCES leave_types(leave_type_id),
    balance INTEGER DEFAULT 0,
    UNIQUE(emp_id, leave_type_id)
);

CREATE TABLE IF NOT EXISTS leave_requests (
    request_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id INTEGER REFERENCES leave_types(leave_type_id),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    status TEXT DEFAULT 'PENDING',
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_approvals (
    approval_id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES leave_requests(request_id) ON DELETE CASCADE,
    manager_id INTEGER,
    approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS holidays (
    holiday_id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id),
    holiday_date DATE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Recruitment Module
CREATE TABLE IF NOT EXISTS job_openings (
    job_id SERIAL PRIMARY KEY,
    dept_id INTEGER REFERENCES departments(dept_id),
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidates (
    candidate_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
    application_id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES job_openings(job_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'APPLIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS interviews (
    interview_id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(application_id) ON DELETE CASCADE,
    interview_date TIMESTAMP WITH TIME ZONE,
    result TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
    offer_id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(application_id) ON DELETE CASCADE,
    salary NUMERIC,
    status TEXT DEFAULT 'OFFERED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Performance & Finance Module
CREATE TABLE IF NOT EXISTS performance_cycles (
    cycle_id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS goals (
    goal_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    cycle_id INTEGER REFERENCES performance_cycles(cycle_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratings (
    rating_id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(review_id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
    feedback_id SERIAL PRIMARY KEY,
    from_emp INTEGER REFERENCES employees(id),
    to_emp INTEGER REFERENCES employees(id),
    comments TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id INTEGER REFERENCES employees(id),
    category TEXT NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending',
    claim_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Training & Assets Module
CREATE TABLE IF NOT EXISTS training_programs (
    training_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    training_id INTEGER REFERENCES training_programs(training_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
    cert_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
    asset_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asset_allocations (
    allocation_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    asset_id INTEGER REFERENCES assets(asset_id) ON DELETE CASCADE,
    allocated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Access & Roles (RBAC)
CREATE TABLE IF NOT EXISTS system_roles (
    role_id SERIAL PRIMARY KEY,
    role_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER REFERENCES system_roles(role_id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_accounts (
    user_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES system_roles(role_id),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Seed Default Data
INSERT INTO leave_types (name, description) VALUES 
('Annual Leave', 'Standard paid leave'),
('Sick Leave', 'Medical leave'),
('Casual Leave', 'Unplanned quick leave')
ON CONFLICT DO NOTHING;

INSERT INTO system_roles (role_name) VALUES 
('Admin'),
('Manager'),
('Employee')
ON CONFLICT DO NOTHING;
