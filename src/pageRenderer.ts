/**
 * PageRenderer - 处理整个页面的渲染
 * 作为渲染过程的总协调者
 */

import { PageLexer, PageLexerResult, PageItem, ShortcodeItem } from './pageLexer';
import { ShortcodeRenderer } from './shortcodeRenderer';

export interface PageRenderResult {
    content: string;
    summary: string;
    hasSummaryDivider: boolean;
    frontmatter?: Record<string, any>;
}

export interface PageRenderOptions {
    /** 是否保留 frontmatter 在输出中 */
    preserveFrontmatter?: boolean;
    /** 是否在控制台输出警告 */
    showWarnings?: boolean;
    /** 是否保留未知 shortcode 的原始标记 */
    preserveUnknownShortcodes?: boolean;
    /** 自定义错误处理函数 */
    onError?: (error: Error, shortcodeName: string) => string;
    /** 是否启用分步渲染模式 */
    stepRender?: boolean;
}

export class PageRenderer {
    private shortcodeRenderer: ShortcodeRenderer;
    private defaultOptions: PageRenderOptions = {
        preserveFrontmatter: false,
        showWarnings: true,
        preserveUnknownShortcodes: true
    };
    // 存储中间步骤的渲染结果
    private stepRenderCache: Map<string, string> = new Map();

    constructor(shortcodeRenderer: ShortcodeRenderer) {
        this.shortcodeRenderer = shortcodeRenderer;
    }

    /**
     * 渲染页面内容
     * @param content 页面内容
     * @param options 渲染选项
     * @returns 渲染结果
     */
    public render(content: string, options?: PageRenderOptions): PageRenderResult {
        // 使用 PageLexer 解析内容
        const lexerResult = PageLexer.parse(content);
        return this.renderLexerResult(lexerResult, options);
    }

    /**
     * 渲染 PageLexer 解析结果
     * @param lexerResult PageLexer 解析结果
     * @param options 渲染选项
     * @returns 渲染结果
     */
    private renderLexerResult(lexerResult: PageLexerResult, options?: PageRenderOptions): PageRenderResult {
        const opts = { ...this.defaultOptions, ...options };
        
        // 处理 shortcodes
        const processedItems = this.processItems(lexerResult.items, opts);
        
        // 构建内容和摘要
        let content = '';
        let summary = '';
        let summaryFound = false;
        let frontmatter: Record<string, any> | undefined;
        
        // 如果只有 summary divider，返回空内容
        if (processedItems.length === 1 && processedItems[0].type === 'summary_divider') {
            return {
                content: '',
                summary: '',
                hasSummaryDivider: true,
                frontmatter: undefined
            };
        }
        
        // 如果没有任何项目，返回空内容
        if (processedItems.length === 0) {
            return {
                content: '',
                summary: '',
                hasSummaryDivider: false,
                frontmatter: undefined
            };
        }
        
        // 如果只有一个内容项目，直接返回它的值
        if (processedItems.length === 1 && processedItems[0].type === 'content') {
            return {
                content: processedItems[0].val,
                summary: processedItems[0].val.trim(),
                hasSummaryDivider: false,
                frontmatter: undefined
            };
        }
        
        for (let i = 0; i < processedItems.length; i++) {
            const item = processedItems[i];
            const nextItem = i < processedItems.length - 1 ? processedItems[i + 1] : null;
            
            if (item.type === 'frontmatter') {
                if (opts.preserveFrontmatter) {
                    content += item.val;
                    if (!summaryFound) {
                        summary += item.val;
                    }
                }
                continue;
            }
            
            if (item.type === 'summary_divider') {
                summaryFound = true;
                // 确保 summary divider 前后有换行符
                if (content && !content.endsWith('\n')) {
                    content += '\n';
                }
                content += '<!-- more -->';
                // 只有当下一个项目不是 null 且不以换行符开头时，才添加换行符
                if (nextItem && !nextItem.val.startsWith('\n')) {
                    content += '\n';
                }
                continue;
            }
            
            content += item.val;
            if (!summaryFound) {
                summary += item.val;
            }
        }
        
        // 去掉摘要末尾的换行符
        summary = summary.trimEnd();
        
        return {
            content: content,
            summary,
            hasSummaryDivider: lexerResult.hasSummaryDivider,
            frontmatter: this.parseFrontmatter(lexerResult)
        };
    }

