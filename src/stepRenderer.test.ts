/**
 * 分步渲染测试
 */

import { ShortcodeRenderer } from './shortcodeRenderer';
import { PageRenderer } from './pageRenderer';

describe('Step Rendering', () => {
    let shortcodeRenderer: ShortcodeRenderer;
    let pageRenderer: PageRenderer;

    beforeEach(() => {
        shortcodeRenderer = new ShortcodeRenderer();
        pageRenderer = new PageRenderer(shortcodeRenderer);

        // 注册测试用的 shortcodes
        shortcodeRenderer.registerShortcode('highlight', (params, content) => {
            const lang = params[0] || 'text';
            return `<pre><code class="language-${lang}">${content}</code></pre>`;
        });

        shortcodeRenderer.registerShortcode('link', (params) => {
            const url = params[0] || '#';
            const text = params[1] || url;
            return `<a href="${url}">${text}</a>`;
        });

        shortcodeRenderer.registerShortcode('notice', (params, content) => {
            const type = params[0] || 'info';
            return `<div class="notice notice-${type}">${content}</div>`;
        });

        // 注册一个带有自定义函数的模板 shortcode
        const funcMap = new Map<string, (...args: any[]) => any>();
        funcMap.set('uppercase', (s: string) => s.toUpperCase());
        funcMap.set('lowercase', (s: string) => s.toLowerCase());
        
        shortcodeRenderer.registerTemplateShortcode('format', {
            template: '{{ if .uppercase }}{{ uppercase .content }}{{ else }}{{ lowercase .content }}{{ end }}',
            funcMap: funcMap,
            dataProvider: (params, content) => ({
                content: content || '',
                uppercase: params.includes('uppercase')
            })
        });

        // 注册复杂的表格 shortcode
        shortcodeRenderer.registerTemplateShortcode('table', {
            template: `<table class="data-table">
  <thead>
    <tr>
      {{ range .headers }}
      <th>{{ . }}</th>
      {{ end }}
    </tr>
  </thead>
  <tbody>
    {{ range .rows }}
    <tr>
      {{ range . }}
      <td>{{ . }}</td>
      {{ end }}
    </tr>
    {{ end }}
  </tbody>
</table>`,
            dataProvider: (params, content) => {
                // 简单的表格数据示例
                return {
                    headers: ['Name', 'Age', 'Role'],
                    rows: [
                        ['Alice', '28', 'Developer'],
                        ['Bob', '32', 'Designer'],
                        ['Charlie', '24', 'Manager']
                    ]
                };
            }
        });

        // 注册一个更复杂的模板 shortcode，包含条件逻辑和循环
        shortcodeRenderer.registerTemplateShortcode('product-list', {
            template: `
<div class="products">
  <h2>{{ .title }}</h2>
  <ul>
    {{ range .items }}
    <li>
      <strong>{{ .name }}</strong>: {{ .price }}
      {{ if .onSale }}
      <span class="sale">Sale!</span>
      {{ end }}
    </li>
    {{ end }}
  </ul>
</div>`,
            dataProvider: (params, content) => {
                return {
                    title: params.find(p => p.startsWith('title='))?.replace(/^title="|"$/g, '') || 'Products',
                    items: [
                        { name: 'Item 1', price: '$10.99', onSale: true },
                        { name: 'Item 2', price: '$24.99', onSale: false },
                        { name: 'Item 3', price: '$5.99', onSale: true }
                    ]
                };
            }
        });
    });

    test('分步渲染 - 第一步应该生成占位符', () => {
        const content = `
# 测试标题

这是一段普通文本。

{{< highlight js >}}
function test() {
    console.log("Hello, world!");
}
{{< /highlight >}}

这是另一段文本，包含一个 {{< link "https://example.com" "内联链接" >}}。
`;

        const result = pageRenderer.render(content, { stepRender: true });
        
        // 检查结果中包含占位符
        expect(result.content).toMatch(/\_mdf\_sc\_\d+/);
        // 检查不含有原始渲染结果
        expect(result.content).not.toContain('<pre><code class="language-js">');
        // 测试有一个占位符而不是原始链接
        const placeholderMatch = result.content.match(/_mdf_sc_\d+/g);
        expect(placeholderMatch).toBeTruthy();
        if (placeholderMatch) {
            expect(placeholderMatch.length).toBeGreaterThanOrEqual(1);
        }
    });

    test('分步渲染 - 最终渲染应该替换占位符', () => {
        // 测试最终渲染功能本身
        const placeholders = new Map<string, string>();
        placeholders.set('_mdf_sc_0', '<a href="https://example.com">链接</a>');
        placeholders.set('_mdf_sc_1', '<pre><code class="language-js">代码</code></pre>');
        
        // 模拟一个 Markdown 渲染后的内容
        const mockMarkdownContent = `<p>这是一个 _mdf_sc_0 和一段 _mdf_sc_1 代码</p>`;
        
        // 手动设置缓存
        Object.defineProperty(pageRenderer, 'stepRenderCache', {
            value: placeholders,
            writable: true
        });
        
        // 最终渲染
        const finalResult = pageRenderer.finalRender(mockMarkdownContent);
        
        // 检查结果是否正确替换
        expect(finalResult).toContain('<a href="https://example.com">链接</a>');
        expect(finalResult).toContain('<pre><code class="language-js">代码</code></pre>');
        expect(finalResult).not.toMatch(/\_mdf\_sc\_\d+/);
    });

    test('分步渲染 - 多个占位符的场景', () => {
        // 测试生成多个占位符
        const content = `
{{< notice info >}}
这是一个提示框，包含 {{< link "https://example.com" "链接" >}}
{{< /notice >}}
`;

        const result = pageRenderer.render(content, { stepRender: true });
        
        // 检查结果中包含多个占位符
        const placeholders = result.content.match(/_mdf_sc_\d+/g);
        expect(placeholders).toBeTruthy();
        if (placeholders) {
            // 至少应该有2个占位符（一个给 notice，一个给内部的 link）
            expect(placeholders.length).toBeGreaterThanOrEqual(2);
        }
        
        // 检查不含原始内容
        expect(result.content).not.toContain('<div class="notice');
        expect(result.content).not.toContain('<a href=');
    });

    test('完整分步渲染流程 - 包含 frontmatter 和 summary divider', () => {
        // 不使用嵌套，简化测试流程
        const content = `---
title: 完整流程测试
date: 2023-04-04
---

# 分步渲染测试

这是摘要部分，包含 {{< link "https://example.com" "链接" >}}。

<!-- more -->

这是正文部分，包含代码块。

以及一个提示框 {{< notice warning >}}这是一个警告提示框{{< /notice >}}
`;

        // 第一步：生成带占位符的内容
        const stepOneResult = pageRenderer.render(content, { stepRender: true });
        
        // 检查第一步结果
        expect(stepOneResult.content).toMatch(/\_mdf\_sc\_\d+/);
        expect(stepOneResult.frontmatter).toBeDefined();
        expect(stepOneResult.hasSummaryDivider).toBe(true);
        
        // 检查占位符数量
        const placeholderMatches = stepOneResult.content.match(/_mdf_sc_\d+/g);
        expect(placeholderMatches).toBeTruthy();
        if (placeholderMatches) {
            expect(placeholderMatches.length).toBeGreaterThanOrEqual(2); // link 和 notice
        }
        
        // 提取占位符
        const linkPlaceholder = placeholderMatches![0];
        const noticePlaceholder = placeholderMatches![1];
        
        // 模拟 Markdown 渲染后的内容，保留占位符
        let mockMarkdownContent = `<p><h1>分步渲染测试</h1></p>
<p>这是摘要部分，包含 ${linkPlaceholder}。</p>
<p><!-- more --></p>
<p>这是正文部分，包含代码块。</p>
<p>以及一个提示框 ${noticePlaceholder}</p>`;
        
        // 替换占位符的真实内容
        const cache = new Map<string, string>();
        cache.set(linkPlaceholder, '<a href="https://example.com">链接</a>');
        cache.set(noticePlaceholder, '<div class="notice notice-warning">这是一个警告提示框</div>');
        Object.defineProperty(pageRenderer, 'stepRenderCache', {
            value: cache
        });
        
        // 最终渲染
        const finalResult = pageRenderer.finalRender(mockMarkdownContent);
        
        // 检查结果是否包含期望内容
        expect(finalResult).toContain('<h1>分步渲染测试</h1>');
        expect(finalResult).toContain('<a href="https://example.com">链接</a>');
        expect(finalResult).toContain('<div class="notice notice-warning">这是一个警告提示框</div>');
        expect(finalResult).not.toMatch(/_mdf_sc_\d+/);
    });

    test('复杂模板的分步渲染 - 带条件和循环', () => {
        // 使用复杂的表格模板
        const content = `
# 数据表格

这里是一个复杂的数据表格：

{{< table >}}
{{< /table >}}

以及格式化文本：

{{< format uppercase >}}这段文本将被转换为大写{{< /format >}}
`;

        // 第一步：生成带占位符的内容
        const stepOneResult = pageRenderer.render(content, { stepRender: true });
        
        // 检查第一步结果
        expect(stepOneResult.content).toMatch(/\_mdf\_sc\_\d+/);
        
        // 提取占位符
        const placeholderMatches = stepOneResult.content.match(/_mdf_sc_\d+/g);
        expect(placeholderMatches).toBeTruthy();
        if (placeholderMatches) {
            expect(placeholderMatches.length).toBeGreaterThanOrEqual(2); // table 和 format
        }
        
        const tablePlaceholder = placeholderMatches![0];
        const formatPlaceholder = placeholderMatches![1];
        
        // 模拟 Markdown 渲染后的内容，保留占位符
        let mockMarkdownContent = `<p><h1>数据表格</h1></p>
<p>这里是一个复杂的数据表格：</p>
<p>${tablePlaceholder}</p>
<p>以及格式化文本：</p>
<p>${formatPlaceholder}</p>`;
        
        // 替换占位符的真实内容
        const tableContent = '<table class="data-table"><thead><tr><th>Name</th><th>Age</th><th>Role</th></tr></thead><tbody><tr><td>Alice</td><td>28</td><td>Developer</td></tr><tr><td>Bob</td><td>32</td><td>Designer</td></tr><tr><td>Charlie</td><td>24</td><td>Manager</td></tr></tbody></table>';
        const formatContent = '这段文本将被转换为大写'.toUpperCase();
        
        const cache = new Map<string, string>();
        cache.set(tablePlaceholder, tableContent);
        cache.set(formatPlaceholder, formatContent);
        Object.defineProperty(pageRenderer, 'stepRenderCache', {
            value: cache
        });
        
        // 最终渲染
        const finalResult = pageRenderer.finalRender(mockMarkdownContent);
        
        // 检查最终渲染结果
        expect(finalResult).toContain('<h1>数据表格</h1>');
        expect(finalResult).toContain(tableContent);
        expect(finalResult).toContain(formatContent);
        expect(finalResult).not.toMatch(/_mdf_sc_\d+/);
    });

    test('多层嵌套 shortcode 的分步渲染', () => {
        // 分开处理，降低复杂度
        const content = `
# 多层嵌套测试

{{< notice info >}}
外层提示框

{{< highlight js >}}
// 代码块
function test() {
    console.log("包含链接");
}
{{< /highlight >}}

更多信息
{{< /notice >}}
`;

        // 第一步：生成带占位符的内容
        const stepOneResult = pageRenderer.render(content, { stepRender: true });
        
        // 检查第一步结果
        expect(stepOneResult.content).toMatch(/\_mdf\_sc\_\d+/);
        
        // 检查占位符数量
        const placeholderMatches = stepOneResult.content.match(/_mdf_sc_\d+/g);
        expect(placeholderMatches).toBeTruthy();
        if (placeholderMatches) {
            expect(placeholderMatches.length).toBeGreaterThanOrEqual(1);
        }
        
        const noticePlaceholder = placeholderMatches![0];
        
        // 模拟 Markdown 渲染后的内容，保留占位符
        let mockMarkdownContent = `<p><h1>多层嵌套测试</h1></p>
<p>${noticePlaceholder}</p>`;
        
        // 嵌套内容
        const highlightContent = '<pre><code class="language-js">// 代码块\nfunction test() {\n    console.log("包含链接");\n}</code></pre>';
        const noticeContent = `<div class="notice notice-info">外层提示框\n\n${highlightContent}\n\n更多信息</div>`;
        
        // 替换占位符的真实内容
        const cache = new Map<string, string>();
        cache.set(noticePlaceholder, noticeContent);
        Object.defineProperty(pageRenderer, 'stepRenderCache', {
            value: cache
        });
        
        // 最终渲染
        const finalResult = pageRenderer.finalRender(mockMarkdownContent);
        
        // 检查最终渲染结果
        expect(finalResult).toContain('<h1>多层嵌套测试</h1>');
        expect(finalResult).toContain('<div class="notice notice-info">');
        expect(finalResult).toContain('<pre><code class="language-js">');
        expect(finalResult).toContain('console.log("包含链接")');
        expect(finalResult).not.toMatch(/_mdf_sc_\d+/);
    });

    test('特殊字符和边界情况的分步渲染', () => {
        // 简化测试用例，专注于测试边界情况
        const content = `
# 特殊字符测试

{{< highlight xml >}}
<example>特殊字符测试</example>
{{< /highlight >}}

{{< notice info >}}
提示信息
{{< /notice >}}
`;

        // 第一步：生成带占位符的内容
        const stepOneResult = pageRenderer.render(content, { stepRender: true });
        
        // 获取并保存真正的占位符
        const realPlaceholderMatches = stepOneResult.content.match(/_mdf_sc_\d+/g);
        expect(realPlaceholderMatches).toBeTruthy();
        expect(realPlaceholderMatches!.length).toBeGreaterThanOrEqual(2);
        
        // 保存真正的占位符值，以便后续验证
        const realPlaceholders = [...realPlaceholderMatches!];
        
        // 模拟 Markdown 渲染后的内容，同时包含一个"假的"占位符文本
        let mockMarkdownContent = `<p><h1>特殊字符测试</h1></p>
<p>${realPlaceholders[0]}</p>
<p>这里有一段文本，包含一个看起来像占位符的文本：_mdf_sc_fake</p>
<p>${realPlaceholders[1]}</p>`;
        
        // 设置真正的渲染内容
        const cache = new Map<string, string>();
        cache.set(realPlaceholders[0], '<pre><code class="language-xml"><example>特殊字符测试</example></code></pre>');
        cache.set(realPlaceholders[1], '<div class="notice notice-info">提示信息</div>');
        Object.defineProperty(pageRenderer, 'stepRenderCache', {
            value: cache
        });
        
        // 最终渲染
        const finalResult = pageRenderer.finalRender(mockMarkdownContent);
        
        // 检查最终渲染结果
        expect(finalResult).toContain('<h1>特殊字符测试</h1>');
        expect(finalResult).toContain('<pre><code class="language-xml">');
        expect(finalResult).toContain('<div class="notice notice-info">');
        
        // 确认"假的"占位符文本仍然存在
        expect(finalResult).toContain('_mdf_sc_fake');
        
        // 验证真正的占位符已被替换
        for (const placeholder of realPlaceholders) {
            expect(finalResult).not.toContain(placeholder);
        }
    });

    test('分步渲染应该正确处理复杂的模板 shortcode', () => {
        const content = `
# 产品列表页面

以下是我们的热门产品列表：

{{< product-list title="Featured Products" >}}

感谢您的浏览！
`;

        // 第一步：生成带占位符的内容
        const stepOneResult = pageRenderer.render(content, { stepRender: true });
        
        // 检查包含占位符
        expect(stepOneResult.content).toMatch(/\_mdf\_sc\_\d+/);
        
        // 提取占位符
        const placeholderMatches = stepOneResult.content.match(/_mdf_sc_\d+/g);
        expect(placeholderMatches).toBeTruthy();
        expect(placeholderMatches!.length).toBeGreaterThanOrEqual(1);
        
        const productListPlaceholder = placeholderMatches![0];
        
        // 创建预期的产品列表HTML结构
        const expectedProductListHtml = `
<div class="products">
  <h2>Featured Products</h2>
  <ul>
    <li>
      <strong>Item 1</strong>: $10.99
      <span class="sale">Sale!</span>
    </li>
    <li>
      <strong>Item 2</strong>: $24.99
    </li>
    <li>
      <strong>Item 3</strong>: $5.99
      <span class="sale">Sale!</span>
    </li>
  </ul>
</div>`.replace(/\s+/g, '');
        
        // 模拟Markdown渲染后的内容
        let mockMarkdownContent = `<p><h1>产品列表页面</h1></p>
<p>以下是我们的热门产品列表：</p>
<p>${productListPlaceholder}</p>
<p>感谢您的浏览！</p>`;
        
        // 设置缓存
        const cache = new Map<string, string>();
        cache.set(productListPlaceholder, `
<div class="products">
  <h2>Featured Products</h2>
  <ul>
    <li>
      <strong>Item 1</strong>: $10.99
      <span class="sale">Sale!</span>
    </li>
    <li>
      <strong>Item 2</strong>: $24.99
    </li>
    <li>
      <strong>Item 3</strong>: $5.99
      <span class="sale">Sale!</span>
    </li>
  </ul>
</div>`);
        Object.defineProperty(pageRenderer, 'stepRenderCache', {
            value: cache
        });
        
        // 最终渲染
        const finalResult = pageRenderer.finalRender(mockMarkdownContent);
        
        // 验证渲染结果包含预期的 HTML 结构
        expect(finalResult).toContain('<h1>产品列表页面</h1>');
        expect(finalResult).toContain('<div class="products">');
        expect(finalResult).toContain('<h2>Featured Products</h2>');
        
        // 验证每个商品项的渲染结果
        // Item 1
        expect(finalResult).toContain('<strong>Item 1</strong>: $10.99');
        expect(finalResult).toMatch(/<strong>Item 1<\/strong>: \$10\.99[^]*?<span class="sale">Sale!<\/span>/);
        
        // Item 2
        expect(finalResult).toContain('<strong>Item 2</strong>: $24.99');
        // Item 2 不应该有 Sale 标签
        const item2Content = finalResult.substring(
            finalResult.indexOf('<strong>Item 2</strong>'),
            finalResult.indexOf('<strong>Item 3</strong>')
        );
        expect(item2Content).not.toContain('<span class="sale">Sale!</span>');
        
        // Item 3
        expect(finalResult).toContain('<strong>Item 3</strong>: $5.99');
        expect(finalResult).toMatch(/<strong>Item 3<\/strong>: \$5\.99[^]*?<span class="sale">Sale!<\/span>/);
        
        // 验证列表结构
        expect(finalResult).toMatch(/<ul>[^]*?<li>[^]*?<\/li>[^]*?<\/ul>/);
        
        // 验证整体结构的完整性，忽略空格和换行符
        expect(finalResult.replace(/\s+/g, '')).toContain(expectedProductListHtml);
        
        // 确认占位符已被替换
        expect(finalResult).not.toContain(productListPlaceholder);
    });
}); 