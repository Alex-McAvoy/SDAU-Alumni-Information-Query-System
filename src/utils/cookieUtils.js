/*
 * @Description: 从cookie中取、放、删token
 * @Author: Alex_McAvoy
 * @Date: 2023-07-15 15:54:35
 */
import Cookies from 'js-cookie'

const TokenKey = 'info_query_system_token'

//  从cookie中取token
export function getToken() {
  return Cookies.get(TokenKey)
}

// 向cookie中设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 从cookie中移除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}