    /**
     * 处理解析后的项目
     * @param items 解析后的项目数组
     * @param options 渲染选项
     * @returns 处理后的项目数组
     */
    private processItems(items: PageItem[], options: PageRenderOptions): PageItem[] {
        const result: PageItem[] = [];
        const shortcodeStack: { index: number; item: ShortcodeItem }[] = [];
        const processedRanges = new Set<string>();
        
        // 找到所有的嵌套层级
        const shortcodePairs: { start: number; end: number; item: ShortcodeItem }[] = [];
        
        // 第一遍扫描：找到所有匹配的 shortcode 对
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            if (item.type !== 'shortcode') {
                continue;
            }
            
            const shortcodeItem = item as ShortcodeItem;
            
            if (shortcodeItem.isClosing) {
                const openTag = shortcodeStack.pop();
                if (openTag && openTag.item.name === shortcodeItem.name) {
                    shortcodePairs.push({
                        start: openTag.index,
                        end: i,
                        item: openTag.item
                    });
                }
            } else if (!shortcodeItem.isInline) {
                shortcodeStack.push({ index: i, item: shortcodeItem });
            }
        }
        
        // 计算深度的辅助函数
        const getDepth = (pair: { start: number; end: number }) => {
            let depth = 0;
            let current = pair;
            for (const p of shortcodePairs) {
                if (p.start < current.start && p.end > current.end) {
                    depth++;
                    current = p;
                }
            }
            return depth;
        };
        
        // 按照深度和位置排序
        shortcodePairs.sort((a, b) => {
            const depthA = getDepth(a);
            const depthB = getDepth(b);
            if (depthA !== depthB) {
                return depthB - depthA; // 深度大的先处理
            }
            return a.start - b.start; // 同深度按位置排序
        });
        
        // 创建一个映射来存储已处理的内容
        const processedContent = new Map<string, string>();
        
        // 清除旧的步骤渲染缓存
        if (options.stepRender) {
            this.stepRenderCache.clear();
        }
        
        // 标记用于步骤渲染的占位符
        let placeholderIndex = 0;
        
        // 第二遍扫描：按照深度优先的顺序处理 shortcodes
        for (const pair of shortcodePairs) {
            const range = `${pair.start}-${pair.end}`;
            if (!processedRanges.has(range)) {
                processedRanges.add(range);
                
                // 收集内容：只处理直接子内容
                let content = '';
                let i = pair.start + 1;
                
                while (i < pair.end) {
                    const item = items[i];
                    if (item.type === 'shortcode') {
                        const shortcodeItem = item as ShortcodeItem;
                        if (shortcodeItem.isInline || (!shortcodeItem.isClosing && !shortcodePairs.some(p => p.start === i))) {
                            // 如果是内联 shortcode 或者是没有对应闭合标签的 shortcode
                            if (options.stepRender) {
                                const placeholder = `_mdf_sc_${placeholderIndex++}`;
                                const rendered = this.shortcodeRenderer.renderShortcodeItem(shortcodeItem, undefined, options);
                                this.stepRenderCache.set(placeholder, rendered);
                                content += placeholder;
                            } else {
                                const rendered = this.shortcodeRenderer.renderShortcodeItem(shortcodeItem, undefined, options);
                                content += rendered;
                            }
                            i++;
                        } else if (!shortcodeItem.isClosing) {
                            // 查找这个开始标签对应的范围
                            const innerPair = shortcodePairs.find(p => p.start === i);
                            if (innerPair) {
                                const innerRange = `${innerPair.start}-${innerPair.end}`;
                                const rendered = processedContent.get(innerRange);
                                if (rendered) {
                                    content += rendered;
                                    i = innerPair.end + 1;
                                    continue;
                                }
                            }
                            i++;
                        } else {
                            i++;
                        }
                    } else {
                        content += item.val;
                        i++;
                    }
                }
                
                // 渲染 shortcode
                let rendered;
                if (options.stepRender) {
                    const placeholder = `_mdf_sc_${placeholderIndex++}`;
                    rendered = this.shortcodeRenderer.renderShortcodeItem(pair.item, content, options);
                    this.stepRenderCache.set(placeholder, rendered);
                    processedContent.set(range, placeholder);
                } else {
                    rendered = this.shortcodeRenderer.renderShortcodeItem(pair.item, content, options);
                    processedContent.set(range, rendered);
                }
            }
        }
        
