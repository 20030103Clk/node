const mysql = require('mysql')

const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
//user:'username'
    password:'123456',
    database:'my_db_01',
})

//暴露
module.exports = db