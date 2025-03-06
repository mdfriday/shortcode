import { ShortcodeRenderer } from './shortcodeRenderer';
import { PageLexer, ShortcodeItem } from './pageLexer';

/**
 * ShortcodeRenderer 单元测试
 * 
 * 这些测试从用户视角验证 ShortcodeRenderer 的功能
 */
describe('ShortcodeRenderer', () => {
  let renderer: ShortcodeRenderer;

  beforeEach(() => {
    renderer = new ShortcodeRenderer();
  });

  describe('基本功能', () => {
    test('应该能够注册和获取 shortcode', () => {
      const renderFn = (params: string[]) => `<div>${params.join(' ')}</div>`;
      renderer.registerShortcode('test', renderFn);
      
      const shortcode = renderer.getShortcode('test');
      expect(shortcode).toBeDefined();
      expect(shortcode?.name).toBe('test');
      expect(shortcode?.render(['a', 'b'])).toBe('<div>a b</div>');
    });

    test('应该能够批量注册 shortcodes', () => {
      renderer.registerShortcodes({
        bold: (params, content) => `<strong>${content || ''}</strong>`,
        italic: (params, content) => `<em>${content || ''}</em>`,
      });
      
      expect(renderer.getShortcode('bold')).toBeDefined();
      expect(renderer.getShortcode('italic')).toBeDefined();
    });

    test('获取不存在的 shortcode 应该返回 undefined', () => {
      expect(renderer.getShortcode('nonexistent')).toBeUndefined();
    });
  });

  describe('渲染 shortcode', () => {
    test('应该正确渲染简单的 shortcode', () => {
      renderer.registerShortcode('test', (params) => `<div>${params.join(' ')}</div>`);
      
      const result = renderer.renderShortcode('test', ['a', 'b']);
      expect(result).toBe('<div>a b</div>');
    });

    test('应该正确渲染带内容的 shortcode', () => {
      renderer.registerShortcode('test', (params, content) => `<div>${content}</div>`);
      
      const result = renderer.renderShortcode('test', [], 'content');
      expect(result).toBe('<div>content</div>');
    });

    test('渲染不存在的 shortcode 应该返回原始标记', () => {
      const result = renderer.renderShortcode('unknown', ['param1', 'param2']);
      expect(result).toBe('{{< unknown param1 param2 >}}');
    });

    test('渲染不存在的 shortcode 时可以选择不保留原始标记', () => {
      const result = renderer.renderShortcode('unknown', ['param1'], undefined, {
        preserveUnknownShortcodes: false
      });
      expect(result).toBe('');
    });

    test('渲染时发生错误应该返回错误信息', () => {
      renderer.registerShortcode('error', () => {
        throw new Error('Test error');
      });
      
      const result = renderer.renderShortcode('error', []);
      expect(result).toContain('Error rendering shortcode error');
      expect(result).toContain('Test error');
    });

    test('渲染时发生错误可以使用自定义错误处理', () => {
      renderer.registerShortcode('error', () => {
        throw new Error('Test error');
      });
      
      const result = renderer.renderShortcode('error', [], undefined, {
        onError: (error, name) => `<div class="error">${name}: ${error.message}</div>`
      });
      
      expect(result).toBe('<div class="error">error: Test error</div>');
    });
  });

  describe('解析参数', () => {
    test('应该正确解析带引号的参数', () => {
      const params = ShortcodeRenderer.parseParams('param1 param2="value with spaces" param3');
      expect(params).toEqual(['param1', 'param2="value with spaces"', 'param3']);
    });

    test('应该正确处理空参数', () => {
      expect(ShortcodeRenderer.parseParams('')).toEqual([]);
      expect(ShortcodeRenderer.parseParams('  ')).toEqual([]);
    });

    test('应该忽略内联标记', () => {
      expect(ShortcodeRenderer.parseParams('/')).toEqual([]);
    });

    test('应该处理嵌套引号', () => {
      const params = ShortcodeRenderer.parseParams('param1="outer \\"inner\\" quotes"');
      expect(params).toEqual(['param1="outer \\"inner\\" quotes"']);
    });
  });

  describe('解析和渲染文本', () => {
    beforeEach(() => {
      renderer.registerShortcode('bold', (params, content) => `<strong>${content || ''}</strong>`);
      renderer.registerShortcode('link', (params, content) => {
        const url = params.find(p => p.startsWith('url='))?.replace(/^url="|"$/g, '') || '#';
        return `<a href="${url}">${content || 'link'}</a>`;
      });
    });

    test('应该正确解析和渲染简单的 shortcode', () => {
      const text = 'This is {{< bold >}}bold{{< /bold >}} text.';
      const result = renderer.parseAndRender(text);
      expect(result).toBe('This is <strong>bold</strong> text.');
    });

    test('应该正确解析和渲染多个 shortcode', () => {
      const text = 'This is {{< bold >}}bold{{< /bold >}} and {{< link url="https://example.com" >}}a link{{< /link >}}.';
      const result = renderer.parseAndRender(text);
      expect(result).toBe('This is <strong>bold</strong> and <a href="https://example.com">a link</a>.');
    });

    test('应该正确解析和渲染嵌套的 shortcode', () => {
      const text = 'This is {{< bold >}}bold with {{< link url="https://example.com" >}}a link{{< /link >}}{{< /bold >}}.';
      
      renderer.registerShortcode('bold', (params, content) => `<strong>${content}</strong>`);
      
      const result = renderer.parseAndRender(text);
      expect(result).toBe('This is <strong>bold with <a href="https://example.com">a link</a></strong>.');
    });

    test('应该正确处理内联 shortcode', () => {
      const text = 'This is {{< link url="https://example.com" />}} text.';
      const result = renderer.parseAndRender(text);
      expect(result).toBe('This is <a href="https://example.com">link</a> text.');
    });
  });

  describe('与 PageLexer 集成', () => {
    beforeEach(() => {
      renderer.registerShortcode('bold', (params, content) => `<strong>${content || ''}</strong>`);
      renderer.registerShortcode('link', (params, content) => {
        const url = params.find(p => p.startsWith('url='))?.replace(/^url="|"$/g, '') || '#';
        return `<a href="${url}">${content || 'link'}</a>`;
      });
    });

    test('应该能够处理 PageLexer 解析的内容', () => {
      const content = 'This is {{< bold >}}bold{{< /bold >}} text.';
      const parsed = PageLexer.parse(content);
      
      const result = renderer.renderParsedContent(parsed);
      expect(result).toBe('This is <strong>bold</strong> text.');
    });

    test('应该能够处理带 frontmatter 的内容', () => {
      const content = `---
title: Test
---
This is {{< bold >}}bold{{< /bold >}} text.`;
      
      // 默认不保留 frontmatter
      const result = renderer.parseAndRender(content);
      expect(result).not.toContain('title: Test');
      expect(result).toBe('This is <strong>bold</strong> text.');
      
      // 可以选择保留 frontmatter
      const resultWithFrontmatter = renderer.parseAndRender(content, {
        preserveFrontmatter: true
      });
      expect(resultWithFrontmatter).toContain('title: Test');
      expect(resultWithFrontmatter).toContain('This is <strong>bold</strong> text.');
    });

    test('应该能够处理带 summary divider 的内容', () => {
      const content = `This is a summary.
<!-- more -->
This is the rest of the content with {{< bold >}}bold{{< /bold >}} text.`;
      
      const result = renderer.parseAndRender(content);
      expect(result).toContain('This is a summary.');
      expect(result).toContain('<!-- more -->');
      expect(result).toContain('<strong>bold</strong>');
    });
  });

  describe('processMarkdown 方法', () => {
    beforeEach(() => {
      renderer.registerShortcode('bold', (params, content) => `<strong>${content || ''}</strong>`);
      renderer.registerShortcode('link', (params, content) => {
        const url = params.find(p => p.startsWith('url='))?.replace(/^url="|"$/g, '') || '#';
        return `<a href="${url}">${content || 'link'}</a>`;
      });
    });

    test('应该正确处理完整的 Markdown 内容', () => {
      const content = `---
title: Test
date: 2023-01-01
---
This is a summary with {{< bold >}}important{{< /bold >}} points.
<!-- more -->
This is the rest of the content with a {{< link url="https://example.com" >}}link{{< /link >}}.`;
      
      const result = renderer.processMarkdown(content);
      
      // 验证 frontmatter 被正确提取
      expect(result.frontmatter).toContain('title: Test');
      expect(result.frontmatter).toContain('date: 2023-01-01');
      
      // 验证 summary divider 被检测到
      expect(result.hasSummaryDivider).toBe(true);
      
      // 验证内容被正确渲染
      expect(result.content).toContain('This is a summary with <strong>important</strong> points.');
      expect(result.content).toContain('This is the rest of the content with a <a href="https://example.com">link</a>.');
    });

    test('应该能够处理没有 frontmatter 的内容', () => {
      const content = 'This is content with {{< bold >}}bold{{< /bold >}} text.';
      
      const result = renderer.processMarkdown(content);
      
      expect(result.frontmatter).toBeNull();
      expect(result.hasSummaryDivider).toBe(false);
      expect(result.content).toBe('This is content with <strong>bold</strong> text.');
    });
  });

  describe('实际使用场景', () => {
    beforeEach(() => {
      // 注册常用 shortcodes
      renderer.registerShortcodes({
        youtube: (params) => {
          const id = params[0]?.replace(/"/g, '') || '';
          return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        },
        figure: (params, content) => {
          const srcParam = params.find(p => p.startsWith('src='));
          const captionParam = params.find(p => p.startsWith('caption='));
          
          const src = srcParam ? srcParam.substring(4).replace(/"/g, '') : '';
          const caption = captionParam ? captionParam.substring(8).replace(/"/g, '') : '';
          
          return `<figure>
  <img src="${src}" alt="${caption}">
  <figcaption>${caption}</figcaption>
  <div class="description">${content || ''}</div>
</figure>`;
        },
        highlight: (params, content) => {
          const lang = params[0]?.replace(/"/g, '') || 'text';
          return `<pre><code class="language-${lang}">${content || ''}</code></pre>`;
        }
      });
    });

    test('应该能够渲染博客文章', () => {
      const blogPost = `---
title: My Blog Post
date: 2023-01-01
tags: [test, example]
---
# Introduction

Here's a video about cats:
{{< youtube "dQw4w9WgXcQ" >}}

And here's a figure with a caption:
{{< figure src="cats.jpg" caption="Cute cats playing" >}}
These cats are really adorable!
{{< /figure >}}

Here's some code:
{{< highlight "javascript" >}}
function hello() {
  console.log("Hello, world!");
}
{{< /highlight >}}

<!-- more -->

## More content

This is after the summary divider.`;
      
      const result = renderer.processMarkdown(blogPost);
      
      // 验证 frontmatter 被正确提取
      expect(result.frontmatter).toContain('title: My Blog Post');
      
      // 验证 summary divider 被检测到
      expect(result.hasSummaryDivider).toBe(true);
      
      // 验证 YouTube shortcode 被正确渲染
      expect(result.content).toContain('<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ"');
      
      // 验证 figure shortcode 被正确渲染
      expect(result.content).toContain('<figure>');
      expect(result.content).toContain('<img src="cats.jpg" alt="Cute cats playing">');
      expect(result.content).toContain('<figcaption>Cute cats playing</figcaption>');
      // 注意：内容可能包含换行符，所以我们只检查部分内容
      expect(result.content).toContain('<div class="description">');
      expect(result.content).toContain('These cats are really adorable!');
      
      // 验证 highlight shortcode 被正确渲染
      expect(result.content).toContain('<pre><code class="language-javascript">');
      expect(result.content).toContain('function hello()');
      
      // 验证 summary divider 后的内容也被正确渲染
      expect(result.content).toContain('## More content');
    });
  });
}); 