import {ShortcodeRenderer} from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles for the RankingFishingCard001 component
const rankingFishingCardStyles = `
.mdf-card {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: 'Arial', sans-serif;
    background-color: transparent;
}

.mdf-card .card-container {
    position: relative;
    width: 1080px;
    height: 1920px;
    border-radius: 54px;
    overflow: hidden;
}

.mdf-card .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
}

.mdf-card .card-content {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 137px 0 0 0;
    color: #ffffff;
    z-index: 1;
}

.mdf-card .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 120px;
}

.mdf-card .rank-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 150px 0 0 0;
    width: 300px;
}

.mdf-card .rank-number {
    font-size: 252px;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 7px 7px 14px rgba(0, 0, 0, 0.6);
    line-height: 1;
    text-align: center;
    width: 100%;
}

.mdf-card .fishing-type {
    font-size: 54px;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 4px 4px 7px rgba(0, 0, 0, 0.6);
    background-color: rgba(0, 0, 0, 0.3);
    padding: 11px 30px;
    border-radius: 36px;
    text-align: center;
    max-width: 100%;
    white-space: nowrap;
    margin: 0 auto;
}

.mdf-card .avatar-container {
    position: absolute;
    top: 313px;
    right: 0;
    width: 900px;
    height: 900px;
    overflow: hidden;
}

.mdf-card .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.mdf-card .card-middle {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 1224px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
}

.mdf-card .user-name {
    font-size: 101px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 46px;
    text-shadow: 7px 7px 14px rgba(0, 0, 0, 0.6);
}

.mdf-card .skills-container {
    width: 90%;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
}

.mdf-card .skill-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 18%;
}

.mdf-card .skill-label {
    font-size: 50px;
    text-shadow: 4px 4px 7px rgba(0, 0, 0, 0.6);
    margin-bottom: 29px;
    text-align: center;
    line-height: 1.5em;
}

.mdf-card .score {
    font-size: 65px;
    font-weight: bold;
    color: #FFD700;
    text-shadow: 4px 4px 7px rgba(0, 0, 0, 0.6);
    text-align: center;
}
`;

/**
 * 注册钓鱼排名卡片组件的 shortcode
 * @param renderer shortcode 渲染器
 * @param theme 默认主题配置
 */
export function registerRankingFishingCard001(renderer: ShortcodeRenderer, theme: ThemeManager) {
    renderer.registerTemplateShortcode('rankingFishingCard001', {
        template: `
      <style>
        ${rankingFishingCardStyles}
      </style>
      <div class="mdf-card">
        <div class="card-container">
          <div class="card-bg" style="background-image: url('{{ .Get "backgroundImage" }}');"></div>
          <div class="card-content">
            <div class="card-top">
              <div class="rank-info">
                <div class="rank-number">{{ .Get "rankNumber" }}</div>
                <div class="fishing-type">{{ .Get "fishingType" }}</div>
              </div>
              <div class="avatar-container">
                <img src="{{ .Get "avatarImage" }}" alt="用户头像" class="avatar-img">
              </div>
            </div>
            <div class="card-middle">
              <div class="user-name">{{ .Get "userName" }}</div>
              <div class="skills-container">
                {{ $skills := split (.Get "skills") "," }}
                {{ $scores := split (.Get "scores") "," }}
                {{ range $index, $skill := $skills }}
                  <div class="skill-item">
                    <div class="skill-label">{{ $skill }}</div>
                    <div class="score">{{ index $scores $index }}</div>
                  </div>
                {{ end }}
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