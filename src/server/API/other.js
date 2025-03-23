/*
 * @Description: 其他人员API
 * @Author: Alex_McAvoy
 * @Date: 2023-07-16 02:52:45
 */
let db = require('../db/index')

exports.getOtherPageList = (request, response) => {
    /* ------ 分页查询相关参数 ------  */
    let limit = parseInt(request.query.limit) // 当前页的数量
    let page = parseInt(request.query.page) // 当前页的页号
    let page_params = [(page - 1) * limit, limit] // 分页参数

    /* ------ 行政区域代码 ------  */
    let code_params = request.query.township_code // 行政区域代码
    // n个行政代码，n个 other.o_township_code=?
    let code_sql = ''
    for (let i = 0; i < code_params.length - 1; i++) { // 前n-1个
        code_sql += "o.o_township_code='" + code_params[i] + "' OR "
    }
    code_sql += "o.o_township_code='" + code_params[code_params.length - 1] + "' " // 第n个

    /* ------ 拼接sql语句 ------  */
    let sql1 = '' // 分页查询sql
    let sql2 = '' // 相关结果数sql
    var keyword = request.query.keyword // 模糊查询对象
    if (keyword != null && keyword != '') { // 带模糊查询
        // 拼接分页查询sql
        sql1 = "SELECT * " +
            "FROM (SELECT * " +
            "    FROM other o " +
            "    WHERE " + code_sql + ") temp " +
            "WHERE temp.o_name LIKE '%" + keyword + "%' " +
            "OR temp.o_phone LIKE '%" + keyword + "%' " +
            "    OR temp.o_type LIKE '%" + keyword + "%' " +
            "OR temp.o_township_code LIKE '%" + keyword + "%' " +
            "LIMIT ?,?;"
        // 拼接相关结果数sql
        sql2 = "SELECT COUNT(*) as o_total " +
            "FROM (SELECT * " +
            "    FROM other o " +
            "    WHERE " + code_sql + ") temp " +
            "WHERE temp.o_name LIKE '%" + keyword + "%' " +
            "OR temp.o_phone LIKE '%" + keyword + "%' " +
            "    OR temp.o_type LIKE '%" + keyword + "%' " +
            "OR temp.o_township_code LIKE '%" + keyword + "%';"
    } else { // 不带模糊查询
        // 拼接分页查询sql
        sql1 = "SELECT * " +
            "FROM other o " +
            "WHERE " + code_sql +
            "LIMIT ?,?;"
        // 拼接相关结果数sql
        sql2 = "SELECT COUNT(*) as o_total " +
            "FROM other o " +
            "WHERE " + code_sql + ";"
    }

    /* ------ 执行sql语句 ------  */
    db.query(sql1, page_params, (err1, result1) => { // 分页查询
        if (err1) {
            return response.send({
                status: 400,
                message: "查询失败" + err1.message
            })
        } else {
            db.query(sql2, page_params, (err2, result2) => { // 查询相关结果数
                if (err2) {
                    return response.send({
                        status: 400,
                        message: "查询失败" + err2.message
                    })
                } else {
                    result1.push(result2) // 拼接结果
                    response.send({
                        status: 200,
                        message: "查询成功",
                        result: result1
                    })
                }
            })
        }
    })
}