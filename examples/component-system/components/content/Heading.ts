import { ShortcodeRenderer } from '../../../../src/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant } from '../../styles/utils/types';

export function registerHeadingShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('heading', {
        template: `
            <{{ .tag }} class="{{ .classes }}">
                {{ .content }}
            </{{ .tag }}>
        `,
        dataProvider: (params: string[], content?: string) => {
            const getParam = (name: string) => params.find(p => p.startsWith(`${name}=`))?.split('=')[1]?.replace(/^["']|["']$/g, '');
            
            const level = getParam('level') || '2';
            const variant = getParam('variant') || 'primary';
            const size = getParam('size') || 'md';
            const customClass = getParam('class') || '';
            
            return {
                tag: `h${level}`,
                classes: StyleComposer.merge(
                    StyleComposer.compose(
                        theme.components.heading,
                        variant as ComponentVariant,
                        size as ComponentSize
                    ),
                    customClass
                )
            };
        }
    });
} 