import { ShortcodeRenderer } from '../../../../src/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant } from '../../styles/utils/types';

// 定义方向到变体的映射
const directionToVariant: Record<string, ComponentVariant> = {
    'row': 'primary',
    'col': 'secondary',
    'row-reverse': 'outline',
    'col-reverse': 'ghost'
};

// 定义间距到尺寸的映射
const gapToSize: Record<string, ComponentSize> = {
    'sm': 'sm',
    'md': 'md',
    'lg': 'lg',
    'xl': 'xl'
};

export function registerFlexShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('flex', {
        template: `
            <div class="{{ .classes }}">
                {{ .content }}
            </div>
        `,
        dataProvider: (params: string[], content?: string) => {
            const getParam = (name: string) => params.find(p => p.startsWith(`${name}=`))?.split('=')[1]?.replace(/^["']|["']$/g, '');
            
            const direction = getParam('direction') || 'row';
            const gap = getParam('gap') || 'md';
            const align = getParam('align') || 'start';
            const justify = getParam('justify') || 'start';
            const customClass = getParam('class') || '';
            
            const variant = directionToVariant[direction] || 'primary';
            const alignClass = `items-${align}`;
            const justifyClass = `justify-${justify}`;
            
            return {
                classes: StyleComposer.merge(
                    StyleComposer.compose(
                        theme.components.flex,
                        variant,
                        gap as ComponentSize
                    ),
                    StyleComposer.merge(alignClass, StyleComposer.merge(justifyClass, customClass))
                )
            };
        }
    });
} 