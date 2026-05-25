import { type GraphState, SimpleLangGraph } from "../../workflow.js";
import { IBrain } from "../../../interface/ibrain.js";
import { render } from "ejs";
import { isNumber } from "remeda";
import { ConditionalPipeline } from "../../pipeline.js";
import doExtract from './extract/index.js'
import doTopic from './topic/index.js'
import doStruct from './struct/index.js'
import doContent from './content/index.js'
import doReducer from './reducer/index.js'
import { Brain } from "../../brain.js";


// import { JsonOutputParser } from "@langchain/core/output_parsers";
// import { ChatPromptTemplate } from "@langchain/core/prompts";


// 通过闭包传递环境信息(通过brain传入)
export function loadWorkflow(brain: IBrain): SimpleLangGraph {
    const graph = new SimpleLangGraph();

    const pipeline = ConditionalPipeline.create<Brain>();

    pipeline.pushTask("extract", doExtract);
    pipeline.pushTask("topic", doTopic);
    pipeline.pushTask("struct", doStruct);
    pipeline.pushTask("content", doContent);
    pipeline.pushTask("reducer", doReducer);

    async function step(state: GraphState): Promise<Partial<GraphState>> {


        let req = "";
        let reqTaskSeq = -1; // 只执行指定任务．
        let execSeq = false; // 是否执行剩余序列，只有reqTaskSqe有效才有效．
        try {
            const jsonInfo = JSON.parse(state.req);
            if (jsonInfo.req && jsonInfo.task) {
                reqTaskSeq = pipeline.getTaskSeq(jsonInfo.task)
                req = jsonInfo.req;
                execSeq = jsonInfo.execSeq === true;
            }
            if (reqTaskSeq < 0) {
                req = state.req;
            }
        } catch (e) {
            req = state.req;
        }
        console.log("enter wedoc step,reqTaskSeq=", reqTaskSeq, "req=", req, "execSeq=", execSeq);

        if (reqTaskSeq >= 0) {
            if (execSeq) {
                await pipeline.execute(brain as Brain, req, reqTaskSeq);
            } else {
                await pipeline.executeTask(reqTaskSeq, brain as Brain, req);
            }
        } else {
            await pipeline.execute(brain as Brain, req);
        }

        return {
            res: (brain as Brain).data.res ?? "WeDoc"
        };
    }

    graph
        .addNode("main", step)
        .setEntryPoint("main")
        .setFinishPoint("main");
    return graph;
}