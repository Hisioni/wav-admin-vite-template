// 处理环境变量
const wrapperEnv = (envConf: Recordable): ViteEnv => {
  // 此处为默认值，无需修改
  const ret: ViteEnv = {
    VITE_PORT: 3000,
    VITE_PUBLIC_PATH: '',
    VITE_PROXY_DOMAIN: '',
    VITE_PROXY_DOMAIN_REAL: '',
    VITE_ROUTER_HISTORY: '',
    VITE_LEGACY: false
  };
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    realName =
      realName === 'true' ? true : realName === 'false' ? false : realName;
    envName === 'VITE_PORT' && (() => (realName = Number(realName)))();
    // @ts-ignore
    ret[envName] = realName;
    typeof realName === 'string'
      ? (process.env[envName] = realName)
      : typeof realName === 'object'
      ? (process.env[envName] = JSON.stringify(realName))
      : null;
  }
  return ret;
};

// 跨域代理重写
const regExps = (value: string, reg: string): string => value.replace(new RegExp(reg, 'g'), '');

// 环境变量
const loadEnv = (): ViteEnv => import.meta.env;

export { wrapperEnv, regExps, loadEnv };
