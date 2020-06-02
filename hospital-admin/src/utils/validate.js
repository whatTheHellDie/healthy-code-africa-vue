/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}
/**
 * 正整数
 * @param {*} s
 */
export function isPositiveInteger (s) {
  return /^[0-9]*[1-9][0-9]*$/.test(s)
}
/**
 * 正浮点数
 * @param {*} s
 */
export function isPositiveFloat (s) {
  return /^[1-9]\d*\.?\d*|0\.\d*[1-9]\d*$/.test(s)
}
/**
 * 1>=s>0
 * @param {*} s
 */
export function isBewteenOneAndZero (s) {
  return /^(1|1\.[0]+|0?\.(?!0+$)[\d]+)$/.test(s)
}
