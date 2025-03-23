/*
 * @Description: 配置数据库信息
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:52:31
 */
let mysql = require('mysql')

let db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'info_query_system',
    multipleStatements: true
})

module.exports = db
