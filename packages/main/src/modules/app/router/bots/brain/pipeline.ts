type TaskFunction<T = any> = (store: T, req: string) => any;
type TaskResult = number | string | any;

interface PipelineOptions {
    maxIterations?: number; // 防止无限循环
}

export class ConditionalPipeline<T = any> {
    private tasks: TaskFunction<T>[] = [];
    private taskMap: Map<string, number> = new Map();

    constructor(private options: PipelineOptions = {}) {
        this.options.maxIterations = options.maxIterations || 100000;
    }

    // 添加任务函数
    pushTask(name: string, task: TaskFunction<T>): this {
        const index = this.tasks.length;
        this.tasks.push(task);
        this.taskMap.set(name, index);
        return this;
    }

    // 获取任务序列号
    public getTaskSeq(name: string): number {
        const index = this.taskMap.get(name);
        if (index === undefined) {
            return -1;
        }
        return index;
    }

    // 执行指定的单个任务（支持任务名称或下标）
    async executeTask(taskIdentifier: string | number, data: T, req: string): Promise<T> {
        let taskIndex: number;

        if (typeof taskIdentifier === 'string') {
            taskIndex = this.getTaskSeq(taskIdentifier);
            if (taskIndex === -1) {
                throw new Error(`Task '${taskIdentifier}' not found`);
            }
        } else {
            taskIndex = taskIdentifier;
            if (taskIndex < 0 || taskIndex >= this.tasks.length) {
                throw new Error(`Task index ${taskIndex} is out of range`);
            }
        }

        const task = this.tasks[taskIndex];
        if (!task) {
            throw new Error(`Task at index ${taskIndex} is undefined`);
        }

        try {
            const result: TaskResult = await task(data, req);
            // 返回任务处理后的数据
            return result;
        } catch (error) {
            throw new Error(`Error in task '${taskIdentifier}': ${error}`);
        }
    }

    // 获取有效的起始索引
    private getStartIndex(startFrom?: string | number): number {
        if (startFrom === undefined) {
            return 0;
        }

        let startIndex: number;

        if (typeof startFrom === 'string') {
            startIndex = this.getTaskSeq(startFrom);
            if (startIndex === -1) {
                console.warn(`Starting task '${startFrom}' not found, starting from beginning`);
                return 0;
            }
        } else {
            startIndex = startFrom;
            if (startIndex < 0 || startIndex >= this.tasks.length) {
                console.warn(`Starting index ${startIndex} is out of range, starting from beginning`);
                return 0;
            }
        }

        return startIndex;
    }

    // 执行管道
    async execute(initialData: T, req: string, startFrom?: string | number): Promise<T> {
        let currentIndex = this.getStartIndex(startFrom);
        let store = initialData;
        let iterations = 0;

        while (currentIndex < this.tasks.length && iterations < this.options.maxIterations!) {
            iterations++;

            const currentTask = this.tasks[currentIndex];
            if (!currentTask) {
                break;
            }

            try {
                const result: TaskResult = await currentTask(store, req);

                // 根据返回值类型决定下一步
                if (typeof result === 'number') {
                    if (result < 0) {
                        // 返回负数，直接退出循环
                        break;
                    } else {
                        // 跳转到指定索引
                        currentIndex = result;
                        continue;
                    }
                } else if (typeof result === 'string') {
                    // 返回字符串，通过 getTaskSeq 获取索引
                    const nextIndex = this.getTaskSeq(result);
                    if (nextIndex === -1) {
                        throw new Error(`Cannot jump to task '${result}': task not found`);
                    }
                    currentIndex = nextIndex;
                    continue;
                } else {
                    currentIndex++;
                }
            } catch (error) {
                throw new Error(`Error in task ${currentIndex}: ${error}`);
            }
        }

        if (iterations >= this.options.maxIterations!) {
            throw new Error('Maximum iterations reached, possible infinite loop');
        }

        return store;
    }

    // 静态方法，类似传统的 pipe
    static create<T>(): ConditionalPipeline<T> {
        return new ConditionalPipeline<T>();
    }
}