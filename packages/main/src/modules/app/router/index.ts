import { AppContext } from "../context.js";
import BotsRoute from "./bots/index.js";
import SysRoute from './sys/index.js'
import SettingRoute from './setting/index.js'
import { pathOr, isFunction } from "remeda";

export const appRouter = {
  bots: BotsRoute,
  sys: SysRoute,
  setting: SettingRoute
};

export type RouteResult = {
  ok: boolean;
  data?: any;
  error?: Error;
};

export async function applyRoute(
  ctx: AppContext,
  reqPath: string,
  ...args: any[]
): Promise<RouteResult> {
  try {
    const func = pathOr(appRouter, reqPath.split(".") as any, undefined as any);
    if (!isFunction(func)) {
      return {
        ok: false,
        error: new Error("路径不存在"),
      };
    }
    // console.log("ctx=", ctx);
    const result = await func.apply(ctx, args);
    // console.log("result = ", result);
    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    return {
      ok: false,
      error: error as Error,
    };
  }
}

export type AppRouter = typeof appRouter;
