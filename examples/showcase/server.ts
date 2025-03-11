import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PageRenderer } from '../../src/pageRenderer';
import { shortcodeRenderer, lightTheme } from '../component-system';

const app = express();
const port = 3000;

// 创建页面渲染器
const pageRenderer = new PageRenderer(shortcodeRenderer);

// 基础 HTML 模板
const baseTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }}</title>
    <meta name="description" content="{{ description }}">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    aspectRatio: {
                        'card': '16 / 9',
                    },
                    colors: {
                        primary: {
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            200: '#bae6fd',
                            300: '#7dd3fc',
                            400: '#38bdf8',
                            500: '#0ea5e9',
                            600: '#0284c7',
                            700: '#0369a1',
                            800: '#075985',
                            900: '#0c4a6e',
                        },
                    },
                    animation: {
                        'fade-in': 'fadeIn 0.5s ease-in-out',
                        'slide-up': 'slideUp 0.5s ease-out',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' },
                        },
                        slideUp: {
                            '0%': { transform: 'translateY(20px)', opacity: '0' },
                            '100%': { transform: 'translateY(0)', opacity: '1' },
                        },
                    },
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        
        /* 添加一些基础样式来确保组件正常显示 */
        .grid {
            display: grid;
        }
        
        .aspect-w-16 {
            position: relative;
            padding-bottom: 56.25%;
        }
        
        .aspect-w-16 > * {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
        
        .prose {
            max-width: 65ch;
            color: #374151;
        }
    </style>
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow-sm">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <a href="/" class="text-xl font-bold text-gray-900">Showcase</a>
                <div class="space-x-4">
                    <a href="/" class="text-gray-600 hover:text-gray-900">Light Theme</a>
                    <a href="/second" class="text-gray-600 hover:text-gray-900">Dark Theme</a>
                    <a href="/three" class="text-gray-600 hover:text-gray-900">Components</a>
                    <a href="/four" class="text-gray-600 hover:text-gray-900">Theme System</a>
                    <a href="/feature" class="text-gray-600 hover:text-gray-900">Features</a>
                </div>
            </div>
        </div>
    </nav>
    {{ content }}
</body>
</html>
`;

// 渲染页面函数
function renderPage(filePath: string, res: express.Response) {
    try {
        // 读取 markdown 文件
        const markdownContent = readFileSync(filePath, 'utf-8');
        
        // 提取 frontmatter 和内容
        const matches = markdownContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!matches) {
            throw new Error('Invalid markdown format');
        }

        const [, frontmatter, content] = matches;
        const metadata = Object.fromEntries(
            frontmatter.split('\n')
                .map(line => line.split(': '))
                .filter((parts): parts is [string, string] => parts.length === 2)
                .map(([key, value]) => [key, value.replace(/^["']|["']$/g, '')])
        );

        // 渲染内容
        const renderedContent = pageRenderer.render(content);

        // 将内容插入到基础模板中
        let html = baseTemplate;
        html = html.replace('{{ title }}', metadata.title || '');
        html = html.replace('{{ description }}', metadata.description || '');
        html = html.replace('{{ content }}', renderedContent.content || '');

        res.send(html);
    } catch (error) {
        console.error('Rendering error:', error);
        res.status(500).send('Error rendering page');
    }
}

// 路由处理
app.get('/', (req, res) => {
    renderPage(join(__dirname, 'index.md'), res);
});

app.get('/second', (req, res) => {
    renderPage(join(__dirname, 'second.md'), res);
});

app.get('/three', (req, res) => {
    renderPage(join(__dirname, 'three.md'), res);
});

app.get('/four', (req, res) => {
    renderPage(join(__dirname, 'four.md'), res);
});

app.get('/feature', (req, res) => {
    renderPage(join(__dirname, 'feature.md'), res);
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 