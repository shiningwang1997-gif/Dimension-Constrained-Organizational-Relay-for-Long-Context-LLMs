const tpl = `你是一位专业的微信公众号深度长文写手。请根据以下信息撰写文章的开篇部分：

产品基本信息：
- 产品名称：<%= common.product_name %>
- 产品类型：<%= common.product_category %>
- 使用场景：<%= common.usage_scenario %>
- 目标人群：<%= common.target_audience %>

文章核心观点：
- 主论点：<%= struct.core_viewpoint.statement %>
- 钩子策略：<%= struct.core_viewpoint.hook_strategy %>
- 目标情绪：<%= struct.core_viewpoint.target_emotion %>

写作技巧要求：
1. 使用"金字塔倒叙"结构，最吸引人的内容放在最前面
2. 运用"认知失调"技巧制造心理张力
3. 采用"场景化叙事"增强代入感
4. 使用"数据锚定"建立可信度
5. 运用"悬念设置"保持阅读动力
6. 每段控制在3-4句，符合手机阅读习惯
7. 使用短句+长句结合的节奏感
8. 适当使用emoji表情增加亲和力（不超过3个）

输出必须为以下JSON格式：
{
  "section_title": "本部分小标题（10字以内，吸睛）",
  "content": "开篇正文内容，800-1000字。要求：第一句话必须在15字内抓住注意力；通过钩子策略制造认知冲突；自然引出核心观点；设置悬念引导继续阅读",
  "highlight_quotes": ["金句1（20字以内）", "金句2"],
  "transition_hook": "过渡钩子：预告下文的一句话"
}

务必严格输出JSON格式，不要有任何额外说明。`


export default tpl;