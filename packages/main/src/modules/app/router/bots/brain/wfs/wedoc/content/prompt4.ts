const tpl = `你是一位专业的微信公众号深度长文写手。请根据前文内容和以下信息，撰写故事案例和数据支撑部分：

前文脉络：
<% for(let i=1; i<=3; i++) { %>
第<%= i %>部分：<%= eval('previous_section_' + i + '.section_title') %>
<% } %>
已建立的核心论点：<%= previous_section_3.cumulative_argument %>

产品信息：
- 产品名称：<%= common.product_name %>
- 使用场景：<%= common.usage_scenario %>
- 竞品对比：<%= common.competitive_comparison %>

支撑素材：
故事元素：
<% struct.third_layer_support.story_elements.forEach(function(story) { %>
- <%= story %>
<% }); %>

数据需求：
<% struct.third_layer_support.data_requirements.forEach(function(data) { %>
- <%= data %>
<% }); %>

用户见证：
<% struct.third_layer_support.user_testimonials.forEach(function(testimonial) { %>
- <%= testimonial %>
<% }); %>

专家观点：
<% struct.third_layer_support.expert_opinions.forEach(function(opinion) { %>
- <%= opinion %>
<% }); %>

产品融入时机：
<% struct.product_integration_strategy.key_integration_moments.forEach(function(moment) { %>
- <%= moment.moment_description %>：<%= moment.integration_method %>
<% }); %>

写作技巧要求：
1. 使用"故事弧线"（起承转合）构建叙事张力
2. 运用"细节描写"增强真实感和画面感
3. 采用"数据可视化描述"（不是图表，而是文字呈现）
4. 使用"对比反差"突出变化效果
5. 加入"情感共鸣点"触动读者
6. 控制"专家引用"频率，避免说教感
7. 使用"用户语言"而非"产品语言"
8. 创造"记忆锚点"（难忘的细节或数据）
9. 运用"高潮-缓冲"节奏控制
10. 埋设"价值认同"的种子

输出必须为以下JSON格式：
{
  "section_title": "本部分标题（故事性）",
  "opening_transition": "承接前文的过渡（100字内）",
  "main_story": {
    "story_title": "主故事标题",
    "story_content": "完整故事叙述（600-800字），包含背景、冲突、转折、结果",
    "story_moral": "故事寓意提炼"
  },
  "supporting_data": {
    "data_narrative": "数据故事化呈现（300-400字）",
    "key_numbers": ["关键数字1", "关键数字2"],
    "data_insight": "数据背后的洞察"
  },
  "expert_validation": {
    "expert_quotes": "专家观点引用（200字内）",
    "authority_building": "权威性构建"
  },
  "user_testimonial_integration": "用户见证自然融入（200字）",
  "product_value_emergence": "产品价值自然浮现的描述",
  "emotional_peak": "情感高潮点营造",
  "section_conclusion": "本部分结论（50字内）",
  "final_section_preview": "最后部分预告"
}

务必严格输出JSON格式，不要有任何额外说明。`

export default tpl;