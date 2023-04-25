import { request } from "@/utils/service"

export function uploadImg(data: any) {
  return request({
    url: "/img/imgupload/",
    method: "post",
    data: data,
    headers: { "Content-Type": "multipart/form-data" }
  })
}

export function upload(data: any) {
  return request({
    url: "/img/imgUpload/",
    method: "post",
    data: data,
    headers: { "Content-Type": "multipart/form-data" }
  })
}
