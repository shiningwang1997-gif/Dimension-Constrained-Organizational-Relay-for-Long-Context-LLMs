import { SimpleLangGraph } from "../brain/workflow.js";
import { IBrain } from "./ibrain.js";

export interface IWorkflowLoader {
    loadWorkflow(brain: IBrain, wfname: string): Promise<SimpleLangGraph>;
}