import { ShortcodeRenderer } from './shortcodeRenderer';
import { ShortcodeItem } from './pageLexer';

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
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< test a b >}}',
        name: 'test',
        params: ['a', 'b'],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem);
      expect(result).toBe('<div>a b</div>');
    });

    test('应该正确渲染带内容的 shortcode', () => {
      renderer.registerShortcode('test', (params, content) => `<div>${content}</div>`);
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< test >}}',
        name: 'test',
        params: [],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem, 'content');
      expect(result).toBe('<div>content</div>');
    });

    test('渲染不存在的 shortcode 应该返回原始标记', () => {
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< unknown param1 param2 >}}',
        name: 'unknown',
        params: ['param1', 'param2'],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem);
      expect(result).toBe('{{< unknown param1 param2 >}}');
    });

    test('渲染不存在的 shortcode 时可以选择不保留原始标记', () => {
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< unknown param1 >}}',
        name: 'unknown',
        params: ['param1'],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem, undefined, {
        preserveUnknownShortcodes: false
      });
      expect(result).toBe('');
    });

    test('渲染时发生错误应该返回错误信息', () => {
      renderer.registerShortcode('error', () => {
        throw new Error('Test error');
      });
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< error >}}',
        name: 'error',
        params: [],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem);
      expect(result).toContain('Error rendering shortcode error');
      expect(result).toContain('Test error');
    });

    test('渲染时发生错误可以使用自定义错误处理', () => {
      renderer.registerShortcode('error', () => {
        throw new Error('Test error');
      });
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< error >}}',
        name: 'error',
        params: [],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem, undefined, {
        onError: (error: Error, name: string) => `<div class="error">${name}: ${error.message}</div>`
      });
      
      expect(result).toBe('<div class="error">error: Test error</div>');
    });
  });

  describe('模板类型 shortcode', () => {
    test('应该正确渲染基本模板', () => {
      renderer.registerTemplateShortcode('test', {
        template: 'Hello, {{ .Get 0 }}!'
      });
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< test World >}}',
        name: 'test',
        params: ['World'],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem);
      expect(result).toBe('Hello, World!');
    });

    test('应该正确处理命名参数', () => {
      renderer.registerTemplateShortcode('test', {
        template: 'Name: {{ .Get "name" }}, Age: {{ .Get "age" }}'
      });
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< test name="John" age="30" >}}',
        name: 'test',
        params: ['name=John', 'age=30'],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem);
      expect(result).toBe('Name: John, Age: 30');
    });

    test('应该正确处理自定义数据', () => {
      renderer.registerTemplateShortcode('test', {
        template: '{{ .customValue }} - {{ .Get 0 }}',
        dataProvider: (params) => ({
          customValue: 'Hello'
        })
      });
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< test World >}}',
        name: 'test',
        params: ['World'],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem);
      expect(result).toBe('Hello - World');
    });

    test('应该正确处理自定义函数', () => {
      renderer.registerTemplateShortcode('test', {
        template: '{{ upper (.Get 0) }}',
        funcMap: new Map([
          ['upper', (str: string) => str.toUpperCase()]
        ])
      });
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< test hello >}}',
        name: 'test',
        params: ['hello'],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem);
      expect(result).toBe('HELLO');
    });

    test('应该正确处理内容', () => {
      renderer.registerTemplateShortcode('test', {
        template: '<div>{{ .content }}</div>'
      });
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< test >}}',
        name: 'test',
        params: [],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem, 'Some content');
      expect(result).toBe('<div>Some content</div>');
    });

    test('模板解析错误应该抛出异常', () => {
      expect(() => {
        renderer.registerTemplateShortcode('test', {
          template: '{{ .Get 0 '  // 未闭合的模板标记
        });
      }).toThrow('Failed to parse template');
    });

    test('模板执行错误应该返回错误信息', () => {
      renderer.registerTemplateShortcode('test', {
        template: '{{ .undefined.property }}',  // 访问未定义对象的属性
      });
      
      const shortcodeItem: ShortcodeItem = {
        type: 'shortcode',
        pos: 0,
        val: '{{< test >}}',
        name: 'test',
        params: [],
        isClosing: false,
        isInline: false
      };
      
      const result = renderer.renderShortcodeItem(shortcodeItem);
      expect(result).toContain('Error rendering shortcode test');
    });
  });
}); 