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