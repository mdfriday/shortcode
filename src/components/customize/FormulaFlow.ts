import { ShortcodeRenderer } from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles with the component class prefix for isolation
const mdfFormulaFlowStyles = `
.mdfFormulaFlow-container {
    font-family: Arial, sans-serif;
    padding: 30px 20px 0;
    background-color: #ffffff;
    max-width: 800px;
    margin: 0 auto;
}

.mdfFormulaFlow-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.mdfFormulaFlow-header-title {
    font-size: 17px;
    color: #333;
}

.mdfFormulaFlow-header-logo {
    font-size: 17px;
    font-weight: bold;
}

.mdfFormulaFlow-section {
    margin-bottom: 0;
}

.mdfFormulaFlow-section-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.mdfFormulaFlow-section-number {
    background-color: #FFB6C1;
    color: black;
    padding: 5px 15px;
    font-size: 28px;
    margin-right: 15px;
}

.mdfFormulaFlow-section-name {
    font-size: 28px;
    font-weight: bold;
}

.mdfFormulaFlow-subtitle {
    font-size: 18px;
    color: #666;
    margin-left: 10px;
}

.mdfFormulaFlow-structure-box {
    border: 1px solid #FFD700;
    border-radius: 8px;
    margin: 10px 0;
}

.mdfFormulaFlow-flow-item {
    background-color: #FFE4B5;
    margin: 5px auto;
    text-align: center;
    width: fit-content;
    min-width: 150px;
    border-radius: 4px;
}

.mdfFormulaFlow-number-circle {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 1px solid #000;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
    margin-right: 10px;
}

.mdfFormulaFlow-structure-title {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 2px solid #000;
    display: inline-block;
    padding-bottom: 5px;
    margin-bottom: 10px;
}

.mdfFormulaFlow-plus-sign {
    display: block;
    text-align: center;
    font-size: 10px;
    color: #666;
    margin: 5px 0;
}

.mdfFormulaFlow-page-number {
    text-align: center;
    color: #666;
    margin-top: 20px;
}
`;

/**
 * Register ScriptStructure component shortcodes
 * @param renderer shortcode renderer
 */
export function registerFormulaFlow(renderer: ShortcodeRenderer, theme: ThemeManager) {
    // Register the main mdfFormulaFlow shortcode
    renderer.registerTemplateShortcode('mdfFormulaFlow', {
        template: `
<style>
${mdfFormulaFlowStyles}
</style>
<div class="mdfFormulaFlow-container">
    <div class="mdfFormulaFlow-header">
        <div class="mdfFormulaFlow-header-title">{{ .Get "title" }}</div>
        <div class="mdfFormulaFlow-header-logo">{{ .Get "brand" }}</div>
    </div>

    <div class="mdfFormulaFlow-section">
        <div class="mdfFormulaFlow-section-title">
            <div class="mdfFormulaFlow-section-number">{{ .Get "number" }}</div>
            <div class="mdfFormulaFlow-section-name">{{ .Get "name" }}</div>
            {{ if .Get "subtitle" }}
            <div class="mdfFormulaFlow-subtitle">{{ .Get "subtitle" }}</div>
            {{ end }}
        </div>

        {{ .Inner }}
    </div>

    {{ if .Get "pageNumber" }}
    <div class="mdfFormulaFlow-page-number">- {{ .Get "pageNumber" }} -</div>
    {{ end }}
</div>
`,
        funcMap: commonFuncMap,
        dataProvider: (params: string[], content?: string) => {
            return {
                Inner: content
            };
        }
    });

    // Register the structure block shortcode (to be used inside mdfFormulaFlow)
    renderer.registerTemplateShortcode('mdfFormulaFlowBlock', {
        template: `
<div>
    <div class="mdfFormulaFlow-structure-title">
        <span class="mdfFormulaFlow-number-circle">{{ .Get "number" }}</span>
        {{ .Get "title" }}
    </div>
    <div class="mdfFormulaFlow-structure-box">
        {{ $usePlus := (.Get "usePlusSigns") }}
        {{ range $index, $item := split (.Get "flowItems") "|" }}
        {{ if eq $usePlus "true" }}
        {{ if gt $index 0 }}
        <div class="mdfFormulaFlow-plus-sign">+</div>
        {{ end }}
        {{ end }}
        
        <div class="mdfFormulaFlow-flow-item">{{ $item }}</div>
        {{ end }}
    </div>
</div>
`,
        funcMap: commonFuncMap,
        dataProvider: (params: string[], content?: string) => {
            return {
                Inner: content
            };
        }
    });
}

const commonFuncMap = new Map<string, (...args: any[]) => any>([
    ['split', (str: string, sep: string) => str.split(sep)],
    ['eq', (a: any, b: any) => a === b],
    ['len', (arr: any[]) => arr.length],
    ['lt', (a: number, b: number) => a < b],
    ['sub', (a: number, b: number) => a - b]
]); 