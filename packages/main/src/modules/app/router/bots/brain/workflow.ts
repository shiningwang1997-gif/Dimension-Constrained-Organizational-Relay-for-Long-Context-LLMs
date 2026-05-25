import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
// import { decodeObjectStrings } from "../utils/transform.js";

// 状态类型定义
type GraphState = {
    req: string;
    res: string;
    data: Record<string, any>;
    [key: string]: any;
}

// 节点函数类型,接收state,然后返回更新了的state部分．
type NodeFunction<S = GraphState, U = Partial<GraphState>> = (state: S) => Promise<U> | U;

// 条件函数类型,返回下一个需要执行的节点名称．或者特殊节点，例如"END".
type ConditionFunction = (state: GraphState) => string;

// 极简LangGraph封装类
class SimpleLangGraph {
    private graph: StateGraph<any, any, any, any>;
    private compiled: any = null;

    // 临时存储，在invoke开始时会被清空．
    public tempStore: Record<string, any> = {}
    // 此结果在返回前会合并到最终结果上，用于简化值处理．在invoke开始时会被清空．
    public mergeResult: Record<string, any> = {}

    constructor() {
        // 使用Root注解创建状态图
        const StateAnnotation = Annotation.Root({
            req: Annotation<string>(),
            res: Annotation<string>(),
            data: Annotation<Record<string, any>>({
                reducer: (current: Record<string, any> = {}, update: Record<string, any>) => ({
                    ...current,
                    ...update
                })
            })
        });
        this.graph = new StateGraph(StateAnnotation);
    }

    // 添加节点
    addNode<K extends string>(name: K, fn: NodeFunction): this {
        this.graph.addNode(name, fn);
        return this;
    }

    // 添加普通边 - 使用正确的类型
    addEdge(from: string | typeof START, to: string | typeof END): this {
        // 根据源代码，addEdge接受 START | N | N[] 作为startKey，N | END 作为endKey
        this.graph.addEdge(from as any, to as any);
        return this;
    }

    // 添加条件边
    addConditionalEdge(
        source: string,
        condition: ConditionFunction,
        mapping: Record<string, string>
    ): this {
        this.graph.addConditionalEdges(source, condition, mapping);
        return this;
    }

    // 设置入口点
    setEntryPoint(nodeId: string): this {
        this.graph.addEdge(START, nodeId);
        return this;
    }

    // 设置结束点
    setFinishPoint(nodeId: string): this {
        this.graph.addEdge(nodeId, END);
        return this;
    }

    // 编译图
    compile(): this {
        this.compiled = this.graph.compile();
        return this;
    }

    // async test(): Promise<void> {
    //     const testit = {
    //         a: { b: "设计师在咖啡厅给客户演示飞鹿家居，刚说&#39;拖拽无延迟&#39;，触控板突然自己动起来。家具自动排列组合，客户惊讶地问&#39;您手没动啊？&#39;设计师尴尬一笑&#39;这是我们AI预判功能...&#39;结果电脑传出声音&#39;这届客户审美不行，让我来！&#39;原来是他双胞胎弟弟远程操控恶搞。" }
    //     }

    //     const transformed = decodeObjectStrings(testit);

    //     console.log("transformed", transformed)
    // }

    // 执行图
    async invoke(initialState: GraphState = { req: "", data: {}, res: '' }, store: Record<string, any> = {}): Promise<GraphState> {

        // await this.test();
        // return initialState;

        if (!this.compiled) {
            this.compile();
        }
        this.mergeResult = {}
        this.tempStore = store;
        // console.log("initialState=", initialState)
        const result = await this.compiled.invoke(initialState);
        console.log("this.mergeResult=", this.mergeResult)
        return {
            ...result,
            ...this.mergeResult
        }
    }

    // 流式执行
    async *stream(initialState: GraphState = { req: "", data: {}, res: '' }): AsyncGenerator<any> {
        if (!this.compiled) {
            this.compile();
        }
        for await (const chunk of this.compiled.stream(initialState)) {
            yield chunk;
        }
    }

    // 获取原始图对象（如果需要高级操作）
    getGraph(): StateGraph<any, any, any, any> {
        return this.graph;
    }
}

// // 使用示例
// const graph = new SimpleLangGraph();

// // 链式调用构建图
// graph
//     .addNode("start", (state) => {
//         console.log("Starting:", state);
//         return { ...state, step: 1 };
//     })
//     .addNode("process", async (state) => {
//         console.log("Processing:", state);
//         return { ...state, step: 2, processed: true };
//     })
//     .addNode("end", (state) => {
//         console.log("Ending:", state);
//         return { ...state, completed: true };
//     })
//     .setEntryPoint("start")
//     .addEdge("start", "process")
//     .addEdge("process", "end")
//     .setFinishPoint("end");

// 导出
export { SimpleLangGraph, type NodeFunction, type ConditionFunction, type GraphState };