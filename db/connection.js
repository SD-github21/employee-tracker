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
// can add connection in this file
db.connect(function(err) {
    if (err) throw err;});

module.exports = db;