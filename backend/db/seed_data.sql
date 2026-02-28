-- Comprehensive Sample Data for HRMS Pro
-- Paste this into the Supabase SQL Editor and Run it.
-- Make sure you have already run master_setup.sql first!

-- 1. Organization Data
INSERT INTO companies (name, registration_no, timezone) VALUES 
('Quantum Systems', 'QS-9988-X', 'Asia/Kolkata'),
('Nexus Digital', 'ND-1122-Z', 'Europe/London');

INSERT INTO branches (company_id, name, location) VALUES 
(1, 'Main HQ', 'Bangalore, India'),
(1, 'Innovation Hub', 'Hyderabad, India'),
(2, 'Sales Office', 'London, UK');

INSERT INTO departments (branch_id, name) VALUES 
(1, 'Engineering'),
(1, 'Product'),
(1, 'HR'),
(2, 'Research & Development'),
(3, 'Global Sales');

INSERT INTO designations (title, level, grade) VALUES 
('Junior Developer', 1, 'L1'),
('Senior Developer', 3, 'L3'),
('Product Manager', 3, 'M1'),
('HR Specialist', 2, 'S2'),
('Head of Engineering', 5, 'E1');

INSERT INTO employment_types (type_name) VALUES 
('Full-Time'),
('Part-Time'),
('Contract'),
('Intern');

INSERT INTO work_locations (location_type) VALUES 
('OFFICE'),
('HOME'),
('HYBRID');

INSERT INTO shifts (start_time, end_time) VALUES 
('09:00:00', '18:00:00'),
('14:00:00', '23:00:00'),
('22:00:00', '07:00:00');

-- 2. Employee Data
INSERT INTO employees (id, company_id, dept_id, designation_id, emp_type_id, first_name, last_name, email, status) VALUES 
(2, 2, 1, 2, 1, 'Sarah', 'Connor', 'sarah.c@quantum.com', 'ACTIVE'),
(3, 2, 1, 1, 1, 'Kyle', 'Reese', 'kyle.r@quantum.com', 'ACTIVE'),
(4, 2, 3, 4, 1, 'John', 'Wick', 'john.w@quantum.com', 'ACTIVE'),
(5, 3, 5, 5, 1, 'Thomas', 'Anderson', 'neo@nexus.com', 'ACTIVE');

-- 3. Attendance & Leave
INSERT INTO attendance (emp_id, attendance_date, check_in, check_out, status) VALUES 
(1, CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '8 hours', CURRENT_TIMESTAMP, 'PRESENT'),
(2, CURRENT_DATE, CURRENT_TIMESTAMP - INTERVAL '7 hours', NULL, 'PRESENT'),
(3, CURRENT_DATE - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day 9 hours', CURRENT_TIMESTAMP - INTERVAL '1 day 1 hour', 'PRESENT');

INSERT INTO leave_requests (emp_id, leave_type_id, from_date, to_date, status, reason) VALUES 
(2, 1, CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '7 days', 'APPROVED', 'Family vacation'),
(3, 2, CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '1 day', 'APPROVED', 'Medical emergency'),
(4, 3, CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '11 days', 'PENDING', 'Personal work');

-- 4. Recruitment
INSERT INTO job_openings (dept_id, title) VALUES 
(1, 'Backend Engineer (Python)'),
(2, 'UI/UX Designer'),
(4, 'Deep Learning Researcher');

INSERT INTO candidates (name, email) VALUES 
('Alice Smith', 'alice@example.com'),
('Bob Johnson', 'bob@example.com'),
('Charlie Brown', 'charlie@example.com');

INSERT INTO applications (candidate_id, job_id, status) VALUES 
(1, 1, 'INTERVIEW'),
(2, 1, 'APPLIED'),
(3, 2, 'OFFERED');

-- 5. Assets
INSERT INTO assets (name) VALUES 
('MacBook Pro M3 - 14"'),
('Dell UltraSharp 27" Monitor'),
('Logitech MX Master 3S'),
('iPhone 15 Pro');

INSERT INTO asset_allocations (emp_id, asset_id) VALUES 
(1, 1),
(1, 2),
(2, 3);

-- 6. Performance
INSERT INTO performance_cycles (year) VALUES (2025), (2026);

INSERT INTO goals (emp_id, description) VALUES 
(1, 'Implement new microservices architecture'),
(2, 'Optimize database queries for 2x performance'),
(3, 'Complete onboarding for 5 new interns');

-- 7. Training
INSERT INTO training_programs (title) VALUES 
('Advanced FastAPI Patterns'),
('Supabase for Enterprise'),
('Soft Skills for Leaders');

INSERT INTO enrollments (emp_id, training_id) VALUES 
(1, 1),
(2, 1),
(4, 3);
