import { ContentProvider, ContentProviderOptions, PageContent } from './contentProvider';
import { ShortcodeRenderer } from './shortcodeRenderer';

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
}); 