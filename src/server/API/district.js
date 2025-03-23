/*
 * @Description: 行政区域API
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:52:31
 */
let db = require('../db/index')

exports.getDistrict = (request, response) => {
    var sql = ''
    if (request.query.authority == 1) { // 教师
        sql = 'SELECT city,county,township,township_code FROM t_district,district WHERE t_district.t_id = ? AND district.township_code = t_district.t_township_code;'
    } else { // 学生
        sql = 'SELECT city,county,township,township_code FROM s_district,district WHERE s_district.s_id = ? AND district.township_code = s_district.s_township_code;'
    }
    db.query(sql, [request.query.userId], (err, result) => {
        if (err) {
            return response.send({
                status: 400,
                message: "查询失败" + err.message
            })
        }
        if (result.length > 0) {
            response.send({
                status: 200,
                message: "查询成功",
                result: result
            })
        } else {
            response.send({
                status: 202,
                message: '无数据'
            })
        }
    })
}
