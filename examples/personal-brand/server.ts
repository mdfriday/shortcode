import express from 'express';
import { ShortcodeRenderer } from '../../src/shortcodeRenderer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PageRenderer } from '../../src/pageRenderer';

const app = express();
const port = 3000;

// 创建 shortcode 渲染器实例
const shortcodeRenderer = new ShortcodeRenderer();

// 通用模板函数
const commonFuncMap = new Map<string, (...args: any[]) => any>([
    ['split', (str: string, sep: string) => str.split(sep)],
    ['join', (arr: string[], sep: string) => arr.join(sep)],
    ['upper', (str: string) => str.toUpperCase()],
    ['lower', (str: string) => str.toLowerCase()],
    ['trim', (str: string) => str.trim()],
    ['eq', (a: any, b: any) => a === b],
    ['range', (n: number) => Array.from({ length: n }, (_, i) => i)],
]);

// 注册所需的 shortcodes
function registerShortcodes(renderer: ShortcodeRenderer) {
    // 布局组件
    renderer.registerTemplateShortcode('hero', {
        template: `
            <div class="hero relative min-h-[60vh] flex items-center justify-center text-center text-white bg-gradient-to-r from-blue-600 to-blue-800 p-8">
                <div class="hero-content">
                    <h1 class="text-4xl md:text-6xl font-bold mb-4">{{ .Get "title" }}</h1>
                    <p class="text-xl md:text-2xl mb-6">{{ .Get "subtitle" }}</p>
                    <div class="text-lg">{{ .content }}</div>
                </div>
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('section', {
        template: `
            <section id="{{ .Get "id" }}" class="py-16 {{ .Get "class" }}">
                {{ .content }}
            </section>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('container', {
        template: `
            <div class="container mx-auto px-4 max-w-6xl">
                {{ .content }}
            </div>
        `,
        funcMap: commonFuncMap
    });

    // 内容组件
    renderer.registerTemplateShortcode('profile-card', {
        template: `
            <div class="bg-white rounded-lg shadow-lg p-8 text-center">
                <div class="text-6xl mb-4">👤</div>
                <h2 class="text-2xl font-bold mb-2">{{ .Get "name" }}</h2>
                <p class="text-gray-600 mb-4">{{ .Get "title" }}</p>
                <p class="text-gray-500 mb-2">📍 {{ .Get "location" }}</p>
                <p class="text-green-500 mb-4">{{ .Get "available" }}</p>
                <div class="prose max-w-none mb-6">{{ .content }}</div>
                <div class="flex justify-center space-x-4">
                    {{ if .Get "github" }}<a href="https://github.com/{{ .Get "github" }}" class="text-gray-600 hover:text-gray-900">🐱 GitHub</a>{{ end }}
                    {{ if .Get "twitter" }}<a href="https://twitter.com/{{ .Get "twitter" }}" class="text-gray-600 hover:text-gray-900">🐦 Twitter</a>{{ end }}
                    {{ if .Get "linkedin" }}<a href="https://linkedin.com/in/{{ .Get "linkedin" }}" class="text-gray-600 hover:text-gray-900">💼 LinkedIn</a>{{ end }}
                </div>
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('section-header', {
        template: `
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold mb-4">{{ .Get "title" }}</h2>
                <p class="text-gray-600">{{ .Get "subtitle" }}</p>
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('skill-grid', {
        template: `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {{ .content }}
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('skill-card', {
        template: `
            <div class="bg-white rounded-lg shadow p-6">
                <div class="text-4xl mb-4">{{ .Get "icon" }}</div>
                <h3 class="text-xl font-semibold mb-2">{{ .Get "title" }}</h3>
                <div class="h-2 bg-gray-200 rounded mb-4">
                    <div class="h-2 bg-blue-600 rounded" style="width: {{ .Get "level" }}%"></div>
                </div>
                <p class="text-gray-600">{{ .content }}</p>
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('project-grid', {
        template: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {{ .content }}
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('project-card', {
        template: `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="text-8xl p-8 bg-gray-100 text-center">🖼️</div>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">{{ .Get "title" }}</h3>
                    <div class="mb-4">
                        {{ range (split (.Get "tags") ",") }}
                            <span class="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600 mr-2">{{ . }}</span>
                        {{ end }}
                    </div>
                    <p class="text-gray-600 mb-4">{{ .content }}</p>
                    <div class="flex space-x-4">
                        {{ if .Get "demo" }}<a href="{{ .Get "demo" }}" class="text-blue-600 hover:text-blue-800">🔗 Live Demo</a>{{ end }}
                        {{ if .Get "github" }}<a href="{{ .Get "github" }}" class="text-gray-600 hover:text-gray-900">🐱 Source Code</a>{{ end }}
                    </div>
                </div>
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('post-grid', {
        template: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {{ .content }}
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('post-card', {
        template: `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="text-6xl p-8 bg-gray-100 text-center">📝</div>
                <div class="p-6">
                    <h3 class="text-xl font-bold mb-2">{{ .Get "title" }}</h3>
                    <div class="text-gray-500 text-sm mb-4">
                        {{ .Get "date" }} • {{ .Get "readTime" }}
                    </div>
                    <p class="text-gray-600 mb-4">{{ .content }}</p>
                    <a href="{{ .Get "url" }}" class="text-blue-600 hover:text-blue-800">Read More →</a>
                </div>
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('contact-form', {
        template: `
            <form action="{{ .Get "action" }}" method="POST" class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                {{ .content }}
                <div class="text-center">
                    <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">Send Message</button>
                </div>
            </form>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('form-field', {
        template: `
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2">{{ .Get "label" }}</label>
                {{ if eq (.Get "type") "textarea" }}
                    <textarea 
                        name="{{ .Get "name" }}"
                        placeholder="{{ .Get "placeholder" }}"
                        rows="{{ .Get "rows" }}"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {{ if .Get "required" }}required{{ end }}
                    ></textarea>
                {{ else if eq (.Get "type") "select" }}
                    <select 
                        name="{{ .Get "name" }}"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {{ if .Get "required" }}required{{ end }}
                    >
                        {{ range (split (.Get "options") ",") }}
                            <option value="{{ . }}">{{ . }}</option>
                        {{ end }}
                    </select>
                {{ else }}
                    <input 
                        type="{{ .Get "type" }}"
                        name="{{ .Get "name" }}"
                        placeholder="{{ .Get "placeholder" }}"
                        class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {{ if .Get "required" }}required{{ end }}
                    >
                {{ end }}
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('footer', {
        template: `
            <footer class="bg-gray-900 text-white py-12">
                <div class="container mx-auto px-4">
                    {{ .content }}
                </div>
            </footer>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('social-links', {
        template: `
            <div class="flex justify-center space-x-6 mb-8">
                {{ if .Get "github" }}<a href="https://github.com/{{ .Get "github" }}" class="hover:text-gray-400">🐱 GitHub</a>{{ end }}
                {{ if .Get "twitter" }}<a href="https://twitter.com/{{ .Get "twitter" }}" class="hover:text-gray-400">🐦 Twitter</a>{{ end }}
                {{ if .Get "linkedin" }}<a href="https://linkedin.com/in/{{ .Get "linkedin" }}" class="hover:text-gray-400">💼 LinkedIn</a>{{ end }}
                {{ if .Get "email" }}<a href="mailto:{{ .Get "email" }}" class="hover:text-gray-400">📧 Email</a>{{ end }}
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('newsletter-form', {
        template: `
            <div class="max-w-md mx-auto text-center mb-8">
                <h3 class="text-xl font-bold mb-2">{{ .Get "title" }}</h3>
                <p class="text-gray-400 mb-4">{{ .Get "description" }}</p>
                <form action="{{ .Get "action" }}" method="POST" class="flex gap-2">
                    <input type="email" placeholder="Your email" class="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{{ .Get "button-text" }}</button>
                </form>
            </div>
        `,
        funcMap: commonFuncMap
    });

    renderer.registerTemplateShortcode('copyright', {
        template: `
            <div class="text-center text-gray-500 text-sm">
                <p class="mb-2">{{ .Get "text" }}</p>
                <div class="space-x-4">
                    {{ range (split (.Get "links") ",") }}
                        <a href="#" class="hover:text-gray-400">{{ . }}</a>
                    {{ end }}
                </div>
            </div>
        `,
        funcMap: commonFuncMap
    });
}

// 注册所有 shortcodes
registerShortcodes(shortcodeRenderer);

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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-50">
    {{ content }}
</body>
</html>
`;

// 路由处理
app.get('/', (req, res) => {
    try {
        // 读取 markdown 文件
        const markdownContent = readFileSync(join(__dirname, 'index.md'), 'utf-8');
        
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
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 