import { resolve } from "node:path";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        api: "modern-compiler",
        silenceDeprecations: ["import"],
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: JSON.stringify(process.env.npm_package_name),
      fileName: () => "index.js",
    },
  },
  plugins: [
    Icons({
      compiler: "web-components",
      webComponents: {
        autoDefine: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@helpers": "/src/helpers",
      "@partials": "/src/components/partials",
      "@styles": "/src/styles",
      "@widgets": "/src/components/widgets",
    },
  },
});
