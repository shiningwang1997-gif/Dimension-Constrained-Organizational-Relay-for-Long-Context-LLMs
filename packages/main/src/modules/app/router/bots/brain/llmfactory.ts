import { ChatOpenAI } from "@langchain/openai";
import { type BaseChatModel } from "@langchain/core/language_models/chat_models";

export function createLLM(
    provider: string,
    modelName: string,
    apiKey: string
): BaseChatModel {
    const cfg: Record<string, any> = {};
    if (modelName) {
        cfg.modelName = modelName;
    }
    switch (provider.toLowerCase()) {
        case "deepseek":
            if (!cfg.modelName) {
                cfg.modelName = "deepseek-chat";
            }
            cfg.configuration = {
                baseURL: "https://api.deepseek.com",
            };
        // cfg.baseURL = "https://api.deepseek.com"
        case "openai":
            cfg.openAIApiKey = apiKey;
            // console.log("config=",cfg)
            return new ChatOpenAI(cfg);
    }
    throw new Error(`不支持的 LLM 提供商: ${provider}`);
}