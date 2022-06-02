let view_depts = `SELECT * FROM department`;
let view_roles = `SELECT * FROM roles`;
let view_emps = `SELECT * FROM employee`;

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