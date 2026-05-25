import { type AppContext } from "../../../context.js";
import { Message, type Robot } from "../../type.js";
import { type BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface IBrain {
    readonly app: AppContext;
    readonly bot: Robot;
    readonly txtio: BaseChatModel;
    callWorkflow(msg: Message, wfname?: string): Promise<Message>;
}