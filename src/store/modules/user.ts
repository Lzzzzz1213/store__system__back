import { ref } from "vue"
import store from "@/store"
import { defineStore } from "pinia"
import { usePermissionStore } from "./permission"
import { getToken, removeToken, setToken } from "@/utils/cache/cookies"
import router, { resetRouter } from "@/router"
import { type ILoginData, loginApi, getUserInfoApi, getUserListApi } from "@/api/login"
import { type RouteRecordRaw } from "vue-router"

export const useUserStore = defineStore("user", () => {
  const token = ref<string>(getToken() || "")
  const roles = ref<string[]>([])
  const username = ref<string>(sessionStorage.getItem("username") || "")
  const id = ref(sessionStorage.getItem("id") || "")
  const mail = ref<string>(sessionStorage.getItem("mail") || "")
  const headurl = ref<string>(sessionStorage.getItem("headurl") || "")
  /** 设置角色数组 */
  const setRoles = (value: string[]) => {
    roles.value = value
  }
  /** 登录 */
  const login = (loginData: ILoginData) => {
    return new Promise((resolve, reject) => {
      loginApi({
        username: loginData.username,
        password: loginData.password,
        type: loginData.type
        // code: loginData.code
      })
        .then((res: any) => {
          setToken(res.data.token)
          id.value = res.data.id
          mail.value = res.data.mail
          username.value = res.data.username
          headurl.value = res.data.headurl
          token.value = res.data.token
          sessionStorage.setItem("token", token.value)
          sessionStorage.setItem("id", id.value.toString())
          sessionStorage.setItem("username", username.value)
          sessionStorage.setItem("mail", mail.value)
          sessionStorage.setItem("headurl", headurl.value)
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 获取用户详情 */
  const getInfo = () => {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((res: any) => {
          roles.value = res.data.roles
          username.value = res.data.username
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
  /** 切换角色 */
  const changeRoles = async (role: string) => {
    const newToken = "token-" + role
    token.value = newToken
    setToken(newToken)
    await getInfo()
    const permissionStore = usePermissionStore()
    permissionStore.setRoutes(roles.value)
    resetRouter()
    permissionStore.dynamicRoutes.forEach((item: RouteRecordRaw) => {
      router.addRoute(item)
    })
  }

  const getUserList = () => {
    return new Promise((resolve, reject) => {
      getUserListApi()
        .then((res: any) => {
          resolve(res)
          return res.data
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  /** 登出 */
  const logout = () => {
    removeToken()
    token.value = ""
    roles.value = []
    resetRouter()
  }
  /** 重置 Token */
  const resetToken = () => {
    removeToken()
    token.value = ""
    roles.value = []
  }

  return {
    token,
    roles,
    username,
    id,
    mail,
    headurl,
    setRoles,
    login,
    getInfo,
    changeRoles,
    logout,
    resetToken,
    getUserList
  }
})

/** 在 setup 外使用 */
export function useUserStoreHook() {
  return useUserStore(store)
}
