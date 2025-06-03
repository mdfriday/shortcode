import {ShortcodeRenderer} from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles for the CardBanner component
const cardBannerStyles = `
.cardbanner {
    font-family: Arial, sans-serif;
            padding: 40px;
            background-color: #f5f5f5;
            max-width: 1080px;
            margin: 0 auto;
}

.cardbanner .header {
   display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 100px;
}

.cardbanner .logo {
    font-size: 24px;
    font-weight: bold;
}

.cardbanner .avatar {
    width: 60px;
            height: 60px;
            font-size: 40px;
            border-radius: 50%; /* 让图片变成圆形 */
            object-fit: cover; /* 确保图片填充整个圆形 */
            display: block;
}

.cardbanner .main-title {
    font-size: 52px;
            font-weight: bold;
            margin-bottom: 20px;
            line-height: 1.2;
}

.cardbanner .subtitle {
    font-size: 65px;
            font-weight: bold;
            background: linear-gradient(transparent 60%, #FFB6C1 40%);
            display: inline-block;
            margin-bottom: 15px;
            letter-spacing: 15px;
}

.cardbanner .description {
    font-size: 23px;
            color: #666;
            margin-bottom: 45px;
}

.cardbanner .new-label {
    position: relative;
            display: inline-block;
            margin-top: 60px;
            transform: rotate(-10deg);
            width: 100%;
}

.cardbanner .new-tag {
    background: #4169E1;
            color: white;
            padding: 10px 20px;
            border-radius: 15px;
            position: absolute;  /* 绝对定位 */
            right: 0;  /* 让它紧贴 .new-label 右侧 */
            top: 50%;  /* 垂直居中 */
            transform: translateY(-50%) rotate(30deg);  /* 保持旋转但居中 */
            display: inline-block;
            font-weight: bold;
            font-size: 28px;
            box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.cardbanner .new-tag::after {
    content: "!!";
    color: white;
    margin-left: 5px;
}

.cardbanner .footer {
     margin-top: 174px;
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            color: #333;
}

.cardbanner .footer span {
    margin: 0 10px;
}

.cardbanner .divider {
    color: #999;
}
`;

/**
 * 注册卡片横幅组件的 shortcode
 * @param renderer shortcode 渲染器
 * @param theme 默认主题配置
 */
export function registerCardBanner(renderer: ShortcodeRenderer, theme: ThemeManager) {
    renderer.registerTemplateShortcode('cardBanner', {
        template: `
      <style>
        ${cardBannerStyles}
      </style>
      <div class="cardbanner">
        <div class="header">
          <div class="logo">{{ .Get "logo" }}</div>
          <div class="avatar">
           <img class="avatar" src='{{ .Get "avatar" }}' alt="头像">
          </div>
        </div>

        <div class="main-title">
          {{ .Get "mainTitle" }}
        </div>

        <div class="subtitle">
          {{ .Get "subtitle" }}
        </div>

        <div class="description">
          {{ .Get "description" }}
        </div>

        <div class="new-label">
          <div class="new-tag">{{ .Get "newTagText" }}</div>
        </div>

        <div class="footer">
        {{ $topics := split (.Get "footerContent") "," }}
        {{ range $index, $topic := $topics }}
            {{ if gt $index 0 }} <span class="divider">|</span> {{ end }}
            {{ $topic }}
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
    ['split', (str: string, sep: string) => str.split(sep)]
]);