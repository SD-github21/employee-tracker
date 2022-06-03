// Import all required dependencies/modules/packages
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");


let add_emp = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
               VALUES
               (?, ?,  ?, )`;

let update_emp = `UPDATE employee SET role_id = ?
                  WHERE id = ?`;


const profileMenuOptions = () => {
    inquirer.prompt(
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: ['View all departments', 'View all roles', 'View all employees', 
                      'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 
                      'Exit']
        })
    .then (({ menu }) => {
        // Create if statement to direct user to the SQL queries associated with the menu options
        if (menu === "View all departments"){
            viewDepts();
        } else if (menu === "View all roles") {
            viewRoles();
        } else if (menu === "View all employees") {
            viewEmps();
        } else if (menu === "Add a department") {
            inquirer.prompt(
                {
                    type: "input",
                    name: "department",
                    message: "What is the name of the department?",
            })
            .then (deptData => {addDepts(deptData)});
        } else if (menu === "Add a role") {
           return inquirer.prompt([
                {
                    type: "input",
                    name: "role",
                    message: "What is the name of the role?",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?",
                },
                {
                    type: "input",
                    name: "department",
                    message: "Which department does the role belong to?",
                 },
                ])
            .then (roleData => {addRole(roleData)});
        } else if (menu === "Add an employee") {
            addEmp();
        } else if (menu === "Update an employee role") {
            updateEmp();
        } else {
            // Create a statement to notify user that application has finished
            console.log("You have finished viewing and managing your organization's data. Goodbye!");
            return;
        }

    })
};


const viewDepts = () => {

    const view_depts = `SELECT department.id AS dept_id, department.name AS dept_name FROM department`;

    db.connect(function(err) {
        if (err) throw err;
        db.query(view_depts, function (err, result) {
            if (err) throw err;
            console.table(result);
            profileMenuOptions();
        });
    });
};

const viewRoles = () => {

    const view_roles = `SELECT roles.id AS role_id, roles.title AS job_title, department.name AS dept_name,
    roles.salary AS salary
    FROM roles
    INNER JOIN department ON roles.department_id = department.id`;
    
    db.connect(function(err) {
        if (err) throw err;
        db.query(view_roles, function (err, result) {
          if (err) throw err;
          console.table(result);
          profileMenuOptions();
        });
      });
    };
    
const viewEmps = () => {

    const view_emps = `SELECT employee.id AS emp_id, employee.first_name AS first_name, employee.last_name AS last_name,  
    roles.title AS job_title, department.name AS department, roles.salary,
    CONCAT(employee.first_name,' ', employee.last_name) as manager
    FROM employee
    INNER JOIN roles ON employee.role_id = roles.id
    LEFT JOIN department ON department.id = roles.department_id`; 

    db.connect(function(err) {
        if (err) throw err;
        db.query(view_emps, function (err, result) {
            if (err) throw err;
            console.table(result);
            profileMenuOptions();
        });
        });
    };


const addDepts = (deptData) => {
    let dept_name = (deptData.department);

    const add_dept = `INSERT INTO department (name) VALUES
    ('${dept_name}')`;
       
    db.connect(function(err) {
        
        db.query(add_dept, (err, result) => {
            if (err) throw err;
            console.log(`Added ${dept_name} to the database`);
        });
          });
    
 };
    
 const addRole = (roleData) => {
    let role = roleData.role;
    let salary = roleData.salary;
    let department = roleData.department;


        let role_id = `SELECT roles.department_id FROM roles 
        INNER JOIN department ON department_id = department.id
        WHERE department.name = '${department}'`;

            db.connect(function(err) {

                db.query(role_id, (err, result) => {
                    if (err) throw err;
                    console.log(result);
                });
            });
};   


//     const add_role = `INSERT INTO roles (title, salary, department_id)
//     VALUES
//     ('${role}', '${salary}', '${department})`;
       
//     db.connect(function(err) {
        
//         db.query(add_role, (err, result) => {
//             if (err) throw err;
//             console.log(`Added ${role} to the database`);
//         });
//     });
    
//  };
    
    


profileMenuOptions();