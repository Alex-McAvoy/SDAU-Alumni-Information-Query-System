/*
 * @Description: 配置node服务器信息
 * @Author: Alex_McAvoy
 * @Date: 2023-07-14 22:52:15
 */
let express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let router = require('./router')

let app = express()
//配置解析，用于解析json和urlencoded格式的数据
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));
//配置跨域
app.use(cors()) 
//配置路由
app.use(router)

app.listen(3000, () => {
    console.log('服务器启动成功');
})

