/**
 * PageLexer - 解析markdown内容，提取frontmatter、summary divider、shortcodes和content
 * 这是 PageLexer 的改进版本，修复了测试中发现的问题
 */

export interface PageItem {
    type: 'frontmatter' | 'shortcode' | 'summary_divider' | 'content';
    pos: number;
    val: string;
}

export interface ShortcodeItem extends PageItem {
    type: 'shortcode';
    name: string;
    params: string[];
    isClosing: boolean;
    isInline: boolean;
}

export interface PageLexerResult {
    items: PageItem[];
    frontmatterFormat: string | null;
    hasFrontmatter: boolean;
    hasSummaryDivider: boolean;
}

export class PageLexer {
    private static readonly frontmatterOpenPattern = /^(---|\+\+\+|{{\s*$)/;
    private static readonly frontmatterClosePattern = {
        '---': /^---\s*$/,
        '+++': /^\+\+\+\s*$/,
        '{{': /^}}\s*$/
    };
    private static readonly summaryDividerPattern = /^<!--\s*more\s*-->\s*$/m;
    
    // 改进的 shortcode 开始标记正则表达式
    private static readonly shortcodeStartPattern = /{{<\s*(\/)?\s*([a-zA-Z0-9_.-]+)/g;

    /**
     * 解析markdown内容
     * @param content markdown内容
     * @returns 解析结果
     */
    public static parse(content: string): PageLexerResult {
        const items: PageItem[] = [];
        let hasFrontmatter = false;
        let frontmatterFormat: string | null = null;
        let hasSummaryDivider = false;
        let currentContent = content;
        let currentPos = 0;
        
        // 处理frontmatter
        const frontmatterResult = this.extractFrontmatter(currentContent);
        if (frontmatterResult.hasFrontmatter) {
            hasFrontmatter = true;
            frontmatterFormat = frontmatterResult.format;
            items.push({
                type: 'frontmatter',
                pos: 0,
                val: frontmatterResult.content
            });
            currentContent = frontmatterResult.remainingContent;
            currentPos = frontmatterResult.content.length + 1;
        }
        
        // 处理 summary divider 和剩余内容
        this.processSummaryDividerAndContent(currentContent, currentPos, items);
        
        return {
            items,
            frontmatterFormat,
            hasFrontmatter,
            hasSummaryDivider: items.some(item => item.type === 'summary_divider')
        };
    }
    
    /**
     * 处理 summary divider 和剩余内容
     * @param content 要处理的内容
     * @param startPos 内容的起始位置
     * @param items 解析结果项目数组
     */
    private static processSummaryDividerAndContent(content: string, startPos: number, items: PageItem[]): void {
        const summaryDividerMatch = content.match(this.summaryDividerPattern);
        
        if (!summaryDividerMatch) {
            // 没有 summary divider，直接处理整个内容中的 shortcodes
            this.parseContentWithShortcodes(content, startPos, items);
            return;
        }
        
        const dividerPos = summaryDividerMatch.index!;
        const beforeDivider = content.substring(0, dividerPos);
        const afterDivider = content.substring(dividerPos + summaryDividerMatch[0].length);
        
        // 处理 summary divider 前的内容中的 shortcodes
        this.parseContentWithShortcodes(beforeDivider, startPos, items);
        
        // 添加 summary divider
        items.push({
            type: 'summary_divider',
            pos: startPos + dividerPos,
            val: summaryDividerMatch[0]
        });
        
        // 处理 summary divider 后的内容中的 shortcodes
        this.parseContentWithShortcodes(afterDivider, startPos + dividerPos + summaryDividerMatch[0].length, items);
    }
    
    /**
     * 解析包含 shortcodes 的内容
     * @param content 要解析的内容
     * @param startPos 内容的起始位置
     * @param items 解析结果项目数组
     */
    private static parseContentWithShortcodes(content: string, startPos: number, items: PageItem[]): void {
        let lastPos = 0;
        let currentPos = 0;
        
        while (currentPos < content.length) {
            // 查找下一个可能的 shortcode 开始位置
            const nextShortcodePos = content.indexOf('{{<', currentPos);
            
            if (nextShortcodePos === -1) {
                // 没有更多 shortcode，添加剩余内容
                if (currentPos < content.length) {
                    items.push({
                        type: 'content',
                        pos: startPos + currentPos,
                        val: content.substring(currentPos)
                    });
                }
                break;
            }
            
            // 添加 shortcode 前的内容
            if (nextShortcodePos > currentPos) {
                items.push({
                    type: 'content',
                    pos: startPos + currentPos,
                    val: content.substring(currentPos, nextShortcodePos)
                });
            }
            
            // 尝试解析 shortcode
            const shortcodeResult = this.parseShortcode(content.substring(nextShortcodePos));
            
            if (shortcodeResult) {
                // 添加解析到的 shortcode
                items.push({
                    type: 'shortcode',
                    pos: startPos + nextShortcodePos,
                    val: shortcodeResult.original,
                    name: shortcodeResult.name,
                    params: shortcodeResult.params,
                    isClosing: shortcodeResult.isClosing,
                    isInline: shortcodeResult.isInline
                } as ShortcodeItem);
                
                // 更新当前位置
                currentPos = nextShortcodePos + shortcodeResult.original.length;
            } else {
                // 解析失败，将 {{< 当作普通内容，继续向前
                items.push({
                    type: 'content',
                    pos: startPos + nextShortcodePos,
                    val: '{{<'
                });
                currentPos = nextShortcodePos + 3;
            }
        }
    }
    
    /**
     * 解析单个 shortcode
     * @param input 输入字符串，以 {{< 开头
     * @returns 解析结果，如果不是有效的 shortcode 则返回 null
     */
    private static parseShortcode(input: string): {
        original: string;
        name: string;
        params: string[];
        isClosing: boolean;
        isInline: boolean;
    } | null {
        // 重置正则
        this.shortcodeStartPattern.lastIndex = 0;
        
        // 匹配开头部分
        const startMatch = this.shortcodeStartPattern.exec(input);
        if (!startMatch) return null;
        
        const isClosing = !!startMatch[1];
        const name = startMatch[2];
        let pos = this.shortcodeStartPattern.lastIndex;
        
        // 解析参数部分和结束部分
        let params: string[] = [];
        let isInline = false;
        let inQuote = false;
        let quoteChar = '';
        let currentParam = '';
        let found = false;
        
        while (pos < input.length) {
            const char = input[pos];
            const nextChar = pos + 1 < input.length ? input[pos + 1] : '';
            
            if (!inQuote) {
                // 检查是否遇到引号
                if (char === '"' || char === "'") {
                    inQuote = true;
                    quoteChar = char;
                    currentParam += char;
                }
                // 检查是否遇到内联结束标记
                else if (char === '/' && nextChar === '>') {
                    isInline = true;
                    pos += 2;
                    // 跳过剩余的 }}}
                    while (pos < input.length && input[pos] === '}') pos++;
                    found = true;
                    break;
                }
                // 检查是否遇到常规结束标记
                else if (char === '>' && nextChar === '}') {
                    pos += 2;
                    // 跳过剩余的 }
                    while (pos < input.length && input[pos] === '}') pos++;
                    found = true;
                    break;
                }
                // 空格表示参数之间的分隔
                else if (char === ' ' || char === '\t') {
                    if (currentParam.trim()) {
                        params.push(currentParam.trim());
                        currentParam = '';
                    }
                }
                else {
                    currentParam += char;
                }
            }
            else {
                // 在引号内
                // 检查是否遇到匹配的结束引号
                if (char === quoteChar && input[pos - 1] !== '\\') {
                    inQuote = false;
                    currentParam += char;
                    params.push(currentParam.trim());
                    currentParam = '';
                }
                else {
                    currentParam += char;
                }
            }
            
            pos++;
        }
        
        // 添加最后一个参数（如果有）
        if (currentParam.trim() && !isInline) {
            params.push(currentParam.trim());
        }
        
        if (!found) return null;
        
        return {
            original: input.substring(0, pos),
            name,
            params,
            isClosing,
            isInline
        };
    }
    
    /**
     * 提取frontmatter
     * @param content markdown内容
     * @returns frontmatter提取结果
     */
    private static extractFrontmatter(content: string): {
        hasFrontmatter: boolean;
        format: string | null;
        content: string;
        remainingContent: string;
    } {
        const lines = content.split('\n');
        if (lines.length === 0) {
            return {
                hasFrontmatter: false,
                format: null,
                content: '',
                remainingContent: content
            };
        }
        
        const firstLine = lines[0].trim();
        const match = firstLine.match(this.frontmatterOpenPattern);
        
        if (!match) {
            return {
                hasFrontmatter: false,
                format: null,
                content: '',
                remainingContent: content
            };
        }
        
        const format = match[1];
        const closePattern = this.frontmatterClosePattern[format as keyof typeof this.frontmatterClosePattern];
        
        if (!closePattern) {
            return {
                hasFrontmatter: false,
                format: null,
                content: '',
                remainingContent: content
            };
        }
        
        let endIndex = -1;
        for (let i = 1; i < lines.length; i++) {
            if (closePattern.test(lines[i].trim())) {
                endIndex = i;
                break;
            }
        }
        
        if (endIndex === -1) {
            return {
                hasFrontmatter: false,
                format: null,
                content: '',
                remainingContent: content
            };
        }
        
        const frontmatterContent = lines.slice(0, endIndex + 1).join('\n');
        const remainingContent = lines.slice(endIndex + 1).join('\n');
        
        return {
            hasFrontmatter: true,
            format,
            content: frontmatterContent,
            remainingContent
        };
    }
} 