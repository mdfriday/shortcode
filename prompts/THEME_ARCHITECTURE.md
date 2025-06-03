# 主题系统架构设计指南

## 🎯 核心理念：拥抱 Tailwind，最小化自定义

**严格遵循 Tailwind 最佳实践**，只在必要时扩展，保持简洁高效：

```css
/* ✅ 正确：只补充 Tailwind 没有的令牌 */
:root {
  --brand-coral: #ff6b6b;     /* 品牌特色颜色 */
  --brand-teal: #4ecdc4;      /* Tailwind 没有的特定色值 */
  --space-18: 4.5rem;         /* 特殊间距需求 */
}

/* ✅ 正确：基于 Tailwind + 自定义令牌创建语义主题 */
.theme-fire {
  --primary: theme('colors.red.500');
  --brand-accent: var(--brand-coral);
  --surface: theme('colors.white');
}
```

## 🏗️ 三层架构

```
1. Tailwind 基础令牌 + 自定义基础令牌
    ↓
2. 自定义主题（语义化样式变量）
    ↓  
3. HTML 组件（使用 classes 响应主题）
```

## 📋 各层详解

### 1. 基础令牌层：只扩展 Tailwind

**原则**：Tailwind First，只补充缺失的
**包含**：品牌特色颜色、特殊间距、自定义字体等

```css
:root {
  /* 品牌颜色（Tailwind 调色板没有的） */
  --brand-coral: #ff6b6b;
  --brand-sage: #87a96b;
  --brand-cream: #fdf6e3;
  
  /* 特殊间距（补充 Tailwind spacing scale） */
  --space-18: 4.5rem;   /* 72px，介于 16(4rem) 和 20(5rem) 之间 */
  --space-30: 7.5rem;   /* 120px，大横幅需求 */
  
  /* 自定义字体（如果不使用 Tailwind 预设） */
  --font-display: "Inter Display", sans-serif;
}
```

### 2. 主题层：Tailwind 风格的语义化

**原则**：使用 `theme()` 函数引用 Tailwind，CSS 变量提供动态切换
**命名**：遵循 Tailwind 的语义约定

```css
/* 基础主题 */
.theme-base {
  /* 主色系 - 直接使用 Tailwind */
  --primary: theme('colors.blue.600');
  --primary-foreground: theme('colors.white');
  
  /* 表面色系 */
  --background: theme('colors.white');
  --foreground: theme('colors.slate.900');
  --muted: theme('colors.slate.50');
  --muted-foreground: theme('colors.slate.600');
  
  /* 边框和状态 */
  --border: theme('colors.slate.200');
  --ring: theme('colors.blue.600');
  
  /* 状态颜色 */
  --destructive: theme('colors.red.500');
  --warning: theme('colors.amber.500');
  --success: theme('colors.green.500');
}

/* Fire 主题变体 */
.theme-fire {
  --primary: theme('colors.red.500');
  --primary-foreground: theme('colors.white');
  --background: theme('colors.red.50');
  --foreground: theme('colors.red.950');
  --muted: theme('colors.red.100');
  --muted-foreground: theme('colors.red.700');
  --border: theme('colors.red.200');
  --ring: theme('colors.red.500');
  
  /* 使用自定义品牌色 */
  --accent: var(--brand-coral);
  --accent-foreground: theme('colors.white');
}

/* Ocean 主题变体 */
.theme-ocean {
  --primary: theme('colors.cyan.500');
  --primary-foreground: theme('colors.white');
  --background: theme('colors.cyan.50');
  --foreground: theme('colors.cyan.950');
  --muted: theme('colors.cyan.100');
  --muted-foreground: theme('colors.cyan.700');
  --border: theme('colors.cyan.200');
  --ring: theme('colors.cyan.500');
}

/* 暗色模式 */
.theme-base.dark {
  --background: theme('colors.slate.950');
  --foreground: theme('colors.slate.50');
  --muted: theme('colors.slate.900');
  --muted-foreground: theme('colors.slate.400');
  --border: theme('colors.slate.800');
}
```

### 3. 组件层：Classes 响应主题变量

**原则**：使用 Tailwind 类名 + CSS 变量，自动响应主题切换
**实现**：通过 `rgb()` 函数使用主题变量

```html
<!-- 卡片组件示例 -->
<div class="bg-[rgb(var(--background))] border-[rgb(var(--border))] rounded-lg p-6 shadow-md">
  <h3 class="text-[rgb(var(--foreground))] text-xl font-semibold mb-4">
    Card Title
  </h3>
  <p class="text-[rgb(var(--muted-foreground))] mb-4">
    Card description text goes here.
  </p>
  <button class="bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
    Action Button
  </button>
</div>

<!-- 文章组件示例 -->
<article class="bg-[rgb(var(--background))] text-[rgb(var(--foreground))] max-w-4xl mx-auto p-8">
  <h1 class="text-3xl font-bold mb-6 text-[rgb(var(--foreground))]">Article Title</h1>
  <div class="prose prose-slate prose-lg">
    <p class="text-[rgb(var(--muted-foreground))] leading-relaxed">
      Article content...
    </p>
  </div>
</article>

<!-- 导航组件示例 -->
<nav class="bg-[rgb(var(--muted))] border-b border-[rgb(var(--border))]">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="text-[rgb(var(--foreground))] font-semibold">Brand</div>
      <div class="space-x-4">
        <a href="#" class="text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors">
          Home
        </a>
        <a href="#" class="text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] transition-colors">
          About
        </a>
      </div>
    </div>
  </div>
</nav>
```

