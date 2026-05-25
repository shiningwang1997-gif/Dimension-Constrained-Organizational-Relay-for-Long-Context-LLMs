import { type GraphState, SimpleLangGraph } from "../../workflow.js";
import { IBrain } from "../../../interface/ibrain.js";
import prompt1 from './prompt1.js'
import prompt2 from './prompt2.js'
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { END, Send } from "@langchain/langgraph";

// 检查格式字符串(typescript格式)是否需要展开下一级解析．
function needExpand(format: string): boolean {
    switch (format.toLowerCase()) {
        case 'json':
        case 'object':
            return true;
    }
    return false;
}


// 通过闭包传递环境信息(通过brain传入)
export function loadWorkflow(brain: IBrain): SimpleLangGraph {
    const graph = new SimpleLangGraph();

    // 流程级的上下文．
    // const wfctx:Record<string,any> = {}

    function cond1(state: GraphState): string {
        // console.log("enter cond1",state)
        if (!state.data?.intent?.is_task_request) {
            state.response = state.data?.result?.user_intent;
            return "END"
        }
        console.log("goto step2")
        return "step2"
    }

    // 检查并映射步骤到worker.worker有两个，1.函数实现链． 2.展开子流程链.判断依据为needExpand.
    async function wfsMapper(state: GraphState): Promise<Send> {
        console.log("enter mapper:", state)
        //1. 首先检查是否有
        return new Send("构建函数", {test:123});
    }

    // 构建流程函数．
    async function buildFunc(state: GraphState): Promise<Partial<GraphState>>  {
        return {}
    }

    async function wfsReducer(state: GraphState): Promise<Partial<GraphState>> {
        return state
    }

    async function step2(state: GraphState): Promise<Partial<GraphState>> {
        console.log("enter step2..")
        console.log(state)
        // console.log("brain.txtio=", brain.txtio)
        const result = await prompt2.pipe(brain.txtio).pipe(new JsonOutputParser()).invoke(
            state.data.intent
        );

        console.log("step2 result=")
        console.dir(result, { depth: null, colors: true })
        return {
            data: {
                workflow: result
            }
        }
    }
    async function step1(state: GraphState): Promise<Partial<GraphState>> {

        console.log("enter step1");
        console.log(state)
        // console.log("brain.txtio=", brain.txtio)
        const result = await prompt1.pipe(brain.txtio).pipe(new JsonOutputParser()).invoke({
            message: state.req,
        });

        console.log("step1 result=", result)

        return {
            data: {
                intent: result
            },
            // @ts-expect-error 不写类型了．
            res: result.user_intent ?? ""
        };
    }

    graph
        .addNode("确定交付物", step1)
        .addNode("确定工作流", step2)
        .addNode("构建函数", buildFunc)
        .addNode("工作流Mapper", wfsMapper)
        .addNode("工作流汇总", wfsReducer)
        .addConditionalEdge("确定交付物", cond1, {
            "END": END,
            "step2": "确定工作流"
        })
        .addEdge("确定工作流","工作流Mapper")
        .addEdge("工作流Mapper","构建函数")
        .addEdge("构建函数","工作流汇总")
        .setEntryPoint("确定交付物")
        .setFinishPoint("工作流汇总");
    return graph;
}