import { ShortcodeRenderer } from '../../../../src/compiler/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant, ComponentState } from '../../styles/utils/types';

export function registerButtonShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('button', {
        template: `
            <a href="{{ .Get "href" }}" class="{{ .classes }}">
                {{ .content }}
            </a>
        `,
        funcMap: new Map<string, (...args: any[]) => any>([
            ['classes', function(this: any) {
                const variant = this.Get('variant') || 'primary';
                const size = this.Get('size') || 'md';
                const disabled = this.Get('disabled') === 'true';
                const state: ComponentState = disabled ? 'disabled' : 'default';
                
                return StyleComposer.compose(
                    theme.components.button,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    state
                );
            }]
        ])
    });
} 