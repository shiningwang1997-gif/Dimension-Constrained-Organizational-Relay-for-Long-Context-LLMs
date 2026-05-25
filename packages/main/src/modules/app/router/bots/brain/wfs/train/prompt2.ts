import { ChatPromptTemplate } from "@langchain/core/prompts";


const prompt = ChatPromptTemplate.fromTemplate(`
你是一位工作流设计专家。请根据以下工作信息，设计一个完整的AI自动化工作流程：

工作职位：{job_title}
工作内容：{job_content}
工作要求：{requirements}
交付物：{deliverable}

请分析这个工作，将其分解为逻辑清晰的步骤序列，设计出一个可以被函数自动执行的工作流，注意函数可以调用大语言模型，因此具有AI能力。

输出要求：
1. 以JSON格式输出工作流
2. 包含完整的步骤序列
3. 每个步骤需要明确的输入、输出和执行内容
4. 每个步骤的输入(示例中的source字段)为一个数组，其值为'input'及step_id的值(表示step_id对应步骤的输出)．
5. output中的format字段，值为字符串，采用typescript的类型标记，但是复杂对象一律标记为JSON即可．input的类型恒定为string,表示用户输入的一段文字．
6. 步骤之间要有逻辑连接关系
7. 考虑异常处理和质量控制


JSON结构要求：
{{
  "workflow_name": "工作流名称",
  "steps": [
    {{
      "step_id": "步骤编号",
      "step_name": "步骤名称",
      "description": "步骤详细描述",
      "input": {{
        "type": "输入数据类型",
        "description": "输入描述",
        "source": ["数据来源1","数据来源2"...]
      }},
      "output": {{
        "type": "输出数据类型",
        "description": "输出描述",
        "format": "输出格式"
      }},
      "execution": {{
        "method": "执行方法",
        "details": "具体执行内容",
        "validation": "验证标准"
      }}
    }}
  ],
  "quality_control": "质量控制措施",
  "error_handling": "异常处理方案"
}}

请现在根据提供的工作信息生成完整的工作流JSON。

`);

export default prompt;