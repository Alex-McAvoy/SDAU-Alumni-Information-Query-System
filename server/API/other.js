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
    let city = '%'+request.query.city+'%' // 所在城市
    let county = '%'+request.query.county+'%' // 所在区县
    let township = '%'+request.query.township+'%' // 所在乡镇
    if (township.includes(" ") || township.includes(",") 
        || township.includes("、") || township.includes("/")
        || township.includes("\\") ) {
        township = '%%'
    }
    let district_params = [city,county,township] //行政区域参数


    /* ------ 拼接sql语句 ------  */
    let sql1 = '' // 分页查询sql
    let sql2 = '' // 相关结果数sql
    var keyword = request.query.keyword // 模糊查询对象
    if (keyword != null && keyword != '') { // 带模糊查询
        // 拼接分页查询sql
        sql1 = "SELECT * " +
               "FROM (SELECT * " +
               "      FROM other " +
               "      WHERE o_city LIKE ? "+
               "      AND o_county LIKE ? " +
               "      AND o_township LIKE ?) temp " +
               "WHERE temp.o_name LIKE '%" + keyword + "%' " +
               "   OR temp.o_phone LIKE '%" + keyword + "%' " +
               "   OR temp.o_type LIKE '%" + keyword + "%' " +
               "   OR temp.o_city LIKE '%" + keyword + "%' " +
               "   OR temp.o_county LIKE '%" + keyword + "%' " +
               "   OR temp.o_township LIKE '%" + keyword + "%' " +
               "   OR temp.o_address LIKE '%" + keyword + "%' " +
               "   OR temp.o_year LIKE '%" + keyword + "%' " +
               "LIMIT ?,?;"
        // 拼接相关结果数sql
        sql2 = "SELECT COUNT(*) as o_total " +
               "FROM (SELECT * " +
               "      FROM other " +
               "      WHERE o_city LIKE ? "+
               "      AND o_county LIKE ? " +
               "      AND o_township LIKE ?) temp " +
               "WHERE temp.o_name LIKE '%" + keyword + "%' " +
               "   OR temp.o_phone LIKE '%" + keyword + "%' " +
               "   OR temp.o_type LIKE '%" + keyword + "%' " +
               "   OR temp.o_city LIKE '%" + keyword + "%' " +
               "   OR temp.o_county LIKE '%" + keyword + "%' " +
               "   OR temp.o_township LIKE '%" + keyword + "%' " +
               "   OR temp.o_address LIKE '%" + keyword + "%' " +
               "   OR temp.o_year LIKE '%" + keyword + "%';"
    } else { // 不带模糊查询
        // 拼接分页查询sql
        sql1 = "SELECT * " +
            "FROM other " +
            "WHERE o_city LIKE ? " +
            "  AND o_county LIKE ? " +
            "  AND o_township LIKE ? " +
            "LIMIT ?,?;"
        // 拼接相关结果数sql
        sql2 = "SELECT COUNT(*) as o_total " +
            "FROM other " +
            "WHERE o_city LIKE ? " +
            "  AND o_county LIKE ? " +
            "  AND o_township LIKE ?;"
    }

    /* ------ 执行sql语句 ------  */
    db.query(sql1, district_params.concat(page_params), (err1, result1) => { // 分页查询
        if (err1) {
            return response.send({
                status: 400,
                message: "数据查询失败\n" + err1.message
            })
        } else {
            db.query(sql2, district_params, (err2, result2) => { // 查询相关结果数
                if (err2) {
                    return response.send({
                        status: 400,
                        message: "数据查询失败\n" + err2.message
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