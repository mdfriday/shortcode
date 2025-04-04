/**
 * 分步渲染示例
 * 演示如何使用 stepRender 功能解决 Markdown 解析与 Shortcode 的冲突问题
 */

const { ShortcodeRenderer, PageRenderer } = require('../dist');
const fs = require('fs');
const path = require('path');

// 假设我们使用一个简单的 Markdown 渲染库
// 在实际使用中，这可能是 marked、markdown-it 等
const simulateMarkdownRender = (content) => {
    // 这只是一个简化的模拟实现
    return content
        .replace(/^#\s+(.*?)$/gm, '<h1>$1</h1>')
        .replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>')
        .replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
};

// 创建 Shortcode 渲染器和注册 shortcodes
const shortcodeRenderer = new ShortcodeRenderer();

// 注册代码高亮 shortcode
shortcodeRenderer.registerShortcode('highlight', (params, content) => {
    const lang = params[0] || 'text';
    return `<pre><code class="language-${lang}">${content}</code></pre>`;
});

// 注册链接 shortcode
shortcodeRenderer.registerShortcode('link', (params) => {
    const url = params[0] || '#';
    const text = params[1] || url;
    return `<a href="${url}">${text}</a>`;
});

// 注册提示框 shortcode
shortcodeRenderer.registerShortcode('notice', (params, content) => {
    const type = params[0] || 'info';
    return `<div class="notice notice-${type}">${content}</div>`;
});

// 创建页面渲染器
const pageRenderer = new PageRenderer(shortcodeRenderer);

// 示例内容（混合了 Markdown 和 Shortcode）
const content = `
# Markdown 与 Shortcode 混合使用示例

这是一篇**包含 Shortcode** 的 Markdown 文档。

{{< notice info >}}
这是一个信息提示框，它包含一些 *Markdown* 格式文本和 {{< link "https://example.com" "一个链接" >}}。
{{< /notice >}}

## 代码示例

下面是一段 JavaScript 代码：

{{< highlight javascript >}}
function example() {
    // 这里的大括号在普通渲染流程中可能会与 Shortcode 解析冲突
    if (condition) {
        console.log("Hello, world!");
    }
    return {
        key: "value"
    };
}
{{< /highlight >}}

更多信息请参考 {{< link "https://example.com/docs" "文档" >}}。
`;

// 1. 常规渲染方式（可能导致问题）
console.log('1. 常规渲染方式结果：');
console.log('------------------------');
try {
    // 先用 Markdown 解析器渲染
    const markdownRendered = simulateMarkdownRender(content);
    
    // 然后尝试渲染 Shortcode (在实际场景中，这会失败，因为 Markdown 已经改变了 Shortcode 的结构)
    // 这里只是为了演示，实际上不会这样使用
    console.log(markdownRendered);
    console.log('注意：实际场景中，这种方式会导致 Shortcode 解析失败，因为 Markdown 渲染已经改变了 Shortcode 的格式');
} catch (error) {
    console.error('常规方式出错:', error.message);
}

console.log('\n\n');

// 2. 分步渲染方式
console.log('2. 分步渲染方式结果：');
console.log('------------------------');

// 第一步：用 Shortcode 渲染器将 shortcode 替换为占位符
const stepOneResult = pageRenderer.render(content, { stepRender: true });
console.log('第一步 - Shortcode 替换为占位符的结果：');
console.log(stepOneResult.content);

console.log('\n');

// 第二步：用 Markdown 渲染器处理内容
const markdownRendered = simulateMarkdownRender(stepOneResult.content);
console.log('第二步 - Markdown 渲染结果（占位符保持不变）：');
console.log(markdownRendered);

console.log('\n');

// 第三步：用 Shortcode 渲染器渲染占位符
const finalResult = pageRenderer.finalRender(markdownRendered);
console.log('第三步 - 最终渲染结果：');
console.log(finalResult);

// 将结果写入文件以便查看
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

fs.writeFileSync(
    path.join(outputDir, 'step-render-result.html'),
    `<!DOCTYPE html>
<html>
<head>
    <title>分步渲染示例结果</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
        h1, h2, h3 { color: #333; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        code { font-family: 'Courier New', monospace; }
        .notice { padding: 15px; margin: 15px 0; border-radius: 5px; }
        .notice-info { background-color: #e8f4fd; border-left: 5px solid #3498db; }
        .notice-warning { background-color: #fcf8e3; border-left: 5px solid #f39c12; }
        .notice-danger { background-color: #f2dede; border-left: 5px solid #e74c3c; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>分步渲染示例结果</h1>
    <hr>
    ${finalResult}
</body>
</html>`
);

console.log(`\n结果已保存到: ${path.join(outputDir, 'step-render-result.html')}`); 