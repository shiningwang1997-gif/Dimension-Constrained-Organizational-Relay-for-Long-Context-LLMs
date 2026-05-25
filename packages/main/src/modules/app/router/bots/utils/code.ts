// 最直接的方法，不需要LangChain的复杂解析器,也不需要解析markdown.
export function extractCodeBlocks(text: string) {
    const codeBlockRegex = /```(?:(\w+)\n)?([\s\S]*?)```/g;
    const matches = [...text.matchAll(codeBlockRegex)];

    return matches.map(match => ({
        language: match[1]?.trim() || "unknown",
        code: match[2].trim(),
        startIndex: match.index,
        endIndex: match.index! + match[0].length
    }));
}

// 提取行内代码
export function extractInlineCode(text: string) {
    const inlineRegex = /`([^`\n]+)`/g;
    const matches = [...text.matchAll(inlineRegex)];

    return matches.map(match => ({
        code: match[1].trim(),
        startIndex: match.index,
        endIndex: match.index! + match[0].length
    }));
}

// 提取所有代码
export function extractAllCode(text: string) {
    return {
        codeBlocks: extractCodeBlocks(text),
        inlineCode: extractInlineCode(text)
    };
}