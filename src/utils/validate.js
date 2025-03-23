/*
 * @Description: 校验工具
 * @Author: Alex_McAvoy
 * @Date: 2023-07-15 19:24:19
 */


// 检查是否为外链
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}


//  验证字符串是否为空
export function validateNotNull(str) {
  return str !== ''
}

// 验证手机号
export function validatePhone(phone) {
  const re = /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
  return re.test(phone)
}

// 验证密码
export function validatePassword(password) {
  // 包含字母、数字，长度至少为 8 位，最多 16 位
  const re = /^(?=.*[a-zA-Z])(?=.*\d)[^]{8,16}$/
  return re.test(password)
}

