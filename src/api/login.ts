import { request } from "@/utils/service"

export interface ILoginData {
  /** admin 或 editor */
  username: string
  /** 密码 */
  password: string
  /** 验证码 */
  // code: string
  type: string
}

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request({
    url: "login/code",
    method: "get"
  })
}
/** 登录并返回 Token */
export function loginApi(data: ILoginData) {
  return request({
    url: "/user/login/",
    method: "post",
    data: data
  })
}
/** 获取用户详情 */
export function getUserInfoApi() {
  return request({
    url: "users/info",
    method: "get"
  })
}

export function getUserListApi() {
  return request({
    url: "/user/userlist/",
    method: "get"
  })
}
