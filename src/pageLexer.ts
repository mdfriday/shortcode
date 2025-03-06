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
    
    // 改进的 shortcode 正则表达式，更准确地匹配 shortcode
    private static readonly shortcodePattern = /{{<\s*(?:(\/)?\s*([a-zA-Z0-9_.-]+)|([a-zA-Z0-9_.-]+)(?:\s+([^>]*?))?\s*(?:\/)?)\s*>}}/g;

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
        let match: RegExpExecArray | null;
        
        // 重置正则表达式
        const regex = new RegExp(this.shortcodePattern);
        regex.lastIndex = 0;
        
        while ((match = regex.exec(content)) !== null) {
            const matchPos = match.index;
            const matchText = match[0];
            
            // 添加 shortcode 前的内容
            if (matchPos > lastPos) {
                items.push({
                    type: 'content',
                    pos: startPos + lastPos,
                    val: content.substring(lastPos, matchPos)
                });
            }
            
            // 解析 shortcode
            const isClosing = !!match[1];
            const name = match[2] || match[3];
            const paramsText = match[4] || '';
            const isInline = matchText.includes('/>')
                || (matchText.includes('/ >'))
                || (matchText.includes('/>}'));
            
            // 解析参数，保留引号
            const params = this.parseShortcodeParams(paramsText);
            
            items.push({
                type: 'shortcode',
                pos: startPos + matchPos,
                val: matchText,
                name,
                params,
                isClosing,
                isInline
            } as ShortcodeItem);
            
            lastPos = matchPos + matchText.length;
        }
        
        // 添加剩余的内容
        if (lastPos < content.length) {
            items.push({
                type: 'content',
                pos: startPos + lastPos,
                val: content.substring(lastPos)
            });
        }
    }
    
    /**
     * 解析 shortcode 参数
     * @param paramsText 参数文本
     * @returns 解析后的参数数组
     */
    private static parseShortcodeParams(paramsText: string): string[] {
        if (!paramsText.trim()) {
            return [];
        }
        
        const params: string[] = [];
        let inQuote = false;
        let quoteChar = '';
        let param = '';
        
        // 跳过参数文本中的 '/' 字符，这是内联 shortcode 的标记，不是参数
        if (paramsText.trim() === '/') {
            return [];
        }
        
        for (let i = 0; i < paramsText.length; i++) {
            const char = paramsText[i];
            
            if ((char === '"' || char === "'") && (i === 0 || paramsText[i-1] !== '\\')) {
                if (!inQuote) {
                    inQuote = true;
                    quoteChar = char;
                    param += char; // 保留引号
                } else if (char === quoteChar) {
                    inQuote = false;
                    param += char; // 保留引号
                    if (param.trim()) {
                        params.push(param.trim());
                        param = '';
                    }
                } else {
                    param += char;
                }
            } else if (char === ' ' && !inQuote) {
                if (param.trim()) {
                    params.push(param.trim());
                    param = '';
                }
            } else {
                param += char;
            }
        }
        
        if (param.trim()) {
            params.push(param.trim());
        }
        
        return params;
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