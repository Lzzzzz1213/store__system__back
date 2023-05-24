import { request } from "@/utils/service"

interface ICreateUserDataApi {
  username: string
  password: string
  email: string
  head_portrait_url: string
  id_card: string
  phone: string
  type: string
}
interface IGetUserDataApi {
  /** 当前页码 */
  currentPage: number
  /** 查询条数 */
  size: number
  /** 查询参数 */
  username?: string
  phone?: string
}
interface IRestUserPwdApi {
  username: string
  email: string
  id_card: string
}
/** 增 */
export function createUserDataApi(data: ICreateUserDataApi) {
  return request({
    url: "/user/register/",
    method: "post",
    data
  })
}
/** 查 */
export function getUserDataApi(params: IGetUserDataApi) {
  return request({
    url: "/user/userlist/",
    method: "get",
    params
  })
}

export function UserDisableOrEnable(id: any) {
  return request({
    url: `/user/status/${id}/`,
    method: "put"
  })
}

export function UserLoginOut(token: string) {
  return request({
    url: "/user/logout/",
    method: "post",
    params: { token }
  })
}

export function UserRestPwd(params: IRestUserPwdApi) {
  return request({
    url: "/user/register/",
    method: "put",
    data: params
  })
}
