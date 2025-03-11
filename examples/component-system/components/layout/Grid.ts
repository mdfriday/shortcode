import { ShortcodeRenderer } from '../../../../src/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant } from '../../styles/utils/types';

// 定义列数到尺寸的映射
const colsToSize: Record<string, ComponentSize> = {
    '2': 'sm',
    '3': 'md',
    '4': 'lg',
    '6': 'xl'
};

// 定义间距到变体的映射
const gapToVariant: Record<string, ComponentVariant> = {
    'sm': 'outline',
    'md': 'primary',
    'lg': 'secondary'
};

export function registerGridShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('grid', {
        template: `
            <div class="{{ .classes }}">
                {{ .content }}
            </div>
        `,
        dataProvider: (params: string[], content?: string) => {
            const getParam = (name: string) => params.find(p => p.startsWith(`${name}=`))?.split('=')[1]?.replace(/^["']|["']$/g, '');
            
            const cols = getParam('cols') || '3';
            const gap = getParam('gap') || 'md';
            const customClass = getParam('class') || '';
            
            const size = colsToSize[cols] || 'md';
            const variant = gapToVariant[gap] || 'primary';
            
            return {
                classes: StyleComposer.merge(
                    StyleComposer.compose(
                        theme.components.grid,
                        variant,
                        size
                    ),
                    customClass
                )
            };
        }
    });
} 