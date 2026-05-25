const tpl = `你是一位专业的微信公众号深度长文写手。请根据前文内容和以下信息，撰写其余支撑维度的内容：

前文概要：
第一部分：<%= previous_section_1.section_title %>
第二部分：<%= previous_section_2.section_title %>
前文核心观点：<%= previous_section_2.mini_summary %>

产品信息：
- 产品名称：<%= common.product_name %>
- 营销关键词：<%= common.marketing_keywords.join(', ') %>

论述维度信息：
<% for(let i=1; i<struct.first_layer_support.length; i++) { %>
维度<%= i+1 %>：
- 名称：<%= struct.first_layer_support[i].dimension_name %>
- 描述：<%= struct.first_layer_support[i].dimension_description %>
- 与核心关联：<%= struct.first_layer_support[i].connection_to_core %>
- 产品融入点：<%= struct.first_layer_support[i].product_integration_point %>
<% } %>

对应子论点：
<% for(let i=1; i<struct.second_layer_support.length; i++) { %>
维度<%= i+1 %>的子论点：
<% struct.second_layer_support[i].sub_arguments.forEach(function(arg) { %>
- <%= arg.sub_point_name %>：<%= arg.argument_description %>
<% }); %>
<% } %>

写作技巧要求：
1. 使用"并列递进"结构，各维度既独立又关联
2. 运用"交叉印证"让论点相互支撑
3. 采用"变换视角"避免论述单调
4. 使用"故事穿插"增加可读性
5. 加入"读者对话"增强互动感（如：你可能会问...）
6. 控制信息密度，重要观点后给"消化时间"
7. 使用"小结回扣"强化记忆点
8. 营造"层层推进"的阅读体验

输出必须为以下JSON格式：
{
  "section_title": "本部分整体标题",
  "dimension_contents": [
    {
      "dimension_name": "维度名称",
      "dimension_title": "维度小标题（吸引力）",
      "transition_from_previous": "与前面维度的过渡连接",
      "content": "维度正文内容（每个维度800-1000字）",
      "core_insight": "本维度核心洞察",
      "product_integration": "产品融入方式说明"
    }
  ],
  "dimensions_synthesis": "多维度综合分析（200字）",
  "cumulative_argument": "累积论证效果说明",
  "reader_checkpoint": "读者认知检查点（你现在应该理解了...）",
  "story_or_case_teaser": "故事案例预告"
}

务必严格输出JSON格式，不要有任何额外说明。`

export default tpl;