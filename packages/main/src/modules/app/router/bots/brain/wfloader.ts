import { SimpleLangGraph } from "./workflow.js";
import { IBrain } from "../interface/ibrain.js";
import { IWorkflowLoader } from "../interface/iwfloader.js";
import { loadWorkflow as loadTrainWf, loadWorkflow } from './wfs/train/index.js';
import { loadWorkflow as loadTrainTest } from './wfs/test/index.js';
import { loadWorkflow as loadAdWf } from './wfs/ad/index.js'
import { loadWorkflow as loadNovelWf } from './wfs/novel/index.js'
import { loadWorkflow as loadWedocWf } from './wfs/wedoc/index.js'

export class WorkflowLoader implements IWorkflowLoader {
    public async loadWorkflow(brain: IBrain, wfname: string): Promise<SimpleLangGraph> {
        let graph: SimpleLangGraph;

        switch (wfname) {
            case 'train':
                // 现在可以将brain对象传递给loadTrainWf
                graph = loadTrainWf(brain);
                break;
            case 'test':
                graph = loadTrainTest(brain);
                break;
            case 'ad':
                graph = loadAdWf(brain);
                break;
            case 'novel':
                graph = loadNovelWf(brain);
                break;
            case 'wedoc':
                graph = loadWedocWf(brain);
                break;
            default:
                throw new Error("尚未支持动态工作流。" + wfname);
        }

        return graph;
    }
}