/**
 * Main entry point for the shortcode compiler
 */

// 导入您的TS包
// 例如: import { someFunction } from 'your-ts-package';

export { ShortcodeRenderer } from './shortcodeRenderer';
export type { Shortcode, RenderOptions } from './shortcodeRenderer';

export { ContentProvider } from './contentProvider';
export type { ContentProviderOptions, PageContent } from './contentProvider';

export { PageLexer } from './pageLexer';
export type { PageLexerResult, PageItem, ShortcodeItem } from './pageLexer';

export { PageRenderer } from './pageRenderer';
export type { PageRenderResult, PageRenderOptions } from './pageRenderer';

/**
 * 主函数，用于测试您的TS包
 */
export function main(): void {
  console.log('TS Package Testing Project');
  
  // 在这里使用您的TS包
  // 例如: const result = someFunction();
  // console.log('Result:', result);
}

// 如果直接运行此文件，则执行main函数
if (require.main === module) {
  main();
} 