import { ShortcodeRenderer } from '../../../../src/compiler/shortcodeRenderer';
import { StyleComposer } from '../../styles/utils/composer';
import { Theme, ComponentSize, ComponentVariant, ComponentState } from '../../styles/utils/types';

// 定义子组件状态
const QUOTE_STATE: ComponentState = 'quote';
const AUTHOR_STATE: ComponentState = 'author';
const AVATAR_STATE: ComponentState = 'avatar';
const NAME_STATE: ComponentState = 'name';
const TITLE_STATE: ComponentState = 'title';

export function registerTestimonialShortcode(renderer: ShortcodeRenderer, theme: Theme) {
    renderer.registerTemplateShortcode('testimonial', {
        template: `
            <div class="{{ .classes }}">
                <div class="{{ .quoteClasses }}">
                    {{ .content }}
                </div>
                <div class="{{ .authorClasses }}">
                    {{ if .avatar }}
                    <div class="w-12 h-12 rounded-full overflow-hidden">
                        <img src="{{ .avatar }}" alt="{{ .author }}" class="{{ .avatarClasses }} w-full h-full object-cover">
                    </div>
                    {{ end }}
                    <div>
                        <div class="{{ .nameClasses }}">{{ .author }}</div>
                        {{ if .title }}
                        <div class="{{ .titleClasses }}">{{ .title }}</div>
                        {{ end }}
                        {{ if .rating }}
                        <div class="{{ .ratingClasses }}">
                            {{ range $i := .ratingStars }}
                                <span class="text-yellow-400">★</span>
                            {{ end }}
                            {{ range $i := .emptyStars }}
                                <span class="text-gray-300">★</span>
                            {{ end }}
                        </div>
                        {{ end }}
                    </div>
                </div>
            </div>
        `,
        dataProvider: (params: string[], content?: string) => {
            const getParam = (name: string) => params.find(p => p.startsWith(`${name}=`))?.split('=')[1]?.replace(/^["']|["']$/g, '');
            
            const variant = getParam('variant') || 'primary';
            const size = getParam('size') || 'md';
            const customClass = getParam('class') || '';
            const rating = parseInt(getParam('rating') || '0', 10);
            
            // Generate arrays for filled and empty stars
            const ratingStars = Array(rating).fill(1);
            const emptyStars = Array(5 - rating).fill(1);
            
            return {
                avatar: getParam('avatar'),
                author: getParam('author'),
                title: getParam('title'),
                rating,
                ratingStars,
                emptyStars,
                classes: StyleComposer.merge(
                    StyleComposer.compose(
                        theme.components.testimonial,
                        variant as ComponentVariant,
                        size as ComponentSize
                    ),
                    customClass
                ),
                quoteClasses: StyleComposer.compose(
                    theme.components.testimonial,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    QUOTE_STATE
                ),
                authorClasses: StyleComposer.compose(
                    theme.components.testimonial,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    AUTHOR_STATE
                ) + ' flex items-center gap-4',
                avatarClasses: StyleComposer.compose(
                    theme.components.testimonial,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    AVATAR_STATE
                ),
                nameClasses: StyleComposer.compose(
                    theme.components.testimonial,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    NAME_STATE
                ) + ' font-semibold',
                titleClasses: StyleComposer.compose(
                    theme.components.testimonial,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    TITLE_STATE
                ) + ' text-gray-600',
                ratingClasses: StyleComposer.compose(
                    theme.components.testimonial,
                    variant as ComponentVariant,
                    size as ComponentSize,
                    'content' as ComponentState
                ) + ' flex mt-1'
            };
        }
    });
} 