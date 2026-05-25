import { applyRoute, appRouter, type AppRouter } from "./router/index.js";
import { AppContext } from "./context.js";
import { ipcMain, dialog } from "electron";

export class LaiApp {
  #context: AppContext;

  constructor(app: Electron.App, win: Electron.BrowserWindow) {
    // console.log("wind=", win)
    this.#context = new AppContext(app, win);
  }

  async beforeShow() {
    const mainWindow = this.#context.win;
    appRouter.sys.menu.set.call(this.#context, '');

    mainWindow.on("close", (event) => {
      // 如果还有未保存的数据
      // if (hasUnsavedChanges) {
      event.preventDefault();

      //确保数据保存完成再退出．
      this.#context.db.close().finally(() => {
        mainWindow.destroy();
      });

      //   // 显示确认对话框
      //   const choice = dialog.showMessageBoxSync(mainWindow, {
      //     type: "question",
      //     buttons: ["保存并退出", "不保存退出", "取消"],
      //     defaultId: 0,
      //     message: "有未保存的更改，是否保存？",
      //   });

      //   if (choice === 0) {
      //     // saveData().then(() => {
      //     mainWindow.destroy();
      //     // });
      //   } else if (choice === 1) {
      //     mainWindow.destroy();
      //   }
      //   // choice === 2 时什么都不做，继续使用应用
      //   // }
    });

    ipcMain.handle("lai-rpc", (event, reqPath, ...args) => {
      return applyRoute(this.#context, reqPath, ...args);
    });
  }

  // async enable({ app }: ModuleContext): Promise<void> {
  //     // await app.whenReady();
  //     // await this.init(app);
  //     // 处理来自 preload 的调用
  //     ipcMain.handle("lai-rpc", (event, reqPath, ...args) => {
  //         console.log("reqPath=", reqPath);
  //         console.dir(args)
  //         return "a车";
  //     });
  // }
}
