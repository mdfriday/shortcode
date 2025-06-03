import {ShortcodeRenderer} from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles for the FormulaCard component
const formulaPairStyles = `
.mdfFormulaPair-canvas {
    min-width: 540px;
    max-width: 1080px;
}

.mdfFormulaPair-canvas .card {
    font-family: Arial, sans-serif;
    padding: 27px 40px;
    background-color: #ffffff;
    margin: 0 auto;
}

.mdfFormulaPair-canvas .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.mdfFormulaPair-canvas .header-title {
    font-size: 17px;
    color: #333;
}

.mdfFormulaPair-canvas .header-logo {
    font-size: 17px;
    font-weight: bold;
}

.mdfFormulaPair-canvas .section {
    margin-bottom: 25px;
}

.mdfFormulaPair-canvas .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.mdfFormulaPair-canvas .section-number {
    background-color: #FFB6C1;
    color: black;
    padding: 5px 15px;
    font-size: 28px;
    margin-right: 15px;
}

.mdfFormulaPair-canvas .section-name {
    font-size: 28px;
    font-weight: bold;
}

.mdfFormulaPair-canvas .formula {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
}

.mdfFormulaPair-canvas .formula-item {
    display: flex;
    align-items: center;
}

.mdfFormulaPair-canvas .formula-text {
    border-bottom: 1px solid #000;
    padding-bottom: 2px;
}

.mdfFormulaPair-canvas .plus {
    margin: 0 10px;
    font-size: 24px;
}

.mdfFormulaPair-canvas .example-title {
    font-size: 22px;
    margin: 10px 0 10px;
}

.mdfFormulaPair-canvas .example-content {
    margin: 20px 0;
    line-height: 1.8;
    font-size: 13px;
}

.mdfFormulaPair-canvas .label {
    display: inline-block;
    background-color: #87CEEB;
    padding: 2px 8px;
    margin: 0 5px;
    border-radius: 4px;
}

.mdfFormulaPair-canvas .example-item {
    margin: 15px 0;
    display: flex;
    align-items: flex-start;
}

.mdfFormulaPair-canvas .number-circle {
    min-width: 24px;
    height: 24px;
    border: 1px solid #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    margin-top: 3px;
}

.mdfFormulaPair-canvas .dotted-line {
    border-bottom: 1px dotted #999;
    padding-bottom: 5px;
    margin-bottom: 5px;
}

.mdfFormulaPair-canvas .page-number {
    text-align: center;
    color: #666;
}
`;

/**
 * Register FormulaCard component shortcode
 * @param renderer shortcode renderer
 * @param theme default jsons configuration
 */
export function registerFormulaPair(renderer: ShortcodeRenderer, theme: ThemeManager) {
    // Register the main mdfFormulaPair shortcode
    renderer.registerTemplateShortcode('mdfFormulaPair', {
        template: `
      <style>
        ${formulaPairStyles}
      </style>
      <div class="mdfFormulaPair-canvas">
        <div class="card">
          <div class="header">
            <div class="header-title">{{ .Get "headerTitle" }}</div>
            <div class="header-logo">{{ .Get "headerLogo" }}</div>
          </div>

          {{ .Inner }}

          {{ if .Get "pageNumber" }}
          <div class="page-number">- {{ .Get "pageNumber" }} -</div>
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

    // Register the formula section shortcode (to be used inside mdfFormulaPair)
    renderer.registerTemplateShortcode('mdfFormulaPairCard', {
        template: `
        <div class="section">
          <div class="section-title">
            <div class="section-number">{{ .Get "number" }}</div>
            <div class="section-name">{{ .Get "name" }}</div>
          </div>

          <div class="formula">
            {{ $formulaItems := split (.Get "items") "+" }}
            {{ range $itemIndex, $item := $formulaItems }}
              
              {{ if gt $itemIndex 0 }}
              <span class="plus">+</span>
              {{ end }}
               <div class="formula-item">
                <span class="formula-text">{{ $item }}</span>
              </div>

            {{ end }}
            
          </div>

          <div class="example-title">案例解析</div>
          
          <div class="example-content">
            {{ .Inner }}
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

    // Register the example shortcode (to be used inside formula)
    renderer.registerTemplateShortcode('mdfFormulaPairExample', {
        template: `
        <div class="example-item">
          <div class="number-circle">{{ .Get "number" }}</div>
          <div>
            <span class="label">{{ .Get "label" }}</span>
            <span class="dotted-line">{{ .Get "content" }}</span>
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
    ['split', (str: string, sep: string) => str.split(sep)]
]); 