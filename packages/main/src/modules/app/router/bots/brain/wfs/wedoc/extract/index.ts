import { Brain } from "../../../brain.js";
import { render } from "ejs";
import promptTpl from './prompt.js'
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { merge } from 'remeda';


export default async function doTask(brain: Brain, req: string): Promise<any> {
    const it = {
        userContent: req,
        common: brain.data.common ?? false
    }

    const prompt = render(promptTpl, it, {
        escape: function (markup) {
            return markup; // 不进行转义
        }
    });

    console.log(prompt)

    const result = await RunnableLambda.from(async (input) => {
        return await brain.txtio.invoke([
            new HumanMessage(prompt)
        ]);
    }).pipe(new JsonOutputParser()).invoke({});

    brain.setData(merge(brain.data, {
        common: result
    }))

    console.log("wedoc extract doTask result=", result)
    // console.log("extract brain data=", brain.data);
}