module.exports = {
  // 🌐 指定要扫描的文件路径，用于生成样式
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  // 🌙 启用 class 模式的暗黑主题
  darkMode: "class",

  theme: {
    // 📱 自定义断点（rem = 16px）
    screens: {
      xs: "0rem", // 默认最小宽度
      md: "60.5rem", // 968px
      lg: "64rem", // 1024px
      xl: "80rem", // 1280px
      "2xl": "96rem", // 1536px
    },

    extend: {
      // 📏 自定义 spacing 单位
      spacing: {
        0: "0",
        1: ".125rem", // 2px
        2: ".25rem", // 4px
        3: ".5rem", // 8px
        4: ".75rem", // 12px
        5: "1rem", // 16px
        6: "1.5rem", // 24px
        7: "2rem", // 32px
        8: "2.5rem", // 40px
        9: "3rem", // 48px
        10: "4rem", // 64px
        11: "5rem", // 80px
        12: "6rem", // 96px
        13: "10rem", // 160px
      },

      // 🖋 自定义字体
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        display: ["Fredoka"],
      },

      // 🔲 自定义圆角
      borderRadius: {
        none: "0",
        sm: ".5rem",
        DEFAULT: ".75rem",
        lg: "1.25rem",
        full: "624.9375rem", // 圆形头像
      },

      // 🌫 自定义透明度（已合并不重复项）
      opacity: {
        20: "0.20",
        30: "0.30",
        40: "0.40",
        50: "0.54",
        60: "0.63",
        70: "0.70",
        80: "0.80",
        90: "0.90",
      },

      // 🌟 自定义阴影（已合并不重复项）
      boxShadow: {
        "shadow-sm": "0rem .0625rem .1875rem 0rem rgba(5,5,5,0.10)",
        shadow:
          "rgb(145 158 171 / 20%) 0rem .0625rem .1875rem 0rem , rgb(145 158 171 / 12%) 0rem .0625rem .125rem -0.25rem",
        "shadow-md":
          "0rem .1875rem .25rem 0rem rgba(3,3,3,0.1), 0rem .125rem .25rem 0rem rgba(3,3,3,0.1)",
        "shadow-lg":
          "0rem .625rem 1.25rem 0rem rgba(3,3,3,0.1), 0rem .1875rem .375rem 0rem rgba(3,3,3,0.1)",
        "shadow-xl":
          "0rem .9375rem 1.5625rem 0rem rgba(3,3,3,0.1), 0rem .3125rem .625rem 0rem rgba(3,3,3,0.1)",
        cxl: "0 .125rem .3125rem rgba(193, 202, 255, 0.5), .125rem 0 .3125rem rgba(193, 202, 255, 0.5), -0.125rem 0 .3125rem rgba(193, 202, 255, 0.5), 0 -0.125rem .3125rem rgba(193, 202, 255, 0.5)",
      },

      // 🌈 自定义动画
      keyframes: {
        gradient: {
          "0%": { "background-position": "0% 0%" },
          "50%": { "background-position": "0% 100%" },
          "100%": { "background-position": "0% 0%" },
        },
      },

      animation: {
        gradient: "gradient 15s ease infinite",
      },
    },
  },

  plugins: [],
};
