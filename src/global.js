/*
 * @Description: 全局变量
 * @Author: Alex_McAvoy
 * @Date: 2023-07-17 16:47:42
 */
// 服务器地址
const server = "http://202.194.139.189:8888"
// 开发地址
const dev = "http://127.0.0.1:3000"

let flag = 2
let address = ""
if (flag == 1) {
    address = dev
} else {
    address = server
}

export default {
    address
}