import { ChatPromptTemplate } from "@langchain/core/prompts";


const prompt = ChatPromptTemplate.fromTemplate(`
你是一位专门设计AI驱动工作流程的专家。请根据提供的工作信息，设计一个完整的、可被函数自动执行的AI工作流程。该工作流将通过调用大语言模型来完成各个步骤，每个步骤会自动生成对应的提示词并执行。

**工作信息：**
- 工作职位：{job_title}
- 工作内容：{job_content}  
- 工作要求：{requirements}
- 交付物：{deliverable}

**设计要求：**

请将工作分解为适合大语言模型执行的逻辑步骤序列。每个步骤都将通过AI函数调用完成，系统会根据步骤描述自动生成相应的提示词。因此要重点考虑：
- 每个步骤要完成的具体任务和目标
- AI模型擅长的任务类型（文本分析、内容生成、推理判断、信息提取等）
- 步骤间的数据流转和依赖关系
- 输出结果的验证标准

**输出格式：**

以JSON格式输出工作流，结构如下：

\`\`\`json
{{
  "workflow_name": "工作流名称",
  "description": "工作流整体描述和目标",
  "steps": [
    {{
      "step_id": "step_1",
      "step_name": "步骤名称", 
      "task_type": "任务类型（如：analysis、generation、extraction、validation等）",
      "objective": "这一步要达成的具体目标和完成的任务",
      "input": {{
        "type": "string",
        "description": "输入数据的描述和要求",
        "source": ["input", "step_id1", "step_id2"]
      }},
      "output": {{
        "type": "输出的TypeScript类型标记",
        "description": "期望输出内容的详细描述", 
        "format": "string | number | boolean | JSON",
        "success_criteria": "判断输出是否成功的标准"
      }},
      "execution": {{
        "method": "llm_call",
        "complexity": "low | medium | high",
        "estimated_tokens": "预估的token消耗量",
        "retry_on_failure": true
      }}
    }}
  ],
  "workflow_logic": {{
    "data_flow": "描述整个工作流的数据流向和依赖关系",
    "parallel_steps": "可以并行执行的步骤组合",
    "critical_path": "关键路径上的步骤"
  }},
  "quality_control": {{
    "validation_strategy": "整体质量验证策略",
    "checkpoints": "关键检查点位置",
    "fallback_options": "质量不达标时的备选方案"
  }},
  "error_handling": {{
    "retry_policy": "重试策略",
    "escalation_rules": "异常升级规则",
    "recovery_steps": "错误恢复步骤"
  }}
}}
\`\`\`

**关键要求：**
1. 每个步骤的objective必须清晰描述要完成的具体任务
2. task_type要准确反映AI需要执行的操作类型
3. 步骤间的依赖关系要在source字段中明确体现
4. 输出的success_criteria要具体可判断
5. 整个流程要逻辑清晰，能够自动化执行
6. 充分考虑AI模型的能力特点和限制

请根据提供的工作信息生成完整的AI工作流JSON。
`);

export default prompt;