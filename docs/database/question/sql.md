# SQL Question

### 1. How to Retrieve the Top N Records from a Table?
```sql
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 5;
```

### 2. How to Find Duplicate Records in a Table?
```sql
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

### 3. Delete Duplicate Records, Keeping One Copy
```sql
WITH RankedUsers AS (
    SELECT id, email, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) as rn
    FROM users
)
DELETE FROM users
WHERE id IN (
    SELECT id
    FROM RankedUsers
    WHERE rn > 1
);
```

### 4. Perform a Join to Find Records with No Match
- Question: Find all departments from a departments table that have no employees in an employees table (based on `department_id`).
```sql
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100)
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department_id INT
);

INSERT INTO departments (department_name) VALUES
('HR'),
('Engineering'),
('Marketing'),
('Finance');

INSERT INTO employees (name, department_id) VALUES
('Alice', 1), -- HR
('Bob', 2),   -- Engineering
('Charlie', 2); -- Engineering
```

- Solution:
```sql
SELECT d.department_name
FROM departments d
-- highlight-next-line
LEFT JOIN employees e ON d.department_id = e.department_id
WHERE e.department_id IS NULL;
```

### 5. Calculate a Running Total in SQL
- Question:
    - Calculate a running total of sales amounts for each order in a sales table, ordered by `order_date`.

```sql
CREATE TABLE sales (
    order_id SERIAL PRIMARY KEY,
    order_date DATE,
    amount DECIMAL(10, 2)
);

-- Insert sample data
INSERT INTO sales (order_date, amount) VALUES
('2025-01-01', 100.00),
('2025-01-02', 150.00),
('2025-01-03', 200.00),
('2025-01-04', 120.00);

SELECT order_id, order_date, amount,
       SUM(amount) OVER (ORDER BY order_date) as running_total
FROM sales;
```

### 6. Group Data and Calculate Aggregates
- Question: Find the total salary for each department in the employees table.
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(100),
    salary DECIMAL(10, 2)
);

INSERT INTO employees (name, department, salary) VALUES
('Alice', 'HR', 60000.00),
('Bob', 'Engineering', 85000.00),
('Charlie', 'Engineering', 90000.00),
('David', 'HR', 55000.00),
('Eve', 'Marketing', 70000.00);

-- Solution
SELECT department, SUM(salary) as total_salary
FROM employees
-- highlight-next-line
GROUP BY department;
```

### 7. Handle NULL Values in Comparisons
- Question: Retrieve all employees from the employees table whose manager_id is NULL (i.e., top-level employees).

```sql
SELECT name, employee_id
FROM employees
WHERE manager_id IS NULL;
```

### 8. Join Multiple Tables to Retrieve Related Data
```sql
SELECT e.name, d.department_name, o.location
FROM employees e
INNER JOIN departments d ON e.department_id = d.department_id
INNER JOIN offices o ON o.office_id = d.office_id;
```

### 9. Filter Data Using a Subquery
- Question: Find all employees whose salary is higher than the average salary in the employees table.
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    salary DECIMAL(10, 2)
);

INSERT INTO employees (name, salary) VALUES
('Alice', 60000.00),
('Bob', 85000.00),
('Charlie', 95000.00),
('David', 55000.00);

SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### 10. Union Join
- Questions: Find the combined list of all employees (both current and former) without duplicates.
```sql
CREATE TABLE current_employees (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(100)
);

CREATE TABLE former_employees (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(100)
);

INSERT INTO current_employees (name, department) VALUES
('Alice', 'HR'),
('Bob', 'Engineering'),
('Charlie', 'Marketing'),
('David', 'Engineering');

INSERT INTO former_employees (name, department) VALUES
('Bob', 'Engineering'), -- Bob appears in both tables
('Eve', 'Sales'),
('Frank', 'HR');

-- Remove duplicates
SELECT name, department
FROM current_employees
UNION
SELECT name, department
FROM former_employees
ORDER BY name;

-- Do not remove duplicates
SELECT name, department
FROM current_employees
UNION ALL
SELECT name, department
FROM former_employees
ORDER BY name;
```