import { request } from "@/utils/service"

export function userShoppingAddressDetail(id: any) {
  return request({
    url: `/address/detail/${id}/`,
    method: "get"
  })
}