## 🎨 主题切换实现

### JavaScript 主题切换

```javascript
// 主题切换函数
function setTheme(themeName, darkMode = false) {
  const root = document.documentElement;
  
  // 移除所有主题类
  root.classList.remove('theme-base', 'theme-fire', 'theme-ocean');
  root.classList.remove('dark');
  
  // 应用新主题
  root.classList.add(`theme-${themeName}`);
  if (darkMode) {
    root.classList.add('dark');
  }
  
  // 保存到 localStorage
  localStorage.setItem('theme', themeName);
  localStorage.setItem('darkMode', darkMode);
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'base';
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  setTheme(savedTheme, savedDarkMode);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initTheme);
```

### React Hook 示例

```typescript
import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setThemeState] = useState('base');
  const [darkMode, setDarkModeState] = useState(false);

  const setTheme = (themeName: string, isDark: boolean = false) => {
    const root = document.documentElement;
    
    // 清除现有主题
    root.classList.remove('theme-base', 'theme-fire', 'theme-ocean', 'dark');
    
    // 应用新主题
    root.classList.add(`theme-${themeName}`);
    if (isDark) root.classList.add('dark');
    
    // 更新状态和存储
    setThemeState(themeName);
    setDarkModeState(isDark);
    localStorage.setItem('theme', themeName);
    localStorage.setItem('darkMode', String(isDark));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'base';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setTheme(savedTheme, savedDarkMode);
  }, []);

  return { theme, darkMode, setTheme };
}
```

## 📐 Tailwind 配置扩展

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // 只扩展 Tailwind 没有的内容
      colors: {
        'brand-coral': 'var(--brand-coral)',
        'brand-sage': 'var(--brand-sage)',
        'brand-cream': 'var(--brand-cream)',
      },
      spacing: {
        '18': 'var(--space-18)',
        '30': 'var(--space-30)',
      },
      fontFamily: {
        'display': 'var(--font-display)',
      },
    },
  },
  plugins: [],
};
```

## 🎯 任意值语法 vs 配置文件

### 为什么推荐任意值语法？

我们推荐使用 `bg-[rgb(var(--background))]` 而不是在配置文件中定义每个主题变量：

#### ❌ 传统方式（不推荐）
```javascript
// tailwind.config.js - 配置文件变得冗长
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)', 
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        // ... 需要为每个主题变量都添加配置
      }
    }
  }
}
```

```html
<!-- HTML 看起来简洁，但配置文件很冗长 -->
<div class="bg-background text-foreground border-border">
```

#### ✅ 任意值语法（推荐）
```javascript
// tailwind.config.js - 保持简洁！
module.exports = {
  theme: {
    extend: {
      // 只扩展 Tailwind 真正没有的
      colors: {
        'brand-coral': 'var(--brand-coral)', // 自定义品牌色
      },
      spacing: {
        '18': 'var(--space-18)', // 特殊间距
      }
    }
  }
}
```

```html
<!-- HTML 稍长，但整体架构更清晰 -->
<div class="bg-[rgb(var(--background))] text-[rgb(var(--foreground))] border-[rgb(var(--border))]">
```

### 任意值语法的优势

1. **配置文件更简洁** - 不需要为每个CSS变量都定义
2. **更灵活** - 可以随时使用新的CSS变量，无需重启开发服务器
3. **更明确** - 一眼就能看出这是在使用CSS变量
4. **避免冲突** - 不会与 Tailwind 内置类名或未来版本冲突
5. **更好的维护性** - 不需要维护配置文件和CSS变量的同步

### 什么时候才在配置中定义？

只有在以下情况才建议在 `tailwind.config.js` 中定义：

- **自定义品牌色**：Tailwind 调色板没有的特定颜色
- **特殊间距**：补充 Tailwind spacing scale 的空隙
- **自定义字体**：项目特定的字体族
- **经常使用的组合值**：避免重复的复杂值

```javascript
// ✅ 这些值得在配置中定义
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-coral': '#ff6b6b',        // 品牌特色色
        'brand-sage': '#87a96b',         // Tailwind 没有的色值
      },
      spacing: {
        '18': '4.5rem',                  // 填补 16(4rem) 和 20(5rem) 之间
        '30': '7.5rem',                  // 大横幅特殊需求
      },
      fontFamily: {
        'display': ['Inter Display', 'sans-serif'], // 项目字体
      },
    },
  },
};
```

这样既保持了配置的简洁性，又充分利用了 Tailwind 的任意值语法功能！

## ✅ 最佳实践总结

### 1. **Tailwind First 原则**
- 优先使用 Tailwind 现有的设计令牌
- 只有在 Tailwind 没有提供时才自定义
- 使用 `theme()` 函数引用 Tailwind 值

### 2. **语义化命名**
- 主题变量使用语义名称：`--primary`, `--background`, `--muted`
- 避免具体的颜色名称：`--blue-500` → `--primary`
- 保持与 Tailwind 语义约定一致

### 3. **组件实现**
- 使用 `rgb(var(--variable))` 模式
- 结合 Tailwind 类名和 CSS 变量
- 让组件自动响应主题切换

### 4. **维护性**
- 最小化自定义 CSS
- 充分利用 Tailwind 的工具类
- 保持简洁的主题层次结构

### 5. **性能优化**
- 避免过多的 CSS 变量层级
- 使用 Tailwind 的 JIT 模式
- 主题切换只修改根元素类名

这种架构既保持了 Tailwind 的开发体验，又提供了强大的主题化能力，是现代 CSS 架构的最佳实践。 