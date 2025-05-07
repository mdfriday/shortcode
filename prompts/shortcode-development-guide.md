# MDFriday Shortcode 开发指南

## 目录

1. [架构概览](#架构概览)
2. [样式系统](#样式系统)
3. [组件系统](#组件系统)
4. [开发规范](#开发规范)
5. [使用示例](#使用示例)
6. [贡献指南](#贡献指南)

## 架构概览

### 核心概念

MDFriday 的 shortcode 系统采用组件化设计，将样式与逻辑分离，主要包含以下部分：

- **样式适配器**: 处理不同 CSS 框架的适配
- **主题系统**: 管理全局样式和主题配置

### 目录结构
mdfriday/
├── components/ # shortcode 组件
│ ├── base/ # 基础组件
│ ├── form/ # 表单组件
│ └── social/ # 社交组件
├── styles/ # 样式定义
│ ├── adapters/ # 样式适配器
│ └── themes/ # 主题配置
├── templates/ # 模板文件
└── types/ # TypeScript 类型定义


## 样式系统

### 样式配置接口

```typescript
interface StyleConfig {
    prefix: string;           // 样式前缀
    theme: ThemeConfig;       // 主题配置
    components: ComponentStyles; // 组件样式
}

interface ComponentStyles {
    [key: string]: {
        base: string;        // 基础样式
        variants: {          // 变体样式
            [key: string]: string;
        };
        sizes: {            // 尺寸样式
            [key: string]: string;
        };
        states: {           // 状态样式
            [key: string]: string;
        };
    };
}
```

### 支持的样式框架

1. **Tailwind CSS** (推荐)
   - 高度可定制
   - 原子化 CSS
   - 按需生成

2. **Bootstrap 5**
   - 组件丰富
   - 上手简单
   - 广泛使用

3. **Bulma**
   - 轻量级
   - 模块化
   - 无 JavaScript 依赖

### 样式适配器

```typescript
interface StyleAdapter {
    framework: string;
    generateClasses: (config: StyleConfig) => string;
    generateTheme: (config: ThemeConfig) => string;
}
```

## 组件系统

### 基础组件

1. **布局组件**
   - Section
   - Container
   - Grid
   - Column

2. **表单组件**
   - Form
   - Input
   - TextArea
   - Select
   - Checkbox
   - Radio

3. **社交组件**
   - Profile Card
   - Social Links
   - Share Buttons
   - Subscribe Form


## 开发规范

### 命名规范

1. **组件名称**
   - 使用 kebab-case
   - 描述性命名
   - 例: `social-card`, `contact-form`

2. **样式类名**
   - 使用项目前缀
   - BEM 命名方法
   - 例: `mf-form`, `mf-form--large`

3. **变量命名**
   - 使用 camelCase
   - 清晰描述用途
   - 例: `primaryColor`, `fontSize`

### 文档规范

1. **组件文档**
   - 组件描述
   - 属性列表
   - 使用示例
   - 注意事项

2. **样式文档**
   - 可用类名
   - 变体说明
   - 主题配置
   - 响应式设计

### 测试规范

1. **单元测试**
   - 组件渲染测试
   - 属性验证测试
   - 样式生成测试

2. **集成测试**
   - 组件交互测试
   - 样式应用测试
   - 主题切换测试

## 使用示例

### 表单组件

```markdown
{{< form 
    variant="contact"
    action="/api/contact"
    submit-text="Send Message"
>}}
    {{< form-field 
        type="text" 
        name="name" 
        label="Your Name" 
        required=true 
    >}}
    {{< form-field 
        type="email" 
        name="email" 
        label="Your Email" 
        required=true 
    >}}
    {{< form-field 
        type="textarea" 
        name="message" 
        label="Message" 
        rows=4 
    >}}
{{< /form >}}
```

### 社交卡片

```markdown
{{< social-card
    variant="expanded"
    name="John Doe"
    avatar="/images/avatar.jpg"
    bio="Full Stack Developer & Tech Writer"
    subscribe-url="https://newsletter.example.com"
    platforms='[
        {"name": "Twitter", "count": "10.5K"},
        {"name": "GitHub", "count": "2.3K"},
        {"name": "Blog", "count": "15K"}
    ]'
    social_links='[
        {"platform": "Twitter", "url": "https://twitter.com/johndoe"},
        {"platform": "GitHub", "url": "https://github.com/johndoe"}
    ]'
>}}
```

## 注意事项

1. **性能优化**
   - 按需加载
   - 代码分割
   - 样式优化

2. **可访问性**
   - ARIA 标签
   - 键盘导航
   - 屏幕阅读器支持

3. **浏览器兼容性**
   - 跨浏览器测试
   - 优雅降级
   - Polyfill 支持

4. **安全考虑**
   - XSS 防护
   - CSRF 保护
   - 输入验证