        // 第三遍扫描：处理所有项目
        let i = 0;
        while (i < items.length) {
            const item = items[i];
            
            if (item.type !== 'shortcode') {
                result.push(item);
                i++;
                continue;
            }
            
            const shortcodeItem = item as ShortcodeItem;
            
            if (shortcodeItem.isInline || (!shortcodeItem.isClosing && !shortcodePairs.some(p => p.item.name === shortcodeItem.name && p.start === i))) {
                // 直接渲染内联 shortcode 或没有闭合标签的 shortcode
                if (options.stepRender) {
                    const placeholder = `_mdf_sc_${placeholderIndex++}`;
                    const rendered = this.shortcodeRenderer.renderShortcodeItem(shortcodeItem, undefined, options);
                    this.stepRenderCache.set(placeholder, rendered);
                    result.push({
                        type: 'content',
                        pos: shortcodeItem.pos,
                        val: placeholder
                    });
                } else {
                    const rendered = this.shortcodeRenderer.renderShortcodeItem(shortcodeItem, undefined, options);
                    result.push({
                        type: 'content',
                        pos: shortcodeItem.pos,
                        val: rendered
                    });
                }
                i++;
            } else if (!shortcodeItem.isClosing) {
                // 查找这个开始标签对应的范围
                const pair = shortcodePairs.find(p => p.start === i);
                if (pair) {
                    const range = `${pair.start}-${pair.end}`;
                    const rendered = processedContent.get(range);
                    if (rendered) {
                        result.push({
                            type: 'content',
                            pos: shortcodeItem.pos,
                            val: rendered
                        });
                        i = pair.end + 1;
                        continue;
                    }
                }
                i++;
            } else {
                i++;
            }
        }
        
        return result;
    }

    /**
     * 收集 shortcode 的内容
     * @param items 所有项目
     * @param options 渲染选项
     * @returns 收集到的内容
     */
    private collectContent(items: PageItem[], options: PageRenderOptions): string {
        // 处理这个范围内的项目
        const processedItems = this.processItems(items, options);
        let content = '';
        
        for (const item of processedItems) {
            content += item.val;
        }
        
        return content;
    }

    /**
     * 解析 frontmatter
     * @param lexerResult PageLexer 解析结果
     * @returns 解析后的 frontmatter 对象
     */
    private parseFrontmatter(lexerResult: PageLexerResult): Record<string, any> | undefined {
        if (!lexerResult.hasFrontmatter || !lexerResult.frontmatterFormat) {
            return undefined;
        }
        
        const frontmatterItem = lexerResult.items.find(item => item.type === 'frontmatter');
        if (!frontmatterItem) {
            return undefined;
        }
        
        try {
            // 这里可以根据 frontmatterFormat 使用不同的解析器
            // 目前简单返回原始内容
            return { content: frontmatterItem.val };
        } catch (error) {
            if (this.defaultOptions.showWarnings) {
                console.warn('Error parsing frontmatter:', error);
            }
            return undefined;
        }
    }

    /**
     * 根据第一步的渲染结果，完成最终渲染
     * @param content 经过Markdown渲染的内容，含有占位符
     * @returns 最终渲染后的内容
     */
    public finalRender(content: string): string {
        // 没有缓存内容，直接返回原内容
        if (this.stepRenderCache.size === 0) {
            return content;
        }
        
        // 替换所有占位符
        let result = content;
        for (const [placeholder, rendered] of this.stepRenderCache.entries()) {
            result = result.replace(new RegExp(placeholder, 'g'), rendered);
        }
        
        return result;
    }
} 