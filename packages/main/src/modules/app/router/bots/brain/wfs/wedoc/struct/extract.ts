const tpl = `
你是一个专业的JSON修复专家。请分析以下不完整的JSON内容，并将其修复为正确且完整的JSON格式。

原始不完整的JSON内容：
\`\`\`
<%= inputJson %>
\`\`\`

修复要求：
1. 补全缺失的括号、引号、逗号等符号
2. 修正语法错误
3. 保持原有数据结构和内容的完整性
4. 确保修复后的JSON可以被正确解析

请直接输出修复后的完整JSON内容，不要包含任何解释、说明或额外文字。输出示例格式：

{
    "article_structure": {
        "core_viewpoint": {
            "statement": "震撼性核心观点表述",
                "hook_strategy": "吸引读者的具体策略",
                    "target_emotion": "预期唤起的读者情感"
        },
        "first_layer_support": [
            {
                "dimension_name": "第一个支撑维度名称",
                "dimension_description": "维度核心内容描述",
                "connection_to_core": "与核心观点的关联逻辑",
                "product_integration_point": "产品自然植入的切入点"
            },
            {
                "dimension_name": "第二个支撑维度名称",
                "dimension_description": "维度核心内容描述",
                "connection_to_core": "与核心观点的关联逻辑",
                "product_integration_point": "产品自然植入的切入点"
            },
            {
                "dimension_name": "第三个支撑维度名称",
                "dimension_description": "维度核心内容描述",
                "connection_to_core": "与核心观点的关联逻辑",
                "product_integration_point": "产品自然植入的切入点"
            }
        ],
            "second_layer_support": [
                {
                    "parent_dimension": "所属第一层维度名称",
                    "sub_arguments": [
                        {
                            "sub_point_name": "子论点名称",
                            "argument_description": "具体论证内容",
                            "evidence_type": "所需证据类型（案例/数据/理论等）"
                        },
                        {
                            "sub_point_name": "子论点名称",
                            "argument_description": "具体论证内容",
                            "evidence_type": "所需证据类型"
                        }
                    ]
                }
            ],
                "third_layer_support": {
            "story_elements": ["具体故事案例需求1", "具体故事案例需求2"],
                "data_requirements": ["所需数据类型1", "所需数据类型2"],
                    "user_testimonials": ["用户反馈类型需求"],
                        "expert_opinions": ["专家观点需求"]
        },
        "product_integration_strategy": {
            "integration_philosophy": "产品植入的整体策略",
                "key_integration_moments": [
                    {
                        "moment_description": "植入时机描述",
                        "integration_method": "植入方式",
                        "expected_effect": "预期效果"
                    }
                ]
        },
        "conclusion_design": {
            "spiral_return": "如何螺旋上升回到核心观点",
                "action_guidance": "给读者的行动建议",
                    "final_call_to_action": "最终的行动召唤"
        },
        "logical_flow_validation": {
            "premise_to_conclusion": "从前提到结论的逻辑链条",
                "conflict_resolution": "如何解决选题中设计的冲突",
                    "reader_journey": "读者认知转变的完整路径"
        }
    }
}

务必确保输出的是纯净的、可解析的JSON格式，不要添加任何前缀、后缀或说明文字。
`

export default tpl;