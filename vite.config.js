import { resolve } from 'path'
import { defineConfig } from 'vite'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'RPP',
      fileName: () => 'index.js',
    },
  },
  plugins: [
    Icons({
      compiler: 'web-components',
      webComponents: {
        autoDefine: true,
      },
    })
  ],
})