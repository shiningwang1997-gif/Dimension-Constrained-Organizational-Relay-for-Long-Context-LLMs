import { Brain } from "../../../brain.js";
import { render } from "ejs";
import promptTpl from './prompt.js'
import extractTpl from './extract.js'
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { merge } from 'remeda';


async function doTopic(brain: Brain, promptTpl: string, it: Record<string, any>) {
    const prompt = render(promptTpl, it, {
        escape: function (markup) {
            return markup; // 不进行转义
        }
    });

    console.log(prompt)
    let result;
    // const maxRetries = 5;
    let lastError;

    let textResult: string = "";
    try {
        // 获取AI响应

        const aiResponse = await brain.txtio.invoke([new HumanMessage(prompt)]);

        // 提取文本内容
        // 使用 LangChain 的内置方法转换为字符串
        textResult = aiResponse.content as string; // 类型断言

        // JsonOutputParser接受字符串参数
        result = await new JsonOutputParser().invoke(textResult);
    } catch (error) {
        console.warn('JSON解析失败，使用提示词提取:', error instanceof Error ? error.message : String(error));
        console.log("textResult=", textResult)

        if (textResult) {
            const prompt = render(extractTpl, {
                inputJson: textResult
            }, {
                escape: function (markup) {
                    return markup; // 不进行转义
                }
            });

            console.log("prompt=", prompt)

            try {
                // 第二次尝试也是先获取文本再解析
                const extractResponse = await brain.txtio.invoke([
                    new HumanMessage(prompt)
                ]);

                const extractText = extractResponse.content as string;
                result = await new JsonOutputParser().invoke(extractText);

            } catch (extractError) {
                lastError = extractError instanceof Error ? extractError.message : String(extractError);
                console.error('提示词提取JSON也失败:', lastError);
                throw extractError;
            }
        }
    }

    return result;
}

export default async function doTask(brain: Brain, req: string): Promise<any> {
    const it = {
        common: brain.data.common ?? false,
        topic: brain.data.topics['4']
    }

    const result = await doTopic(brain, promptTpl, it);

    console.log("result=", result)


    brain.setData(merge(brain.data, {
        struct: result
    }));

    // console.log("extract brain data=", brain.data);
}