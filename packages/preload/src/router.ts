import { type AppRouter, type RouteResult } from "@app/main";
import { ipcRenderer } from "electron";
// 由于monorepo,无法使用electron-trpc.因此采用简化实现，以快速实现．
// import { mapValues, isString } from 'remeda';

async function electronInvoke(path: string, ...args: any[]): Promise<any> {
  if (!ipcRenderer) {
    throw new Error("ipcRenderer not available - are you running in Electron?");
  }

  // console.log(`异步调用路径: ${path}`);
  // console.log(`参数:`, args);
  const result: RouteResult = await ipcRenderer.invoke("lai-rpc", path, ...args);
  if (result.ok) {
    return result.data
  }
  throw result.error;
}

// function transformEmptyStringsToFunctions(
//   obj: Record<string, any>,
//   fixedFunction: (path: string, ...args: any[]) => any = electronInvoke
// ): Record<string, any> {

//   function traverse(current: any, path: string = ''): any {
//     if (Array.isArray(current)) {
//       return current.map((item, index) =>
//         traverse(item, path ? `${path}[${index}]` : `[${index}]`)
//       );
//     }

//     if (typeof current === 'object' && current !== null) {
//       return mapValues(current, (value, key) => {
//         const currentPath = path ? `${path}.${key}` : key;
//         return traverse(value, currentPath);
//       });
//     }

//     // 检查是否为空字符串
//     if (isString(current) && current === '') {
//       // 返回一个函数，该函数调用固定函数并传入路径作为第一个参数
//       return function (...args: any[]) {
//         return fixedFunction(path, ...args);
//       };
//     }

//     return current;
//   }

//   return traverse(obj);
// }

// const rpc = transformEmptyStringsToFunctions(appRouterProxy);

const rpc = {
  bots: {
    insert: async (...args: any[]) => electronInvoke("bots.insert", ...args),
    find: async (...args: any[]) => electronInvoke("bots.find", ...args),
    rmById: async (...args: any[]) => electronInvoke("bots.rmById", ...args),
    update: async (...args: any[]) => electronInvoke("bots.update", ...args),
    train: {
      load: async (...args: any[]) => electronInvoke("bots.train.load", ...args),
      send: async (...args: any[]) => electronInvoke("bots.train.send", ...args),
      data: async (...args: any[]) => electronInvoke("bots.train.data", ...args),
      save: async (...args: any[]) => electronInvoke("bots.train.save", ...args),
    }
  },
  sys: {
    menu: {
      set: async (...args: any[]) => electronInvoke("sys.menu.set", ...args),
    }
  },
  setting: {
    get: async (...args: any[]) => electronInvoke("setting.get", ...args),
    set: async (...args: any[]) => electronInvoke("setting.set", ...args),
  }
};

export default rpc as unknown as AppRouter;
