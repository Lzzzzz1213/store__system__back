<script lang="ts" setup>
import { h, ref } from "vue"
import { useUserStore } from "@/store/modules/user"
import AdminDashboard from "./admin/index.vue"
import EditorDashboard from "./editor/index.vue"
import { ElNotification } from "element-plus"

type CurrentRoleType = "admin" | "editor"

const userStore = useUserStore()
const currentRole = ref<CurrentRoleType>("admin")
if (!userStore.roles.includes("admin")) {
  currentRole.value = "editor"
}

ElNotification({
  title: "你好",
  message: h(
    "a",
    { style: "color: teal", target: "_blank", href: "https://github.com/un-pany/v3-admin-vite" },
    "欢迎使用商城后台管理系统"
  ),
  duration: 0,
  position: "bottom-right"
})
</script>

<template>
  <component :is="currentRole === 'admin' ? AdminDashboard : EditorDashboard" />
</template>
