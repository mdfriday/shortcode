# @mdfriday/shortcode-compiler

A powerful shortcode compiler for markdown content, supporting nested shortcodes and frontmatter parsing.

## Features

- Shortcode parsing and rendering
- Nested shortcode support
- Frontmatter parsing (YAML, TOML, JSON)
- Summary divider handling
- Customizable error handling
- TypeScript support

## Installation

```bash
npm install @mdfriday/shortcode-compiler
```

## Usage

```typescript
import { ShortcodeRenderer, ContentProvider } from '@mdfriday/shortcode-compiler';

// Create a ShortcodeRenderer instance
const shortcodeRenderer = new ShortcodeRenderer();

// Register shortcodes
shortcodeRenderer.registerShortcode('bold', (params, content) => {
  return `<strong>${content || ''}</strong>`;
});

shortcodeRenderer.registerShortcode('link', (params, content) => {
  const url = params.find(p => p.startsWith('url='))?.replace(/^url="|"$/g, '') || '#';
  return `<a href="${url}">${content || url}</a>`;
});

// Create a ContentProvider instance
const contentProvider = new ContentProvider({ shortcodeRenderer });

// Process content
const content = `---
title: Test Post
---
This is {{< bold >}}bold text{{< /bold >}} with a {{< link url="https://example.com" >}}link{{< /link >}}.
<!-- more -->
Rest of the content.`;

const result = await contentProvider.getPageContent('test.md', content);
console.log(result);
```

## API

### ShortcodeRenderer

The main class for registering and rendering shortcodes.

```typescript
const renderer = new ShortcodeRenderer(options?: RenderOptions);
```

#### Methods

- `registerShortcode(name: string, renderFn: (params: string[], content?: string) => string): void`
- `registerShortcodes(shortcodes: Record<string, (params: string[], content?: string) => string>): void`
- `renderShortcode(name: string, params: string[], content?: string, options?: RenderOptions): string`

### ContentProvider

The main class for processing markdown content with shortcodes.

```typescript
const provider = new ContentProvider(options: ContentProviderOptions);
```

#### Methods

- `getPageContent(filePath: string, fileContent: string): Promise<PageContent>`
- `getPageContentFromText(text: string): PageContent`

## License

Apache License 2.0
