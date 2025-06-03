import {ShortcodeRenderer} from '@mdfriday/shortcode-compiler';
import {ThemeManager} from '../../themes';

// CSS styles for the CornellNotes001 component
const cornellNotesStyles = `
    .mdf-card {
        font-family: "SimSun", "STSong", serif;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f5f5f5;
    }

    .mdf-card .container {
        width: 100%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: white;
        margin: auto;
        padding: 0;
    }

    .mdf-card .header h1 {
        font-size: 36px;
        margin: 0;
    }

    .mdf-card .content {
        display: flex;
        flex-direction: column;
        border: 2px solid #000;
        margin: 0;
        padding: 0;
    }

    .mdf-card .upper-section {
        display: flex;
        min-height: 500px;
    }

    .mdf-card .organize-column {
        flex: 3;
        background-color: #7fbcb0;
        padding: 20px;
        border-right: 2px solid #000;
    }

    .mdf-card .notes-column {
        flex: 5;
        background-color: #a8d5c7;
        padding: 20px;
    }

    .mdf-card .summary-section {
        background-color: #b9cdec;
        padding: 20px;
        border-top: 2px solid #000;
    }

    .mdf-card .column-title {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: center;
    }

    .mdf-card .note-date {
        color: #555;
        margin-bottom: 5px;
    }

    .mdf-card p {
        margin: 5px 0;
        line-height: 1.5;
    }
`;

/**
 * 注册康奈尔笔记法组件的 shortcode
 * @param renderer shortcode 渲染器
 * @param theme 默认主题配置
 */
export function registerCornellNotes001(renderer: ShortcodeRenderer, theme: ThemeManager) {
    renderer.registerTemplateShortcode('cornellNotes001', {
        template: `
      <style>
        ${cornellNotesStyles}
      </style>
      <div class="mdf-card">
        <div class="container">
            <div class="content">
                <div class="upper-section">
                    <div class="organize-column">
                        <div class="column-title">【整理栏】</div>
                        {{ .Get "organizeContent" }}
                    </div>
                    
                    <div class="notes-column">
                        <div class="column-title">【笔记栏】</div>
                        <div class="note-date">{{ .Get "noteDate" }}</div>
                        {{ .Get "notesContent" }}
                    </div>
                </div>
                
                <div class="summary-section">
                    <div class="column-title">【总结栏】</div>
                    {{ .Get "summaryContent" }}
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