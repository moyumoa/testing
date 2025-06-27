// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import svgr from 'vite-plugin-svgr';
import viteCompression from 'vite-plugin-compression'

// 兼容 __dirname 写法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  return {
    plugins: [
      svgr({
        svgrOptions: { exportType: 'named', ref: true, svgo: false, titleProp: true },
        include: '**/*.svg',
      }),
      react(),
      ...(isProd ? [viteCompression({
        verbose: true, // 是否在控制台输出压缩结果
        disable: false, // 是否禁用压缩
        threshold: 10240, // 压缩前文件大小阈值，单位为字节，默认值为 10240（10KB）
        algorithm: 'gzip', // 压缩算法，默认值为 'gzip'
        ext: '.gz', // 压缩后的文件扩展名，默认值为 '.gz'
      })] : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    // server: {
    //   host: 'localhost',
    //   port: 45679,
    //   proxy: {
    //     '/api': {
    //       target: 'http://192.168.9.99:8090/v1/',
    //       changeOrigin: true,
    //       rewrite: path => path.replace(/^\/api/, ''),
    //     }
    //   }
    // },
    server: {
      host: '0.0.0.0',
      port: 45679,
    },
    build: {
      minify: 'esbuild', // 默认就是 esbuild，写上更清晰
      terserOptions: {}, // 这句会被忽略，只有 terser 时用
      rollupOptions: {}, // 可选
      // 👇 关键配置，移除 console/debugger
      commonjsOptions: {},
      target: 'es2015',
      sourcemap: false, // 不生成 sourcemap 文件
    },
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [], // 🧹 移除 console/debugger
    },
    // optimizeDeps: {
    //   exclude: ['@mvmoo/react'], // 防止 Vite 预编译时破坏它
    // },
  }
})
