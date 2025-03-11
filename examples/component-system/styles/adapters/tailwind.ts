import { StyleAdapter, StyleConfig, ThemeConfig } from '../types';

interface ComponentStyle {
    base?: string;
    variants?: { [key: string]: string };
    sizes?: { [key: string]: string };
    states?: { [key: string]: string };
}

interface StylesConfig {
    [key: string]: ComponentStyle;
}

export class TailwindAdapter implements StyleAdapter {
    framework = 'tailwind';

    generateClasses(config: StyleConfig): string {
        const { component, variant, size, state } = config;
        const classes: string[] = [];

        // 获取基础样式
        if (this.styles[component]?.base) {
            classes.push(this.styles[component].base);
        }

        // 获取变体样式
        if (variant && this.styles[component]?.variants?.[variant]) {
            classes.push(this.styles[component].variants[variant]);
        }

        // 获取尺寸样式
        if (size && this.styles[component]?.sizes?.[size]) {
            classes.push(this.styles[component].sizes[size]);
        }

        // 获取状态样式
        if (state && this.styles[component]?.states?.[state]) {
            classes.push(this.styles[component].states[state]);
        }

        return classes.join(' ');
    }

    generateTheme(config: ThemeConfig): string {
        // 实现主题配置生成
        return '';
    }

    private styles: StylesConfig = {
        // 布局组件样式
        section: {
            base: 'py-16',
            variants: {
                light: 'bg-white',
                dark: 'bg-gray-900 text-white',
                primary: 'bg-blue-600 text-white'
            }
        },
        container: {
            base: 'container mx-auto px-4',
            sizes: {
                sm: 'max-w-4xl',
                md: 'max-w-6xl',
                lg: 'max-w-7xl'
            }
        },
        // 内容组件样式
        card: {
            base: 'rounded-lg shadow-lg overflow-hidden',
            variants: {
                light: 'bg-white',
                dark: 'bg-gray-800 text-white',
                bordered: 'border-2 border-gray-200'
            },
            sizes: {
                sm: 'p-4',
                md: 'p-6',
                lg: 'p-8'
            }
        },
        button: {
            base: 'rounded-lg font-medium focus:outline-none focus:ring-2',
            variants: {
                primary: 'bg-blue-600 text-white hover:bg-blue-700',
                secondary: 'bg-gray-600 text-white hover:bg-gray-700',
                outline: 'border-2 border-current'
            },
            sizes: {
                sm: 'px-4 py-2 text-sm',
                md: 'px-6 py-3 text-base',
                lg: 'px-8 py-4 text-lg'
            },
            states: {
                disabled: 'opacity-50 cursor-not-allowed'
            }
        }
    };
} 