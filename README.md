# @mdfriday/shortcode-compiler

A powerful shortcode compiler for markdown content, supporting function and template shortcodes, nested shortcodes, and frontmatter parsing.

## Features

- Two types of shortcodes:
  - Function shortcodes: Simple function-based rendering
  - Template shortcodes: Complex template-based rendering with conditions and loops
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

### Function Shortcodes

```typescript
import { ShortcodeRenderer, ContentProvider } from '@mdfriday/shortcode-compiler';

// Create a ShortcodeRenderer instance
const shortcodeRenderer = new ShortcodeRenderer();

// Register function shortcodes
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

const result = await contentProvider.getPageContent(content);
console.log(result);
```

### Template Shortcodes (New in v0.2.0)

```typescript
// Register a template shortcode with conditions and loops
shortcodeRenderer.registerTemplateShortcode('product-list', {
  // Template with Go template syntax
  template: `
<div class="products">
  <h2>{{ .title }}</h2>
  <ul>
    {{ range .items }}
    <li>
      <strong>{{ .name }}</strong>: {{ .price }}
      {{ if .onSale }}
      <span class="sale">Sale!</span>
      {{ end }}
    </li>
    {{ end }}
  </ul>
</div>`,
  // Custom data provider
  dataProvider: (params, content) => ({
    title: params.find(p => p.startsWith('title='))?.replace(/^title="|"$/g, '') || 'Products',
    items: [
      { name: 'Item 1', price: '$10.99', onSale: true },
      { name: 'Item 2', price: '$24.99', onSale: false }
    ]
  })
});

// Use the template shortcode
const content = `
# Product Catalog
{{< product-list title="Featured Products" >}}
`;

const result = await contentProvider.getPageContent(content);
console.log(result);
```

### Template Shortcode Features

Template shortcodes support:
- Go template syntax
- Conditional rendering with `if`/`else`
- Loops with `range`
- Custom functions
- Named and positional parameters
- Custom data providers
- Nested template support

## API

### ShortcodeRenderer

The main class for registering and rendering shortcodes.

```typescript
const renderer = new ShortcodeRenderer(options?: RenderOptions);
```

#### Methods

- `registerShortcode(name: string, renderFn: (params: string[], content?: string) => string): void`
- `registerShortcodes(shortcodes: Record<string, (params: string[], content?: string) => string>): void`
- `registerTemplateShortcode(name: string, config: TemplateShortcodeConfig): void`
- `renderShortcode(name: string, params: string[], content?: string, options?: RenderOptions): string`

### ContentProvider

The main class for processing markdown content with shortcodes.

```typescript
const provider = new ContentProvider(options: ContentProviderOptions);
```

#### Methods

- `getPageContent(content: string): Promise<PageContent>`
- `getPageContentFromText(text: string): PageContent`

## License

Apache License 2.0
