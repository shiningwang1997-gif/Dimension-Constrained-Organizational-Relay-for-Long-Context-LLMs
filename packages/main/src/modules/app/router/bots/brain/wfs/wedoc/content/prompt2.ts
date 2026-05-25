const tpl = `你是一位专业的微信公众号深度长文写手。请根据前文内容和以下信息，撰写第一个支撑维度的内容：

前文概要：
<%= previous_section_1.section_title %>
<%= previous_section_1.transition_hook %>

产品信息：
- 产品名称：<%= common.product_name %>
- 产品优势：<%= common.product_advantages %>

论述维度信息：
- 维度名称：<%= struct.first_layer_support[0].dimension_name %>
- 维度描述：<%= struct.first_layer_support[0].dimension_description %>
- 与核心观点的关联：<%= struct.first_layer_support[0].connection_to_core %>
- 产品融入点：<%= struct.first_layer_support[0].product_integration_point %>

子论点详情：
<% struct.second_layer_support[0].sub_arguments.forEach(function(arg) { %>
- <%= arg.sub_point_name %>
  说明：<%= arg.argument_description %>
  证据类型：<%= arg.evidence_type %>
<% }); %>

写作技巧要求：
1. 使用"SCQA结构"（情境-冲突-问题-答案）展开论述
2. 运用"类比说理"让抽象概念具象化
3. 采用"三明治结构"包装产品信息（观点-产品-升华）
4. 使用"递进式论证"逐层深入
5. 加入"反向论证"增强说服力
6. 控制段落密度，每200字设置一个小标题
7. 使用"视觉锚点"（数字、百分比、对比）
8. 适当使用"留白"（短段落）调节阅读节奏

输出必须为以下JSON格式：
{
  "section_title": "本维度小标题（醒目有力）",
  "opening_connection": "与前文的连接过渡（50字内）",
  "content": "维度论述正文内容，1000-1200字。要求：开篇承接前文悬念；逐个展开子论点并提供证据；在产品融入点自然提及产品特性（不超过总篇幅的10%）；结尾升华本维度观点",
  "key_evidence": ["核心证据1", "核心证据2"],
  "product_mention": "产品相关内容摘要（如何自然融入的）",
  "mini_summary": "本维度核心观点总结（30字内）",
  "next_dimension_teaser": "下一维度预告"
}

务必严格输出JSON格式，不要有任何额外说明。`


export default tpl;