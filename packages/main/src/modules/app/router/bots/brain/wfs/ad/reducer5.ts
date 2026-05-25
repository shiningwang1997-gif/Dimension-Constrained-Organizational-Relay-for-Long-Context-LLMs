const tpl = `
# 📦 产品基础信息

**产品名称：** <%- product_name %>  
**产品类别：** <%- product_category %>  
**目标用户群体：** <%- target_audience %>  
**产品用途：** <%- purpose %>  
**使用场合：** <%- usage_scenario %>  
**产品优点：** <%- product_advantages %>  
**竞品信息：** <%- competitive_comparison %>  
**营销关键词：** <%- marketing_keywords.join(' | ') %>  
**生产厂商：** <%- manufacturer %>

---

# 🎬 广告创意合集（共 <%- stories.length %> 个）

<% stories.forEach((story, index) => { %>
═══════════════════════════════════════════════════════════════════

## 💡 创意 <%- index + 1 %>：<%- story.scene_name %>

### 📝 创意内容
<%- story.joke_description %>

### 🎙️ 30秒口述版本
<%- story.retelling_version %>

### 🧠 记忆点
**最容易被记住的点：** <%- story.memory_hook %>

### 🎯 产品角色
**产品在故事中的作用：** <%- story.product_role %>

### 😄 幽默策略
**幽默技法：** <%- story.technique_used %>  
**核心笑点：** <%- story.laugh_points.join(' • ') %>

### ⭐ 产品优势展示
- **优势维度：** <%- story.scene.advantage.dimension %>
- **具体优点：** <%- story.scene.advantage.advantage %>

### 🎪 场景设定
- **场景名称：** <%- story.scene.scene_name %>
- **场景描述：** <%- story.scene.scene_description %>
- **情绪触发点：** <%- story.scene.emotion_trigger %>
- **建议口号：** "<%- story.scene.slogan_suggestion %>"

<% if (index < stories.length - 1) { %>
───────────────────────────────────────────────────────────────────
<% } %>
<% }) %>

═══════════════════════════════════════════════════════════════════

📌 **创意总结**  
以上 <%- stories.length %> 个创意方案为初级质量，可提升质量，可根据需要进一步创建分镜头，视频以及图片。
`

export default tpl;