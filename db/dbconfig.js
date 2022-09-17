const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '123',
    database:'escola',
    port: 3306
})

module.exports = pool