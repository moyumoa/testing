// 📌 由沫沫同学自动转换为 JavaScript，已去除类型定义并添加中文注释
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// 👇 用于构建路径别名的工具函数
const pathResolve = (dir) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), // 启用 Vue 插件
  ],
  resolve: {
    alias: {
      // 路径别名配置，使用 @src 表示 src 目录
      "@src": pathResolve("src"),
      "@custom_types": pathResolve("src/@custom_types"),
    },
  },
});
