# CSS主题样式管理系统设计

## 1. 系统概述

这个CSS主题样式管理系统旨在支持不同的主题和组件样式，具有以下特性：

- 支持多主题（不同的布局和组件样式）
- 每个主题支持明暗两种模式（light/dark）
- 组件可以通过name属性动态应用不同的样式组合
- 用户只需指定name和theme属性即可应用相应样式
- 支持在Obsidian插件环境中使用，并提供样式隔离

## 2. 核心概念

### 2.1 主要概念定义

- **主题(Theme)**: 定义整体布局和组件样式的集合
- **模式(Mode)**: 每个主题下的明暗色配色方案
- **组件(Component)**: 具有特定样式的UI元素
- **子类型(Subtype)**: 组件的基本类型或种类（如primary, secondary按钮）
- **变体(Variant)**: 组件的状态或特殊变化（如disabled, highlight等）
- **尺寸(Size)**: 组件的大小变化（如small, medium, large等）

### 2.2 Subtype 和 Variant 的区别

**Subtype（子类型）**:
- 表示组件的基本类型或种类，定义了组件的主要外观和用途
- 例如按钮的子类型：primary, secondary, text, icon, outline
- 子类型决定了按钮的基本外观和设计风格，是按钮的"种类"
- 通常是持久的，在组件创建时确定

**Variant（变体）**:
- 表示组件的状态或特殊变化，通常是临时的或交互相关的
- 例如按钮的变体：default, disabled, loading, highlight
- 变体通常是叠加在子类型之上的额外样式，表示按钮的"状态"
- 通常是临时的，可能随用户交互而变化

## 3. 系统架构

### 3.1 核心类型定义

```typescript
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  // 其他颜色...
  [key: string]: string;
}

export interface ThemeModeConfig {
  colors: ThemeColors;
  // 其他模式特定配置...
  [key: string]: any;
}

export interface ComponentVariant {
  [key: string]: string | number;
}

export interface ComponentConfig {
  base: ComponentVariant;
  subtypes?: {
    [subtypeName: string]: ComponentVariant;
  };
  sizes?: {
    [sizeName: string]: ComponentVariant;
  };
  variants: {
    default: ComponentVariant;
    [variantName: string]: ComponentVariant;
  };
}

export interface ThemeConfig {
  name: string;
  modes: {
    light: ThemeModeConfig;
    dark: ThemeModeConfig;
  };
  components: {
    [componentName: string]: ComponentConfig;
  };
  layout: {
    spacing: {
      [key: string]: string;
    };
    breakpoints: {
      [key: string]: string;
    };
    // 其他布局配置...
    [key: string]: any;
  };
}

export interface ThemeManagerOptions {
  prefix?: string; // CSS类名前缀，用于样式隔离
  defaultTheme?: string;
  defaultMode?: ThemeMode;
  themesPath?: string; // 主题文件路径
}
```

### 3.2 主题管理器

主题管理器负责加载、管理主题和生成CSS：

