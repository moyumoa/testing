export default [
  {
    "title": "首页",
    "icon": "kongzhitai",
    "path": "/",
    "meta": {
      "title": "首页",
      "icon": "kongzhitai"
    }
  },
  {
    "title": "西戈云",
    "icon": "yun",
    "path": "/dashboard",
    "meta": {
      "title": "西戈云",
      "icon": "yun"
    },
    "children": [
      {
        "title": "数据指标",
        "path": "index",
        "component": "Dashboard/Index",
        "meta": {
          "title": "数据指标"
        }
      },
      {
        "title": "用户管理",
        "icon": "kehu2",
        "path": "home",
        "component": "Home",
        "meta": {
          "title": "用户管理",
          "icon": "kehu2"
        },
        "children": [
          {
            "title": "用户列表",
            "icon": "kehu1",
            "path": "about",
            "component": "About",
            "meta": {
              "title": "用户列表",
              "icon": "kehu1"
            }
          }
        ]
      },
      {
        "title": "系统维护",
        "icon": "danxingjiqun",
        "path": "system",
        "meta": {
          "title": "系统维护",
          "icon": "danxingjiqun"
        },
        "children": [
          {
            "title": "菜单管理",
            "icon": "prokongzhitai",
            "path": "menus",
            "component": "System/Menus/Index",
            "meta": {
              "title": "菜单管理",
              "icon": "prokongzhitai"
            }
          },
          {
            "title": "角色权限",
            "icon": "ziyuanzhongxinquanxianziyuan",
            "path": "about4",
            "component": "System/Roles/Index",
            "meta": {
              "title": "角色权限",
              "icon": "ziyuanzhongxinquanxianziyuan"
            }
          },
          {
            "title": "公共资源",
            "icon": "wulumuqishigongandashujuguanlipingtaiico",
            "path": "about3",
            "component": "About",
            "meta": {
              "title": "公共资源",
              "icon": "wulumuqishigongandashujuguanlipingtaiico"
            }
          },
          {
            "title": "API接口",
            "icon": "daimaguanli",
            "path": "about2",
            "component": "About",
            "meta": {
              "title": "API接口",
              "icon": "daimaguanli"
            }
          }
        ]
      }
    ]
  },
  {
    "title": "芥光寻影",
    "icon": "a046zhaopian",
    "path": "/dashboard2",
    "meta": {
      "title": "芥光寻影",
      "icon": "a046zhaopian"
    },
    "children": [
      {
        "title": "数据指标",
        "icon": "shuju2",
        "path": "index",
        "component": "Dashboard/Index",
        "meta": {
          "title": "数据指标",
          "icon": "shuju2"
        }
      },
      {
        "title": "云空间",
        "icon": "shuju1",
        "path": "index22",
        "component": "Dashboard/Index",
        "meta": {
          "title": "云空间",
          "icon": "shuju1"
        }
      },
      {
        "title": "订阅管理",
        "icon": "huiyuan1",
        "path": "index2",
        "component": "Dashboard/Index",
        "meta": {
          "title": "订阅管理",
          "icon": "huiyuan1"
        },
        "children": [
          {
            "title": "资源包套餐",
            "icon": "ziyuanbao2",
            "path": "about",
            "component": "About",
            "meta": {
              "title": "资源包套餐",
              "icon": "ziyuanbao2"
            }
          },
          {
            "title": "叠加记录",
            "icon": "ziyuan1",
            "path": "about1",
            "component": "About",
            "meta": {
              "title": "叠加记录",
              "icon": "ziyuan1"
            }
          }
        ]
      },
      {
        "title": "用户管理",
        "icon": "kehuziliao",
        "path": "home",
        "component": "Home",
        "meta": {
          "title": "用户管理",
          "icon": "kehuziliao"
        },
        "children": [
          {
            "title": "用户列表",
            "icon": "kehu1",
            "path": "about",
            "component": "About",
            "meta": {
              "title": "用户列表",
              "icon": "kehu1"
            }
          }
        ]
      }
    ]
  },
  {
    "title": "移动端",
    "icon": "iconxiangcefengmian",
    "path": "/user",
    "meta": {
      "title": "移动端",
      "icon": "iconxiangcefengmian"
    }
  },
  {
    "title": "外链",
    "icon": "liulanqi",
    "path": "https://baidu.com",
    "meta": {
      "title": "外链",
      "icon": "liulanqi"
    }
  }
]