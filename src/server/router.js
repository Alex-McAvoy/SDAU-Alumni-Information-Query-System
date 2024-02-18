/*
 * @Description: express路由信息
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:59:16
 */
let express = require('express')
let router = express.Router()

let login = require('./API/login')
router.get('/login', login.login)

let student = require('./API/student')
router.post('/updatePassword', student.updatePassword)

let other = require('./API/other')
router.get('/getOtherPageList', other.getOtherPageList)

module.exports = router