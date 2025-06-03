import { ContentProvider, ContentProviderOptions, PageContent } from '../src/contentProvider';
import { ShortcodeRenderer } from '../src/shortcodeRenderer';

/**
 * ContentProvider 单元测试
 * 
 * 这些测试验证 ContentProvider 的功能，包括：
 * 1. 基本内容处理
 * 2. Shortcode 处理
 * 3. Summary divider 处理
 * 4. 复杂内容处理
 */
describe('ContentProvider', () => {
  let shortcodeRenderer: ShortcodeRenderer;
  let contentProvider: ContentProvider;

  beforeEach(() => {
    // 创建 ShortcodeRenderer 实例并注册一些基本的 shortcodes
    shortcodeRenderer = new ShortcodeRenderer();
    shortcodeRenderer.registerShortcode('bold', (params, content) => `<strong>${content || ''}</strong>`);
    shortcodeRenderer.registerShortcode('link', (params, content) => {
      const url = params.find(p => p.startsWith('url='))?.replace(/^url="|"$/g, '') || '#';
      return `<a href="${url}">${content || 'link'}</a>`;
    });

    // 创建 ContentProvider 实例
    const options: ContentProviderOptions = {
      shortcodeRenderer
    };
    contentProvider = new ContentProvider(options);
  });

  describe('基本内容处理', () => {
    test('应该正确处理简单文本内容', async () => {
      const content = 'This is a simple content.';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toBe('This is a simple content.');
      expect(result.summary).toBe('This is a simple content.');
      expect(result.hasSummaryDivider).toBe(false);
    });

    test('应该正确处理带 shortcode 的内容', async () => {
      const content = 'This is {{< bold >}}bold{{< /bold >}} text.';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toContain('<strong>bold</strong>');
      expect(result.summary).toContain('<strong>bold</strong>');
      expect(result.hasSummaryDivider).toBe(false);
    });

    test('应该正确处理带摘要分隔符的内容', async () => {
      const content = 'This is the summary.\n<!-- more -->\nThis is the rest of the content.';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toContain('This is the summary.');
      expect(result.content).toContain('This is the rest of the content.');
      expect(result.summary).toBe('This is the summary.');
      expect(result.hasSummaryDivider).toBe(true);
    });
  });

  describe('从文本获取内容', () => {
    test('应该正确处理简单文本', () => {
      const text = 'This is a simple text.';
      const result = contentProvider.getPageContent(text);

      expect(result.content).toBe('This is a simple text.');
      expect(result.summary).toBe('This is a simple text.');
      expect(result.hasSummaryDivider).toBe(false);
    });

    test('应该正确处理带 shortcode 的文本', () => {
      const text = 'Text with {{< link url="https://example.com" >}}a link{{< /link >}}.';
      const result = contentProvider.getPageContent(text);

      expect(result.content).toContain('<a href="https://example.com">a link</a>');
      expect(result.summary).toContain('<a href="https://example.com">a link</a>');
      expect(result.hasSummaryDivider).toBe(false);
    });

    test('应该正确处理带摘要分隔符的文本', () => {
      const text = 'Summary text.\n<!-- more -->\nFull content.';
      const result = contentProvider.getPageContent(text);

      expect(result.content).toContain('Summary text.');
      expect(result.content).toContain('Full content.');
      expect(result.summary).toBe('Summary text.');
      expect(result.hasSummaryDivider).toBe(true);
    });
  });

  describe('复杂内容处理', () => {
    test('应该正确处理包含多个 shortcodes 的内容', async () => {
      const content = `This is a {{< bold >}}bold{{< /bold >}} text with a {{< link url="https://example.com" >}}test link{{< /link >}}.
<!-- more -->
More {{< bold >}}bold{{< /bold >}} content.`;

      const result = await contentProvider.getPageContent(content);

      expect(result.content).toContain('<strong>bold</strong>');
      expect(result.content).toContain('<a href="https://example.com">test link</a>');
      expect(result.summary).toContain('<strong>bold</strong>');
      expect(result.summary).toContain('<a href="https://example.com">test link</a>');
      expect(result.summary).not.toContain('More');
      expect(result.hasSummaryDivider).toBe(true);
    });

    test('应该正确处理嵌套的 shortcodes', async () => {
      const content = 'This is {{< bold >}}bold with {{< link url="https://example.com" >}}a nested link{{< /link >}}{{< /bold >}}.';
      const result = await contentProvider.getPageContent(content);

      // 由于当前实现是按顺序处理 shortcodes，而不是递归处理
      expect(result.content).toBe('This is <strong>bold with <a href="https://example.com">a nested link</a></strong>.');
      expect(result.hasSummaryDivider).toBe(false);
    });
  });

  describe('错误处理', () => {
    test('应该正确处理未知的 shortcode', async () => {
      const content = 'This is {{< unknown  >}}content{{< /unknown >}}.';
      const result = await contentProvider.getPageContent(content);

      // 默认应该保留未知的 shortcode 标记
      expect(result.content).toBe('This is {{< unknown  >}}content{{< /unknown >}}.');
    });

    test('应该正确处理格式错误的 shortcode', async () => {
      const content = 'This is {{< bold >}}{{< /bold >}} shortcode.';
      const result = await contentProvider.getPageContent(content);

      // 应该尽可能处理格式错误的 shortcode
      expect(result.content).toBe('This is <strong></strong> shortcode.');
    });
  });

  describe('边缘情况', () => {
    test('应该正确处理空内容', async () => {
      const content = '';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toBe('');
      expect(result.summary).toBe('');
      expect(result.hasSummaryDivider).toBe(false);
    });

    test('应该正确处理只有摘要分隔符的内容', async () => {
      const content = '<!-- more -->';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toBe('');
      expect(result.summary).toBe('');
      expect(result.hasSummaryDivider).toBe(true);
    });

    test('应该正确处理只包含空白字符的内容', async () => {
      const content = '   \n  \t  \n  ';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toBe(content);
      expect(result.summary).toBe(content.trim());
      expect(result.hasSummaryDivider).toBe(false);
    });
  });

  /**
   * 模板类型 shortcode 测试
   * 
   * 验证 ContentProvider 对模板类型 shortcode 的处理
   */
  describe('模板类型 Shortcode 处理', () => {
    beforeEach(() => {
      // 注册一个基本的模板 shortcode
      shortcodeRenderer.registerTemplateShortcode('greeting', {
        template: 'Hello, {{ .Get 0 }}!'
      });

      // 注册一个带有命名参数的模板 shortcode
      shortcodeRenderer.registerTemplateShortcode('profile', {
        template: '<div class="profile">Name: {{ .Get "name" }}, Age: {{ .Get "age" }}</div>'
      });

      // 注册一个带有自定义数据提供者的模板 shortcode
      shortcodeRenderer.registerTemplateShortcode('card', {
        template: '<div class="card"><h2>{{ .title }}</h2><p>{{ .content }}</p></div>',
        dataProvider: (params, content) => ({
          title: params.find(p => p.startsWith('title='))?.replace(/^title="|"$/g, '') || 'Default Title',
          content: content || 'No content provided'
        })
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

      // 注册一个复杂的模板 shortcode，包含条件逻辑和循环
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
        dataProvider: (params, content) => ({
          title: params.find(p => p.startsWith('title='))?.replace(/^title="|"$/g, '') || 'Products',
          items: [
            { name: 'Item 1', price: '$10.99', onSale: true },
            { name: 'Item 2', price: '$24.99', onSale: false },
            { name: 'Item 3', price: '$5.99', onSale: true }
          ]
        })
      });
    });

    test('应该正确处理基本模板 shortcode', async () => {
      const content = 'This is a {{< greeting World >}} message.';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toBe('This is a Hello, World! message.');
      expect(result.summary).toBe('This is a Hello, World! message.');
      expect(result.hasSummaryDivider).toBe(false);
    });

    test('应该正确处理带命名参数的模板 shortcode', async () => {
      const content = 'User profile: {{< profile name="John" age="30" >}}';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toBe('User profile: <div class="profile">Name: John, Age: 30</div>');
      expect(result.summary).toBe('User profile: <div class="profile">Name: John, Age: 30</div>');
    });

    test('应该正确处理带内容的模板 shortcode', async () => {
      const content = '{{< card title="Welcome" >}}This is the card content.{{< /card >}}';
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toBe('<div class="card"><h2>Welcome</h2><p>This is the card content.</p></div>');
      expect(result.summary).toBe('<div class="card"><h2>Welcome</h2><p>This is the card content.</p></div>');
    });

    test('应该正确处理带自定义函数的模板 shortcode', async () => {
      const content = `
{{< format uppercase >}}This should be uppercase{{< /format >}}
{{< format >}}This Should Be Lowercase{{< /format >}}`;
      const result = await contentProvider.getPageContent(content);

      expect(result.content).toContain('THIS SHOULD BE UPPERCASE');
      expect(result.content).toContain('this should be lowercase');
    });

    test('应该正确处理复杂的模板 shortcode', async () => {
      const content = 'Check out our {{< product-list title="Featured Products" >}}';
      const result = await contentProvider.getPageContent(content);

      // 验证基本结构
      expect(result.content).toContain('<div class="products">');
      expect(result.content).toContain('<h2>Featured Products</h2>');

      // 验证商品项
      expect(result.content).toContain('<strong>Item 1</strong>: $10.99');
      expect(result.content).toMatch(/<strong>Item 1<\/strong>: \$10\.99[^]*?<span class="sale">Sale!<\/span>/);

      // 验证 Item 2（不应该有 Sale 标签）
      expect(result.content).toContain('<strong>Item 2</strong>: $24.99');
      const item2Content = result.content.substring(
        result.content.indexOf('<strong>Item 2</strong>'),
        result.content.indexOf('<strong>Item 3</strong>')
      );
      expect(item2Content).not.toContain('<span class="sale">Sale!</span>');

      // 验证 Item 3
      expect(result.content).toContain('<strong>Item 3</strong>: $5.99');
      expect(result.content).toMatch(/<strong>Item 3<\/strong>: \$5\.99[^]*?<span class="sale">Sale!<\/span>/);

      // 验证整体结构
      const expectedStructure = `
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

      expect(result.content.replace(/\s+/g, '')).toContain(expectedStructure);
    });

    test('应该正确处理带摘要分隔符的模板 shortcode 内容', async () => {
      const content = `This is a {{< greeting Reader >}} in the summary.
<!-- more -->
And this is a {{< profile name="Jane" age="28" >}} in the content.`;

      const result = await contentProvider.getPageContent(content);

      expect(result.hasSummaryDivider).toBe(true);
      expect(result.summary).toBe('This is a Hello, Reader! in the summary.');
      expect(result.content).toContain('And this is a <div class="profile">Name: Jane, Age: 28</div> in the content.');
    });

    test('应该正确处理模板 shortcode 中的错误', async () => {
      // 注册一个会抛出错误的模板 shortcode
      shortcodeRenderer.registerTemplateShortcode('error-template', {
        template: '{{ .undefinedVariable }}', // 这会导致模板执行错误
      });

      const content = 'This will {{< error-template >}}cause an error{{< /error-template >}}.';
      const result = await contentProvider.getPageContent(content);

      // 检查渲染结果是否包含原始内容
      expect(result.content).toBe('This will cause an error.');
    });
  });
}); 