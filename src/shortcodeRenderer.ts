/**
 * ShortcodeRenderer - 渲染 shortcodes
 * 这是 ShortcodeRenderer 的改进版本，修复了测试中发现的问题
 */

import { PageLexer, ShortcodeItem } from './pageLexer';

/**
 * Shortcode 定义
 */
export interface Shortcode {
    name: string;
    render: (params: string[], content?: string) => string;
}

/**
 * 渲染选项
 */
export interface RenderOptions {
    /** 是否保留未知 shortcode 的原始标记 */
    preserveUnknownShortcodes?: boolean;
    /** 是否在控制台输出警告 */
    showWarnings?: boolean;
    /** 是否保留 frontmatter */
    preserveFrontmatter?: boolean;
    /** 自定义错误处理函数 */
    onError?: (error: Error, shortcodeName: string) => string;
}

/**
 * ShortcodeEntry 定义，用于跟踪 shortcode 处理状态
 */
interface ShortcodeEntry {
    shortcode: ShortcodeItem;
    content?: string;
    endPos?: number;
    processed?: boolean;
}

/**
 * ShortcodeRenderer 类
 * 用于注册和渲染 shortcodes
 */
export class ShortcodeRenderer {
    private shortcodes: Map<string, Shortcode> = new Map();
    private defaultOptions: RenderOptions = {
        preserveUnknownShortcodes: true,
        showWarnings: true,
        preserveFrontmatter: false
    };

    /**
     * 构造函数
     * @param options 渲染选项
     */
    constructor(options?: RenderOptions) {
        this.defaultOptions = { ...this.defaultOptions, ...options };
    }

    /**
     * 注册一个 shortcode
     * @param name shortcode 名称
     * @param renderFn 渲染函数
     */
    public registerShortcode(name: string, renderFn: (params: string[], content?: string) => string): void {
        this.shortcodes.set(name, {
            name,
            render: renderFn
        });
    }

    /**
     * 批量注册 shortcodes
     * @param shortcodes shortcode 对象
     */
    public registerShortcodes(shortcodes: Record<string, (params: string[], content?: string) => string>): void {
        for (const [name, renderFn] of Object.entries(shortcodes)) {
            this.registerShortcode(name, renderFn);
        }
    }

    /**
     * 获取一个 shortcode
     * @param name shortcode 名称
     * @returns shortcode 对象或 undefined
     */
    public getShortcode(name: string): Shortcode | undefined {
        return this.shortcodes.get(name);
    }

