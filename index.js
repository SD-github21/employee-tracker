// Import all required dependencies/modules/packages
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");

let view_depts = `SELECT * FROM department`;
let view_roles = `SELECT * FROM roles`;
let view_emps = `SELECT * FROM employee`
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


const profileMenuOptions = () => {
    inquirer.prompt(
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: ['View all departments', 'View all roles', 'View all employees', 
                      'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
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
            addDepts();
        } else if (menu === "Add a role") {
            addRole();
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

    db.connect(function(err) {
        if (err) throw err;
        db.query(view_emps, function (err, result) {
            if (err) throw err;
            console.table(result);
            profileMenuOptions();
        });
        });
    };



profileMenuOptions();