// core
import { createApp } from "vue"
import App from "@/App.vue"
import store from "@/store"
import router from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"
// import axios from "axios"

const app = createApp(App)

/** 加载插件 */
loadPlugins(app)
/** 加载全局 SVG */
loadSvg(app)
/** 加载自定义指令 */
loadDirectives(app)
// axios.defaults.baseURL = "http://127.0.0.1:9000/demo/api/"
// app.config.globalProperties.$http = axios
// const token = localStorage.getItem("token")
// if (token) {
//   app.config.globalProperties.$http.defaults.headers.common["Authorization"] = "Token " + token
// }
app.use(store).use(router).mount("#app")