```typescript
export class ThemeManager {
  private themes: Record<string, ThemeConfig> = {};
  private currentTheme: string;
  private currentMode: ThemeMode;
  private prefix: string;
  
  constructor(options: ThemeManagerOptions = {}) {
    this.prefix = options.prefix || 'theme';
    this.currentTheme = options.defaultTheme || 'default';
    this.currentMode = options.defaultMode || 'light';
    
    // 加载预装的主题
    this.loadThemes(options.themesPath);
  }
  
  // 加载预装的主题
  private async loadThemes(themesPath?: string): Promise<void> {
    // 从文件加载主题
  }
  
  // 获取所有可用主题名称
  public getAvailableThemes(): string[] {
    return Object.keys(this.themes);
  }
  
  // 设置当前主题
  public setTheme(themeName: string): ThemeManager {
    if (!this.themes[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return this;
    }
    
    this.currentTheme = themeName;
    return this;
  }
  
  // 设置当前模式（明/暗）
  public setMode(mode: ThemeMode): ThemeManager {
    this.currentMode = mode;
    return this;
  }
  
  // 获取当前主题
  public getCurrentTheme(): ThemeConfig | null {
    return this.themes[this.currentTheme] || null;
  }
  
  // 获取当前模式
  public getCurrentMode(): ThemeMode {
    return this.currentMode;
  }
  
  // 获取组件的CSS类名
  public getComponentClasses(
    componentName: string, 
    options: {
      variant?: string;
      subtype?: string;
      size?: string;
      theme?: string;
    } = {}
  ): string {
    const {
      variant = 'default',
      subtype = 'primary',
      size = 'medium',
      theme
    } = options;
    
    // 如果指定了主题，临时切换
    const originalTheme = theme ? this.currentTheme : null;
    if (theme) {
      this.setTheme(theme);
    }
    
    const currentTheme = this.getCurrentTheme();
    if (!currentTheme) return '';
    
    // 构建类名
    const baseClass = `${this.prefix}-${currentTheme.name}-${componentName}`;
    const subtypeClass = subtype ? `${baseClass}--${subtype}` : '';
    const sizeClass = size ? `${baseClass}--${size}` : '';
    const variantClass = variant !== 'default' ? `${baseClass}--${variant}` : '';
    const modeClass = `${baseClass}--${this.currentMode}`;
    
    // 恢复原始主题
    if (originalTheme) {
      this.setTheme(originalTheme);
    }
    
    return [baseClass, subtypeClass, sizeClass, variantClass, modeClass]
      .filter(Boolean)
      .join(' ');
  }
  
  // 生成所有CSS
  public generateCSS(): string {
    let css = '';
    
    // 遍历所有主题
    Object.values(this.themes).forEach(theme => {
      // 生成CSS变量
      css += this.generateCSSVariables(theme);
      
      // 生成组件样式
      css += this.generateComponentStyles(theme);
    });
    
    return css;
  }
  
  // 缓存生成的CSS
  private cssCache: Record<string, string> = {};

  public generateThemeCSS(themeName: string): string {
    // 检查缓存
    if (this.cssCache[themeName]) {
      return this.cssCache[themeName];
    }
    
    // 生成CSS
    const theme = this.themes[themeName];
    if (!theme) return '';
    
    let css = '';
    css += this.generateCSSVariables(theme);
    css += this.generateComponentStyles(theme);
    
    // 存入缓存
    this.cssCache[themeName] = css;
    
    return css;
  }

  // 当主题配置变化时清除缓存
  public invalidateCache(themeName?: string) {
    if (themeName) {
      delete this.cssCache[themeName];
    } else {
      this.cssCache = {};
    }
  }
  
  // 生成CSS变量
  private generateCSSVariables(theme: ThemeConfig): string {
    let css = '';
    
    // 生成亮色模式变量
    css += `[data-theme="${theme.name}"][data-mode="light"] {\n`;
    Object.entries(theme.modes.light.colors).forEach(([key, value]) => {
      css += `  --${this.prefix}-${key}: ${value};\n`;
    });
    css += '}\n\n';
    
    // 生成暗色模式变量
    css += `[data-theme="${theme.name}"][data-mode="dark"] {\n`;
    Object.entries(theme.modes.dark.colors).forEach(([key, value]) => {
      css += `  --${this.prefix}-${key}: ${value};\n`;
    });
    css += '}\n\n';
    
    return css;
  }
  
  // 生成组件样式
  private generateComponentStyles(theme: ThemeConfig): string {
    let css = '';
    
    // 遍历所有组件
    Object.entries(theme.components).forEach(([componentName, component]) => {
      const baseClass = `.${this.prefix}-${theme.name}-${componentName}`;
      
      // 基础样式
      css += `${baseClass} {\n`;
      Object.entries(component.base).forEach(([prop, value]) => {
        css += `  ${this.camelToDash(prop)}: ${value};\n`;
      });
      css += '}\n\n';
      
      // 子类型样式
      if (component.subtypes) {
        Object.entries(component.subtypes).forEach(([subtypeName, subtypeStyle]) => {
          const subtypeClass = `${baseClass}--${subtypeName}`;
          css += `${subtypeClass} {\n`;
          Object.entries(subtypeStyle).forEach(([prop, value]) => {
            css += `  ${this.camelToDash(prop)}: ${value};\n`;
          });
          css += '}\n\n';
        });
      }
      
      // 尺寸样式
      if (component.sizes) {
        Object.entries(component.sizes).forEach(([sizeName, sizeStyle]) => {
          const sizeClass = `${baseClass}--${sizeName}`;
          css += `${sizeClass} {\n`;
          Object.entries(sizeStyle).forEach(([prop, value]) => {
            css += `  ${this.camelToDash(prop)}: ${value};\n`;
          });
          css += '}\n\n';
        });
      }
      
      // 变体样式
      Object.entries(component.variants).forEach(([variantName, variantStyle]) => {
        if (variantName === 'default') {
          // 默认样式已经包含在基础类中
          return;
        }
        
        const variantClass = `${baseClass}--${variantName}`;
        css += `${variantClass} {\n`;
        Object.entries(variantStyle).forEach(([prop, value]) => {
          css += `  ${this.camelToDash(prop)}: ${value};\n`;
        });
        css += '}\n\n';
      });
      
      // 模式特定样式
      ['light', 'dark'].forEach(mode => {
        const modeClass = `${baseClass}--${mode}`;
        css += `${modeClass} {\n`;
        css += `  /* 模式特定样式可以在这里添加 */\n`;
        css += '}\n\n';
      });
    });
    
    return css;
  }
  
  // 将驼峰命名转换为短横线命名
  private camelToDash(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  // 主题继承
  public extendTheme(baseThemeName: string, newThemeName: string, overrides: Partial<ThemeConfig>): ThemeManager {
    const baseTheme = this.themes[baseThemeName];
    if (!baseTheme) {
      console.error(`Base theme "${baseThemeName}" not found`);
      return this;
    }
    
    // 深度合并主题配置
    const newTheme = deepMerge(baseTheme, { ...overrides, name: newThemeName });
    
    // 注册新主题
    this.themes[newThemeName] = newTheme;
    
    // 清除缓存
    this.invalidateCache(newThemeName);
    
    return this;
  }

  // 导出主题
  public exportTheme(themeName: string): string {
    const theme = this.themes[themeName];
    if (!theme) {
      console.error(`Theme "${themeName}" not found`);
      return '';
    }
    
    return JSON.stringify(theme, null, 2);
  }

  // 导入主题
  public importTheme(themeJson: string): ThemeManager {
    try {
      const theme = JSON.parse(themeJson) as ThemeConfig;
      if (!theme.name) {
        console.error('Invalid theme: missing name');
        return this;
      }
      
      this.themes[theme.name] = theme;
      this.invalidateCache(theme.name);
      
      return this;
    } catch (error) {
      console.error('Failed to import theme:', error);
      return this;
    }
  }
}
```

### 3.3 组件样式助手

组件样式助手提供了更便捷的方法来获取组件样式：

```typescript
export class ComponentStyler {
  private themeManager: ThemeManager;
  
  constructor(themeManager: ThemeManager) {
    this.themeManager = themeManager;
  }
  
  // 获取组件的CSS类名
  public getComponentClasses(
    componentName: string, 
    options: {
      variant?: string;
      subtype?: string;
      size?: string;
      theme?: string;
    } = {}
  ): string {
    return this.themeManager.getComponentClasses(componentName, options);
  }
  
  // 解析Markdown中的组件语法并返回对应的类名
  public parseComponentSyntax(syntax: string): string | null {
    // 解析组件语法
    const match = syntax.match(/{{<\s*(\w+)(?:\s+"([^"]+)"="([^"]*)")*(?:\s+theme="([^"]*)")?\s*\/>}}/);
    
    if (!match) return null;
    
    const [fullMatch, componentName] = match;
    
    // 提取所有属性
    const attributes: Record<string, string> = {};
    const attrRegex = /"([^"]+)"="([^"]*)"/g;
    let attrMatch;
    
    while (attrMatch = attrRegex.exec(fullMatch)) {
      const [_, key, value] = attrMatch;
      attributes[key] = value;
    }
    
    // 映射属性到选项
    const options = {
      variant: attributes.name, // 为了兼容性，name映射到variant
      subtype: attributes.subtype,
      size: attributes.size,
      theme: match[4] // theme属性
    };
    
    return this.getComponentClasses(componentName, options);
  }
  
  // 为HTML元素添加样式类
  public applyClassesToElement(
    element: HTMLElement, 
    componentName: string, 
    options: {
      variant?: string;
      subtype?: string;
      size?: string;
      theme?: string;
    } = {}
  ): HTMLElement {
    const classes = this.getComponentClasses(componentName, options);
    element.className = element.className ? `${element.className} ${classes}` : classes;
    return element;
  }
}
```

### 3.4 公开API

```typescript
// 单例实例
let themeManager: ThemeManager | null = null;
let componentStyler: ComponentStyler | null = null;

// 初始化主题系统
export function initThemeSystem(options: {
  prefix?: string;
  defaultTheme?: string;
  defaultMode?: ThemeMode;
  themesPath?: string;
} = {}) {
  themeManager = new ThemeManager(options);
  componentStyler = new ComponentStyler(themeManager);
  
  return {
    themeManager,
    componentStyler
  };
}

// 获取主题管理器实例
export function getThemeManager(): ThemeManager {
  if (!themeManager) {
    throw new Error('Theme system not initialized. Call initThemeSystem first.');
  }
  return themeManager;
}

// 获取组件样式助手实例
export function getComponentStyler(): ComponentStyler {
  if (!componentStyler) {
    throw new Error('Theme system not initialized. Call initThemeSystem first.');
  }
  return componentStyler;
}

// 设置当前主题
export function setTheme(themeName: string) {
  getThemeManager().setTheme(themeName);
  document.documentElement.setAttribute('data-theme', themeName);
}

// 设置当前模式
export function setMode(mode: ThemeMode) {
  getThemeManager().setMode(mode);
  document.documentElement.setAttribute('data-mode', mode);
}

// 获取组件类名
export function getComponentClasses(
  componentName: string, 
  options: {
    variant?: string;
    subtype?: string;
    size?: string;
    theme?: string;
  } = {}
): string {
  return getComponentStyler().getComponentClasses(componentName, options);
}

// 生成所有CSS
export function generateCSS(): string {
  return getThemeManager().generateCSS();
}

// 生成特定主题的CSS
export function generateThemeCSS(themeName: string): string {
  return getThemeManager().generateThemeCSS(themeName);
}

// 解析组件语法
export function parseComponentSyntax(syntax: string): string | null {
  return getComponentStyler().parseComponentSyntax(syntax);
}

// 获取所有可用主题
export function getAvailableThemes(): string[] {
  return getThemeManager().getAvailableThemes();
}
```

## 4. 主题配置示例

### 4.1 按钮组件配置

```json
{
  "components": {
    "button": {
      "base": {
        "fontFamily": "inherit",
        "cursor": "pointer",
        "transition": "all 0.2s ease",
        "border": "none",
        "outline": "none",
        "display": "inline-flex",
        "alignItems": "center",
        "justifyContent": "center"
      },
      "subtypes": {
        "primary": {
          "backgroundColor": "var(--obsidian-theme-primary)",
          "color": "var(--obsidian-theme-primary-contrast)",
          "borderRadius": "4px"
        },
        "secondary": {
          "backgroundColor": "var(--obsidian-theme-secondary)",
          "color": "var(--obsidian-theme-secondary-contrast)",
          "borderRadius": "4px"
        },
        "text": {
          "backgroundColor": "transparent",
          "color": "var(--obsidian-theme-primary)",
          "padding": "4px 8px"
        },
        "icon": {
          "backgroundColor": "transparent",
          "color": "var(--obsidian-theme-text)",
          "borderRadius": "50%",
          "padding": "8px",
          "minWidth": "auto"
        },
        "outline": {
          "backgroundColor": "transparent",
          "color": "var(--obsidian-theme-primary)",
          "border": "1px solid var(--obsidian-theme-primary)",
          "borderRadius": "4px"
        }
      },
      "sizes": {
        "small": {
          "fontSize": "12px",
          "padding": "4px 8px",
          "minWidth": "64px",
          "height": "28px"
        },
        "medium": {
          "fontSize": "14px",
          "padding": "6px 16px",
          "minWidth": "80px",
          "height": "36px"
        },
        "large": {
          "fontSize": "16px",
          "padding": "8px 22px",
          "minWidth": "96px",
          "height": "44px"
        }
      },
      "variants": {
        "default": {},
        "disabled": {
          "opacity": "0.6",
          "cursor": "not-allowed",
          "pointerEvents": "none"
        },
        "loading": {
          "position": "relative",
          "color": "transparent",
          "pointerEvents": "none"
        },
        "highlight": {
          "boxShadow": "0 0 8px var(--obsidian-theme-primary)",
          "transform": "translateY(-1px)"
        }
      }
    }
  }
}
```

### 4.2 完整主题配置示例

```json
{
  "name": "disney",
  "modes": {
    "light": {
      "colors": {
        "primary": "#1a75ff",
        "primary-contrast": "#ffffff",
        "secondary": "#ff6b6b",
        "secondary-contrast": "#ffffff",
        "background": "#f5f5f5",
        "surface": "#ffffff",
        "text": "#333333",
        "text-secondary": "#666666",
        "border": "#e0e0e0",
        "disabled": "#cccccc",
        "disabled-text": "#999999"
      }
    },
    "dark": {
      "colors": {
        "primary": "#4d94ff",
        "primary-contrast": "#ffffff",
        "secondary": "#ff9999",
        "secondary-contrast": "#ffffff",
        "background": "#222222",
        "surface": "#333333",
        "text": "#f0f0f0",
        "text-secondary": "#cccccc",
        "border": "#444444",
        "disabled": "#555555",
        "disabled-text": "#888888"
      }
    }
  },
  "components": {
    "button": {
      "base": {
        "fontFamily": "Fantasy, cursive",
        "borderRadius": "20px",
        "transition": "all 0.3s ease"
      },
      "subtypes": {
        "primary": {
          "backgroundColor": "var(--obsidian-theme-primary)",
          "color": "white",
          "boxShadow": "0 4px 8px rgba(0,0,0,0.2)"
        }
      },
      "sizes": {
        "medium": {
          "fontSize": "14px",
          "padding": "8px 20px",
          "height": "36px"
        }
      },
      "variants": {
        "disabled": {
          "opacity": "0.6",
          "cursor": "not-allowed",
          "border": "2px solid var(--obsidian-theme-disabled)"
        }
      }
    },
    "card": {
      "base": {
        "backgroundColor": "var(--obsidian-theme-surface)",
        "color": "var(--obsidian-theme-text)",
        "borderRadius": "12px",
        "overflow": "hidden",
        "boxShadow": "0 4px 8px rgba(0,0,0,0.1)",
        "transition": "all 0.3s ease"
      },
      "subtypes": {
        "basic": {
          "padding": "16px"
        },
        "image": {
          "padding": "0"
        },
        "interactive": {
          "cursor": "pointer"
        }
      },
      "sizes": {
        "small": {
          "width": "240px"
        },
        "medium": {
          "width": "320px"
        },
        "large": {
          "width": "400px"
        }
      },
      "variants": {
        "default": {},
        "elevated": {
          "boxShadow": "0 8px 16px rgba(0,0,0,0.2)"
        },
        "outlined": {
          "boxShadow": "none",
          "border": "2px solid var(--obsidian-theme-border)"
        },
        "highlight": {
          "boxShadow": "0 0 12px var(--obsidian-theme-primary)",
          "border": "2px solid var(--obsidian-theme-primary)"
        }
      }
    },
    "input": {
      "base": {
        "fontFamily": "inherit",
        "fontSize": "14px",
        "lineHeight": "1.5",
        "color": "var(--obsidian-theme-text)",
        "backgroundColor": "var(--obsidian-theme-surface)",
        "border": "1px solid var(--obsidian-theme-border)",
        "borderRadius": "4px",
        "padding": "8px 12px",
        "width": "100%",
        "transition": "all 0.2s ease",
        "outline": "none"
      },
      "subtypes": {
        "text": {},
        "password": {},
        "search": {
          "paddingLeft": "32px"
        },
        "textarea": {
          "minHeight": "80px",
          "resize": "vertical"
        }
      },
      "sizes": {
        "small": {
          "fontSize": "12px",
          "padding": "4px 8px",
          "height": "28px"
        },
        "medium": {
          "fontSize": "14px",
          "padding": "8px 12px",
          "height": "36px"
        },
        "large": {
          "fontSize": "16px",
          "padding": "12px 16px",
          "height": "44px"
        }
      },
      "variants": {
        "default": {
          "borderColor": "var(--obsidian-theme-border)"
        },
        "focused": {
          "borderColor": "var(--obsidian-theme-primary)",
          "boxShadow": "0 0 0 2px rgba(26, 117, 255, 0.2)"
        },
        "error": {
          "borderColor": "var(--obsidian-theme-error)",
          "color": "var(--obsidian-theme-error)"
        },
        "disabled": {
          "backgroundColor": "var(--obsidian-theme-disabled)",
          "color": "var(--obsidian-theme-disabled-text)",
          "cursor": "not-allowed"
        }
      }
    },
    "tag": {
      "base": {
        "display": "inline-flex",
        "alignItems": "center",
        "justifyContent": "center",
        "borderRadius": "16px",
        "padding": "2px 8px",
        "fontSize": "12px",
        "fontWeight": "500",
        "lineHeight": "1.5",
        "whiteSpace": "nowrap"
      },
      "subtypes": {
        "default": {
          "backgroundColor": "var(--obsidian-theme-primary)",
          "color": "var(--obsidian-theme-primary-contrast)"
        },
        "secondary": {
          "backgroundColor": "var(--obsidian-theme-secondary)",
          "color": "var(--obsidian-theme-secondary-contrast)"
        },
        "success": {
          "backgroundColor": "var(--obsidian-theme-success)",
          "color": "var(--obsidian-theme-success-contrast)"
        },
        "warning": {
          "backgroundColor": "var(--obsidian-theme-warning)",
          "color": "var(--obsidian-theme-warning-contrast)"
        },
        "error": {
          "backgroundColor": "var(--obsidian-theme-error)",
          "color": "var(--obsidian-theme-error-contrast)"
        },
        "info": {
          "backgroundColor": "var(--obsidian-theme-info)",
          "color": "var(--obsidian-theme-info-contrast)"
        }
      },
      "sizes": {
        "small": {
          "height": "20px",
          "fontSize": "10px",
          "padding": "0 6px"
        },
        "medium": {
          "height": "24px",
          "fontSize": "12px",
          "padding": "0 8px"
        },
        "large": {
          "height": "28px",
          "fontSize": "14px",
          "padding": "0 10px"
        }
      },
      "variants": {
        "default": {},
        "outlined": {
          "backgroundColor": "transparent",
          "border": "1px solid currentColor"
        },
        "clickable": {
          "cursor": "pointer",
          "userSelect": "none"
        },
        "removable": {
          "paddingRight": "4px"
        }
      }
    }
  },
  "layout": {
    "spacing": {
      "small": "10px",
      "medium": "20px",
      "large": "30px"
    },
    "breakpoints": {
      "mobile": "480px",
      "tablet": "768px",
      "desktop": "1024px"
    }
  }
}
```

## 5. 使用示例

### 5.1 在Markdown中使用

```markdown
<!-- 主要按钮 -->
{{< button "subtype"="primary" "size"="medium" theme="disney" />}}

<!-- 次要按钮 -->
{{< button "subtype"="secondary" "size"="medium" theme="disney" />}}

<!-- 文本按钮 -->
{{< button "subtype"="text" "size"="medium" theme="disney" />}}

<!-- 图标按钮 -->
{{< button "subtype"="icon" "size"="medium" theme="disney" />}}

<!-- 轮廓按钮 -->
{{< button "subtype"="outline" "size"="medium" theme="disney" />}}

<!-- 禁用状态 -->
{{< button "subtype"="primary" "size"="medium" "name"="disabled" theme="disney" />}}

<!-- 高亮状态 -->
{{< button "subtype"="primary" "size"="large" "name"="highlight" theme="disney" />}}

<!-- 卡片组件 -->
{{< card "subtype"="basic" "size"="medium" theme="disney" />}}
```

### 5.2 在代码中使用

```typescript
import { getComponentClasses, generateCSS } from './api';

// 初始化主题系统
initThemeSystem({
  prefix: 'my-plugin',
  defaultTheme: 'disney',
  defaultMode: 'light',
  themesPath: './themes'
});

// 获取主要按钮类名
const primaryButtonClasses = getComponentClasses('button', {
  subtype: 'primary',
  size: 'medium',
  theme: 'disney'
});
// 结果: my-plugin-disney-button my-plugin-disney-button--primary my-plugin-disney-button--medium my-plugin-disney-button--light

// 获取禁用状态的次要按钮类名
const disabledSecondaryButtonClasses = getComponentClasses('button', {
  subtype: 'secondary',
  size: 'medium',
  variant: 'disabled',
  theme: 'disney'
});
// 结果: my-plugin-disney-button my-plugin-disney-button--secondary my-plugin-disney-button--medium my-plugin-disney-button--disabled my-plugin-disney-button--light

// 应用到HTML元素
const button = document.createElement('button');
button.className = primaryButtonClasses;
button.textContent = 'Click Me';
document.body.appendChild(button);

// 生成CSS并注入到页面
const css = generateCSS();
const styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);
```

### 5.3 在Obsidian插件中使用

```typescript
import { Plugin } from 'obsidian';
import { initThemeSystem, getComponentClasses, generateCSS } from './api';

export default class MyObsidianPlugin extends Plugin {
  async onload() {
    // 初始化主题系统，加载预装主题
    const { themeManager } = initThemeSystem({
      prefix: 'my-plugin',
      defaultTheme: 'disney',
      defaultMode: 'light',
      themesPath: `${this.manifest.dir}/themes` // 预装主题路径
    });
    
    // 处理Markdown中的组件
    this.registerMarkdownPostProcessor((el, ctx) => {
      // 查找所有组件占位符
      el.querySelectorAll('.component-placeholder').forEach(placeholder => {
        const componentName = placeholder.getAttribute('data-component') || '';
        const subtype = placeholder.getAttribute('data-subtype') || 'primary';
        const size = placeholder.getAttribute('data-size') || 'medium';
        const variant = placeholder.getAttribute('data-variant');
        const themeName = placeholder.getAttribute('data-theme');
        
        // 获取组件类名
        const classes = getComponentClasses(componentName, {
          subtype,
          size,
          variant,
          theme: themeName
        });
        
        // 应用类名
        placeholder.className = `${placeholder.className} ${classes}`.trim();
      });
      
      // 注入CSS
      this.injectCSS();
    });
  }
  
  injectCSS() {
    // 获取所有CSS
    const css = generateCSS();
    
    // 创建或更新样式元素
    let styleEl = document.getElementById('my-plugin-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'my-plugin-styles';
      document.head.appendChild(styleEl);
    }
    
    styleEl.textContent = css;
  }
}
```

## 6. 生成的CSS示例

对于上面的按钮配置，系统将生成类似以下的CSS：

```css
/* 基础按钮样式 */
.obsidian-theme-disney-button {
  font-family: Fantasy, cursive;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 子类型样式 */
.obsidian-theme-disney-button--primary {
  background-color: var(--obsidian-theme-primary);
  color: var(--obsidian-theme-primary-contrast);
  border-radius: 20px;
}

.obsidian-theme-disney-button--secondary {
  background-color: var(--obsidian-theme-secondary);
  color: var(--obsidian-theme-secondary-contrast);
  border-radius: 20px;
}

.obsidian-theme-disney-button--text {
  background-color: transparent;
  color: var(--obsidian-theme-primary);
  padding: 4px 8px;
}

.obsidian-theme-disney-button--icon {
  background-color: transparent;
  color: var(--obsidian-theme-text);
  border-radius: 50%;
  padding: 8px;
  min-width: auto;
}

.obsidian-theme-disney-button--outline {
  background-color: transparent;
  color: var(--obsidian-theme-primary);
  border: 2px solid var(--obsidian-theme-primary);
  border-radius: 20px;
}

/* 尺寸样式 */
.obsidian-theme-disney-button--small {
  font-size: 12px;
  padding: 4px 12px;
  min-width: 64px;
  height: 28px;
}

.obsidian-theme-disney-button--medium {
  font-size: 14px;
  padding: 8px 20px;
  min-width: 80px;
  height: 36px;
}

.obsidian-theme-disney-button--large {
  font-size: 16px;
  padding: 12px 28px;
  min-width: 96px;
  height: 44px;
}

/* 变体样式 */
.obsidian-theme-disney-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
  border: 2px solid var(--obsidian-theme-disabled);
}

.obsidian-theme-disney-button--loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.obsidian-theme-disney-button--highlight {
  box-shadow: 0 0 10px rgba(255,215,0,0.5);
  border: 2px solid gold;
  transform: translateY(-2px);
}

/* 模式特定样式 */
.obsidian-theme-disney-button--light {
  /* 亮色模式特定样式 */
}

.obsidian-theme-disney-button--dark {
  /* 暗色模式特定样式 */
}
```

## 7. 实现注意事项

### 7.1 性能考虑

在处理大量组件和主题时，性能可能会成为一个问题。为了优化性能，可以考虑以下几点：

- **缓存**：对于频繁使用的组件和主题，可以考虑使用缓存来减少重复计算。
- **异步加载**：对于大型主题和组件配置，可以考虑使用异步加载和延迟加载的方式来提高初始化速度。

### 7.2 安全性考虑

在处理用户输入和外部资源时，需要确保安全性。例如，对于用户输入的组件名称和主题名称，需要进行有效的验证和过滤，以防止潜在的安全风险。

### 7.3 可维护性考虑

在设计系统时，需要考虑到系统的可维护性。例如，对于复杂的主题和组件配置，可以考虑使用配置文件或数据库来存储这些配置，以便于管理和更新。

### 7.4 兼容性考虑

在设计系统时，需要考虑到系统的兼容性。例如，对于不同的浏览器和设备，需要确保系统能够正常运行。

### 7.5 可扩展性考虑

在设计系统时，需要考虑到系统的可扩展性。例如，对于新的组件和主题，需要确保系统能够轻松地添加和集成这些新功能。

### 7.6 样式隔离

为了确保样式不会与Obsidian或其他插件冲突，我们采用了以下策略：

1. **CSS前缀**: 所有CSS类名和变量都使用可配置的前缀
2. **数据属性**: 使用`data-theme`和`data-mode`属性来控制主题和模式
3. **作用域选择器**: 可以将所有样式限制在特定容器内

示例：

```css
/* 使用前缀和数据属性 */
[data-theme="disney"][data-mode="light"] {
  --obsidian-theme-primary: #1a75ff;
}

/* 使用作用域选择器 */
.my-plugin-container .obsidian-theme-disney-button {
  /* 样式 */
}
```

### 7.7 主题文件结构

主题文件可以存储为JSON格式，便于读取和修改：

```
/themes
  /default.json
  /disney.json
  /material.json
```

每个主题文件包含完整的主题配置，包括模式、组件和布局。

### 7.8 扩展性考虑

系统设计应考虑以下扩展性需求：

1. **新组件支持**: 轻松添加新组件类型
2. **自定义变体**: 允许用户定义自己的组件变体
3. **主题继承**: 支持主题之间的继承关系
4. **插件集成**: 提供API供其他插件使用
5. **主题导出/导入**: 支持主题的导出和导入

示例扩展：

```typescript
// 主题继承
public extendTheme(baseThemeName: string, newThemeName: string, overrides: Partial<ThemeConfig>): ThemeManager {
  const baseTheme = this.themes[baseThemeName];
  if (!baseTheme) {
    console.error(`Base theme "${baseThemeName}" not found`);
    return this;
  }
  
  // 深度合并主题配置
  const newTheme = deepMerge(baseTheme, { ...overrides, name: newThemeName });
  
  // 注册新主题
  this.themes[newThemeName] = newTheme;
  
  // 清除缓存
  this.invalidateCache(newThemeName);
  
  return this;
}

// 导出主题
public exportTheme(themeName: string): string {
  const theme = this.themes[themeName];
  if (!theme) {
    console.error(`Theme "${themeName}" not found`);
    return '';
  }
  
  return JSON.stringify(theme, null, 2);
}

// 导入主题
public importTheme(themeJson: string): ThemeManager {
  try {
    const theme = JSON.parse(themeJson) as ThemeConfig;
    if (!theme.name) {
      console.error('Invalid theme: missing name');
      return this;
    }
    
    this.themes[theme.name] = theme;
    this.invalidateCache(theme.name);
    
    return this;
  } catch (error) {
    console.error('Failed to import theme:', error);
    return this;
  }
}
```

## 8. 组件类型扩展示例

除了按钮外，系统可以支持多种组件类型。以下是一些常见组件的配置示例：

### 8.1 卡片组件

```json
"card": {
  "base": {
    "backgroundColor": "var(--obsidian-theme-surface)",
    "color": "var(--obsidian-theme-text)",
    "borderRadius": "12px",
    "overflow": "hidden",
    "boxShadow": "0 4px 8px rgba(0,0,0,0.1)",
    "transition": "all 0.3s ease"
  },
  "subtypes": {
    "basic": {
      "padding": "16px"
    },
    "image": {
      "padding": "0"
    },
    "interactive": {
      "cursor": "pointer"
    }
  },
  "sizes": {
    "small": {
      "width": "240px"
    },
    "medium": {
      "width": "320px"
    },
    "large": {
      "width": "400px"
    }
  },
  "variants": {
    "default": {},
    "elevated": {
      "boxShadow": "0 8px 16px rgba(0,0,0,0.2)"
    },
    "outlined": {
      "boxShadow": "none",
      "border": "2px solid var(--obsidian-theme-border)"
    },
    "highlight": {
      "boxShadow": "0 0 12px var(--obsidian-theme-primary)",
      "border": "2px solid var(--obsidian-theme-primary)"
    }
  }
}
```

### 8.2 输入框组件

```json
"input": {
  "base": {
    "fontFamily": "inherit",
    "fontSize": "14px",
    "lineHeight": "1.5",
    "color": "var(--obsidian-theme-text)",
    "backgroundColor": "var(--obsidian-theme-surface)",
    "border": "1px solid var(--obsidian-theme-border)",
    "borderRadius": "4px",
    "padding": "8px 12px",
    "width": "100%",
    "transition": "all 0.2s ease",
    "outline": "none"
  },
  "subtypes": {
    "text": {},
    "password": {},
    "search": {
      "paddingLeft": "32px"
    },
    "textarea": {
      "minHeight": "80px",
      "resize": "vertical"
    }
  },
  "sizes": {
    "small": {
      "fontSize": "12px",
      "padding": "4px 8px",
      "height": "28px"
    },
    "medium": {
      "fontSize": "14px",
      "padding": "8px 12px",
      "height": "36px"
    },
    "large": {
      "fontSize": "16px",
      "padding": "12px 16px",
      "height": "44px"
    }
  },
  "variants": {
    "default": {
      "borderColor": "var(--obsidian-theme-border)"
    },
    "focused": {
      "borderColor": "var(--obsidian-theme-primary)",
      "boxShadow": "0 0 0 2px rgba(26, 117, 255, 0.2)"
    },
    "error": {
      "borderColor": "var(--obsidian-theme-error)",
      "color": "var(--obsidian-theme-error)"
    },
    "disabled": {
      "backgroundColor": "var(--obsidian-theme-disabled)",
      "color": "var(--obsidian-theme-disabled-text)",
      "cursor": "not-allowed"
    }
  }
}
```

### 8.3 标签组件

```json
"tag": {
  "base": {
    "display": "inline-flex",
    "alignItems": "center",
    "justifyContent": "center",
    "borderRadius": "16px",
    "padding": "2px 8px",
    "fontSize": "12px",
    "fontWeight": "500",
    "lineHeight": "1.5",
    "whiteSpace": "nowrap"
  },
  "subtypes": {
    "default": {
      "backgroundColor": "var(--obsidian-theme-primary)",
      "color": "var(--obsidian-theme-primary-contrast)"
    },
    "secondary": {
      "backgroundColor": "var(--obsidian-theme-secondary)",
      "color": "var(--obsidian-theme-secondary-contrast)"
    },
    "success": {
      "backgroundColor": "var(--obsidian-theme-success)",
      "color": "var(--obsidian-theme-success-contrast)"
    },
    "warning": {
      "backgroundColor": "var(--obsidian-theme-warning)",
      "color": "var(--obsidian-theme-warning-contrast)"
    },
    "error": {
      "backgroundColor": "var(--obsidian-theme-error)",
      "color": "var(--obsidian-theme-error-contrast)"
    },
    "info": {
      "backgroundColor": "var(--obsidian-theme-info)",
      "color": "var(--obsidian-theme-info-contrast)"
    }
  },
  "sizes": {
    "small": {
      "height": "20px",
      "fontSize": "10px",
      "padding": "0 6px"
    },
    "medium": {
      "height": "24px",
      "fontSize": "12px",
      "padding": "0 8px"
    },
    "large": {
      "height": "28px",
      "fontSize": "14px",
      "padding": "0 10px"
    }
  },
  "variants": {
    "default": {},
    "outlined": {
      "backgroundColor": "transparent",
      "border": "1px solid currentColor"
    },
    "clickable": {
      "cursor": "pointer",
      "userSelect": "none"
    },
    "removable": {
      "paddingRight": "4px"
    }
  }
}
```

## 9. 不同主题下的组件样式对比

不同主题可以为相同的组件定义不同的样式，以下是两个主题下按钮样式的对比：

### 9.1 默认主题按钮

```json
// default.json
{
  "name": "default",
  "components": {
    "button": {
      "base": {
        "fontFamily": "Arial, sans-serif",
        "borderRadius": "4px",
        "transition": "all 0.2s ease"
      },
      "subtypes": {
        "primary": {
          "backgroundColor": "var(--obsidian-theme-primary)",
          "color": "white"
        }
      },
      "sizes": {
        "medium": {
          "fontSize": "14px",
          "padding": "6px 16px",
          "height": "36px"
        }
      },
      "variants": {
        "disabled": {
          "opacity": "0.5",
          "cursor": "not-allowed"
        }
      }
    }
  }
}
```

### 9.2 迪士尼主题按钮

```json
// disney.json
{
  "name": "disney",
  "components": {
    "button": {
      "base": {
        "fontFamily": "Fantasy, cursive",
        "borderRadius": "20px",
        "transition": "all 0.3s ease"
      },
      "subtypes": {
        "primary": {
          "backgroundColor": "var(--obsidian-theme-primary)",
          "color": "white",
          "boxShadow": "0 4px 8px rgba(0,0,0,0.2)"
        }
      },
      "sizes": {
        "medium": {
          "fontSize": "14px",
          "padding": "8px 20px",
          "height": "36px"
        }
      },
      "variants": {
        "disabled": {
          "opacity": "0.6",
          "cursor": "not-allowed",
          "border": "2px solid var(--obsidian-theme-disabled)"
        }
      }
    }
  }
}
```

## 10. 总结

这个CSS主题样式管理系统提供了一个灵活、可扩展的解决方案，允许：

1. **多主题支持**: 可以定义和切换不同的主题
2. **明暗模式**: 每个主题支持明暗两种模式
3. **组件样式变化**: 通过子类型、尺寸和变体支持多种组件样式
4. **样式隔离**: 使用前缀和作用域选择器避免样式冲突
5. **简单的API**: 提供简洁的API用于应用主题和样式
6. **Markdown集成**: 支持在Markdown中使用组件语法

通过这种设计，用户只需指定组件名称、子类型、尺寸、变体和主题，就能获得相应的CSS类名，并生成所需的CSS样式。这使得在Obsidian插件中创建一致且可定制的UI组件变得简单而灵活。