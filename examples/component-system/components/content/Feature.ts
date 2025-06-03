import { ShortcodeRenderer } from '../../../../src/compiler/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant, ComponentState } from '../../styles/utils/types';

// 定义子组件状态
const ICON_STATE: ComponentState = 'icon';
const TITLE_STATE: ComponentState = 'title';
const CONTENT_STATE: ComponentState = 'content';

// 预定义的图标映射
const ICONS: { [key: string]: string } = {
    'megaphone': '📢',
    'mobile': '📱',
    'link': '🔗',
    'sun': '☀️',
    'default': '⚡️'
};

export function registerFeatureShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('feature', {
        template: `
            <div class="{{ .classes }}">
                {{ if .icon }}
                <div class="{{ .iconClasses }}">
                    <span class="text-2xl">{{ .icon }}</span>
                </div>
                {{ end }}
                <div class="space-y-2">
                    {{ if .title }}
                    <h3 class="{{ .titleClasses }}">{{ .title }}</h3>
                    {{ end }}
                    <div class="{{ .contentClasses }}">{{ .content }}</div>
                </div>
            </div>
        `,
        dataProvider: (params: string[], content?: string) => {
            const getParam = (name: string) => params.find(p => p.startsWith(`${name}=`))?.split('=')[1]?.replace(/^["']|["']$/g, '');
            
            const variant = getParam('variant') || 'primary';
            const size = getParam('size') || 'md';
            const customClass = getParam('class') || '';
            const iconName = getParam('icon') || 'default';
            const highlight = getParam('highlight') === 'true';
            
            // 获取主题配置
            const { colors, typography, spacing } = theme.config;
            
            // 构建基础样式
            const baseClasses = StyleComposer.compose(
                theme.components.feature,
                variant as ComponentVariant,
                size as ComponentSize
            );

            // 构建图标样式
            const iconBaseClasses = StyleComposer.compose(
                theme.components.feature,
                variant as ComponentVariant,
                size as ComponentSize,
                ICON_STATE
            );

            // 根据变体和高亮状态添加额外的图标样式
            const iconVariantClasses = {
                'primary': `bg-${colors.primary} text-white`,
                'secondary': `bg-${colors.secondary} text-white`,
                'outline': `border-2 border-${colors.primary} text-${colors.primary}`,
                'ghost': `text-${colors.primary}`
            }[variant];

            const iconClasses = highlight 
                ? `${iconBaseClasses} ${iconVariantClasses} transform hover:scale-110 transition-transform duration-200`
                : `${iconBaseClasses} ${iconVariantClasses}`;

            // 构建标题样式
            const titleClasses = StyleComposer.merge(
                StyleComposer.compose(
                    theme.components.feature,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    TITLE_STATE
                ),
                `${typography.fontWeight.bold} ${typography.fontSize['xl']}`
            );

            // 构建内容样式
            const contentClasses = StyleComposer.merge(
                StyleComposer.compose(
                    theme.components.feature,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    CONTENT_STATE
                ),
                typography.fontSize.base
            );

            // 添加悬停和交互效果
            const hoverClasses = highlight 
                ? 'transform hover:-translate-y-1 transition-transform duration-200'
                : '';

            return {
                icon: ICONS[iconName] || ICONS['default'],
                title: getParam('title'),
                classes: StyleComposer.merge(
                    StyleComposer.merge(baseClasses, hoverClasses),
                    customClass
                ),
                iconClasses: iconClasses,
                titleClasses: titleClasses,
                contentClasses: contentClasses,
                content: content || ''
            };
        }
    });
}