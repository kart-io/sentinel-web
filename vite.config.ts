import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 生产构建优化
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将第三方库拆分成单独的 chunk
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['antd', '@mui/material', '@emotion/react', '@emotion/styled'],
          query: ['@tanstack/react-query'],
          state: ['zustand'],
          utils: ['axios', 'clsx', 'tailwind-merge'],
        },
      },
    },
    // 调整 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
    // 启用 sourcemap（生产环境可关闭）
    sourcemap: false,
    // 压缩选项
    minify: 'esbuild',
    // 禁用 CSS 代码拆分
    cssCodeSplit: true,
  },
  // 开发服务器配置
  server: {
    port: 5173,
    open: true,
    // 配置代理（如果需要）
    proxy: {
      // 例如: '/api': 'http://localhost:3000'
    },
  },
  // 预览服务器配置
  preview: {
    port: 4173,
    open: true,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'zustand'],
  },
})
