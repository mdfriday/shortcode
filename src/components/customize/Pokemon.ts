import {ShortcodeRenderer} from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles for the Storytelling-InfoCard-001 component
const infoCardStyles = `
.pokemon {
    --theme-color: var(--pokmon-typeelectric);
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    min-width: 320px;
    height: auto;
    align-items: flex-start;
    padding: 4px;
    position: relative;
    background-color: var(--theme-color);
    margin: 0 auto;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
}

.pokemon[data-theme="fire"] {
    --theme-color: var(--pokmon-typefire);
}

.pokemon[data-theme="water"] {
    --theme-color: var(--pokmon-typewater);
}

.pokemon[data-theme="grass"] {
    --theme-color: var(--pokmon-typegrass);
}

.pokemon[data-theme="electric"] {
    --theme-color: var(--pokmon-typeelectric);
}

.pokemon[data-theme="ice"] {
    --theme-color: var(--pokmon-typeice);
}

.pokemon[data-theme="fighting"] {
    --theme-color: var(--pokmon-typefighting);
}

.pokemon[data-theme="poison"] {
    --theme-color: var(--pokmon-typepoison);
}

.pokemon[data-theme="ground"] {
    --theme-color: var(--pokmon-typeground);
}

.pokemon[data-theme="flying"] {
    --theme-color: var(--pokmon-typeflying);
}

.pokemon[data-theme="psychic"] {
    --theme-color: var(--pokmon-typepsychic);
}

.pokemon[data-theme="bug"] {
    --theme-color: var(--pokmon-typebug);
}

.pokemon[data-theme="rock"] {
    --theme-color: var(--pokmon-typerock);
}

.pokemon[data-theme="ghost"] {
    --theme-color: var(--pokmon-typeghost);
}

.pokemon[data-theme="dragon"] {
    --theme-color: var(--pokmon-typedragon);
}

.pokemon[data-theme="dark"] {
    --theme-color: var(--pokmon-typedark);
}

.pokemon[data-theme="steel"] {
    --theme-color: var(--pokmon-typesteel);
}

.pokemon[data-theme="fairy"] {
    --theme-color: var(--pokmon-typefairy);
}

.pokemon[data-theme="custom"] {
    --theme-color: var(--custom-theme-color, var(--pokmon-typeelectric));
}

.pokemon * {
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
}

.pokemon .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 20px 20px 24px;
    position: relative;
    align-self: stretch;
    width: 100%;
    flex: 0 0 auto;
    z-index: 3;
}

.pokemon .pok-mon-name {
    position: relative;
    flex: 1;
    max-width: 70%;
    margin-top: -1.00px;
    font-family: var(--header-headline-font-family);
    font-weight: var(--header-headline-font-weight);
    color: var(--grayscalewhite);
    font-size: var(--header-headline-font-size);
    letter-spacing: var(--header-headline-letter-spacing);
    line-height: var(--header-headline-line-height);
    font-style: var(--header-headline-font-style);
}

.pokemon .date {
    width: fit-content;
    font-family: var(--header-subtitle-2-font-family);
    font-weight: var(--header-subtitle-2-font-weight);
    color: var(--grayscalewhite);
    font-size: var(--header-subtitle-2-font-size);
    white-space: nowrap;
    position: relative;
    letter-spacing: var(--header-subtitle-2-letter-spacing);
    line-height: var(--header-subtitle-2-line-height);
    font-style: var(--header-subtitle-2-font-style);
}

.pokemon .image {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 16px 20px;
    position: relative;
    flex: 0 0 auto;
    height: 200px;
    align-self: stretch;
    width: 100%;
    z-index: 2;
    overflow: hidden;
}

.pokemon .character {
    position: absolute;
    width: 60%;
    max-width: 200px;
    height: auto;
    aspect-ratio: 1/1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
}

.pokemon .card {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 200px;
    align-items: center;
    gap: 16px;
    padding: 56px 20px 20px;
    margin-top: -56px;
    position: relative;
    align-self: stretch;
    width: 100%;
    z-index: 1;
    background-color: var(--grayscalewhite);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: inset 0px 1px 3px 1px #00000040;
}

.pokemon .type {
    display: flex;
    justify-content: center;
    gap: 16px;
    align-self: stretch;
    width: 100%;
    align-items: flex-start;
    position: relative;
    flex: 0 0 auto;
}

.pokemon .type-chips {
    display: inline-flex;
    flex-direction: column;
    padding: 2px 8px;
    background-color: var(--theme-color);
    border-radius: 10px;
    overflow: hidden;
    align-items: flex-start;
    position: relative;
    flex: 0 0 auto;
}

.pokemon .text-wrapper {
    position: relative;
    width: fit-content;
    margin-top: -1.00px;
    font-family: var(--header-subtitle-3-font-family);
    font-weight: var(--header-subtitle-3-font-weight);
    color: var(--grayscalewhite);
    font-size: var(--header-subtitle-3-font-size);
    letter-spacing: var(--header-subtitle-3-letter-spacing);
    line-height: var(--header-subtitle-3-line-height);
    white-space: nowrap;
    font-style: var(--header-subtitle-3-font-style);
}

.pokemon .text-wrapper-2 {
    position: relative;
    align-self: stretch;
    font-family: var(--header-subtitle-1-font-family);
    font-weight: var(--header-subtitle-1-font-weight);
    color: var(--theme-color);
    font-size: var(--header-subtitle-1-font-size);
    text-align: center;
    letter-spacing: var(--header-subtitle-1-letter-spacing);
    line-height: var(--header-subtitle-1-line-height);
    font-style: var(--header-subtitle-1-font-style);
}

.pokemon .attribute {
    display: flex;
    align-items: flex-start;
    position: relative;
    align-self: stretch;
    width: 100%;
    flex: 0 0 auto;
}

.pokemon .frame {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 0px 8px;
    position: relative;
    flex: 1;
    flex-grow: 1;
}

.pokemon .frame-2 {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0px;
    position: relative;
    align-self: stretch;
    width: 100%;
    flex: 0 0 auto;
}

.pokemon .text-wrapper-3 {
    position: relative;
    flex: 1;
    margin-top: -1.00px;
    font-family: var(--body-body-3-font-family);
    font-weight: var(--body-body-3-font-weight);
    color: var(--grayscaledark);
    font-size: var(--body-body-3-font-size);
    text-align: center;
    letter-spacing: var(--body-body-3-letter-spacing);
    line-height: var(--body-body-3-line-height);
    font-style: var(--body-body-3-font-style);
}

.pokemon .text-wrapper-4 {
    position: relative;
    flex: 1;
    margin-top: -1.00px;
    font-family: var(--body-body-1-font-family);
    font-weight: var(--body-body-1-font-weight);
    color: var(--grayscaledark);
    font-size: var(--body-body-1-font-size);
    text-align: center;
    letter-spacing: var(--body-body-1-letter-spacing);
    line-height: var(--body-body-1-line-height);
    font-style: var(--body-body-1-font-style);
}

.pokemon .divider {
    position: relative;
    align-self: stretch;
    height: 1px;
    object-fit: cover;
    background-color: var(--grayscalelight);
}

.pokemon .lorem-ipsum-dolor {
    position: relative;
    align-self: stretch;
    font-family: var(--body-body-2-font-family);
    font-weight: var(--body-body-2-font-weight);
    color: var(--grayscaledark);
    font-size: var(--body-body-2-font-size);
    letter-spacing: var(--body-body-2-letter-spacing);
    line-height: var(--body-body-2-line-height);
    font-style: var(--body-body-2-font-style);
}

.pokemon .text-wrapper-5 {
    position: relative;
    align-self: stretch;
    font-family: var(--header-subtitle-1-font-family);
    font-weight: var(--header-subtitle-1-font-weight);
    color: var(--theme-color);
    font-size: var(--header-subtitle-1-font-size);
    text-align: center;
    letter-spacing: var(--header-subtitle-1-letter-spacing);
    line-height: var(--header-subtitle-1-line-height);
    font-style: var(--header-subtitle-1-font-style);
}

.pokemon .base-stats {
    display: flex;
    height: 156px;
    align-items: flex-start;
    gap: 16px;
    position: relative;
    align-self: stretch;
    width: 100%;
}

.pokemon .label {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    position: relative;
    flex: 0 0 auto;
}

.pokemon .text-wrapper-7 {
    position: relative;
    width: fit-content;
    margin-top: -1.00px;
    font-family: var(--body-body-2-font-family);
    font-weight: var(--body-body-2-font-weight);
    color: var(--grayscaledark);
    font-size: var(--body-body-2-font-size);
    text-align: right;
    letter-spacing: var(--body-body-2-letter-spacing);
    line-height: var(--body-body-2-line-height);
    white-space: nowrap;
    font-style: var(--body-body-2-font-style);
}

.pokemon .data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    position: relative;
    flex: 0 0 auto;
}

.pokemon .element {
    position: relative;
    width: fit-content;
    margin-top: -1.00px;
    font-family: var(--body-body-2-font-family);
    font-weight: var(--body-body-2-font-weight);
    color: var(--grayscaledark);
    font-size: var(--body-body-2-font-size);
    letter-spacing: var(--body-body-2-letter-spacing);
    line-height: var(--body-body-2-line-height);
    white-space: nowrap;
    font-style: var(--body-body-2-font-style);
}

.pokemon .chart {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    flex: 1;
    position: relative;
    align-self: stretch;
}

.pokemon .chart-2 {
    display: flex;
    height: 16px;
    align-items: center;
    position: relative;
    align-self: stretch;
    width: 100%;
    flex: 0 0 auto;
}

.pokemon .value {
    display: flex;
    height: 16px;
    justify-content: flex-end;
    align-items: center;
    position: relative;
    flex: 1;
    overflow: hidden;
}

.pokemon .rectangle {
    position: relative;
    flex: 1;
    align-self: stretch;
    width: 100%;
    background-color: var(--theme-color);
}

.pokemon .background {
    position: relative;
    align-self: stretch;
    width: 100%;
    height: 4px;
    object-fit: cover;
    background-color: var(--grayscalelight);
}

.pokemon .pokeball {
    position: absolute;
    width: 360px;
    height: 360px;
    top: 0px;
    right: 0px;
    object-fit: cover;
    z-index: 0;
    opacity: 0.3;
}

@media screen and (max-width: 480px) {
    .pokemon .attribute {
        flex-direction: column;
    }

    .pokemon .divider {
        margin-top: 8px;
        margin-bottom: 8px;
    }

    .pokemon .pok-mon-name {
        font-size: 20px;
    }

    .pokemon .value, 
    .pokemon .chart-2 {
        height: 8px;
    }
}

:root {
    --identityprimary: rgba(220, 10, 45, 1);
    --identitysecondary: rgba(40, 170, 253, 1);
    --grayscaledark: rgba(29, 29, 29, 1);
    --grayscalemedium: rgba(102, 102, 102, 1);
    --grayscalelight: rgba(224, 224, 224, 1);
    --grayscalebackground: rgba(239, 239, 239, 1);
    --grayscalewhite: rgba(255, 255, 255, 1);
    --grayscalewireframe: rgba(184, 184, 184, 1);
    --pokmon-typebug: rgba(167, 183, 35, 1);
    --pokmon-typedark: rgba(117, 87, 76, 1);
    --pokmon-typedragon: rgba(112, 55, 255, 1);
    --pokmon-typeelectric: rgba(249, 207, 48, 1);
    --pokmon-typefairy: rgba(230, 158, 172, 1);
    --pokmon-typefighting: rgba(193, 34, 57, 1);
    --pokmon-typefire: rgba(245, 125, 49, 1);
    --pokmon-typeflying: rgba(168, 145, 236, 1);
    --pokmon-typeghost: rgba(112, 85, 155, 1);
    --pokmon-typegrass: rgba(116, 203, 72, 1);
    --pokmon-typeground: rgba(222, 193, 107, 1);
    --pokmon-typeice: rgba(154, 214, 223, 1);
    --pokmon-typenormal: rgba(170, 166, 127, 1);
    --pokmon-typepoison: rgba(164, 62, 158, 1);
    --pokmon-typepsychic: rgba(251, 85, 132, 1);
    --pokmon-typerock: rgba(182, 158, 49, 1);
    --pokmon-typesteel: rgba(183, 185, 208, 1);
    --pokmon-typewater: rgba(100, 147, 235, 1);
    --header-headline-font-family: "Poppins", Helvetica;
    --header-headline-font-weight: 700;
    --header-headline-font-size: 24px;
    --header-headline-letter-spacing: 0px;
    --header-headline-line-height: 32px;
    --header-headline-font-style: normal;
    --header-subtitle-1-font-family: "Poppins", Helvetica;
    --header-subtitle-1-font-weight: 700;
    --header-subtitle-1-font-size: 14px;
    --header-subtitle-1-letter-spacing: 0px;
    --header-subtitle-1-line-height: 16px;
    --header-subtitle-1-font-style: normal;
    --header-subtitle-2-font-family: "Poppins", Helvetica;
    --header-subtitle-2-font-weight: 700;
    --header-subtitle-2-font-size: 12px;
    --header-subtitle-2-letter-spacing: 0px;
    --header-subtitle-2-line-height: 16px;
    --header-subtitle-2-font-style: normal;
    --header-subtitle-3-font-family: "Poppins", Helvetica;
    --header-subtitle-3-font-weight: 700;
    --header-subtitle-3-font-size: 10px;
    --header-subtitle-3-letter-spacing: 0px;
    --header-subtitle-3-line-height: 16px;
    --header-subtitle-3-font-style: normal;
    --body-body-1-font-family: "Poppins", Helvetica;
    --body-body-1-font-weight: 400;
    --body-body-1-font-size: 14px;
    --body-body-1-letter-spacing: 0px;
    --body-body-1-line-height: 16px;
    --body-body-1-font-style: normal;
    --body-body-2-font-family: "Poppins", Helvetica;
    --body-body-2-font-weight: 400;
    --body-body-2-font-size: 12px;
    --body-body-2-letter-spacing: 0px;
    --body-body-2-line-height: 16px;
    --body-body-2-font-style: normal;
    --body-body-3-font-family: "Poppins", Helvetica;
    --body-body-3-font-weight: 400;
    --body-body-3-font-size: 10px;
    --body-body-3-letter-spacing: 0px;
    --body-body-3-line-height: 16px;
    --body-body-3-font-style: normal;
    --body-caption-font-family: "Poppins", Helvetica;
    --body-caption-font-weight: 400;
    --body-caption-font-size: 8px;
    --body-caption-letter-spacing: 0px;
    --body-caption-line-height: 12px;
    --body-caption-font-style: normal;
    --drop-shadow-2-dp: 0px 1px 3px 1px rgba(0, 0, 0, 0.2);
    --drop-shadow-6-dp: 0px 3px 12px 3px rgba(0, 0, 0, 0.2);
}

`;

