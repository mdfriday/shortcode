import { ShortcodeRenderer } from '../../../../src/compiler/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant } from '../../styles/utils/types';

export function registerSectionShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('section', {
        template: `
            <section id="{{ .Get "id" }}" class="{{ .classes }}">
                {{ .content }}
            </section>
        `,
        dataProvider: (params: string[], content?: string) => {
            const variant = params.find(p => p.startsWith('variant='))?.split('=')[1]?.replace(/^["']|["']$/g, '') || 'primary';
            const size = params.find(p => p.startsWith('size='))?.split('=')[1]?.replace(/^["']|["']$/g, '') || 'md';
            const customClass = params.find(p => p.startsWith('class='))?.split('=')[1]?.replace(/^["']|["']$/g, '') || '';
            const id = params.find(p => p.startsWith('id='))?.split('=')[1]?.replace(/^["']|["']$/g, '') || '';

            return {
                id,
                classes: StyleComposer.merge(
                    StyleComposer.compose(
                        theme.components.section,
                        variant as ComponentVariant,
                        size as ComponentSize
                    ),
                    customClass
                )
            };
        }
    });
} 