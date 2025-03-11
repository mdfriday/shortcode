export interface StyleConfig {
    component: string;
    variant?: string;
    size?: string;
    state?: string;
}

export interface ThemeConfig {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        textLight: string;
        textDark: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            base: string;
            sm: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
        };
        fontWeight: {
            normal: string;
            medium: string;
            semibold: string;
            bold: string;
        };
    };
    spacing: {
        base: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    components: {
        // 标题样式
        heading: {
            h1: string;
            h2: string;
            h3: string;
            paragraph: string;
        };
        // 布局样式
        section: {
            base: string;
            variants: {
                light: string;
                dark: string;
                primary: string;
            };
        };
        container: {
            base: string;
            sizes: {
                sm: string;
                md: string;
                lg: string;
            };
        };
        // 内容样式
        card: {
            base: string;
            variants: {
                light: string;
                dark: string;
                bordered: string;
            };
            sizes: {
                sm: string;
                md: string;
                lg: string;
            };
        };
        button: {
            base: string;
            variants: {
                primary: string;
                secondary: string;
                outline: string;
                white: string;
            };
            sizes: {
                sm: string;
                md: string;
                lg: string;
            };
        };
        // 布局辅助
        grid: {
            base: string;
            cols: {
                '1': string;
                '2': string;
                '3': string;
                '4': string;
            };
            gap: {
                sm: string;
                md: string;
                lg: string;
            };
        };
        flex: {
            base: string;
            center: string;
            between: string;
            gap: {
                sm: string;
                md: string;
                lg: string;
            };
        };
    };
}

export interface StyleAdapter {
    framework: string;
    generateClasses(config: StyleConfig): string;
    generateTheme(config: ThemeConfig): string;
} 