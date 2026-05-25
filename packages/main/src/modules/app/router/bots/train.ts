/// 注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数，如同下例．
import { type AppContext } from "../../context.js";
import { type Message } from "../type.js";
import { Brain } from "./brain/brain.js";


async function load(id: string, limit: number = 30) {
    // console.log("call into find!~!!")
    //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
    const ctx: AppContext = this;
    const db = ctx.ensureDB(id);
    const botsColl = db.collection("msgs");

    const allRecords = botsColl.find({});
    const latest30 = allRecords
        .sort((a, b) => {
            // 对于 ISO 格式字符串，可以直接比较
            return b.timestamp > a.timestamp ? 1 : -1;
        })
        .slice(0, 30);

    if (latest30.length === 0) { // 首次插入ai发言．
        const msg = {
            id: crypto.randomUUID(),
            content: '\n你好！我是新入职的机器人助手，很高兴认识您！\n\n我来了解一下工作安排，请告诉我：\n\n**首先最重要的是** - 我需要承担什么具体的工作职责？要为您交付什么类型的成果或服务？\n\n另外，如果您对我的工作方式有任何个性化要求，比如回复风格、格式偏好、专业领域重点等，也请一并告诉我。我会根据您的需求来调整我的工作方式，确保能够最好地为您工作。\n\n期待您的指导！',
            sender: "ai",
            timestamp: new Date().toISOString()
        }
        botsColl.insert(msg);
        return [msg];
    }

    return latest30;
};

// 用户说的内容,返回AI回应的内容．
async function send(msg: Message, bid: string, mode = "train"): Promise<Message> {
    // console.log("mode=",mode)
    //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
    const ctx: AppContext = this;
    const brain = await Brain.ensureBrain(ctx, bid);
    const result = await brain.callWorkflow(msg, mode);
    return result;
}

// 获取Brain的data内容(会尝试从文件中加载) Ontology-data.
async function data(bid: string): Promise<Record<string,any>> {
    // console.log("mode=",mode)
    //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
    const ctx: AppContext = this;
    const brain = await Brain.ensureBrain(ctx, bid);
    return brain.data;
}

async function save(bid: string,data:Record<string,any>): Promise<void> {
    // console.log("mode=",mode)
    //@ts-expect-error　注意，由于箭头函数不能绑定this,如果需要接收appContext,必须使用函数．
    const ctx: AppContext = this;
    const brain = await Brain.ensureBrain(ctx, bid);
    await brain.setData(data);
}


export default {
    load,
    send,
    data,
    save
};
