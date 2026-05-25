/// 注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数，如同下例．
import { type AppContext } from "../../context.js";
import train from './train.js'
// import { type Robot } from "../type.js";

async function insert(bot: Record<string, any>) {
  //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
  const ctx: AppContext = this;
  if (!bot.id) {
    bot.id = crypto.randomUUID();
  }
  const botsColl = ctx.db.collection("bots");
  botsColl.insert(bot);

  return bot.id;
  // console.log("this is appcontext=", ctx);
  //   return `Hello ${input ?? "World"}!`;
}

async function find(query?: LokiQuery<any>) {
  // console.log("call into find!~!!")
  //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
  const ctx: AppContext = this;
  const botsColl = ctx.db.collection("bots");
  return botsColl.find(query);
}


async function rmById(id: string) {
  // console.log("call into rmByid")
  //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
  const ctx: AppContext = this;
  const botsColl = ctx.db.collection("bots");
  // console.log("rmById:",id)
  return botsColl.removeById(id);
}

async function update(bot: Record<string, any>): Promise<number> {
  //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
  const ctx: AppContext = this;
  const botsColl = ctx.db.collection("bots");
  return botsColl.updateWhere({ 'id': bot.id }, bot)
}

export default {
  find,
  insert,
  update,
  rmById,
  train
};