/**
 * 注册故事讲述信息卡组件的 shortcode
 * @param renderer shortcode 渲染器
 * @param theme 默认主题配置
 */
export function registerPokemon001(renderer: ShortcodeRenderer, theme: ThemeManager) {
    renderer.registerTemplateShortcode('pokemon001', {
        template: `
      <style>
        ${infoCardStyles}
      </style>
      <div class="pokemon" data-theme="{{ .Get "theme" }}">
        <div class="title">
            <div class="pok-mon-name">{{ .Get "name" }}</div>
            <div class="date">{{ .Get "date" }}</div>
        </div>
        <div class="image">
            <div class="character" style="background-image: url({{ .Get "characterImage" }})"></div>
        </div>
        <div class="card">
            <div class="type">
                {{ $types := split (.Get "types") "," }}
                {{ range $type := $types }}
                    <div class="type-chips"><div class="text-wrapper">{{ $type }}</div></div>
                {{ end }}
            </div>
            <div class="text-wrapper-2">{{ .Get "subjectTitle" }}</div>
            <div class="attribute">
                {{ $subjects := split (.Get "subjects") ";" }}
                {{ range $index, $subject := $subjects }}
                    {{ if gt $index 0 }}<div class="divider"></div>{{ end }}
                    {{ $parts := split $subject "," }}
                    <div class="frame">
                        <div class="frame-2">
                            <div class="text-wrapper-3">{{ index $parts 1 }}</div>
                        </div>
                        <div class="text-wrapper-4">{{ index $parts 0 }}</div>
                    </div>
                {{ end }}
            </div>
            <p class="lorem-ipsum-dolor">
                {{ .Inner }}
            </p>
            <div class="text-wrapper-5">{{ .Get "statsTitle" }}</div>
            <div class="base-stats">
                <div class="label">
                    {{ $labels := split (.Get "statsLabels") "," }}
                    {{ range $label := $labels }}
                        <div class="text-wrapper-7">{{ $label }}</div>
                    {{ end }}
                </div>
                <div class="divider"></div>
                <div class="data">
                    {{ $values := split (.Get "statsValues") ";" }}
                    {{ range $value := $values }}
                        {{ $parts := split $value "," }}
                        <div class="element">{{ index $parts 1 }}</div>
                    {{ end }}
                </div>
                <div class="chart">
                    {{ $values := split (.Get "statsValues") ";" }}
                    {{ range $value := $values }}
                        {{ $parts := split $value "," }}
                        {{ $paddingRight := div (sub 21 (float (index $parts 1))) 21 }}
                        {{ $percentage := mul $paddingRight 100 }}
                        <div class="chart-2">
                            <div class="value" style="padding-right: {{ $percentage }}%">
                                <div class="rectangle"></div>
                            </div>
                            <div class="background"></div>
                        </div>
                    {{ end }}
                </div>
            </div>
        </div>
        <img class="pokeball" src="{{ .Get "pokeballImage" }}" />
      </div>
    `,
        funcMap: new Map<string, (...args: any[]) => any>([
            ['split', (str: string, sep: string) => str.split(sep)],
            ['div', (a: number, b: number) => a / b],
            ['sub', (a: number, b: number) => a - b],
            ['mul', (a: number, b: number) => a * b],
            ['float', (str: string) => parseFloat(str)]
        ]),
        dataProvider: (params: string[], content?: string) => {
            return {
                Inner: content
            };
        }
    });
} 