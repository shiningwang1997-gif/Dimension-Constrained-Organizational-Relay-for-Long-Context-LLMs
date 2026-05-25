import { Brain } from "../../../brain.js";
import { render } from "ejs";
import promptTpl from './prompt.js'
import promptTpl1 from './prompt1.js'
import promptTpl2 from './prompt2.js'
import promptTpl3 from './prompt3.js'
import promptTpl4 from './prompt4.js'
import extractTpl from './extract.js'
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { merge } from 'remeda';


async function doTopic(brain: Brain, promptTpl: string, it: Record<string, any>, final: Record<string, any>, finalName: string) {
    const prompt = render(promptTpl, it, {
        escape: function (markup) {
            return markup; // 不进行转义
        }
    });

    // console.log(prompt)
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
        // console.log("textResult=", textResult)

        if (textResult) {
            const prompt = render(extractTpl, {
                inputJson: textResult
            }, {
                escape: function (markup) {
                    return markup; // 不进行转义
                }
            });

            // console.log("prompt=", prompt)

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

    if (result) {
        final[finalName] = result;
    }
}

export default async function doTask(brain: Brain, req: string): Promise<any> {
    const it = {
        userContent: req,
        common: brain.data.common ?? false
    }

    const tasks = [];
    const topics = {};
    tasks.push(doTopic(brain, promptTpl, it, topics, '0'))
    tasks.push(doTopic(brain, promptTpl1, it, topics, '1'))
    tasks.push(doTopic(brain, promptTpl2, it, topics, '2'))
    tasks.push(doTopic(brain, promptTpl3, it, topics, '3'))
    tasks.push(doTopic(brain, promptTpl4, it, topics, '4'))

    await Promise.all(tasks);


    brain.setData(merge(brain.data, {
        topics
    }));

    console.log("wedoc extract doTask result=", topics)
    // console.log("extract brain data=", brain.data);
}