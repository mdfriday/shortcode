import {ShortcodeRenderer} from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles for the McKinseyMethod001 component
const mckinseyMethodStyles = `
    .mdf-card {
        margin: 0;
        font-family: 'SimSun', 'Arial', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
    }

    .mdf-card .container {
        width: 100%;
        margin: auto;
        padding: 0;
    }

    .mdf-card .chart {
        border: 2px solid #000;
        overflow: hidden;
    }

    .mdf-card .top-row {
        background-color: #fff7b2;
        padding: 15px;
        border-bottom: 1px solid #000;
    }

    .mdf-card .step {
        margin: 15px 0;
    }

    .mdf-card .step-number {
        display: inline-block;
        width: 25px;
        height: 25px;
        line-height: 25px;
        border-radius: 50%;
        border: 1px solid #000;
        text-align: center;
        margin-right: 10px;
        font-weight: bold;
    }

    .mdf-card .step-title {
        font-size: 20px;
        font-weight: bold;
    }

    .mdf-card .step-description {
        margin-left: 35px;
    }

    .mdf-card .bottom-row {
        display: flex;
        min-height: 400px;
    }

    .mdf-card .column {
        flex: 1;
        padding: 15px;
        display: flex;
        flex-direction: column;
    }

    .mdf-card .column-pink {
        background-color: #ffdddd;
        border-right: 1px solid #000;
    }

    .mdf-card .column-blue {
        background-color: #add8e6;
        border-right: 1px solid #000;
    }

    .mdf-card .column-purple {
        background-color: #b0b0e0;
    }
    
    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .mdf-card .bottom-row {
            flex-direction: column;
            min-height: auto;
        }
        
        .mdf-card .column-pink,
        .mdf-card .column-blue {
            border-right: none;
            border-bottom: 1px solid #000;
        }
    }
`;

/**
 * 注册麦肯锡笔记法组件的 shortcode
 * @param renderer shortcode 渲染器
 * @param theme 默认主题配置
 */
export function registerMcKinseyMethod001(renderer: ShortcodeRenderer, theme: ThemeManager) {
    renderer.registerTemplateShortcode('mcKinseyMethod001', {
        template: `
      <style>
        ${mckinseyMethodStyles}
      </style>
      <div class="mdf-card">
        <div class="container">
            <div class="chart">
                <div class="top-row">
                    <div class="step">
                        <span class="step-number">1</span>
                        <span class="step-title">：{{ .Get "step1Title" }}</span>
                        <div class="step-description">{{ .Get "step1Description" }}</div>
                    </div>
                    
                    <div class="step">
                        <span class="step-number">5</span>
                        <span class="step-title">：{{ .Get "step5Title" }}</span>
                        <div class="step-description">{{ .Get "step5Description" }}</div>
                    </div>
                </div>
                
                <div class="bottom-row">
                    <div class="column column-pink">
                        <div class="step">
                            <span class="step-number">2</span>
                            <span class="step-title">：{{ .Get "step2Title" }}</span>
                            <div class="step-description">
                                {{ .Get "step2Description" }}
                            </div>
                        </div>
                    </div>
                    
                    <div class="column column-blue">
                        <div class="step">
                            <span class="step-number">3</span>
                            <span class="step-title">：{{ .Get "step3Title" }}</span>
                            <div class="step-description">
                                {{ .Get "step3Description" }}
                            </div>
                        </div>
                    </div>
                    
                    <div class="column column-purple">
                        <div class="step">
                            <span class="step-number">4</span>
                            <span class="step-title">：{{ .Get "step4Title" }}</span>
                            <div class="step-description">
                                {{ .Get "step4Description" }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
    ['index', (arr: any[], idx: number) => arr[idx]]
]); 