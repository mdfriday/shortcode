import { ShortcodeRenderer } from '../../../../src/compiler/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant } from '../../styles/utils/types';

export function registerCardShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('card', {
        template: `
            <div class="{{ .classes }}">
                {{ if .image }}
                <div class="aspect-w-16 aspect-h-9">
                    <img src="{{ .image }}" alt="{{ .imageAlt }}" class="object-cover w-full h-full">
                </div>
                {{ end }}
                <div class="space-y-4">
                    {{ if .title }}
                    <h3 class="text-xl font-bold">{{ .title }}</h3>
                    {{ end }}
                    {{ if .subtitle }}
                    <p class="text-gray-600">{{ .subtitle }}</p>
                    {{ end }}
                    <div class="prose">{{ .content }}</div>
                    {{ if or .primaryAction .secondaryAction }}
                    <div class="flex gap-4">
                        {{ if .primaryAction }}
                        <a href="{{ .primaryActionUrl }}" class="{{ .primaryButtonClasses }}">
                            {{ .primaryAction }}
                        </a>
                        {{ end }}
                        {{ if .secondaryAction }}
                        <a href="{{ .secondaryActionUrl }}" class="{{ .secondaryButtonClasses }}">
                            {{ .secondaryAction }}
                        </a>
                        {{ end }}
                    </div>
                    {{ end }}
                </div>
            </div>
        `,
        dataProvider: (params: string[], content?: string) => {
            const getParam = (name: string) => params.find(p => p.startsWith(`${name}=`))?.split('=')[1]?.replace(/^["']|["']$/g, '');
            
            const variant = getParam('variant') || 'primary';
            const size = getParam('size') || 'md';
            const customClass = getParam('class') || '';
            
            return {
                image: getParam('image'),
                imageAlt: getParam('imageAlt'),
                title: getParam('title'),
                subtitle: getParam('subtitle'),
                primaryAction: getParam('primaryAction'),
                primaryActionUrl: getParam('primaryActionUrl'),
                secondaryAction: getParam('secondaryAction'),
                secondaryActionUrl: getParam('secondaryActionUrl'),
                classes: StyleComposer.merge(
                    StyleComposer.compose(
                        theme.components.card,
                        variant as ComponentVariant,
                        size as ComponentSize
                    ),
                    customClass
                ),
                primaryButtonClasses: StyleComposer.compose(
                    theme.components.button,
                    'primary' as ComponentVariant,
                    'md' as ComponentSize
                ),
                secondaryButtonClasses: StyleComposer.compose(
                    theme.components.button,
                    'secondary' as ComponentVariant,
                    'md' as ComponentSize
                )
            };
        }
    });
} 