import { ShortcodeRenderer } from '../../../../src/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant, ComponentState } from '../../styles/utils/types';

// 定义子组件状态
const ICON_STATE: ComponentState = 'icon';
const TITLE_STATE: ComponentState = 'title';
const CONTENT_STATE: ComponentState = 'content';

export function registerFeatureShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('feature', {
        template: `
            <div class="{{ .classes }}">
                {{ if .icon }}
                <div class="{{ .iconClasses }}">
                    <i class="{{ .icon }}"></i>
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
            
            return {
                icon: getParam('icon'),
                title: getParam('title'),
                classes: StyleComposer.merge(
                    StyleComposer.compose(
                        theme.components.feature,
                        variant as ComponentVariant,
                        size as ComponentSize
                    ),
                    customClass
                ),
                iconClasses: StyleComposer.compose(
                    theme.components.feature,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    ICON_STATE
                ),
                titleClasses: StyleComposer.compose(
                    theme.components.feature,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    TITLE_STATE
                ),
                contentClasses: StyleComposer.compose(
                    theme.components.feature,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    CONTENT_STATE
                )
            };
        }
    });
} 