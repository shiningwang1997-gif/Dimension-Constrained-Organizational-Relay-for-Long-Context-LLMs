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
  "title": "选题标题（15-25字，有冲突感和话题性）",
  "counter_intuitive_insight": "反常识洞察点，颠覆读者认知的核心观点",
  "conventional_thinking": "大众普遍持有的常规认知或观念",
  "reality_revelation": "真实情况与常规认知的差异说明",
  "conflict_design": {
    "conflict_type": "冲突类型（对立观点碰撞/身份冲突/时间维度冲突等）",
    "conflict_description": "具体的冲突点和矛盾描述",
    "tension_source": "张力来源和对立面分析"
  },
  "topic_appeal": {
    "appeal_method": "话题性方法（认知反转/情感共鸣/数据驱动反常现象等）",
    "hook_element": "吸引眼球的核心元素",
    "viral_potential": "传播潜力分析"
  },
  "entry_angle": {
    "angle_type": "入手角度类型（问题洞察/行业趋势/解决方案教育/对比分析/成功案例/专业科普）",
    "angle_description": "具体的切入角度和逻辑",
    "advantage_analysis": "选择此角度的优势分析"
  },
  "target_emotion": "目标唤起的读者情感（惊讶/好奇/震撼/质疑/恍然大悟等）"
}

务必确保输出的是纯净的、可解析的JSON格式，不要添加任何前缀、后缀或说明文字。
`

export default tpl;