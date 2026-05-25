import { Brain } from "../../../brain.js";
import { render } from "ejs";
import promptTpl1 from './prompt1.js'
import promptTpl2 from './prompt2.js'
import promptTpl3 from './prompt3.js'
import promptTpl4 from './prompt4.js'
import promptTpl5 from './prompt5.js'
import * as fs from 'fs';
import * as path from 'path';
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { merge } from 'remeda';
import { shell } from 'electron';


async function doTopic(brain: Brain, promptTpl: string, it: Record<string, any>) {
    const prompt = render(promptTpl, it, {
        escape: function (markup) {
            return markup; // 不进行转义
        }
    });

    console.log(prompt)
    // 获取AI响应

    const aiResponse = await brain.txtio.invoke([new HumanMessage(prompt)]);

    // 提取文本内容
    // 使用 LangChain 的内置方法转换为字符串
    return aiResponse.content as string; // 类型断言

}

export default async function doTask(brain: Brain, req: string): Promise<any> {
    // const it: Record<string, any> = {
    //     common: brain.data.common ?? false,
    //     struct: brain.data.struct.article_structure
    // }

    const content = brain.data.content;

    const final = []
    let result;
    result = await doTopic(brain, promptTpl1, {
        opening_json: content[0]
    });
    // console.log("result1=", result)
    final.push(result);

    result = await doTopic(brain, promptTpl2, {
        dimension1_json: content[1]
    });
    final.push(result)
    // console.log("result2=", result)


    result = await doTopic(brain, promptTpl3, {
        dimensions_json: content[2]
    });
    // console.log("result3=", result)
    final.push(result);


    result = await doTopic(brain, promptTpl4, {
        story_data_json: content[3],
        prevcontent: final[2]
    });
    // console.log("result4=", result)
    final.push(result);


    result = await doTopic(brain, promptTpl5, {
        conclusion_json: content[4]
    });
    // console.log("result5=", result)
    final.push(result);


    const filePath = brain.app.getFileName();
    const parsed = path.parse(filePath);
    const jsonPath = path.join(parsed.dir, parsed.name + '.json');

    if (!fs.existsSync(parsed.dir)) {
        fs.mkdirSync(parsed.dir, { recursive: true });
    }

    await Promise.all([
        fs.promises.writeFile(filePath, final.join('\n\n'), 'utf8'),
        fs.promises.writeFile(jsonPath, JSON.stringify(brain.data, null, 2), 'utf8')
    ])

    brain.setData(merge(brain.data, {
        final: final,
        res: `# 内容保存完毕:

- 文本内容: '${filePath}'
- 本体内容: '${jsonPath}'`
    }));


    // 使用系统默认程序打开文件
    await shell.openPath(filePath);


    // console.log("extract brain data=", brain.data);
}