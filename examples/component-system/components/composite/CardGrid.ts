import { ShortcodeRenderer } from '../../../../src/compiler/shortcodeRenderer';
import { StyleAdapter } from '../../styles/types';

export function registerCardGridShortcode(renderer: ShortcodeRenderer, styleAdapter: StyleAdapter) {
    renderer.registerTemplateShortcode('card-grid', {
        template: `
            <div class="grid grid-cols-1 gap-6 ${generateGridCols('{{ .Get "cols" }}')}">
                {{ .content }}
            </div>
        `,
        funcMap: new Map<string, (...args: any[]) => any>([
            ['generateGridCols', generateGridCols],
        ])
    });
}

function generateGridCols(cols: string = '3'): string {
    const colsNum = parseInt(cols, 10);
    return `
        md:grid-cols-2
        ${colsNum >= 3 ? 'lg:grid-cols-3' : ''}
        ${colsNum >= 4 ? 'xl:grid-cols-4' : ''}
    `.trim();
} 