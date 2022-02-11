import { ConfigEnv, UserConfigExport, Alias, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import AutoImport from "unplugin-auto-import/vite";
import { resolve } from "path";
import { regExps, wrapperEnv } from "./build";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import removeConsole from 'vite-plugin-remove-console';

const root: string = process.cwd();

const pathResolve = (dir: string): string => resolve(__dirname, ".", dir);

const alias: Alias[] = [
  {
    find: "@",
    replacement: pathResolve("src"),
  },
  {
    find: "@build",
    replacement: pathResolve("build"),
  },
];

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const __DEV__ = mode === "development";
  const {
    VITE_PORT,
    VITE_LEGACY,
    VITE_PUBLIC_PATH,
    VITE_PROXY_DOMAIN,
    VITE_PROXY_DOMAIN_REAL,
  } = wrapperEnv(loadEnv(mode, root));

  if (__DEV__) {
    // 解决警告 You are running the esm-bundler build of vue-i18n.
    alias.push({
      find: 'vue-i18n',
      replacement: pathResolve('vue-i18n/dist/vue-i18n.cjs.js')
    });
  }

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias,
    },
    server: {
      https: false,
      port: VITE_PORT,
      host: '0.0.0.0',
      proxy:
        VITE_PROXY_DOMAIN_REAL.length > 0
          ? {
              [VITE_PROXY_DOMAIN]: {
                target: VITE_PROXY_DOMAIN_REAL,
                changeOrigin: true,
                rewrite: (path: string) => regExps(path, VITE_PROXY_DOMAIN)
              }
            }
          : {}
    },
    plugins: [
      vue(),
      VueSetupExtend(),
      AutoImport({
        dts: "types/auto-imports.d.ts",
        imports: ["vue"],
      }),
      Components({
        dts: "types/components.d.ts",
        dirs: ["src/components"],
        resolvers: [ElementPlusResolver()],
        extensions: ["vue"]
      }),
      removeConsole()
    ],
  };
};
