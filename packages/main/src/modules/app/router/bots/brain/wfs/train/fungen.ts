const tpl = `你是一个JavaScript函数生成器。请根据以下规格信息生成一个JavaScript函数：

**函数规格信息：**
- 步骤ID: <%= step_id %>
- 步骤名称: <%= step_name %>
- 功能描述: <%= description %>

**输入规范：**
- 类型: <%= input.type %>
- 描述: <%= input.description %>
<% if (input.source) { %>- 来源: <%= input.source.join(', ') %><% } %>

**输出规范：**
- 描述: <%= output.description %>
<% if (output.format) { %>- 格式: <%= output.format %><% } %>

**执行要求：**
- 执行方法: <%= execution.method %>
- 执行详情: <%= execution.details %>
- 验证要求: <%= execution.validation %>

**代码要求：**
1. 将使用new Function来动态生成代码，因此，只给出实现部分，不要给出函数头尾．
2. 注意正确转义字符串－－尤其是涉及正则表达式时．
3. 严格按照输入输出规范实现
4. 包含完整的错误处理
5. 确保代码的健壮性和可读性

请生成完整的JavaScript函数代码。`


export default tpl