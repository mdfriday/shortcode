import {ShortcodeRenderer} from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles for the MasterPoster001 component
const masterPosterStyles = `
    .mdf-card {
        font-family: 'Noto Sans SC', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #fff;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }

    .mdf-card .poster {
        position: relative;
        width: 600px;
        height: 850px;
        background-color: #000;
        overflow: hidden;
        border: 1px solid #333;
        box-sizing: border-box;
    }

    .mdf-card .top-text {
        position: absolute;
        top: 30px;
        right: 30px;
        text-align: right;
        color: #c9a86b;
        font-size: 22px;
    }

    .mdf-card .concert-title {
        position: absolute;
        top: 60px;
        right: 30px;
        text-align: right;
        color: #c9a86b;
        font-size: 50px;
        font-weight: bold;
        width: 40%;
    }

    .mdf-card .large-character {
        position: absolute;
        left: 40px;
        top: 600px;
        color: #c9a86b;
        font-size: 110px;
        font-weight: bold;
        line-height: 1;
        writing-mode: vertical-rl;
        text-orientation: upright;
    }

    .mdf-card .answer {
        position: absolute;
        left: 180px;
        top: 680px;
        color: #fff;
        font-size: 28px;
        font-weight: bold;
    }

    .mdf-card .detail {
        position: absolute;
        left: 180px;
        top: 725px;
        color: #fff;
        font-size: 20px;
    }

    .mdf-card .profile {
        width: 600px;
        height: 600px;
        font-size: 100px;
    }

    .mdf-card .horizontal-line {
        position: absolute;
        left: 40px;
        top: 600px;
        width: 370px;
        height: 2px;
        background-color: #c9a86b;
    }

    .mdf-card .small-text {
        position: absolute;
        left: 180px;
        top: 610px;
        color: #fff;
        font-size: 18px;
        letter-spacing: 4px;
    }
`;

/**
 * 注册钓鱼大师海报组件的 shortcode
 * @param renderer shortcode 渲染器
 * @param theme 默认主题配置
 */
export function registerMasterPoster001(renderer: ShortcodeRenderer, theme: ThemeManager) {
    renderer.registerTemplateShortcode('masterPoster001', {
        template: `
      <style>
        ${masterPosterStyles}
      </style>
      <div class="mdf-card">
        <div class="poster">
            <div class="top-text">{{ .Get "questionText" }}</div>
            <div class="concert-title">{{ .Get "titleText" }}</div>

            <div class="profile">
                <img src="{{ .Get "profileImage" }}" alt="大师图片" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <div class="large-character">{{ .Get "largeText" }}</div>
            <div class="small-text">{{ .Get "masterName" }}</div>

            <div class="horizontal-line"></div>

            <div class="answer">{{ .Get "answerTitle" }}{{ .Get "answer" }}</div>
            <div class="detail">{{ .Get "detailText" }}</div>
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