    /**
     * 渲染一个 shortcode
     * @param name shortcode 名称
     * @param params 参数数组
     * @param content 内容（可选）
     * @param options 渲染选项
     * @returns 渲染结果
     */
    public renderShortcode(
        name: string, 
        params: string[], 
        content?: string, 
        options?: RenderOptions
    ): string {
        const opts = { ...this.defaultOptions, ...options };
        const shortcode = this.getShortcode(name);
        
        if (!shortcode) {
            if (opts.showWarnings) {
                console.warn(`Unknown shortcode: ${name}`);
            }
            
            if (opts.preserveUnknownShortcodes) {
                // 保留原始标记
                let original = `{{< ${name} `;
                if (params.length > 0) {
                    original += params.join(' ');
                }
                if (content) {
                    original += ` >}}${content}{{< /${name} >}}`;
                } else {
                    original += ` >}}`;
                }
                return original;
            }
            
            // 返回内容或空字符串
            return content || '';
        }
        
        try {
            // 处理嵌套的 shortcodes
            let processedContent = content;
            if (content && content.includes('{{<')) {
                // 使用正则表达式匹配嵌套的 shortcodes
                const shortcodeRegex = /{{<\s*([a-zA-Z0-9_.-]+)(?:\s+([^>]*?))?\s*>}}([\s\S]*?){{<\s*\/\s*\1\s*>}}/g;
                processedContent = content.replace(shortcodeRegex, (match, nestedName, nestedParams, nestedContent) => {
                    const parsedParams = nestedParams ? ShortcodeRenderer.parseParams(nestedParams) : [];
                    return this.renderShortcode(nestedName, parsedParams, nestedContent, opts);
                });
            }
            
            // 调用渲染函数，确保传递正确的参数
            return shortcode.render(params, processedContent);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error rendering shortcode ${name}:`, errorMessage);
            
            if (opts.onError) {
                return opts.onError(error instanceof Error ? error : new Error(String(error)), name);
            }
            
            return `Error rendering shortcode ${name}: ${errorMessage}`;
        }
    }

    /**
     * 解析并渲染文本中的 shortcodes
     * @param text 包含 shortcodes 的文本
     * @param options 渲染选项
     * @returns 渲染后的文本
     */
    public parseAndRender(text: string, options?: RenderOptions): string {
        if (!text) {
            return '';
        }
        
        const opts = { ...this.defaultOptions, ...options };
        
        // 检查是否有 frontmatter
        const frontmatterRegex = /^(---|\+\+\+|{{)[\s\S]*?(---|\+\+\+|}})[\r\n]*/;
        let frontmatter = '';
        let content = text;
        
        const frontmatterMatch = text.match(frontmatterRegex);
        if (frontmatterMatch) {
            frontmatter = frontmatterMatch[0];
            content = text.substring(frontmatterMatch[0].length);
            
            // 如果不保留 frontmatter，则从结果中移除
            if (!opts.preserveFrontmatter) {
                text = content;
            }
        }
        
        // 匹配带内容的 shortcodes: {{< name params >}}content{{< /name >}}
        const shortcodeWithContentRegex = /{{<\s*([a-zA-Z0-9_.-]+)(?:\s+([^>]*?))?\s*>}}([\s\S]*?){{<\s*\/\s*\1\s*>}}/g;
        
        // 匹配内联 shortcodes: {{< name params />}}
        const inlineShortcodeRegex = /{{<\s*([a-zA-Z0-9_.-]+)(?:\s+([^>]*?))?\s*\/\s*>}}/g;
        
        // 匹配不带内容的 shortcodes: {{< name params >}}
        const shortcodeWithoutContentRegex = /{{<\s*([a-zA-Z0-9_.-]+)(?:\s+([^>]*?))?\s*>}}/g;
        
        // 使用一个函数来处理替换，以便递归处理嵌套的 shortcodes
        const processShortcodes = (input: string): string => {
            // 先处理带内容的 shortcodes
            let processed = input.replace(shortcodeWithContentRegex, (match, name, paramsStr, content) => {
                // 递归处理内容中的嵌套 shortcodes
                const processedContent = processShortcodes(content);
                const params = paramsStr ? ShortcodeRenderer.parseParams(paramsStr) : [];
                return this.renderShortcode(name, params, processedContent, opts);
            });
            
            // 处理内联 shortcodes
            processed = processed.replace(inlineShortcodeRegex, (match, name, paramsStr) => {
                const params = paramsStr ? ShortcodeRenderer.parseParams(paramsStr) : [];
                return this.renderShortcode(name, params, undefined, opts);
            });
            
            // 处理不带内容的 shortcodes
            processed = processed.replace(shortcodeWithoutContentRegex, (match, name, paramsStr) => {
                const params = paramsStr ? ShortcodeRenderer.parseParams(paramsStr) : [];
                return this.renderShortcode(name, params, undefined, opts);
            });
            
            return processed;
        };
        
        // 处理所有 shortcodes
        let result = processShortcodes(text);
        
        return result;
    }

    /**
     * 渲染解析后的内容
     * @param parsed PageLexer 解析结果
     * @param options 渲染选项
     * @returns 渲染后的文本
     */
    public renderParsedContent(parsed: { items: any[] }, options?: RenderOptions): string {
        const opts = { ...this.defaultOptions, ...options };
        let result = '';
        
        // 第一遍：收集所有 shortcodes 及其内容
        const shortcodeMap = new Map<number, ShortcodeEntry>();
        
        const closingShortcodes = new Map<string, number[]>();
        
        // 收集所有 shortcodes
        for (let i = 0; i < parsed.items.length; i++) {
            const item = parsed.items[i];
            
            if (item.type === 'shortcode') {
                const shortcodeItem = item as ShortcodeItem;
                
                if (shortcodeItem.isClosing) {
                    // 收集闭合标签
                    if (!closingShortcodes.has(shortcodeItem.name)) {
                        closingShortcodes.set(shortcodeItem.name, []);
                    }
                    closingShortcodes.get(shortcodeItem.name)?.push(i);
                } else {
                    // 收集开始标签
                    shortcodeMap.set(i, { shortcode: shortcodeItem });
                }
            }
        }
        
        // 匹配开始和结束标签
        for (const [index, entry] of shortcodeMap.entries()) {
            const { shortcode } = entry;
            
            // 如果不是内联 shortcode，查找对应的闭合标签
            if (!shortcode.isInline) {
                const closingIndices = closingShortcodes.get(shortcode.name) || [];
                
                // 找到第一个匹配的闭合标签
                for (let i = 0; i < closingIndices.length; i++) {
                    const closingIndex = closingIndices[i];
                    
                    if (closingIndex > index) {
                        // 提取开始和结束标签之间的内容
                        let content = '';
                        for (let j = index + 1; j < closingIndex; j++) {
                            const contentItem = parsed.items[j];
                            if (contentItem.type === 'content') {
                                content += contentItem.val;
                            } else if (contentItem.type === 'shortcode' && !contentItem.isClosing) {
                                // 标记这个 shortcode 已经被处理过
                                const existingEntry = shortcodeMap.get(j);
                                if (existingEntry) {
                                    shortcodeMap.set(j, { ...existingEntry, processed: true });
                                }
                            }
                        }
                        
                        // 更新 shortcode 条目
                        shortcodeMap.set(index, { 
                            ...entry, 
                            content, 
                            endPos: closingIndex 
                        });
                        
                        // 从闭合标签列表中移除已匹配的标签
                        closingIndices.splice(i, 1);
                        break;
                    }
                }
            }
        }
        
        // 第二遍：渲染内容
        for (let i = 0; i < parsed.items.length; i++) {
            const item = parsed.items[i];
            
            if (item.type === 'shortcode') {
                const entry = shortcodeMap.get(i);
                
                // 如果这个 shortcode 已经被处理过，跳过
                if (entry && entry.processed) {
                    continue;
                }
                
                // 如果是开始标签，渲染 shortcode
                if (entry && !item.isClosing) {
                    const { shortcode, content } = entry;
                    
                    result += this.renderShortcode(
                        shortcode.name,
                        shortcode.params,
                        content,
                        opts
                    );
                    
                    // 如果有结束位置，跳过中间的内容和结束标签
                    if (entry.endPos) {
                        i = entry.endPos;
                    }
                }
                // 如果是未匹配的闭合标签，根据选项决定是否保留
                else if (item.isClosing) {
                    if (opts.preserveUnknownShortcodes) {
                        result += `{{< /${item.name} >}}`;
                    }
                }
            } else if (item.type === 'content') {
                result += item.val;
            } else if (item.type === 'frontmatter' && opts.preserveFrontmatter) {
                result += item.val;
            }
            // 忽略 summary_divider
        }
        
        return result;
    }

    /**
     * 解析参数文本
     * @param paramsText 参数文本
     * @returns 参数数组
     */
    public static parseParams(paramsText: string): string[] {
        if (!paramsText || !paramsText.trim()) {
            return [];
        }
        
        // 特殊处理内联标记
        if (paramsText.trim() === '/') {
            return [];
        }
        
        const params: string[] = [];
        let current = '';
        let inQuote = false;
        let quoteChar = '';
        
        for (let i = 0; i < paramsText.length; i++) {
            const char = paramsText[i];
            
            // 处理引号
            if ((char === '"' || char === "'") && (i === 0 || paramsText[i - 1] !== '\\')) {
                if (!inQuote) {
                    inQuote = true;
                    quoteChar = char;
                    current += char; // 保留引号
                } else if (char === quoteChar) {
                    inQuote = false;
                    quoteChar = '';
                    current += char; // 保留引号
                    
                    // 如果引号结束，添加参数并重置
                    params.push(current);
                    current = '';
                } else {
                    current += char;
                }
                continue;
            }
            
            // 处理空格
            if (char === ' ' && !inQuote) {
                if (current) {
                    params.push(current);
                    current = '';
                }
                continue;
            }
            
            // 添加字符
            current += char;
        }
        
        // 添加最后一个参数
        if (current) {
            params.push(current);
        }
        
        return params;
    }

    /**
     * 一站式处理 Markdown 内容
     * @param content Markdown 内容
     * @param options 渲染选项
     * @returns 处理结果
     */
    public processMarkdown(content: string, options?: RenderOptions): {
        content: string;
        frontmatter: string | null;
        hasSummaryDivider: boolean;
    } {
        const opts = { ...this.defaultOptions, ...options };
        
        // 使用 PageLexer 解析内容
        const parsed = PageLexer.parse(content);
        
        // 提取 frontmatter
        let frontmatter: string | null = null;
        if (parsed.hasFrontmatter) {
            for (const item of parsed.items) {
                if (item.type === 'frontmatter') {
                    frontmatter = item.val;
                    break;
                }
            }
        }
        
        // 渲染内容
        const renderedContent = this.renderParsedContent(parsed, opts);
        
        return {
            content: renderedContent,
            frontmatter,
            hasSummaryDivider: parsed.hasSummaryDivider
        };
    }
} 