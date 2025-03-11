import { ShortcodeRenderer } from '../../../../src/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant } from '../../styles/utils/types';

export function registerContainerShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('container', {
        template: `
            <div class="{{ .classes }}">
                {{ .content }}
            </div>
        `,
        dataProvider: (params: string[], content?: string) => {
            const getParam = (name: string) => params.find(p => p.startsWith(`${name}=`))?.split('=')[1]?.replace(/^["']|["']$/g, '');
            
            const variant = getParam('variant') || 'primary';
            const size = getParam('size') || 'md';
            const customClass = getParam('class') || '';
            
            return {
                classes: StyleComposer.merge(
                    StyleComposer.compose(
                        theme.components.container,
                        variant as ComponentVariant,
                        size as ComponentSize
                    ),
                    customClass
                )
            };
        }
    });
} 