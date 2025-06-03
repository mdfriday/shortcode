import {ShortcodeRenderer} from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles for the ToyotaA3Template001 component
const toyotaA3TemplateStyles = `
    .mdf-card {
        font-family: "SimSun", "Microsoft YaHei", sans-serif;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
    }

    .mdf-card .container {
        width: 100%;
        border: 2px solid black;
        margin: 0 auto;
        padding: 0;
    }

    .mdf-card .row {
        display: flex;
        border-bottom: 1px solid #000;
    }

    .mdf-card .row:last-child {
        border-bottom: none;
    }

    .mdf-card .label {
        width: 80px;
        padding: 10px;
        border-right: 1px solid #000;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .mdf-card .content {
        flex: 1;
        padding: 10px;
        line-height: 1.5;
        margin: 0;
    }

    /* 背景颜色 */
    .mdf-card .theme .content {
        background-color: white;
    }

    .mdf-card .background .content {
        background-color: #ffcece;
    }

    .mdf-card .current .content {
        background-color: #b3d9cd;
    }

    .mdf-card .goal .content {
        background-color: #b3d9d9;
    }

    .mdf-card .question .content {
        background-color: #ffcfa8;
    }

    .mdf-card .solution .content {
        background-color: #f5d142;
    }

    .mdf-card .plan .content {
        background-color: #c1e7c7;
    }
`;

/**
 * 注册丰田A3模板组件的 shortcode
 * @param renderer shortcode 渲染器
 * @param theme 默认主题配置
 */
export function registerToyotaA3Template001(renderer: ShortcodeRenderer, theme: ThemeManager) {
    renderer.registerTemplateShortcode('toyotaA3Template001', {
        template: `
      <style>
        ${toyotaA3TemplateStyles}
      </style>
      <div class="mdf-card">
        <div class="container">
            <div class="row theme">
                <div class="label">主题：</div>
                <div class="content">{{ .Get "theme" }}</div>
            </div>

            <div class="row background">
                <div class="label">背景：</div>
                <div class="content">{{ .Get "background" }}</div>
            </div>

            <div class="row current">
                <div class="label">现状：</div>
                <div class="content">{{ .Get "current" }}</div>
            </div>

            <div class="row goal">
                <div class="label">目标：</div>
                <div class="content">{{ .Get "goal" }}</div>
            </div>

            <div class="row question">
                <div class="label">课题：</div>
                <div class="content">{{ .Get "question" }}</div>
            </div>

            <div class="row solution">
                <div class="label">解决<br>方案：</div>
                <div class="content">{{ .Get "solution" }}</div>
            </div>

            <div class="row plan">
                <div class="label">计划：</div>
                <div class="content">{{ .Get "plan" }}</div>
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