
export const advCate = [
    {
        cate: "功能性优点",
        subcate: [
            "这个产品能帮用户节省多少时间/金钱？",
            "它解决了用户什么样的痛点？",
            "相比竞品，它的独特功能是什么？"
        ]
    },
    {
        cate: "情感性优点",
        subcate: [
            "使用后会让用户产生什么积极情绪？",
            "它如何提升用户的社交形象？",
            "能带来什么样的心理满足感？"
        ]
    },
    {
        cate: "体验性优点",
        subcate: [
            "第一次使用时最惊喜的感受是什么？",
            "哪个细节最能体现品质感？",
            "使用过程中最流畅的环节是什么？"
        ]
    }
]


const tpl = `你是一位资深的产品分析专家。请基于提供的产品信息，专注挖掘<%= analysis_category.cate %>，每个优点用一句话精准概括。

## 产品基础信息
- 产品名称：<%= product_name %>
- 产品类别：<%= product_category %>
- 目标用户群体：<%= target_audience %>
- 产品用途：<%= purpose %>
- 使用场合：<%= usage_scenario %>
- 产品优点：<%= product_advantages %>
- 竞品信息：<%= competitive_comparison %>
- 营销关键词: <%= marketing_keywords.join(',') %>
- 生产厂商: <%= manufacturer %>

## <%= analysis_category.cate %>分析限定
严格按照以下维度挖掘<%= analysis_category.cate %>：

<% analysis_category.subcate.forEach(function(subcate, index) { %>
<%= index + 1 %>. **<%= subcate %>**
<% }); %>

## 分析要求
1. 每个优点必须紧扣<%= analysis_category.cate %>的本质特征
2. 每个优点用一句话简洁表达，突出核心价值点
3. 从用户实际使用场景出发，确保优点的真实性
4. 优点数量控制在3-8个，确保质量
5. 针对上述<%= analysis_category.subcate.length %>个分析维度，每个维度至少挖掘1个优点

## 输出格式要求
请严格按照以下JSON数组格式输出：

[
  {
    "dimension": "这个产品能帮用户节省多少时间/金钱？",
    "advantage": "自动同步健康数据，每天为用户节省20分钟手动记录时间"
  },
  {
    "dimension": "它解决了用户什么样的痛点？",
    "advantage": "实时心率监测功能，彻底解决运动过程中无法掌控身体状态的困扰"
  },
  {
    "dimension": "相比竞品，它的独特功能是什么？",
    "advantage": "独创的睡眠质量AI分析算法，提供个性化改善建议超越同类产品"
  },
  {
    "dimension": "这个产品能帮用户节省多少时间/金钱？",
    "advantage": "一体化设计替代多个设备，为用户节省购买其他健康监测产品的费用"
  },
  {
    "dimension": "它解决了用户什么样的痛点？",
    "advantage": "防水设计支持游泳监测，解决传统设备无法全场景使用的局限性"
  }
]

每个对象要求：
- dimension字段：标明该优点属于哪个功能性维度
- advantage字段：一句话概括优点，20-30字为佳
- 突出功能性价值点，语言简洁有力
- 避免营销化词汇，专注功能本身

现在请开始分析，输出结果必须是对象数组格式的JSON。`


export default tpl