import { ShortcodeRenderer, PageRenderer } from '.';

describe('Step Rendering for Nested Shortcodes', () => {
  let shortcodeRenderer: ShortcodeRenderer;
  let pageRenderer: PageRenderer;
  
  // Define the CSS styles for the FormulaPair shortcodes
  const formulaPairStyles = `
  .mdfFormulaPair-canvas {
      min-width: 540px;
      max-width: 1080px;
  }

  .mdfFormulaPair-canvas .card {
      font-family: Arial, sans-serif;
      padding: 27px 40px;
      background-color: #ffffff;
      margin: 0 auto;
  }

  .mdfFormulaPair-canvas .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
  }

  .mdfFormulaPair-canvas .header-title {
      font-size: 17px;
      color: #333;
  }

  .mdfFormulaPair-canvas .header-logo {
      font-size: 17px;
      font-weight: bold;
  }

  .mdfFormulaPair-canvas .section {
      margin-bottom: 25px;
  }

  .mdfFormulaPair-canvas .section-title {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
  }

  .mdfFormulaPair-canvas .section-number {
      background-color: #FFB6C1;
      color: black;
      padding: 5px 15px;
      font-size: 28px;
      margin-right: 15px;
  }

  .mdfFormulaPair-canvas .section-name {
      font-size: 28px;
      font-weight: bold;
  }

  .mdfFormulaPair-canvas .formula {
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
  }

  .mdfFormulaPair-canvas .formula-item {
      display: flex;
      align-items: center;
  }

  .mdfFormulaPair-canvas .formula-text {
      border-bottom: 1px solid #000;
      padding-bottom: 2px;
  }

  .mdfFormulaPair-canvas .plus {
      margin: 0 10px;
      font-size: 24px;
  }

  .mdfFormulaPair-canvas .example-title {
      font-size: 22px;
      margin: 10px 0 10px;
  }

  .mdfFormulaPair-canvas .example-content {
      margin: 20px 0;
      line-height: 1.8;
      font-size: 13px;
  }

  .mdfFormulaPair-canvas .label {
      display: inline-block;
      background-color: #87CEEB;
      padding: 2px 8px;
      margin: 0 5px;
      border-radius: 4px;
  }

  .mdfFormulaPair-canvas .example-item {
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
  }

  .mdfFormulaPair-canvas .number-circle {
      min-width: 24px;
      height: 24px;
      border: 1px solid #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      margin-top: 3px;
  }

  .mdfFormulaPair-canvas .dotted-line {
      border-bottom: 1px dotted #999;
      padding-bottom: 5px;
      margin-bottom: 5px;
  }

  .mdfFormulaPair-canvas .page-number {
      text-align: center;
      color: #666;
  }
  `;

  // The markdown content with deeply nested shortcodes
  const markdownContent = `
  {{< mdfFormulaPair
  headerTitle="[爆款文案结构公式]"
  headerLogo="BUHEIXUEZHANG"
  pageNumber="2"
  >}}
  
  {{< mdfFormulaPairCard
  number="03"
  name="FIRE结构"
  items="Fact事实+Interpret解读+Reaction反应+Ends结果"
  >}}
  {{< mdfFormulaPairExample
  number="1"
  label="Fact/事实"
  content="最近好多博主都在抱怨流量不如之前了"
  />}}
  {{< mdfFormulaPairExample
  number="2"
  label="Interpret解读"
  content="那是因为机制从流量转化效率调整到了曝光转化效率"
  />}}
  {{< mdfFormulaPairExample
  number="3"
  label="Reaction反应"
  content="不光短视频，直播间的流量也是一样的结果"
  />}}
  {{< mdfFormulaPairExample
  number="4"
  label="Ends结果"
  content="我们需要优化前两秒使用视听语言"
  />}}
  
  {{< /mdfFormulaPairCard >}}
  
  {{< mdfFormulaPairCard
  number="04"
  name="RIDE结构"
  items="Risk风险+Interest利益+Difference差异+Effect影响"
  >}}
  {{< mdfFormulaPairExample
  number="1"
  label="Risk风险"
  content="消极口头禅会影响运气"
  />}}
  {{< mdfFormulaPairExample
  number="2"
  label="Interest利益"
  content="使用积极的口头禅来吸引好运对你最有利"
  />}}
  {{< mdfFormulaPairExample
  number="3"
  label="Difference差异"
  content="说我会成功而不是我可能会失败"
  />}}
  {{< mdfFormulaPairExample
  number="4"
  label="Effect影响"
  content="积极的口头禅对人的心态和运气有显著影响"
  />}}
  {{< /mdfFormulaPairCard >}}
  
  {{< /mdfFormulaPair >}}
  `;
  
  beforeEach(() => {
    shortcodeRenderer = new ShortcodeRenderer();
    pageRenderer = new PageRenderer(shortcodeRenderer);
    
    // Create a function map with the split function
    const funcMap = new Map<string, (...args: any[]) => any>();
    funcMap.set('split', (str: string, sep: string) => str.split(sep));
    
    // Register the three shortcodes
    
    // 1. Register mdfFormulaPair
    shortcodeRenderer.registerTemplateShortcode('mdfFormulaPair', {
      template: `
        <style>
          ${formulaPairStyles}
        </style>
        <div class="mdfFormulaPair-canvas">
          <div class="card">
            <div class="header">
              <div class="header-title">{{ .Get "headerTitle" }}</div>
              <div class="header-logo">{{ .Get "headerLogo" }}</div>
            </div>

            {{ .Inner }}

            {{ if .Get "pageNumber" }}
            <div class="page-number">- {{ .Get "pageNumber" }} -</div>
            {{ end }}
          </div>
        </div>
      `,
      funcMap: funcMap,
      dataProvider: (params: string[], content?: string) => {
        return {
          Inner: content
        };
      }
    });
    
    // 2. Register mdfFormulaPairCard
    shortcodeRenderer.registerTemplateShortcode('mdfFormulaPairCard', {
      template: `
        <div class="section">
          <div class="section-title">
            <div class="section-number">{{ .Get "number" }}</div>
            <div class="section-name">{{ .Get "name" }}</div>
          </div>

          <div class="formula">
            {{ $formulaItems := split (.Get "items") "+" }}
            {{ range $itemIndex, $item := $formulaItems }}
              
              {{ if gt $itemIndex 0 }}
              <span class="plus">+</span>
              {{ end }}
               <div class="formula-item">
                <span class="formula-text">{{ $item }}</span>
              </div>

            {{ end }}
            
          </div>

          <div class="example-title">案例解析</div>
          
          <div class="example-content">
            {{ .Inner }}
          </div>
        </div>
      `,
      funcMap: funcMap,
      dataProvider: (params: string[], content?: string) => {
        return {
          Inner: content
        };
      }
    });
    
    // 3. Register mdfFormulaPairExample
    shortcodeRenderer.registerTemplateShortcode('mdfFormulaPairExample', {
      template: `
        <div class="example-item">
          <div class="number-circle">{{ .Get "number" }}</div>
          <div>
            <span class="label">{{ .Get "label" }}</span>
            <span class="dotted-line">{{ .Get "content" }}</span>
          </div>
        </div>
      `,
      funcMap: funcMap,
      dataProvider: (params: string[], content?: string) => {
        return {
          Inner: content
        };
      }
    });
  });
  
  test('深度嵌套的 Shortcodes 应正确处理占位符和最终渲染结果', () => {
    // 第一步：分步渲染，生成占位符
    const stepRenderResult = pageRenderer.render(markdownContent, { stepRender: true });
    
    // 验证第一步结果包含占位符
    expect(stepRenderResult.content).toMatch(/_mdf_sc_\d+/);
    
    // 收集占位符，应该创建占位符层级结构
    const placeholders = stepRenderResult.content.match(/_mdf_sc_\d+/g);
    expect(placeholders).toBeTruthy();
    if (placeholders) {
      // 验证生成的占位符数量
      // 嵌套结构中应该有多个占位符
      expect(placeholders.length).toBeGreaterThanOrEqual(1);
      
      // 检查占位符是否是最外层的 mdfFormulaPair
      // 仅应有一个一级占位符（只保留最外层的占位符）
      const trimmedContent = stepRenderResult.content.trim();
      expect(trimmedContent.startsWith('_mdf_sc_')).toBe(true);
      expect(trimmedContent).toEqual(placeholders[0]);
    }
    
    // 第二步：最终渲染，替换占位符
    const finalRenderResult = pageRenderer.finalRender(stepRenderResult.content);
    
    // 验证最终渲染结果
    expect(finalRenderResult).not.toMatch(/_mdf_sc_\d+/);  // 不再包含占位符
    expect(finalRenderResult).toContain('<div class="mdfFormulaPair-canvas">');  // 包含最外层容器
    expect(finalRenderResult).toContain('<div class="header-title">[爆款文案结构公式]</div>');  // 包含标题
    expect(finalRenderResult).toContain('<div class="section-name">FIRE结构</div>');  // 包含第一个卡片
    expect(finalRenderResult).toContain('<div class="section-name">RIDE结构</div>');  // 包含第二个卡片
    expect(finalRenderResult).toContain('<span class="label">Fact/事实</span>');  // 包含示例标签
  });
  
  test('直接渲染（一步式）应该与两步渲染最终结果一致', () => {
    // 分步渲染
    const stepRenderResult = pageRenderer.render(markdownContent, { stepRender: true });
    const twoStepFinalResult = pageRenderer.finalRender(stepRenderResult.content);
    
    // 一步渲染
    const oneStepResult = pageRenderer.render(markdownContent).content;
    
    // 验证两种渲染方式的结果一致
    expect(twoStepFinalResult).toEqual(oneStepResult);
  });
  
  test('多层嵌套的 shortcodes 验证渲染过程中占位符的生成和替换', () => {
    // 这个测试用于验证实际步骤渲染中的缓存内容
    
    // 第一步：分步渲染，生成占位符
    const stepRenderResult = pageRenderer.render(markdownContent, { stepRender: true });
    
    // 获取占位符
    const placeholders = stepRenderResult.content.match(/_mdf_sc_\d+/g);
    expect(placeholders).toBeTruthy();
    if (!placeholders) return;
    
    // 访问缓存
    const stepRenderCache = pageRenderer.getStepRenderCache();
    expect(stepRenderCache.size).toBeGreaterThan(0);
    
    // 验证 cache 中包含占位符
    expect(stepRenderCache.has(placeholders[0])).toBe(true);
    
    // 验证缓存中占位符的渲染内容是完整的
    const cachedContent = stepRenderCache.get(placeholders[0]);
    
    // 确保cachedContent不为undefined
    expect(cachedContent).toBeDefined();
    if (!cachedContent) return; // TypeScript类型保护
    
    expect(cachedContent).toContain('<div class="mdfFormulaPair-canvas">');
    expect(cachedContent).toContain('<div class="section-name">FIRE结构</div>');
    expect(cachedContent).toContain('<div class="section-name">RIDE结构</div>');
    
    // 最终渲染应该使用缓存中的内容替换占位符
    const finalRenderResult = pageRenderer.finalRender(stepRenderResult.content);
    // 忽略空白符差异进行比较
    expect(finalRenderResult.replace(/\s+/g, '')).toEqual(cachedContent.replace(/\s+/g, ''));
  });
  
  test('复杂结构的 shortcodes 应该处理 funcMap 中的函数调用', () => {
    // 这个测试验证在两步渲染过程中，模板中的函数调用是否正确执行
    
    // 分步渲染
    const stepRenderResult = pageRenderer.render(markdownContent, { stepRender: true });
    const finalRenderResult = pageRenderer.finalRender(stepRenderResult.content);
    
    // 验证 split 函数在 FIRE 结构中正确处理了 "+" 分隔
    expect(finalRenderResult).toContain('<span class="formula-text">Fact事实</span>');
    expect(finalRenderResult).toContain('<span class="formula-text">Interpret解读</span>');
    expect(finalRenderResult).toContain('<span class="formula-text">Reaction反应</span>');
    expect(finalRenderResult).toContain('<span class="formula-text">Ends结果</span>');
    
    // 验证 RIDE 结构中的分隔处理
    expect(finalRenderResult).toContain('<span class="formula-text">Risk风险</span>');
    expect(finalRenderResult).toContain('<span class="formula-text">Interest利益</span>');
    expect(finalRenderResult).toContain('<span class="formula-text">Difference差异</span>');
    expect(finalRenderResult).toContain('<span class="formula-text">Effect影响</span>');
    
    // 确认 plus 分隔符在正确位置
    const plusCount = (finalRenderResult.match(/<span class="plus">\+<\/span>/g) || []).length;
    expect(plusCount).toBe(6); // 两个卡片，每个有3个"+"
  });

  test('验证嵌套 Shortcodes 的层级结构与分步渲染缓存', () => {
    // 创建一个更简单但具有深度嵌套结构的示例
    const simpleNestedMarkdown = `
    {{< outer level="1" >}}
      {{< middle level="2" >}}
        {{< inner level="3" >}}
          内容
        {{< /inner >}}
      {{< /middle >}}
    {{< /outer >}}
    `;
    
    // 注册测试用的嵌套 shortcodes
    shortcodeRenderer.registerTemplateShortcode('outer', {
      template: `<div class="outer" data-level="{{ .Get \"level\" }}">{{ .Inner }}</div>`,
      dataProvider: (params, content) => ({ Inner: content })
    });
    
    shortcodeRenderer.registerTemplateShortcode('middle', {
      template: `<div class="middle" data-level="{{ .Get \"level\" }}">{{ .Inner }}</div>`,
      dataProvider: (params, content) => ({ Inner: content })
    });
    
    shortcodeRenderer.registerTemplateShortcode('inner', {
      template: `<div class="inner" data-level="{{ .Get \"level\" }}">{{ .Inner }}</div>`,
      dataProvider: (params, content) => ({ Inner: content })
    });
    
    // 执行分步渲染
    const stepRenderResult = pageRenderer.render(simpleNestedMarkdown, { stepRender: true });
    
    // 获取占位符
    const placeholders = stepRenderResult.content.match(/_mdf_sc_\d+/g);
    expect(placeholders).toBeTruthy();
    if (!placeholders) return;
    
    // 访问缓存
    const stepRenderCache = pageRenderer.getStepRenderCache();
    
    // 验证占位符数量和内容
    expect(placeholders.length).toBe(1); // 在第一阶段只有一个顶层占位符
    
    // 验证缓存中的内容
    const outerContent = stepRenderCache.get(placeholders[0]);
    
    // 确保outerContent不为undefined
    expect(outerContent).toBeDefined();
    if (!outerContent) return; // TypeScript类型保护
    
    expect(outerContent).toContain('<div class="outer" data-level="1">');
    expect(outerContent).toContain('<div class="middle" data-level="2">');
    expect(outerContent).toContain('<div class="inner" data-level="3">');
    expect(outerContent).toContain('内容');
    
    // 验证嵌套结构的完整性
    const expectedHtml = '<div class="outer" data-level="1"><div class="middle" data-level="2"><div class="inner" data-level="3">内容</div></div></div>';
    expect(outerContent.replace(/\s+/g, '')).toContain(expectedHtml.replace(/\s+/g, ''));
    
    // 最终渲染
    const finalResult = pageRenderer.finalRender(stepRenderResult.content);
    expect(finalResult.replace(/\s+/g, '')).toContain(expectedHtml.replace(/\s+/g, ''));
  });
  
  test('验证多重嵌套缓存机制', () => {
    // 创建一个具有多重嵌套和多个并列结构的例子
    const complexNestedMarkdown = `
    {{< box title="主盒子" >}}
      {{< column width="50%" >}}
        {{< card type="info" >}}
          第一张卡片
        {{< /card >}}
      {{< /column >}}
      
      {{< column width="50%" >}}
        {{< card type="warning" >}}
          第二张卡片
        {{< /card >}}
      {{< /column >}}
    {{< /box >}}
    `;
    
    // 注册测试用的组件 shortcodes
    shortcodeRenderer.registerTemplateShortcode('box', {
      template: `<div class="box"><h3>{{ .Get "title" }}</h3><div class="content">{{ .Inner }}</div></div>`,
      dataProvider: (params, content) => ({ Inner: content })
    });
    
    shortcodeRenderer.registerTemplateShortcode('column', {
      template: `<div class="column" style="width:{{ .Get "width" }}">{{ .Inner }}</div>`,
      dataProvider: (params, content) => ({ Inner: content })
    });
    
    shortcodeRenderer.registerTemplateShortcode('card', {
      template: `<div class="card card-{{ .Get "type" }}">{{ .Inner }}</div>`,
      dataProvider: (params, content) => ({ Inner: content })
    });
    
    // 执行分步渲染
    const stepRenderResult = pageRenderer.render(complexNestedMarkdown, { stepRender: true });
    
    // 获取占位符
    const placeholders = stepRenderResult.content.match(/_mdf_sc_\d+/g);
    expect(placeholders).toBeTruthy();
    if (!placeholders) return;
    
    // 访问缓存
    const stepRenderCache = pageRenderer.getStepRenderCache();
    
    // 验证占位符数量 - 应该只有外层 box 的占位符
    expect(placeholders.length).toBe(1);
    
    // 验证缓存中的内容
    const boxContent = stepRenderCache.get(placeholders[0]);
    
    // 确保boxContent不为undefined
    expect(boxContent).toBeDefined();
    if (!boxContent) return; // TypeScript类型保护
    
    // 验证缓存包含所有嵌套元素
    expect(boxContent).toContain('<div class="box"><h3>主盒子</h3>');
    expect(boxContent).toContain('<div class="content">');
    expect(boxContent).toContain('<div class="column" style="width:50%">');
    expect(boxContent).toContain('<div class="card card-info">');
    expect(boxContent).toContain('<div class="card card-warning">');
    
    // 最终渲染应包含完整内容
    const finalResult = pageRenderer.finalRender(stepRenderResult.content);
    // 忽略空白符差异进行比较
    expect(finalResult.replace(/\s+/g, '')).toEqual(boxContent.replace(/\s+/g, ''));
    
    // 验证最终HTML结构正确
    expect(finalResult).toContain('<div class="box"><h3>主盒子</h3>');
    expect(finalResult).toContain('<div class="content">');
    expect(finalResult).toContain('<div class="column" style="width:50%">');
    expect(finalResult).toContain('<div class="card card-info">');
    expect(finalResult).toContain('<div class="card card-warning">');
  });
  
  test('生成适合调试的分步渲染步骤日志', () => {
    // 创建一个较为简单的多层嵌套结构，方便调试
    const debugMarkdown = `
    # 测试分步渲染

    {{< section title="第一部分" >}}
      这是普通文本内容
      
      {{< callout type="info" >}}
        这是一个信息提示
        
        {{< highlight js >}}
        function test() {
          console.log("Hello world");
        }
        {{< /highlight >}}
      {{< /callout >}}
      
      更多普通文本
    {{< /section >}}
    `;
    
    // 注册相关 shortcodes
    shortcodeRenderer.registerTemplateShortcode('section', {
      template: `<section class="content-section"><h2>{{ .Get "title" }}</h2><div>{{ .Inner }}</div></section>`,
      dataProvider: (params, content) => ({ Inner: content })
    });
    
    shortcodeRenderer.registerTemplateShortcode('callout', {
      template: `<div class="callout callout-{{ .Get "type" }}">{{ .Inner }}</div>`,
      dataProvider: (params, content) => ({ Inner: content })
    });
    
    shortcodeRenderer.registerShortcode('highlight', (params, content) => {
      const lang = params[0] || 'text';
      return `<pre><code class="language-${lang}">${content}</code></pre>`;
    });
    
    // 执行分步渲染
    const stepRenderResult = pageRenderer.render(debugMarkdown, { stepRender: true });
    
    // 打印调试信息（仅在测试中使用）
    console.log('--- 分步渲染调试信息 ---');
    console.log('1. 初始步骤结果:');
    console.log(stepRenderResult.content);
    
    // 获取占位符
    const placeholders = stepRenderResult.content.match(/_mdf_sc_\d+/g) || [];
    console.log(`\n2. 识别到 ${placeholders.length} 个占位符:`);
    placeholders.forEach(p => console.log(`   - ${p}`));
    
    // 访问缓存
    const stepRenderCache = pageRenderer.getStepRenderCache();
    
    console.log('\n3. 缓存内容:');
    for (const [key, value] of stepRenderCache.entries()) {
      console.log(`   占位符 ${key}:`);
      // 为了调试可读性，只显示简短内容
      const shortValue = value.length > 100 ? value.substring(0, 100) + '...' : value;
      console.log(`   ${shortValue}`);
    }
    
    // 最终渲染
    const finalResult = pageRenderer.finalRender(stepRenderResult.content);
    console.log('\n4. 最终渲染结果:');
    console.log(finalResult.substring(0, 200) + (finalResult.length > 200 ? '...' : ''));
    console.log('--- 调试信息结束 ---');
    
    // 验证测试结果
    expect(stepRenderResult.content).toMatch(/_mdf_sc_\d+/);
    expect(placeholders.length).toBeGreaterThan(0);
    expect(finalResult).not.toMatch(/_mdf_sc_\d+/);
    expect(finalResult).toContain('<section class="content-section">');
    expect(finalResult).toContain('<div class="callout callout-info">');
    expect(finalResult).toContain('<pre><code class="language-js">');
    
    // 验证嵌套结构
    expect(finalResult).toContain('Hello world');
    
    // 确保最终内容包含 Markdown 格式的非 shortcode 元素
    expect(finalResult).toContain('# 测试分步渲染');
    expect(finalResult).toContain('这是普通文本内容');
    expect(finalResult).toContain('更多普通文本');
  });
}); 