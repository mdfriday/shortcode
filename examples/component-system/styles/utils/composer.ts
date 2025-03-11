import { ComponentStyles, ComponentVariant, ComponentSize, ComponentState } from './types';

/**
 * 样式组合器工具
 */
export class StyleComposer {
    /**
     * 合并样式类名
     * @param baseClasses 基础类名
     * @param additionalClasses 额外类名
     * @returns 合并后的类名
     */
    static merge(baseClasses: string, additionalClasses?: string): string {
        if (!additionalClasses) return baseClasses;
        return `${baseClasses} ${additionalClasses}`;
    }

    /**
     * 组合组件样式
     * @param component 组件样式配置
     * @param variant 变体
     * @param size 尺寸
     * @param state 状态
     * @returns 组合后的类名
     */
    static compose(component: any, variant: string, size?: string, state?: string): string {
        if (!component) return '';
        
        let classes = component.base || '';
        
        if (variant && component.variants?.[variant]) {
            classes = this.merge(classes, component.variants[variant]);
        }
        
        if (size && component.sizes?.[size]) {
            classes = this.merge(classes, component.sizes[size]);
        }
        
        if (state && component.states?.[state]) {
            classes = this.merge(classes, component.states[state]);
        }
        
        return classes;
    }

    /**
     * 条件样式组合
     * @param conditions 条件对象
     * @returns 样式类名字符串
     */
    static conditional(conditions: { [key: string]: boolean }): string {
        return Object.entries(conditions)
            .filter(([_, value]) => value)
            .map(([className]) => className)
            .join(' ');
    }
} 