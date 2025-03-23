/*
 * @Description: 登录API
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:52:31
 */
let db = require('../db/index')

exports.login = (request, response) => {
    var sql = ''
    if (request.query.authority == 1) { // 教师
        sql = 'SELECT * FROM teacher WHERE t_username = ? AND t_password = ?;'
    } else { // 学生
        sql = 'SELECT * FROM student WHERE s_username = ? AND s_password = ?;'
    }
    db.query(sql, [request.query.username, request.query.password], (err, result) => {
        if (err) {
            return response.send({
                status: 400,
                message: "登录失败" + err.message
            })
        }
        if (result.length > 0) {
            response.send({
                status: 200,
                message: "登录成功",
                result: result
            })
        } else {
            response.send({
                status: 202,
                message: '用户名或密码错误'
            })
        }
    })
}
