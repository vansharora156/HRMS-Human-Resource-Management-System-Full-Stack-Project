-- 1. Reset Tables (Drop existing to fix schema issues)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS training_courses CASCADE;
DROP TABLE IF EXISTS employee_training CASCADE;

-- 2. Create Employees Table (Standard "id" column)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    designation TEXT,
    department TEXT,
    joining_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Attendance Table
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(id),
    attendance_date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status TEXT, -- Present, Absent, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(emp_id, attendance_date)
);

-- 4. Recruitment (Candidates)
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Applied',
    rating INTEGER DEFAULT 0,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Ensure UUID extension is on
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 5. Payroll
CREATE TABLE payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id INTEGER REFERENCES employees(id),
    month TEXT NOT NULL,
    basic_salary NUMERIC DEFAULT 0,
    net_pay NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Expenses (Finance)
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id INTEGER REFERENCES employees(id),
    category TEXT NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending',
    claim_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Performance (Goals)
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id INTEGER REFERENCES employees(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'In Progress',
    progress_percent INTEGER DEFAULT 0,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Insert Test Employee (ID 1)
INSERT INTO employees (id, first_name, last_name, email, designation, department)
VALUES (1, 'John', 'Doe', 'john.doe@example.com', 'Software Engineer', 'Engineering');
