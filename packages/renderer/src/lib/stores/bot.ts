import { writable, type Writable } from "svelte/store";
import { rpc } from "@app/preload";
import { type Robot } from './bots'


export interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
}


interface BotState {
    bot: Robot;
    // train: Message[] //  train的对话历史．
    // tasks
    loading: boolean;
    error: string | null;
}

interface BotStore extends Writable<BotState> {
    id(): string;
    load(): Promise<void>;
    unload(): Promise<void>;
    updateRobot(robot: Robot): Promise<number>;
    deleteRobot(id: string): Promise<boolean>;
}

const createBotStore = (id: string, type: string): BotStore => {
    const localState: BotState = {
        bot: {
            id,
            type,
            name: '',
            taskCount: 0,
            updTime: '',
            status: ''
        },
        // train: [],
        loading: true,
        error: null,
    };

    const { subscribe, set, update } = writable(localState);

    return {
        subscribe,
        set,
        update,

        id(): string {
            return localState.bot.id;
        },

        async unload(): Promise<void> {

        },

        // 程序方法来更新状态
        async load(): Promise<void> {
            if (!localState.loading) { // 已经加载过了，忽略后续请求．
                return
            }
            localState.error = null;
            update((state) => ({ ...state, loading: true, error: null }));

            try {
                const result = await rpc.bots.find({ id });
                if (result.length !== 1) {
                    localState.loading = false;
                    localState.error = "Not found";
                    update((state) => ({ ...state, loading: false, error: localState.error }));
                }
                localState.bot = result[0];
                localState.loading = false;
                localState.error = null;
                set(localState);
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                localState.loading = false;
                localState.error = errorMessage;
                update((state) => ({ ...state, loading: false, error: errorMessage }));
            }
        },

        async updateRobot(robot: Robot): Promise<number> {
            if (!robot.id) {
                return 0;
            }

            // 先调用RPC
            const result = await rpc.bots.update(robot);

            update((state) => ({
                ...state,
                bot: state.bot.map(
                    (existingRobot) =>
                        existingRobot.id === robot.id
                            ? { ...robot } // 更新匹配的机器人
                            : existingRobot // 保持其他机器人不变
                ),
            }));
            // console.log("add robot=", data);
            return result;
        },

        async deleteRobot(id: string): Promise<boolean> {
            // console.log("call rmbyid:", id)
            const result = await rpc.bots.rmById(id);
            update((state) => ({
                ...state,
                bot: state.bot.filter((robot) => robot.id !== id),
            }));
            return result;
        },
    };
};

const botCache: Map<string, BotStore> = new Map();
export const ensureBot = (id: string, mode: string): BotStore => {
    const store = botCache.get(id);
    if (store) {
        return store;
    }
    if (!mode) {
        mode = "train";
    }
    const bot = createBotStore(id, mode);
    botCache.set(id, bot)
    return bot;
}

export const unloadBot = async (id: string): Promise<void> => {
    const store = botCache.get(id);
    if (store) {
        botCache.delete(id);
        await store.unload();
    }
}