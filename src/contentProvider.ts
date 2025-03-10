/**
 * ContentProvider - 提供页面内容
 * 作为系统的入口点，协调各个组件
 */

import { PageRenderer } from './pageRenderer';
import { ShortcodeRenderer } from './shortcodeRenderer';

export interface PageContent {
    content: string;
    summary: string;
    hasSummaryDivider: boolean;
    frontmatter?: Record<string, any>;
}

export interface ContentProviderOptions {
    shortcodeRenderer: ShortcodeRenderer;
}

export class ContentProvider {
    private pageRenderer: PageRenderer;
    
    constructor(options: ContentProviderOptions) {
        this.pageRenderer = new PageRenderer(options.shortcodeRenderer);
    }
    
    /**
     * 从文本获取页面内容
     * @param text 文本内容
     * @returns 页面内容
     */
    public getPageContent(text: string): PageContent {
        // 使用 PageRenderer 渲染内容
        const renderResult = this.pageRenderer.render(text);
        
        return {
            content: renderResult.content,
            summary: renderResult.summary,
            hasSummaryDivider: renderResult.hasSummaryDivider,
            frontmatter: renderResult.frontmatter
        };
    }
    
    /**
     * 从文件内容获取页面内容
     * @param filePath 文件路径
     * @param fileContent 文件内容
     * @returns 页面内容
     */
    public async getPageContentFromFile(filePath: string, fileContent: string): Promise<PageContent> {
        // 这里可以添加文件特定的处理逻辑
        return this.getPageContent(fileContent);
    }
} 