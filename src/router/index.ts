import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    // component: () => import("@/views/login/index.vue"),
    component: () => import("@/views/login/login.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  // {
  //   path: "/unocss",
  //   component: Layout,
  //   redirect: "/unocss/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/unocss/index.vue"),
  //       name: "UnoCSS",
  //       meta: {
  //         title: "unocss",
  //         svgIcon: "unocss"
  //       }
  //     }
  //   ]
  // },
  {
    path: "/usermanage",
    component: Layout,
    redirect: "/usermanage/userlists",
    name: "usermange",
    meta: {
      title: "后台用户",
      elIcon: "User"
    },
    children: [
      {
        path: "userlists",
        component: () => import("@/views/user/employeeManagement/index.vue"),
        // component: () => import("@/views/user/resetpwd/index.vue"),
        name: "userlists",
        meta: {
          title: "后台账号列表",
          elIcon: "Memo"
        }
      }
      // {
      //   path: "resetpwd",
      //   component: () => import("@/views/user/resetpwd/index.vue"),
      //   name: "resetpwd",
      //   meta: {
      //     title: "密码重置",
      //     elIcon: "Lock"
      //   }
      // }
      // {
      //   path: "demo",
      //   component: () => import("@/views/demo/index.vue"),
      //   name: "demo",
      //   meta: {
      //     title: "Demo",
      //     elIcon: "Lock"
      //   }
      // }
    ]
  },
  // {
  //   path: "/department",
  //   component: Layout,
  //   redirect: "/department/departmentlist",
  //   children: [
  //     {
  //       path: "departmentlist",
  //       component: () => import("@/views/department/index.vue"),
  //       name: "department",
  //       meta: {
  //         title: "部门管理",
  //         svgIcon: "department"
  //       }
  //     }
  //   ]
  // },
  {
    path: "/order",
    component: Layout,
    redirect: "/order/orderlist",
    meta: {
      title: "订单管理",
      svgIcon: "commodity"
    },
    children: [
      {
        path: "orderlist",
        component: () => import("@/views/order/index.vue"),
        name: "order",
        meta: {
          title: "订单列表",
          svgIcon: "order"
        }
      },
      {
        path: "evaluatelist",
        component: () => import("@/views/evaluate/index.vue"),
        name: "evaluate",
        meta: {
          title: "评价列表",
          svgIcon: "evaluatelist"
        }
      }
    ]
  },
  {
    path: "/commodity",
    component: Layout,
    redirect: "/commodity/commoditylist",
    meta: {
      title: "商品管理",
      svgIcon: "commodity"
    },
    children: [
      {
        path: "commoditylist",
        component: () => import("@/views/commodity/commoditylist/index.vue"),
        name: "commodity",
        meta: {
          title: "商品列表",
          svgIcon: "commoditylist"
        }
      },
      {
        path: "categorylist",
        component: () => import("@/views/commodity/category/index.vue"),
        name: "category",
        meta: {
          title: "种类列表",
          svgIcon: "category"
        }
      }
    ]
  },
  {
    path: "/customer",
    component: Layout,
    redirect: "/customer/customerlist",
    name: "customer",
    meta: {
      title: "客户管理",
      svgIcon: "customer"
    },
    children: [
      {
        path: "customerlist",
        component: () => import("@/views/customer/index.vue"),
        name: "userlist",
        meta: {
          title: "客户列表",
          svgIcon: "customerlist"
        }
      }
    ]
  },
  // {
  //   path: "/carouselmap",
  //   component: Layout,
  //   redirect: "/carouselmap/carouselmaplist",
  //   children: [
  //     {
  //       path: "carouselmaplist",
  //       component: () => import("@/views/carouselmap/index.vue"),
  //       name: "carouselmap",
  //       meta: {
  //         title: "门户轮播图",
  //         svgIcon: "carouselmap"
  //       }
  //     }
  //   ]
  // },
  {
    path: "/link",
    component: Layout,
    children: [
      {
        path: "https://juejin.cn/post/7089377403717287972",
        component: () => {},
        name: "Link",
        meta: {
          title: "内部网盘",
          svgIcon: "link"
        }
      }
    ]
  }

  // {
  //   path: "/table",
  //   component: Layout,
  //   redirect: "/table/element-plus",
  //   name: "Table",
  //   meta: {
  //     title: "表格",
  //     elIcon: "Grid"
  //   },
  //   children: [
  //     {
  //       path: "element-plus",
  //       component: () => import("@/views/table/element-plus/index.vue"),
  //       name: "ElementPlus",
  //       meta: {
  //         title: "Element Plus"
  //       }
  //     },
  //     {
  //       path: "vxe-table",
  //       component: () => import("@/views/table/vxe-table/index.vue"),
  //       name: "VxeTable",
  //       meta: {
  //         title: "Vxe Table"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/menu",
  //   component: Layout,
  //   redirect: "/menu/menu1",
  //   name: "Menu",
  //   meta: {
  //     title: "多级菜单",
  //     svgIcon: "menu"
  //   },
  //   children: [
  //     {
  //       path: "menu1",
  //       component: () => import("@/views/menu/menu1/index.vue"),
  //       redirect: "/menu/menu1/menu1-1",
  //       name: "Menu1",
  //       meta: {
  //         title: "menu1"
  //       },
  //       children: [
  //         {
  //           path: "menu1-1",
  //           component: () => import("@/views/menu/menu1/menu1-1/index.vue"),
  //           name: "Menu1-1",
  //           meta: {
  //             title: "menu1-1"
  //           }
  //         },
  //         {
  //           path: "menu1-2",
  //           component: () => import("@/views/menu/menu1/menu1-2/index.vue"),
  //           redirect: "/menu/menu1/menu1-2/menu1-2-1",
  //           name: "Menu1-2",
  //           meta: {
  //             title: "menu1-2"
  //           },
  //           children: [
  //             {
  //               path: "menu1-2-1",
  //               component: () => import("@/views/menu/menu1/menu1-2/menu1-2-1/index.vue"),
  //               name: "Menu1-2-1",
  //               meta: {
  //                 title: "menu1-2-1"
  //               }
  //             },
  //             {
  //               path: "menu1-2-2",
  //               component: () => import("@/views/menu/menu1/menu1-2/menu1-2-2/index.vue"),
  //               name: "Menu1-2-2",
  //               meta: {
  //                 title: "menu1-2-2"
  //               }
  //             }
  //           ]
  //         },
  //         {
  //           path: "menu1-3",
  //           component: () => import("@/views/menu/menu1/menu1-3/index.vue"),
  //           name: "Menu1-3",
  //           meta: {
  //             title: "menu1-3"
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: "menu2",
  //       component: () => import("@/views/menu/menu2/index.vue"),
  //       name: "Menu2",
  //       meta: {
  //         title: "menu2"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/hooks",
  //   component: Layout,
  //   redirect: "/hooks/use-fetch-select",
  //   name: "Hooks",
  //   meta: {
  //     title: "hooks",
  //     elIcon: "Menu",
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: "use-fetch-select",
  //       component: () => import("@/views/hooks/use-fetch-select.vue"),
  //       name: "UseFetchSelect",
  //       meta: {
  //         title: "useFetchSelect"
  //       }
  //     },
  //     {
  //       path: "use-fullscreen-loading",
  //       component: () => import("@/views/hooks/use-fullscreen-loading.vue"),
  //       name: "UseFullscreenLoading",
  //       meta: {
  //         title: "useFullscreenLoading"
  //       }
  //     }
  //   ]
  // }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // {
  //   path: "/permission",
  //   component: Layout,
  //   redirect: "/permission/page",
  //   name: "Permission",
  //   meta: {
  //     title: "权限管理",
  //     svgIcon: "lock",
  //     roles: ["admin", "editor"], // 可以在根路由中设置角色
  //     alwaysShow: true // 将始终显示根菜单
  //   },
  //   children: [
  //     {
  //       path: "page",
  //       component: () => import("@/views/permission/page.vue"),
  //       name: "PagePermission",
  //       meta: {
  //         title: "页面权限",
  //         roles: ["admin"] // 或者在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: "directive",
  //       component: () => import("@/views/permission/directive.vue"),
  //       name: "DirectivePermission",
  //       meta: {
  //         title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
  //       }
  //     }
  //   ]
  // },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
