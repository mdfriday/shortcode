/**
 * ContentProvider - 提供页面内容
 */

import { PageLexer } from './pageLexer';
import { PageRenderer } from './pageRenderer';
import { ShortcodeRenderer } from './shortcodeRenderer';

export interface ContentProviderOptions {
    shortcodeRenderer: ShortcodeRenderer;
}

export interface PageContent {
    content: string;
    summary: string;
    hasSummaryDivider: boolean;
}

export class ContentProvider {
    private shortcodeRenderer: ShortcodeRenderer;
    private pageRenderer: PageRenderer;
    
    constructor(options: ContentProviderOptions) {
        this.shortcodeRenderer = options.shortcodeRenderer;
        this.pageRenderer = new PageRenderer(this.shortcodeRenderer);
    }
    
    /**
     * 从文件内容获取页面内容
     * @param filePath 文件路径
     * @param fileContent 文件内容
     * @returns 页面内容
     */
    public async getPageContent(filePath: string, fileContent: string): Promise<PageContent> {
        // 解析页面
        const lexerResult = PageLexer.parse(fileContent);
        
        // 渲染页面
        const renderResult = this.pageRenderer.render(lexerResult);
        
        return {
            content: renderResult.content,
            summary: renderResult.summary,
            hasSummaryDivider: renderResult.hasSummaryDivider
        };
    }
    
    /**
     * 从文本获取页面内容
     * @param text 文本
     * @returns 页面内容
     */
    public getPageContentFromText(text: string): PageContent {
        // 解析页面
        const lexerResult = PageLexer.parse(text);
        
        // 渲染页面
        const renderResult = this.pageRenderer.render(lexerResult);
        
        return {
            content: renderResult.content,
            summary: renderResult.summary,
            hasSummaryDivider: renderResult.hasSummaryDivider
        };
    }
} 