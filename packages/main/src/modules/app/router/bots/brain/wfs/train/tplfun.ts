
const tpl = `
请分析以下函数规格，判断其实现可行性并以JSON格式返回结果。

**函数名称**: <%=step_name%>
**功能描述**: <%=description%>

**输入规格**:
- 类型: <%=input.type%>
- 描述: <%=input.description%>
- 数据源: <%=input.source%>

**输出规格**:
- 类型: <%=output.type%>
- 描述: <%=output.description%>
- 格式: <%=output.format%>

**执行方法**:
- 实现方式: <%=execution.method%>
- 具体细节: <%=execution.details%>
- 验证要求: <%=execution.validation%>

## 分析要求

请从以下维度分析该函数的实现可行性：

1. **技术可行性**: 基于描述和执行方法，判断功能是否可以实现
2. **实现方式**: 确定最适合的实现方法（js代码/提示词/不支持）
3. **依赖分析**: 识别所需的库、工具或资源，使用Javascript来实现．
4. **限制因素**: 识别可能的技术限制或不支持的情况

## 返回格式

请严格按照以下JSON格式返回分析结果：

\`\`\`json
{
  "feasible": boolean,
  "implementation_method": "code|prompt|unsupported",
  "confidence": number,
  "analysis": {
    "can_implement": boolean,
    "reasoning": "详细说明可行性分析过程",
    "complexity": "low|medium|high",
    "estimated_effort": "描述预估的实现工作量"
  },
  "implementation_details": {
    "approach": "具体的实现方法或策略",
    "key_technologies": ["所需的关键技术或方法"],
    "potential_challenges": ["可能遇到的技术挑战"]
  },
  "dependencies": {
    "required_libraries": ["如果需要代码实现，列出必需的库"],
    "external_apis": ["如果需要外部API，列出具体API"],
    "missing_components": ["当前不支持或缺失的组件"]
  },
  "recommendations": {
    "preferred_method": "推荐的实现方式",
    "alternative_approaches": ["备选方案"],
    "optimization_suggestions": ["优化建议"]
  }
}
\`\`\`
`

export default tpl;