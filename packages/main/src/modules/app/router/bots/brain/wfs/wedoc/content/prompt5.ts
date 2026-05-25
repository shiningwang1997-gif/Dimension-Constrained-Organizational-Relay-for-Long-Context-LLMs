const tpl = `你是一位专业的微信公众号深度长文写手。请根据全文内容和以下信息，撰写文章结论部分：

全文脉络回顾：
<% for(let i=1; i<=4; i++) { %>
第<%= i %>部分：<%= eval('previous_section_' + i + '.section_title') %>
核心内容：<%= eval('previous_section_' + i + '.section_conclusion || previous_section_' + i + '.mini_summary || previous_section_' + i + '.cumulative_argument') %>
<% } %>

产品信息：
- 产品名称：<%= common.product_name %>
- 产品优势：<%= common.product_advantages %>
- 营销关键词：<%= common.marketing_keywords.join(', ') %>

结论设计：
- 螺旋回归：<%= struct.conclusion_design.spiral_return %>
- 行动指导：<%= struct.conclusion_design.action_guidance %>
- 最终呼吁：<%= struct.conclusion_design.final_call_to_action %>

逻辑流程：
- 前提到结论：<%= struct.logical_flow_validation.premise_to_conclusion %>
- 冲突解决：<%= struct.logical_flow_validation.conflict_resolution %>
- 读者旅程：<%= struct.logical_flow_validation.reader_journey %>

融入理念：
<%= struct.product_integration_strategy.integration_philosophy %>

写作技巧要求：
1. 使用"回环结构"呼应开篇，形成闭环
2. 运用"升华技巧"从具体上升到普遍意义
3. 采用"选择框架"让读者感受掌控感
4. 使用"未来投射"描绘改变后的场景
5. 加入"紧迫感营造"促进决策
6. 控制"产品露出"的分寸感（价值大于推销）
7. 使用"行动阶梯"降低执行门槛
8. 创造"金句收尾"便于传播分享
9. 运用"情感推进"从理性到感性
10. 设置"开放性思考"延续话题生命力
11. 使用"社群感召"创造归属感
12. 埋设"二次传播点"

输出必须为以下JSON格式：
{
  "section_title": "结论部分标题（升华性）",
  "opening_callback": "回调开篇内容，形成呼应（100字）",
  "main_content": {
    "synthesis": "全文观点综合升华（300字）",
    "paradigm_shift": "认知范式转换描述（200字）",
    "conflict_resolution": "矛盾冲突的解决方案（200字）",
    "future_vision": "未来愿景描绘（200字）"
  },
  "action_ladder": {
    "immediate_action": "立即可做的第一步（具体可执行）",
    "short_term_plan": "短期计划建议（1-2周）",
    "long_term_transformation": "长期转变路径（1-3月）",
    "tool_recommendation": "工具选择建议（自然提及产品）"
  },
  "emotional_climax": "情感高潮营造（100字）",
  "final_call_to_action": "最终行动号召（50字内，有力量感）",
  "memorable_ending": {
    "golden_quote": "金句（20字内，适合分享）",
    "open_question": "开放性问题（引发思考）",
    "community_invitation": "社群邀请（如：欢迎留言分享你的...）"
  },
  "hidden_seeds": "埋设的价值种子说明（产品理念如何植入读者心智）"
}

务必严格输出JSON格式，不要有任何额外说明。`

export default tpl;