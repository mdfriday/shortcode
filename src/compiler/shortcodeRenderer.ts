/**
 * ShortcodeRenderer - 渲染 shortcodes
 * 专注于单个 shortcode 的渲染
 */

import { ShortcodeItem } from './pageLexer';
import { New, Template } from '@mdfriday/text-template';

/**
 * Shortcode 类型
 */
export type ShortcodeType = 'function' | 'template';

/**
 * 基础数据提供者接口
 */
export interface BaseDataProvider {
    Get: (paramName: string | number) => string | undefined;
    content?: string;
    [key: string]: any;
}

/**
 * 模板 Shortcode 配置
 */
export interface TemplateShortcodeConfig {
    template: string;
    funcMap?: Map<string, (...args: any[]) => any>;
    dataProvider?: (params: string[], content?: string) => Record<string, any>;
}

/**
 * Shortcode 定义
 */
export interface Shortcode {
    name: string;
    type: ShortcodeType;
    render: (params: string[], content?: string) => string;
    template?: Template;
}

/**
 * 渲染选项
 */
export interface RenderOptions {
    /** 是否保留未知 shortcode 的原始标记 */
    preserveUnknownShortcodes?: boolean;
    /** 是否在控制台输出警告 */
    showWarnings?: boolean;
    /** 自定义错误处理函数 */
    onError?: (error: Error, shortcodeName: string) => string;
}

/**
 * ShortcodeRenderer 类
 * 用于注册和渲染单个 shortcode
 */
export class ShortcodeRenderer {
    private shortcodes: Map<string, Shortcode> = new Map();
    private defaultOptions: RenderOptions = {
        preserveUnknownShortcodes: true,
        showWarnings: true
    };

    /**
     * 构造函数
     * @param options 渲染选项
     */
    constructor(options?: RenderOptions) {
        this.defaultOptions = { ...this.defaultOptions, ...options };
    }

    /**
     * 注册一个函数类型的 shortcode
     * @param name shortcode 名称
     * @param renderFn 渲染函数
     */
    public registerShortcode(name: string, renderFn: (params: string[], content?: string) => string): void {
        this.shortcodes.set(name, {
            name,
            type: 'function',
            render: renderFn
        });
    }

    /**
     * 创建基础数据提供者
     * @param params shortcode 参数
     * @param content shortcode 内容
     * @returns 基础数据提供者对象
     */
    private createBaseDataProvider(params: string[], content?: string): BaseDataProvider {
        return {
            Get: (paramName: string | number): string | undefined => {
                if (typeof paramName === 'number') {
                    return params[paramName];
                }
                // Named parameters in the format name="value"
                const namedParam = params.find(p => p.startsWith(`${paramName}=`));
                if (namedParam) {
                    return namedParam.split('=')[1].replace(/^["']|["']$/g, '');
                }
                return undefined;
            },
            content
        };
    }

    /**
     * 注册一个模板类型的 shortcode
     * @param name shortcode 名称
     * @param config 模板 shortcode 配置
     */
    public registerTemplateShortcode(name: string, config: TemplateShortcodeConfig): void {
        const tmpl = New(name);
        
        if (config.funcMap) {
            tmpl.Funcs(config.funcMap);
        }

        const [parsedTmpl, parseErr] = tmpl.Parse(config.template);
        if (parseErr) {
            throw new Error(`Failed to parse template for shortcode ${name}: ${parseErr}`);
        }

        this.shortcodes.set(name, {
            name,
            type: 'template',
            template: parsedTmpl,
            render: (params: string[], content?: string) => {
                try {
                    // 创建基础数据提供者
                    const baseData = this.createBaseDataProvider(params, content);
                    
                    // 合并用户提供的数据
                    const userData = config.dataProvider ? config.dataProvider(params, content) : {};
                    const data = {
                        ...baseData,
                        ...userData
                    };

                    const [result, execErr] = parsedTmpl.Execute(data);
                    if (execErr) {
                        throw new Error(`Template execution error: ${execErr}`);
                    }
                    return result;
                } catch (error) {
                    throw new Error(`Failed to render template shortcode ${name}: ${error instanceof Error ? error.message : String(error)}`);
                }
            }
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
     * @param shortcodeItem shortcode 项
     * @param content shortcode 的内容
     * @param options 渲染选项
     * @returns 渲染结果
     */
    public renderShortcodeItem(shortcodeItem: ShortcodeItem, content?: string, options?: RenderOptions): string {
        const opts = { ...this.defaultOptions, ...options };
        const shortcode = this.getShortcode(shortcodeItem.name);
        
        if (!shortcode) {
            if (opts.showWarnings) {
                console.warn(`Unknown shortcode: ${shortcodeItem.name}`);
            }
            
            if (opts.preserveUnknownShortcodes) {
                // 保留原始标记
                if (shortcodeItem.isClosing) {
                    return shortcodeItem.val;
                }
                if (content) {
                    return shortcodeItem.val + content + `{{< /${shortcodeItem.name} >}}`;
                }
                return shortcodeItem.val;
            }
            
            return content || '';
        }
        
        try {
            return shortcode.render(shortcodeItem.params, content);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error rendering shortcode ${shortcodeItem.name}:`, errorMessage);
            
            if (opts.onError) {
                return opts.onError(error instanceof Error ? error : new Error(String(error)), shortcodeItem.name);
            }
            
            return `Error rendering shortcode ${shortcodeItem.name}: ${errorMessage}`;
        }
    }
} 