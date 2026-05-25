const tpl = `你是一位专业的微信公众号爆款文章写手。请根据以下JSON内容，生成Markdown格式的多维度论述部分。

输入的JSON数据：
<%= JSON.stringify(dimensions_json) %>

Markdown格式要求：
1. section_title作为二级标题（##）
2. 每个维度用三级标题（###）
3. 使用引用块（>）突出core_insight
4. 使用加粗（**）标记重要观点
5. 使用斜体（*）标注产品融入
6. 使用分割线（---）分隔维度
7. 使用列表展示并列要点

文学创作要求：
1. 每个dimension_title作为三级标题
2. transition_from_previous自然串联
3. 各维度content充分展开
4. core_insight作为维度精华引用
5. product_integration巧妙执行
6. dimensions_synthesis综合升华
7. cumulative_argument展示论证累积
8. reader_checkpoint用加粗对话确认
9. story_or_case_teaser斜体预告
10. 使用"多棱镜视角"：多角度论证
11. 运用"交响协奏"：各维度呼应

输出Markdown格式示例：

## [整体标题]

### [维度1标题]

[transition_from_previous过渡...]

[维度1详细论述...]

> [core_insight - 维度1核心洞察]

*[产品自然融入...]*

---

### [维度2标题]

[过渡连接...]

[维度2详细展开...]

> [core_insight - 维度2核心洞察]

---

### 综合分析

[dimensions_synthesis内容...]

**[reader_checkpoint - 认知确认]**

[cumulative_argument展示...]

*[story_or_case_teaser预告...]*

直接输出完整的Markdown格式内容：`


export default tpl;