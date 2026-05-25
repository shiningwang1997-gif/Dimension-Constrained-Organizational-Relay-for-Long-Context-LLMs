import { type AppContext } from "../../../context.js";
import { Message, type Robot } from "../../type.js";
import { createLLM } from "./llmfactory.js";
import { type BaseChatModel } from "@langchain/core/language_models/chat_models";
import { IBrain } from "../interface/ibrain.js";
import { IWorkflowLoader } from "../interface/iwfloader.js";
import { WorkflowLoader } from "./wfloader.js";

export class Brain implements IBrain {
    public readonly app: AppContext;
    public readonly bot: Robot;

    #txtio: BaseChatModel | null = null;
    #workflowLoader: IWorkflowLoader;
    readonly #data: Record<string, any> = {
        data: {}, // 节点实际信息(tempStore)
        meta: {}, // meta信息．
        history: [] // 对话历史．
    };

    private static cache: Map<string, Brain> = new Map();
    public static async ensureBrain(ctx: AppContext, bid: string): Promise<Brain> {
        if (Brain.cache.has(bid)) {
            return Brain.cache.get(bid)!
        }
        const brain = new Brain(ctx, bid);
        const data = await ctx.readJson(bid);
        if (data) {
            brain.#data.data = data;
        }
        Brain.cache.set(bid, brain);
        return brain;
    }
    public static unloadBrain(bid: string): void {
        Brain.cache.delete(bid);
    }

    private constructor(app: AppContext, bid: string, workflowLoader?: IWorkflowLoader) {
        this.app = app;
        const botsColl = app.db.collection("bots");
        const bot = botsColl.find({ id: bid });
        if (bot.length === 0) {
            throw new Error(`未发现bot定义:${bid}`);
        }
        this.bot = bot[0];
        this.#workflowLoader = workflowLoader || new WorkflowLoader();
    }

    public get data(): Record<string, any> {
        return this.#data.data;
    }

    public async setData(data: Record<string, any>): Promise<void> {
        // console.log("setData=",data)
        this.#data.data = data;
        await this.app.writeJson(this.bot.id, data);
    }

    public get txtio(): BaseChatModel {
        if (this.#txtio) {
            return this.#txtio;
        }

        const llmcfgstr = this.bot.input?.txt ?? "deepseek";
        const coll = this.app.db.collection("setting");
        const existingRecord = coll.findOne({ id: llmcfgstr });
        const apikey = existingRecord?.value;

        if (!apikey) {
            throw new Error(`未配置语言模型${llmcfgstr}的ApiKey`);
        }

        const llmcfg = llmcfgstr.split("/");
        const [provider, modelName] = llmcfg;
        this.#txtio = createLLM(provider, modelName, apikey);
        return this.#txtio;
    }

    public async callWorkflow(
        msg: Message,
        wfname: string = "train"
    ): Promise<Message> {
        const result: Message = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            sender: "ai",
            content: "",
        };

        try {
            const graph = await this.#workflowLoader.loadWorkflow(this, wfname);

            // console.log("call workflow:",msg)
            const finalResult = await graph.invoke({
                req: msg.content,
                data: {},
                res: "",
            }, this.#data.data ?? {});
            console.log("final result=", finalResult);
            // console.log("final state=", state)
            result.content = finalResult.res;
        } catch (e) {
            console.error("error:", e);
            result.content = `# 错误信息\n\n## 错误详情\n\n**错误内容：** ${e instanceof Error ? e.message : String(e)
                }\n`;
        }

        return result;
    }
}
