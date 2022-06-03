let view_depts = `SELECT department.id AS dept_id, department.name AS dept_name FROM department`;

let view_roles = `SELECT roles.id AS role_id, roles.title AS job_title, department.name AS dept_name,
                 roles.salary AS salary
                 FROM roles
                 INNER JOIN department ON roles.department_id = department.id`;

let view_emps = `SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name,  
                roles.title AS role, department.name AS department, roles.salary,
                CONCAT(employee.first_name,' ', employee.last_name) as manager
                FROM employee
                INNER JOIN roles ON employee.role_id = roles.id
                LEFT JOIN department ON department.id = roles.department_id`; 

let add_dept = `INSERT INTO department (name)
                VALUES
                (?)`;

let add_role = `INSERT INTO roles (title, salary, department_id)
                VALUES
                (?, ?, ?)`;

let add_emp = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
               VALUES
               (?, ?,  ?, )`;

let update_emp = `UPDATE employee SET role_id = ?
                  WHERE id = ?`;

let delete_dept = `DELETE FROM department WHERE id = ?`;

let delete_role = `DELETE FROM roles WHERE id = ?`;

let delete_emp = `DELETE FROM employee WHERE id = ?`;

-- still need to work on count of salaries by department
-- let total_sal = `SELECT department.name AS Department, count(role_id) AS Employees, SUM(salary) AS combined_salaries,   
--                  FROM employee
--                  JOIN roles ON role_id = roles(id) 
--                  JOIN department ON department_id = department(id)
--                  GROUP BY dept_id`;