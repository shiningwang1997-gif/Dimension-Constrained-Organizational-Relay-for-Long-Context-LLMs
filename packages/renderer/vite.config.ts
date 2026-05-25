import { defineConfig } from "vite";
// import { svelte } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: "svelte",
      autoInstall: true,
      customCollections: {
        // 'my-icons' 是你自定义图标集合的名称
        "fs-icons": FileSystemIconLoader("./assets/icons", (svg) =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        ),
      },
    }),
  ],
  server: {
    proxy: {
      '^/(.*).html': {
        target: 'http://localhost:5173',
        rewrite: (path) => path.replace(/\.html$/, '')
      }
    }
  },
  build: {
    emptyOutDir: true,
    target: "esnext",
    rollupOptions: {
      external: ["electron"],
      output: {
        manualChunks(id) {
          // 根据文档示例，将node_modules中的包分离到vendor chunk
          if (id.includes('node_modules')) {

            // 大型UI库单独分包
            if (id.includes('@mantine') || id.includes('@mui') || id.includes('antd')
              || id.includes('svelte-exmarkdown') || id.includes('svelte-awesome') || id.includes("svelte-select")) {
              return 'ui-vendor1';
            }

            if (id.includes("svelte-jsoneditor")) {
              return 'ui-vendor2';

            }

            // 工具库分包
            if (id.includes('@floating-ui') || id.includes('ajv') || id.includes('natural-compare-lite')
              || id.includes('lodash-es')) {
              return 'utils-vendor';
            }

            // 图表库单独分包
            // if (id.includes('lodash') || id.includes('ramda') || id.includes('date-fns')) {
            //   return 'utils-vendor';
            // }

            // console.log(`  -> Adding to vendor chunk: ${id}`);
            // 其他第三方库
            return 'vendor';
          }

          // 应用代码分包
          if (id.includes('src/lib/components')) {
            return 'components';
          }

          if (id.includes('src/lib/stores')) {
            return 'stores';
          }
        }
      }
    },
  },
  optimizeDeps: {
    exclude: ['electron']
  },
  resolve: {
    alias: {
      // 使用别名来管理路径
      "$assets": path.resolve("./src/assets"),
    },
  },
});
