# 发布流程

本文档描述了如何将 `@mdfriday/shortcode-compiler` 发布到 npm。

## 1. 准备工作

### 1.1 更新 package.json

确保 `package.json` 包含以下关键配置：

```json
{
  "name": "@mdfriday/shortcode-compiler",
  "version": "0.1.0",
  "description": "A shortcode compiler for markdown content, supporting nested shortcodes and frontmatter",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "publishConfig": {
    "access": "public"
  }
}
```

### 1.2 检查必要文件

确保以下文件存在且内容完整：

- `README.md`：包含使用说明和 API 文档
- `LICENSE`：包含许可证信息
- `src/`：源代码目录
- `tsconfig.json`：TypeScript 配置文件

## 2. 构建和测试

### 2.1 安装依赖

```bash
npm install
```

### 2.2 运行测试

```bash
npm test
```

确保所有测试通过。

### 2.3 构建项目

```bash
npm run build
```

检查 `dist/` 目录是否包含以下文件：
- JavaScript 文件 (`.js`)
- 类型声明文件 (`.d.ts`)
- Source map 文件 (`.js.map`)

## 3. 发布到 npm

### 3.1 登录 npm

```bash
npm login
```

输入你的 npm 账号信息：
- 用户名
- 密码
- 邮箱
- 双因素认证码（如果启用）

### 3.2 发布包

```bash
npm publish --access public
```

发布过程会自动执行以下步骤：
1. 运行 `prepublishOnly` 脚本（运行测试）
2. 运行 `prepare` 脚本（清理并构建项目）
3. 打包并上传到 npm 仓库

## 4. 验证发布

### 4.1 检查包是否可用

访问 npm 网站验证包是否已发布：
https://www.npmjs.com/package/@mdfriday/shortcode-compiler

### 4.2 测试安装

在一个新项目中测试安装：

```bash
npm install @mdfriday/shortcode-compiler
```

## 5. 在 Obsidian 插件中使用

### 5.1 安装依赖

在你的 Obsidian 插件项目中运行：

```bash
npm install @mdfriday/shortcode-compiler
```

### 5.2 使用示例

```typescript
import { ShortcodeRenderer, ContentProvider } from '@mdfriday/shortcode-compiler';

// 创建 ShortcodeRenderer 实例
const renderer = new ShortcodeRenderer();

// 注册 shortcodes
renderer.registerShortcode('link', (params, content) => {
  const url = params.find(p => p.startsWith('url='))?.replace(/^url="|"$/g, '') || '#';
  return `<a href="${url}">${content || url}</a>`;
});

// 创建 ContentProvider 实例
const provider = new ContentProvider({ shortcodeRenderer: renderer });

// 处理内容
const content = `
---
title: My Page
---
Here's a {{< link url="https://example.com" >}}link{{< /link >}}
`;

const result = await provider.getPageContent('example.md', content);
console.log(result.content); // 输出处理后的 HTML
```

## 6. 版本更新

当需要发布新版本时：

1. 更新 `package.json` 中的版本号
2. 更新 `CHANGELOG.md`（如果有）
3. 提交更改到 Git
4. 创建新的 Git tag
5. 重复发布流程 