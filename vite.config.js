// 📌 由妍妍自动转换为 JavaScript，已去除类型定义并添加中文注释
import { defineConfig } from "vite";
import alias from "@rollup/plugin-alias";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

const rootDir = resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), alias()],
  resolve: {
    alias: {
      "@src"(rootDir, "src"),
      "@custom_types"(rootDir, "src/@custom_types"),
    },
  },
});
