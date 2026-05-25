import { writable, type Writable } from "svelte/store";
import { rpc } from "@app/preload";
import dayjs from "$lib/utils/dayjs";

export interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: string;
}

interface MessageState {
    loading: boolean;
    messages: Message[];
    isTyping: boolean;
    latestMessageId: string; // 用于控制自动滚动．
    thinking: string; // AI思考的内容．
    error: string | null;
}

interface MessageStore extends Writable<MessageState> {
    sendMessage(content: string, mode: string): Promise<void>;
    setTyping(typing: boolean): void;
    setLatestMessageId(id: string): void;
    clearMessages(): void;
    loadMessages(): Promise<void>;
    saveMessages(): Promise<void>;
    simulateAIResponse(userInput: string): Promise<void>;
}

export function createMsg(content: string, sender: "user" | "ai" = "user"): Message {
    return {
        id: crypto.randomUUID(),
        content,
        sender,
        timestamp: dayjs().format(),
    };
}

const createMessageStore = (id: string): MessageStore => {
    const localState: MessageState = {
        loading: true,
        messages: [],
        isTyping: false,
        latestMessageId: "",
        thinking: '',
        error: null,
    };

    const { subscribe, set, update } = writable(localState);

    const generateAIResponse = (userInput: string): string => {
        const responses = [
            `关于"**${userInput}**"，这是一个很有趣的话题！\n\n让我为你详细分析一下：\n\n1. **关键点分析**\n   - 首先需要理解核心问题\n   - 然后寻找最佳解决方案\n\n2. **建议方案**\n   \`\`\`javascript\n   // 这里是一些示例代码\n   const solution = "最佳实践";\n   console.log("这是一行很长的代码，用来测试代码块在聊天气泡中的自适应宽度效果");\n   \`\`\`\n\n希望这些信息对你有帮助！`,

            `我理解你的意思，让我来详细解答。\n\n## 问题分析\n\n这个问题涉及多个方面的考虑：\n\n- **技术层面**：需要考虑实现的可行性，包括性能优化、代码维护性、扩展性等多个维度\n- **用户体验**：确保解决方案用户友好，界面直观易用\n- **维护性**：代码要易于维护和扩展，遵循最佳实践\n\n> 💡 **提示**：记住始终从用户需求出发，这是最重要的设计原则！`,

            `根据你的描述，我建议可以从以下几个方面考虑：\n\n### 🎯 核心要点\n\n1. **首先** - 明确目标和需求，确保方向正确\n2. **其次** - 选择合适的技术栈，权衡各种因素\n3. **最后** - 实施和测试，确保质量\n\n\`\`\`javascript\n// 示例代码 - 测试长行代码的自适应效果\nfunction handleUserInputWithVeryLongFunctionNameToTestWrapping(input) {\n  const processedResult = processAndRespondWithDetailedAnalysis(input);\n  return processedResult;\n}\n\`\`\`\n\n有其他问题随时问我！`,

            `这个问题确实值得深入探讨。\n\n## 💭 我的思路\n\n我来为你提供一些思路和建议：\n\n**功能优先级分析：**\n- 🔴 **高优先级**：满足基本需求，确保核心功能正常运行\n- 🟡 **中优先级**：优化用户体验，提升界面友好度和交互流畅性  \n- 🟢 **低优先级**：提升界面美观度，添加锦上添花的功能\n\n*记得循序渐进地实现，不要一次性做得太复杂！*`,

            `感谢你的提问！我很乐意为你解答。\n\n### 📚 相关信息整理\n\n让我整理一下相关信息：\n\n- [x] 理解问题背景和具体需求\n- [x] 分析可能的解决方案和技术选型\n- [ ] 提供具体的实施建议和最佳实践\n- [ ] 考虑潜在的风险和应对措施\n\n**结论**：基于以上分析，我认为你应该从最核心的功能开始实现，然后逐步完善其他特性。\n\n需要更多细节的话请告诉我！`,

            `让我为你分析一下这个问题的要点：\n\n## 🔍 深度分析\n\n希望对你有所帮助：\n\n\`\`\`markdown\n问题：${userInput}\n分析：这涉及到多个维度的考虑，需要综合评估技术可行性、业务价值、实施成本等因素\n建议：采用渐进式的解决方案，先实现MVP（最小可行产品），再逐步迭代优化\n\`\`\`\n\n### 下一步行动计划\n\n1. **立即行动**：开始基础实施，搭建项目框架\n2. **短期规划**：完善核心功能，确保基本可用性\n3. **长期愿景**：持续优化改进，添加高级特性\n\n还有什么想了解的吗？我可以为你提供更详细的指导！`,
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    };

    function prependMessage(newMessage: Message) {
        localState.messages = [newMessage, ...localState.messages]
        localState.latestMessageId = newMessage.id;

        update(state => localState);
    }

    function addMessage(content: string, sender: "user" | "ai"): Message {
        const newMessage: Message = createMsg(content, sender)
        prependMessage(newMessage)
        return newMessage;
    }


    return {
        subscribe,
        set,
        update,


        async sendMessage(content: string, mode: string): Promise<void> {

            // console.log("sendMessage mode=", mode)
            const msg = addMessage(content, 'user');
            // 这里开始监听思考进度．
            this.setTyping(true);
            try {
                const response = await rpc.bots.train.send(msg, id, mode);
                localState.isTyping = false;
                prependMessage(response);
            } catch (err) {
                localState.isTyping = false;
                addMessage(err instanceof Error ? err.message : String(err), "ai");
            } finally {
                // 取消思考进度的关注．
            }
            // return this.simulateAIResponse(content)
        },

        setTyping(typing: boolean): void {
            localState.isTyping = typing;
            update(state => localState);
        },

        setLatestMessageId(id: string): void {
            localState.latestMessageId = id
            update(state => localState);
        },

        clearMessages(): void {
            localState.messages = [];
            localState.latestMessageId = '';
            update(state => localState);
        },

        async loadMessages(): Promise<void> {
            try {
                if (!localState.loading) {
                    localState.loading = true;
                    update(state => localState);
                }
                // 这里调用RPC加载历史消息
                localState.messages = await rpc.bots.train.load(id);
                localState.loading = false;
                update(state => localState);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                localState.error = errorMessage;
                localState.loading = false;
                update(state => localState);
            }
        },

        async saveMessages(): Promise<void> {
            try {
                // 这里可以调用RPC保存消息
                // await rpc.messages.save(localState.messages);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                update(state => ({ ...state, error: errorMessage }));
            }
        },

        async simulateAIResponse(userInput: string): Promise<void> {
            // 设置正在输入
            this.setTyping(true);

            // 模拟AI响应延迟
            setTimeout(() => {
                const aiResponse = generateAIResponse(userInput);
                localState.thinking = aiResponse;
                update(state => localState)
                setTimeout(() => {
                    const aiResponse = generateAIResponse(userInput);
                    localState.thinking = "";
                    localState.isTyping = false;
                    addMessage(aiResponse, "ai");
                    // this.setTyping(false);
                }, 5000);
            }, 1500);
        }
    };
};

const storeCache: Map<string, MessageStore> = new Map();
export const ensureStore = (id: string): MessageStore => {
    let store = storeCache.get(id);
    if (store) {
        return store;
    }
    store = createMessageStore(id);
    storeCache.set(id, store)
    return store;
}

export const unloadStore = async (id: string): Promise<void> => {
    const store = storeCache.get(id);
    if (store) {
        storeCache.delete(id);
        // await store.unload();
    }
}