-- 1. Employees Table
-- Ensure this table exists. This script assumes it creates it if not exists, but 'employees' is often created by Supabase Auth or manually.
-- We use 'employee_id' as Serial Primary Key based on current codebase usage.
CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    designation TEXT,
    department TEXT,
    joining_date DATE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(emp_id, attendance_date)
);

-- 3. Candidates Table (Recruitment)
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT,
    status TEXT DEFAULT 'Applied',
    rating INTEGER DEFAULT 0,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Leave Types
CREATE TABLE IF NOT EXISTS leave_types (
    leave_type_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- Seed Leave Types
INSERT INTO leave_types (name) VALUES ('Annual Leave'), ('Sick Leave'), ('Casual Leave'), ('Maternity Leave') ON CONFLICT DO NOTHING;

-- 5. Leave Balances
CREATE TABLE IF NOT EXISTS leave_balances (
    balance_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
    leave_type_id INTEGER REFERENCES leave_types(leave_type_id),
    balance INTEGER DEFAULT 0,
    UNIQUE(emp_id, leave_type_id)
);

-- 6. Leave Requests
CREATE TABLE IF NOT EXISTS leave_requests (
    request_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(employee_id) ON DELETE CASCADE,
    leave_type_id INTEGER REFERENCES leave_types(leave_type_id),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Seed Data
-- Insert Test Employee (ID 1) if not exists
INSERT INTO employees (employee_id, first_name, last_name, email, designation, department, joining_date, status)
VALUES (1, 'John', 'Doe', 'john.doe@example.com', 'Software Engineer', 'Engineering', CURRENT_DATE, 'Active')
ON CONFLICT (employee_id) DO NOTHING;

-- Seed Balances for Test Employee
INSERT INTO leave_balances (emp_id, leave_type_id, balance)
SELECT 1, leave_type_id, 14 FROM leave_types
ON CONFLICT DO NOTHING;

