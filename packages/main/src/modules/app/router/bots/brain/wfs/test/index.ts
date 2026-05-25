import { type GraphState, SimpleLangGraph } from "../../workflow.js";
import { IBrain } from "../../../interface/ibrain.js";
import {render} from "ejs";
// import { JsonOutputParser } from "@langchain/core/output_parsers";
// import { ChatPromptTemplate } from "@langchain/core/prompts";


// 通过闭包传递环境信息(通过brain传入)
export function loadWorkflow(brain: IBrain): SimpleLangGraph {
    const graph = new SimpleLangGraph();


    async function step(state: GraphState): Promise<Partial<GraphState>> {

        console.log("enter test step");
        const input = JSON.parse(state.req);
        console.log(input);

        const content = render(input.text,JSON.parse(input.json));

        const result = await brain.txtio.invoke([{ role: "user", content }]);

        console.log("step1 result=", result)

        return {
            res: result.content as string
        };
    }

    graph
        .addNode("test", step)
        .setEntryPoint("test")
        .setFinishPoint("test");
    return graph;
}