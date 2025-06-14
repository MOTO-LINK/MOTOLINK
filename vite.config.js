import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // إذا كنت تريد عمل proxy للصور من localhost أثناء التطوير
      '/images/services': {
        target: 'https://fas7nii.runasp.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/images\/services/, '/images/services'),
      },
      // مثال آخر للربط مع localhost:7298
      // '/images/services': {
      //   target: 'http://localhost:7298',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/images\/services/, '/images/services'),
      // },
    },
  },
})
