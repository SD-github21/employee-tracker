require('dotenv').config()
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection(
    {
        host: "localhost",
        // Your MySql username
        user: process.env.user,
        // Your MySql password
        password: process.env.password,
        database: "employee_tracker"
    },
);

module.exports = db;