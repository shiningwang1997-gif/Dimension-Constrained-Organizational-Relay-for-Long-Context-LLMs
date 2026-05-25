const tpl = `你是一个专业的微信公众号内容策划师，擅长用身份认同法创作深度分析类长文。请根据以下产品信息，设计1个具有强烈社会共鸣、冲突感和话题性的选题。

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
1. 使用身份认同法：将产品用户群体特征放大为身份标签或生活方式，让读者对号入座并产生身份向往
2. 运用冲突感设计：对立观点碰撞、身份冲突、时间维度冲突等
3. 营造话题性：认知反转、情感共鸣、数据驱动的反常现象等
4. 选择最佳入手角度：问题洞察、行业趋势、解决方案教育、对比分析、成功案例、专业科普等

## 输出格式
务必严格按照以下JSON格式输出，不得有任何偏差：

{
  "title": "选题标题（15-25字，有冲突感和话题性）",
  "identity_label": "核心身份标签（如精英人群、新中产、都市白领、极简主义者等）",
  "lifestyle_philosophy": "这一身份群体代表的生活方式或价值理念",
  "identity_aspiration": "读者对这一身份的向往点和认同动机",
  "group_characteristics": "该身份群体的典型特征和行为模式",
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
  "target_emotion": "目标唤起的读者情感（向往/认同/自豪/归属感/优越感等）"
}

请务必严格按照上述JSON格式输出，确保格式正确且分析深入有见地。`

export default tpl;