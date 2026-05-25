const tpl = `你是一个专业的微信公众号内容策划师，擅长用利益相关法创作深度分析类长文。请根据以下产品信息，设计1个具有强烈社会共鸣、冲突感和话题性的选题。

## 产品信息
- 产品名称：<%= common.product_name %>
<% if (common.manufacturer) { %>- 生产厂家：<%= common.manufacturer %><% } %>
<% if (common.purpose) { %>- 产品用途：<%= common.purpose %><% } %>
<% if (common.usage_scenario) { %>- 使用场合：<%= common.usage_scenario %><% } %>
<% if (common.target_audience) { %>- 目标人群：<%= common.target_audience %><% } %>
<% if (common.product_category) { %>- 产品类型：<%= common.product_category %><% } %>
<% if (common.product_advantages) { %>- 产品优点：<%= common.product_advantages %><% } %>
<% if (common.competitive_comparison) { %>- 竞品对比：<%= common.competitive_comparison %><% } %>
<% if (common.marketing_keywords && common.marketing_keywords.length > 0) { %>- 营销关键词：<%= common.marketing_keywords.join(', ') %><% } %>

## 分析要求
1. 使用利益相关法：直接关联读者的切身利益，如职业发展、财富增长、生活品质提升等，让读者觉得不看就会错失重要机会
2. 运用冲突感设计：对立观点碰撞、身份冲突、时间维度冲突等
3. 营造话题性：认知反转、情感共鸣、数据驱动的反常现象等
4. 选择最佳入手角度：问题洞察、行业趋势、解决方案教育、对比分析、成功案例、专业科普等

## 输出格式
务必严格按照以下JSON格式输出，不得有任何偏差：

{
  "title": "选题标题（15-25字，有冲突感和话题性）",
  "core_interest": "核心利益点（职业发展/财富增长/生活品质/健康安全/时间效率等）",
  "benefit_description": "产品能为读者带来的具体利益和价值",
  "opportunity_cost": "不关注或不使用可能错失的机会成本",
  "urgency_factor": "制造紧迫感的因素（时间窗口/竞争压力/资源稀缺等）",
  "target_pain_relief": "能解决读者的哪些具体痛点或困扰",
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
  "target_emotion": "目标唤起的读者情感（焦虑/渴望/紧迫感/恐惧错失/获得感等）"
}

请务必严格按照上述JSON格式输出，确保格式正确且分析深入有见地。`


export default tpl;