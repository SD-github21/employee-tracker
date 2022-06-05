// Import all required dependencies/modules/packages
const inquirer = require("inquirer");
require("console.table");
const db = require("./db/connection");

// Create function 
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
            .then (roleData => {addRoleData(roleData)});
        } else if (menu === "Add an employee") {
            return inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the employee's first name?",
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the employee's last name?",
                },
                {
                    type: "input",
                    name: "role",
                    message: "What is the employee's role?",
                },
                {
                    type: "input",
                    name: "manager",
                    message: "Who is the employee's manager?",
                 },
                ])
            .then (empData => {addEmpData(empData)});
        } else if (menu === "Update an employee role") {

            let employee_name = `SELECT CONCAT(employee.first_name,' ', employee.last_name) AS employee
            FROM employee`;
        db.connect(function(err) {
            if (err) throw err;
            db.query(employee_name, function (err, result) {
                if (err) throw err;
                let getEmpChoices = result.map(({ employee }) => employee) 
                return inquirer.prompt([
                    {
                        type: "list",
                        name: "empFullName",
                        message: "Which employee's role would you like to update?",
                        choices:  getEmpChoices,
                    },

                    {
                        type: "input",
                        name: "newRole",
                        message: "What is the new role of this employee?"
                    }
                ])
                .then (empRole => {updateRoleData(empRole)});
            })});
        } else {
            // Create a statement to notify user that application has finished
            console.log("You have finished viewing and managing your organization's data. Goodbye!")
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

    const view_emps = `SELECT employee1.id AS emp_id, employee1.first_name AS first_name, employee1.last_name AS last_name,  
    roles.title AS job_title, department.name AS department, roles.salary, 
    CONCAT(manager.first_name,' ', manager.last_name) AS manager 
    FROM employee employee1  
    INNER JOIN roles ON employee1.role_id = roles.id
    LEFT JOIN department ON department.id = roles.department_id
    LEFT JOIN employee manager ON employee1.manager_id = manager.id  
    `; 

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
            profileMenuOptions();

        });
          });
    
 };
    
 const addRoleData = (roleData) => {

    let role = roleData.role;
    let salary = roleData.salary;
    let department = roleData.department;


        let role_id = `SELECT department.id FROM department 
        WHERE department.name = '${department}'
        LIMIT 1`;

            db.connect(function(err) {

                db.query(role_id, (err, result) => {
                    if (err) throw err;
                    let dept_id = result[0].id;
                    addRole(role, salary, dept_id);

                });
        
        const addRole = (role, salary, dept_id) => {


            const add_role = `INSERT INTO roles (title, salary, department_id)
            VALUES
            ('${role}', '${salary}', '${dept_id}')`;

            db.query(add_role, (err, result) => {
                if (err) throw err;
                console.log(`Added ${role} to the database`);
                profileMenuOptions();
            });
        }       
   });
};   
 
// BEGIN ADD EMPLOYEE CODE

const addEmpData = (empData) => {

        let first_name = empData.first_name
        let last_name = empData.last_name;
        let role = empData.role;
        let manager = empData.manager;
           
           
        let getRoleId = `SELECT roles.id FROM roles 
        WHERE roles.title = '${role}' 
        LIMIT 1`;

        let getManagerId =  `SELECT employee.id
        FROM employee 
        WHERE CONCAT(employee.first_name,' ', employee.last_name) = '${manager}' LIMIT 1`;


        db.query(getRoleId, (err, result) => {
            if (err) throw err;
            let role_id = result[0].id;
            goToManager(first_name, last_name, role_id)});

            const goToManager = (first_name, last_name, role_id, manager) =>{
                
  
            db.query(getManagerId, (err, result) => {
                if (err) throw err;
                let manager_id = result[0].id;
                addEmp(first_name, last_name, role_id, manager_id)});


            }

        }
            

 const addEmp = (first_name, last_name, role_id, manager_id) => {
    
            const add_emp = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES
            ('${first_name}', '${last_name}', '${role_id}', '${manager_id}')`;
     
            db.query(add_emp, (err, result) => {
                if (err) throw err;
                console.log(`Added ${first_name} ${last_name} to the database`);
                profileMenuOptions();
            });
};      
              
                      
              
               
    
const updateRoleData = function (updateData) {

    let employee_name = updateData.empFullName;
    let newRole = updateData.newRole;

    let getEmpId = `SELECT employee.id FROM employee 
                WHERE CONCAT(employee.first_name,' ', employee.last_name) = '${employee_name}'`;

    let getNewRoleId =  `SELECT roles.id FROM roles 
                WHERE roles.title = '${newRole}'`;


            db.query(getEmpId, (err, result) => {
                if (err) throw err;
                let emp_id = result[0].id;
                goToNewRole(employee_name, newRole, emp_id)});

            goToNewRole = (employee_name, newRole, emp_id) => {
                db.query(getNewRoleId, (err, result) => {
                if (err) throw err;
                let newRole_id = result[0].id;
                updateRole(employee_name, newRole, emp_id, newRole_id)});
    }
};

updateRole = (employee_name, newRole, emp_id, newRole_id) => {

    const update_emp = `UPDATE employee SET role_id = ${newRole_id}
            WHERE id = ${emp_id}`;

            db.query(update_emp, (err, result) => {
                if (err) throw err;
                console.log(`Updated ${employee_name}'s new role '${newRole}' in the database`);
                profileMenuOptions();
            });

}

initializeApp = () => {
    console.log("Welcome to Employee Tracker - a CMS designed to help you organize and plan your business!");
    profileMenuOptions();
}

initializeApp();