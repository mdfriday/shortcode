// 组件变体类型
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

// 组件尺寸类型
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';

// 组件状态类型
export type ComponentState = 'default' | 'hover' | 'active' | 'disabled' | 'icon' | 'title' | 'content' | 'quote' | 'author' | 'avatar' | 'name';

// 主题配置接口
export interface ThemeConfig {
    // 颜色
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        border: string;
    };
    
    // 排版
    typography: {
        fontFamily: string;
        fontSize: {
            base: string;
            [key: string]: string;
        };
        fontWeight: {
            normal: string;
            medium: string;
            bold: string;
        };
    };
    
    // 间距
    spacing: {
        [key: string]: string;
    };
    
    // 圆角
    borderRadius: {
        none: string;
        sm: string;
        md: string;
        lg: string;
        full: string;
    };
    
    // 阴影
    shadows: {
        none: string;
        sm: string;
        md: string;
        lg: string;
    };
}

// 组件样式配置接口
export interface ComponentStyles {
    base: string;
    variants: {
        [key in ComponentVariant]: string;
    };
    sizes: {
        [key in ComponentSize]: string;
    };
    states: {
        [key in ComponentState]: string;
    };
}

// 主题组件样式映射
export interface ThemeComponents {
    // 布局组件
    section: ComponentStyles;
    container: ComponentStyles;
    grid: ComponentStyles;
    flex: ComponentStyles;
    
    // 内容组件
    heading: ComponentStyles;
    text: ComponentStyles;
    button: ComponentStyles;
    card: ComponentStyles;
    feature: ComponentStyles;
    testimonial: ComponentStyles;
}

// 完整主题接口
export interface Theme {
    name: string;
    config: ThemeConfig;
    components: ThemeComponents;
} 