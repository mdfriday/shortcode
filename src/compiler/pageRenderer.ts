/**
 * PageRenderer - 处理整个页面的渲染
 * 作为渲染过程的总协调者
 */

import { PageLexer, PageLexerResult, PageItem, ShortcodeItem } from './pageLexer';
import { ShortcodeRenderer } from './shortcodeRenderer';
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import markedKatex from "marked-katex-extension";

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
    markedContent?: boolean;
}

export class PageRenderer {
    private markedInstance: Marked;
    private shortcodeRenderer: ShortcodeRenderer;
    private defaultOptions: PageRenderOptions = {
        preserveFrontmatter: false,
        showWarnings: true,
        preserveUnknownShortcodes: true,
        markedContent: false
    };
    // 存储中间步骤的渲染结果
    private stepRenderCache: Map<string, string> = new Map();

    constructor(shortcodeRenderer: ShortcodeRenderer) {
        this.shortcodeRenderer = shortcodeRenderer;
        this.markedInstance = new Marked(
            markedHighlight({
                emptyLangClass: "hljs",
                langPrefix: "hljs language-",
                highlight(code, lang) {
                    const language = hljs.getLanguage(lang) ? lang : "plaintext";

                    return hljs.highlight(code, { language }).value;
                },
            }),
            markedKatex({}),
            {
                breaks: true,
            },
        );
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
                        let itemVal: string | Promise<string> = item.val;
                        if (item.type === 'content' && options.markedContent) {
                            itemVal = this.markedInstance.parse(itemVal);
                        }
                        content += itemVal;
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
        
        // 预处理缓存中的嵌套占位符
        this.processNestedInCache();
        
        // 使用递归方法处理嵌套占位符
        return this.processNestedPlaceholders(content);
    }

    /**
     * 预处理缓存中的嵌套占位符，确保缓存内容是完整渲染的
     * @private
     */
    private processNestedInCache(): void {
        // 我们需要递归处理嵌套占位符，所以我们需要从最小的占位符开始
        // 首先找出所有的嵌套关系
        
        // 收集占位符映射表：记录哪些占位符包含其他占位符
        const placeholderMap = new Map<string, Set<string>>();
        
        // 初始化映射表
        for (const [placeholder, content] of this.stepRenderCache.entries()) {
            const nestedPlaceholders = content.match(/_mdf_sc_\d+/g);
            if (nestedPlaceholders) {
                const uniqueNested = new Set(nestedPlaceholders);
                placeholderMap.set(placeholder, uniqueNested);
            }
        }
        
        // 标记占位符深度（0 表示没有嵌套占位符）
        const placeholderDepth = new Map<string, number>();
        
        // 计算每个占位符的深度
        const calculateDepth = (placeholder: string, visited = new Set<string>()): number => {
            // 防止循环引用
            if (visited.has(placeholder)) {
                return 0;
            }
            
            visited.add(placeholder);
            
            // 如果已经计算过深度，直接返回
            if (placeholderDepth.has(placeholder)) {
                return placeholderDepth.get(placeholder)!;
            }
            
            // 获取该占位符包含的所有嵌套占位符
            const nestedPlaceholders = placeholderMap.get(placeholder);
            
            // 如果没有嵌套占位符，深度为0
            if (!nestedPlaceholders || nestedPlaceholders.size === 0) {
                placeholderDepth.set(placeholder, 0);
                return 0;
            }
            
            // 计算所有嵌套占位符的最大深度
            let maxDepth = 0;
            for (const nestedPlaceholder of nestedPlaceholders) {
                const depth = calculateDepth(nestedPlaceholder, new Set(visited));
                maxDepth = Math.max(maxDepth, depth);
            }
            
            // 自身深度为最大嵌套深度 + 1
            const depth = maxDepth + 1;
            placeholderDepth.set(placeholder, depth);
            return depth;
        };
        
        // 计算所有占位符的深度
        for (const placeholder of this.stepRenderCache.keys()) {
            if (!placeholderDepth.has(placeholder)) {
                calculateDepth(placeholder);
            }
        }
        
        // 按深度排序占位符（深度较小的先处理）
        const sortedPlaceholders = Array.from(this.stepRenderCache.keys()).sort((a, b) => 
            (placeholderDepth.get(a) || 0) - (placeholderDepth.get(b) || 0)
        );
        
        // 从底层开始，逐层处理占位符
        const processedCache = new Map<string, string>();
        
        // 处理各个占位符
        for (const placeholder of sortedPlaceholders) {
            const content = this.stepRenderCache.get(placeholder)!;
            
            // 检查内容中是否有占位符
            const nestedPlaceholders = content.match(/_mdf_sc_\d+/g);
            
            if (!nestedPlaceholders) {
                // 没有嵌套占位符，直接保存
                processedCache.set(placeholder, content);
                continue;
            }
            
            // 处理嵌套占位符
            let processedContent = content;
            
            // 替换占位符
            for (const nestedPlaceholder of new Set(nestedPlaceholders)) {
                // 使用已处理的缓存内容（如果有的话）或原始缓存内容
                const replacementContent = processedCache.has(nestedPlaceholder) 
                    ? processedCache.get(nestedPlaceholder)!
                    : this.stepRenderCache.get(nestedPlaceholder)!;
                
                // 替换占位符
                processedContent = processedContent.replace(
                    new RegExp(nestedPlaceholder, 'g'),
                    replacementContent
                );
            }
            
            // 保存处理后的内容
            processedCache.set(placeholder, processedContent);
        }
        
        // 更新原始缓存
        this.stepRenderCache = processedCache;
    }

    /**
     * 递归处理内容中的嵌套占位符
     * @param content 包含占位符的内容
     * @returns 处理后的内容，所有占位符都被替换
     * @private
     */
    private processNestedPlaceholders(content: string): string {
        // 检查内容中是否还有占位符
        const placeholderRegex = /_mdf_sc_\d+/g;
        const placeholders = content.match(placeholderRegex);
        
        if (!placeholders) {
            return content; // 没有占位符，直接返回
        }
        
        // 替换所有占位符
        let processedContent = content;
        for (const placeholder of placeholders) {
            if (this.stepRenderCache.has(placeholder)) {
                // 获取缓存的内容（已经处理过嵌套占位符）
                const nestedContent = this.stepRenderCache.get(placeholder)!;
                processedContent = processedContent.replace(new RegExp(placeholder, 'g'), nestedContent);
            }
        }
        
        return processedContent;
    }

    /**
     * 获取指定占位符的预处理后的缓存内容
     * 这个方法会先确保缓存中的内容都已经预处理好嵌套占位符
     * @param placeholder 占位符
     * @returns 预处理后的内容，如果占位符不存在则返回null
     */
    public getProcessedCacheContent(placeholder: string): string | null {
        // 预处理缓存
        this.processNestedInCache();
        
        // 返回指定占位符的缓存内容
        return this.stepRenderCache.has(placeholder) 
            ? this.stepRenderCache.get(placeholder)! 
            : null;
    }

    /**
     * 获取当前的步骤渲染缓存
     * 用于测试和调试目的
     * @returns 预处理后的缓存
     */
    public getStepRenderCache(): Map<string, string> {
        // 预处理缓存
        this.processNestedInCache();
        
        // 返回缓存
        return this.stepRenderCache;
    }
} 