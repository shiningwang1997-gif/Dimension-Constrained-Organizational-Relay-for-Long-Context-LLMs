import { type GraphState, SimpleLangGraph } from "../../workflow.js";
import { IBrain } from "../../../interface/ibrain.js";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableLambda } from "@langchain/core/runnables";
import { END, Send } from "@langchain/langgraph";
import { render } from "ejs";
import analysis1Tpl from './1analysis.js'
import { isArray, isString } from 'remeda';
import { advCate } from './advatage2.js'
import advatage2Tpl from './advatage2.js'
import scene3Tpl from './scene3.js'
import story4Tpl from './story4.js'
import reducer5Tpl from './reducer5.js'
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { shell } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import pMap from 'p-map';
import { decodeObjectStrings } from "../../../utils/transform.js";


// 通过闭包传递环境信息(通过brain传入)
export function loadWorkflow(brain: IBrain): SimpleLangGraph {
    const graph = new SimpleLangGraph();


    async function step1(state: GraphState): Promise<Partial<GraphState>> {

        console.log("enter ad test step");

        // 构建消息列表
        const result = await RunnableLambda.from(async (input) => {
            return await brain.txtio.invoke([
                new SystemMessage(analysis1Tpl),
                new HumanMessage(state.req)
            ]);
        }).pipe(new JsonOutputParser()).invoke({});

        // const result = await brain.txtio.invoke([
        //     new SystemMessage(analysis1),
        //     new HumanMessage(state.req)
        // ]).then(response => {
        //     const parser = new JsonOutputParser();
        //     return parser.parse(response.content);
        // });

        // const input = JSON.parse(state.req);
        // console.log(input);

        // const content = render(input.text,JSON.parse(input.json));

        // const result = await brain.txtio.invoke([{ role: "user", content }]);

        console.log("step1 result=", result)

        return {
            // res: result.content as string
            data: {
                analysis: result
            }
        };
    }

    function cond1(state: GraphState): string {

        const fieldNames = ['product_name', 'manufacturer', 'purpose', 'usage_scenario', 'target_audience', 'product_category', 'product_advantages', 'competitive_comparison'];
        const allfiledPassed = () => {
            const analysis = state?.data?.analysis ?? {}
            return fieldNames.every(fieldName => {
                const value = analysis[fieldName];
                if (isString(value) && value.trim().length > 0) {
                    return true;
                }
                console.log("fieldName not satisfied:", fieldName, analysis[fieldName])
                console.log("fieldName,analysis=", fieldName, analysis)
                return false;
            })
        }

        if (!allfiledPassed()) {
            console.log("not ok!!!!")
            // 创建新的状态对象来触发更新
            graph.mergeResult.res = `未分析出必要内容，TODO:继续追问．！！END!!!!\n
            \`\`\`json\n
            ${JSON.stringify(state.data.analysis)}
            \`\`\`
            `
            return "END"
        }

        return "step2"
    }

    async function step2(state: GraphState): Promise<Partial<GraphState>> {
        const advantages: Array<string> = [];
        async function processCate(cate: { cate: string, subcate: Array<string> }): Promise<void> {
            try {
                const it = {
                    ...state?.data?.analysis,
                    analysis_category: cate
                }
                const prompt = render(advatage2Tpl, it);

                // console.log("prompt=", prompt)

                const result = await RunnableLambda.from(async (input) => {
                    return await brain.txtio.invoke([
                        new HumanMessage(prompt)
                    ]);
                }).pipe(new JsonOutputParser()).invoke({});

                if (isArray(result)) {
                    // @ts-ignore
                    advantages.push(...result);
                }
                // console.log("result=", result)
            } catch (e) {
                console.error("忽略类别错误", e)
            }
        }

        const results = await pMap(advCate, processCate, {
            concurrency: 10
        });
        // const result = await processCate(advCate[0]);

        console.log("advantages=", advantages)
        graph.tempStore.advantages = advantages;

        return {
        }
    }

    async function step3(state: GraphState): Promise<Partial<GraphState>> {
        const scenes: Array<string> = [];

        async function processScene(advantage: { dimension: string, advantage: string }): Promise<void> {
            try {
                const it = {
                    ...state?.data?.analysis,
                    advantage: advantage
                }
                const prompt = render(scene3Tpl, it);

                // console.log("scene prompt=", prompt)

                const result = await RunnableLambda.from(async (input) => {
                    return await brain.txtio.invoke([
                        new HumanMessage(prompt)
                    ]);
                }).pipe(new JsonOutputParser()).invoke({});

                if (isArray(result)) {

                    const newResult = (result as any[]).map(item => ({
                        ...item,
                        advantage
                    }));
                    // @ts-ignore
                    scenes.push(...newResult);
                }
            } catch (e) {
                console.error("忽略场景错误:", e)
            }
            // console.log("result=", result)
        }

        const advantages = graph.tempStore.advantages;

        const results = await pMap(advantages, processScene, {
            concurrency: 15
        });
        // const result = await processScene(advantages[0]);

        // console.log("scenes=", scenes)
        graph.tempStore.scenes = scenes;


        return {}
    }

    async function step4(state: GraphState): Promise<Partial<GraphState>> {
        const stories: Array<string> = [];

        async function processStory(scene: Record<string, any>): Promise<void> {
            try {
                const it = {
                    ...state?.data?.analysis,
                    ...scene
                }
                const prompt = render(story4Tpl, it);

                // console.log("story prompt=", prompt)

                const result = await RunnableLambda.from(async (input) => {
                    return await brain.txtio.invoke([
                        new HumanMessage(prompt)
                    ]);
                }).pipe(new JsonOutputParser()).invoke({});

                if (isArray(result)) {
                    const newResult = (result as any[]).map(item => ({
                        ...item,
                        scene
                    }));
                    // @ts-ignore
                    stories.push(...newResult);
                }
                console.log("story result=", result)
            } catch (e) {
                console.error("忽略错误:", e)
            }
        }

        const scenes = graph.tempStore.scenes;

        const results = await pMap(scenes, processStory, {
            concurrency: 15
        });
        const result = await processStory(scenes[0]);

        console.log("stories=", stories)
        graph.tempStore.stories = stories;

        return {
            res: ""
        }
    }


    async function reducer(state: GraphState): Promise<Partial<GraphState>> {

        const stories = decodeObjectStrings(graph.tempStore.stories);

        const it = {
            ...state?.data?.analysis,
            stories: stories
        }


        const result = render(reducer5Tpl, it, {
            escape: function (markup) {
                return markup; // 不进行转义
            }
        });
        // console.log("final result=", result)

        const filePath = brain.app.getFileName();
        const parsed = path.parse(filePath);
        const jsonPath = path.join(parsed.dir, parsed.name + '.json');

        if (!fs.existsSync(parsed.dir)) {
            fs.mkdirSync(parsed.dir, { recursive: true });
        }

        await Promise.all([
            fs.promises.writeFile(filePath, result, 'utf8'),
            fs.promises.writeFile(jsonPath, JSON.stringify(it, null, 2), 'utf8')
        ])

        // 使用系统默认程序打开文件
        await shell.openPath(filePath);
        await shell.openPath(jsonPath);



        return {
            res: `# 内容保存完毕:

- 文本内容: '${filePath}' 
- JSON内容: '${jsonPath}' `
        }
    }

    graph
        .addNode("初始分析", step1)
        .addNode("列出优点", step2)
        .addNode("设计场景", step3)
        .addNode("设计镜头", step4)
        .addNode("汇总成稿", reducer)
        .addConditionalEdge("初始分析", cond1, {
            "END": END,
            "step2": "列出优点"
        })
        .addEdge("列出优点", "设计场景")
        .addEdge("设计场景", "设计镜头")
        .addEdge("设计镜头", "汇总成稿")
        .setEntryPoint("初始分析")
        .setFinishPoint("汇总成稿");
    return graph;
}