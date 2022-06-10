//const mysql = require('mysql2')

// Połaczenie do bazy
// const pool = mysql.createPool({
    //     connectionLimit : 10,
    //     host : process.env.DB_HOST,
    //     user : process.env.DB_USER,
    //     database : process.env.DB_NAME
    // })

const {Pool} = require('pg')

const pool = new Pool({
    user: process.env.DB_PGUSER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PGPASS
})

module.exports = pool