-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Candidates (Recruitment)
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Applied', 'Interview', 'Offer', 'Hired', 'Rejected')),
    rating INTEGER DEFAULT 0,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Payroll (Salary Slips)
CREATE TABLE payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    month TEXT NOT NULL, -- e.g. "January 2026"
    basic_salary NUMERIC NOT NULL,
    allowances NUMERIC DEFAULT 0,
    deductions NUMERIC DEFAULT 0,
    net_pay NUMERIC NOT NULL,
    status TEXT DEFAULT 'Processed' CHECK (status IN ('Draft', 'Processed', 'Paid')),
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Expenses (Finance)
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    category TEXT NOT NULL CHECK (category IN ('Travel', 'Meals', 'Internet', 'Office Supplies', 'Other')),
    description TEXT,
    amount NUMERIC NOT NULL,
    receipt_url TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Paid')),
    claim_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Assets (Inventory)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Laptop', 'Monitor', 'Phone', 'Accessory', 'Furniture')),
    serial_number TEXT UNIQUE,
    status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Assigned', 'Maintenance', 'Retired')),
    assigned_to UUID REFERENCES employees(id),
    assigned_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Training (L&D)
CREATE TABLE training_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    duration_hours NUMERIC,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE employee_training (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    course_id UUID REFERENCES training_courses(id),
    status TEXT DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
    progress_percent INTEGER DEFAULT 0,
    assigned_date DATE DEFAULT CURRENT_DATE,
    completion_date DATE
);

-- 6. Performance (Goals)
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'In Progress' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Cancelled')),
    progress_percent INTEGER DEFAULT 0,
    due_date DATE,
    priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
