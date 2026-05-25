/// 注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数，如同下例．
import { App, Menu, type MenuItem, type MenuItemConstructorOptions } from "electron";
import { type AppContext } from "../../context.js";
import { isString, isFunction } from "remeda";

type MenuType = Array<(MenuItemConstructorOptions) | (MenuItem)>


function getTemplate(name: string): Record<string, any>[] {
    //忽略名称，直接返回默认．
    return [
        {
            label: '应用',
            submenu: [
                {
                    label: '设置',
                    click: 'setting'
                },
                {
                    label: '机器人列表',
                    click: 'home'
                },
                { type: 'separator' },
                {
                    role: 'quit',
                    label: '退出'
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                {
                    role: 'undo',
                    label: '撤销操作' // 自定义中文标签
                },
                {
                    role: 'redo',
                    label: '重做操作' // 自定义中文标签
                },
                { type: 'separator' },
                {
                    role: 'cut',
                    label: '剪切'
                },
                {
                    role: 'copy',
                    label: '复制'
                },
                {
                    role: 'paste',
                    label: '粘贴'
                },
                {
                    role: 'selectall',
                    label: '选择全部'
                }
            ]
        },
        {
            label: '窗口',
            submenu: [
                {
                    role: 'minimize',
                    label: '最小化'
                },
                {
                    role: 'toggleFullScreen',
                    label: '切换全屏'
                },
                {
                    role: 'toggleDevTools',
                    label: '切换控制台'
                },
                { type: 'separator' },
                {
                    role: 'resetZoom',
                    label: '默认尺寸'
                },
                {
                    role: 'zoomIn',
                    label: '放大'
                },
                {
                    role: 'zoomOut',
                    label: '缩小'
                }
            ]
        }
    ];
}


function loadURL(ctx:AppContext,reqPath:string){
    const currentUrl = ctx.win.webContents.getURL();
    const newUrl = new URL(currentUrl);
    newUrl.pathname = reqPath;
    ctx.win.loadURL(newUrl.toString());
}

const roleExt: Record<string, (ctx: AppContext) => void> = {
    'setting': (ctx: AppContext) => {
        loadURL(ctx,"/setting.html")
    },
    'home': (ctx: AppContext) => {
        loadURL(ctx,'/')
    }
}


function transformClickPropertiesSafe<T>(ctx: AppContext, obj: T): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => transformClickPropertiesSafe(ctx, item)) as T;
    }

    const result = {} as T;

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            if (key === 'click' && typeof value === 'string') {
                // 假设字符串是一个函数名，创建对应的函数调用
                (result as any)[key] = () => {
                    // 这里可以根据需要调用相应的函数
                    // console.log(`Calling function: ${value}`);
                    try {

                        // console.log("ctx=", ctx)
                        const handle = roleExt[value];
                        if (isFunction(handle)) {
                            handle(ctx);
                        } else {
                            ctx.win.webContents.send("menuaction", value)
                        }
                    } catch (e) {
                        console.log("执行菜单命令时出错:", value)
                    }
                    // 或者如果有全局函数可以这样调用：
                    // if (typeof window !== 'undefined' && (window as any)[value]) {
                    //   return (window as any)[value]();
                    // }
                };
            } else {
                (result as any)[key] = transformClickPropertiesSafe(ctx, value);
            }
        }
    }

    return result;
}

async function set(template: string | Record<string, any>[]) {
    //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
    const ctx: AppContext = this;
    // console.log("ctx=", ctx)
    let tpl: MenuType;
    if (isString(template)) {
        tpl = getTemplate(template);
    } else {
        tpl = template
    }

    const transformTpl: MenuType = transformClickPropertiesSafe<MenuType>(ctx, tpl);

    // console.log("transformTpl=", transformTpl)

    const newMenu = Menu.buildFromTemplate(transformTpl);
    Menu.setApplicationMenu(newMenu);
}

export default {
    set
};
