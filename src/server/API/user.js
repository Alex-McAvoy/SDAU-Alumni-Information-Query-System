/*
 * @Description: 用户API
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:52:31
 */
let db = require('../db/index')

exports.updatePassword = (request, response) => {
    var sql = ''
    if (request.body.authority == 1) { // 教师
        sql = 'UPDATE teacher SET t_password = ? WHERE t_id = ? AND t_password = ?;'
    } else { // 学生
        sql = 'UPDATE student SET s_password = ? WHERE s_id = ? AND s_password = ?;'
    }
    db.query(sql, [request.body.newPassword, request.body.userId, request.body.oldPassword], (err, result) => {
        if (err) {
            return response.send({
                status: 400,
                message: "错误：" + err.message
            })
        }
        if (result.changedRows > 0) {
            response.send({
                status: 200,
                message: "修改成功",
            })
        } else {
            response.send({
                status: 202,
                message: '修改失败'
            })
        }
    })
}
