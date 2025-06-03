# CTA Email Subscription Form Template

A beautiful, responsive call-to-action email subscription form with 10 predefined themes and custom theme support.

## Features

- 🎨 **10 Predefined Themes**: Electric, Fire, Water, Grass, Psychic, Ice, Dragon, Dark, Steel, Fairy
- 🌈 **Custom Theme Support**: Use any color with CSS custom properties
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ✨ **Interactive Animations**: Floating particles and hover effects
- 🎯 **Simple Structure**: Just title, description, email input, and subscribe button
- ⚡ **Lightweight**: Pure CSS and minimal JavaScript
- 🔧 **Easy to Customize**: Well-organized CSS variables and modular structure

## Quick Start

1. Include the CSS files in your HTML:
```html
<link rel="stylesheet" href="globals.css" />
<link rel="stylesheet" href="styleguide.css" />
<link rel="stylesheet" href="style.css" />
```

2. Add the HTML structure:
```html
<div class="cta-form" data-theme="electric">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="content">
        <h2 class="title">Your Amazing Title</h2>
        <p class="description">Your compelling description text goes here.</p>
        <div class="form-container">
            <input type="email" class="email-input" placeholder="Enter your email address" />
            <button class="subscribe-button">Subscribe</button>
        </div>
    </div>
</div>
```

## Available Themes

### Predefined Themes
Use the `data-theme` attribute to apply predefined themes:

- `data-theme="electric"` - Bright yellow theme
- `data-theme="fire"` - Orange/red theme
- `data-theme="water"` - Blue theme
- `data-theme="grass"` - Green theme
- `data-theme="psychic"` - Pink theme
- `data-theme="ice"` - Light blue theme
- `data-theme="dragon"` - Purple theme
- `data-theme="dark"` - Brown theme
- `data-theme="steel"` - Gray theme
- `data-theme="fairy"` - Light pink theme

### Custom Themes
For custom colors, use `data-theme="custom"` and set the `--custom-theme-color` CSS variable:

```html
<div class="cta-form" data-theme="custom" style="--custom-theme-color: #9c27b0;">
    <!-- customize -->
</div>
```

## Customization

### Colors
All theme colors are defined in `styleguide.css`:
```css
:root {
    --theme-electric: rgba(249, 207, 48, 1);
    --theme-fire: rgba(245, 125, 49, 1);
    --theme-water: rgba(100, 147, 235, 1);
    /* ... more themes */
}
```

### Typography
Font settings can be customized in `styleguide.css`:
```css
:root {
    --header-headline-font-family: "Poppins", Helvetica;
    --header-headline-font-size: 32px;
    --header-subtitle-font-size: 16px;
    /* ... more typography settings */
}
```

### Spacing
Spacing is controlled by CSS custom properties:
```css
:root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    --spacing-3xl: 64px;
}
```

## Responsive Behavior

The form automatically adapts to different screen sizes:

- **Desktop (>480px)**: Horizontal layout with email input and button side by side
- **Mobile (≤480px)**: Vertical layout with stacked email input and button
- **Small Mobile (≤320px)**: Reduced padding and font sizes

## JavaScript Integration

Basic form validation and interaction is included:

```javascript
document.querySelectorAll('.subscribe-button').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const emailInput = this.parentElement.querySelector('.email-input');
        const email = emailInput.value;
        
        if (email && email.includes('@')) {
            // Handle successful subscription
            this.textContent = 'Subscribed!';
            this.style.backgroundColor = '#4caf50';
            emailInput.value = '';
        } else {
            // Handle validation error
            emailInput.focus();
        }
    });
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
template/6/cta-form/
├── index.html          # Demo page with all themes
├── style.css           # Main component styles
├── styleguide.css      # Design tokens and variables
├── globals.css         # Global reset and base styles
└── README.md          # This documentation
```

## Examples

### Basic Usage
```html
<div class="cta-form" data-theme="water">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="content">
        <h2 class="title">Join Our Newsletter</h2>
        <p class="description">Get the latest updates and exclusive content delivered to your inbox.</p>
        <div class="form-container">
            <input type="email" class="email-input" placeholder="Enter your email address" />
            <button class="subscribe-button">Subscribe</button>
        </div>
    </div>
</div>
```

### Custom Theme
```html
<div class="cta-form" data-theme="custom" style="--custom-theme-color: #e91e63;">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="content">
        <h2 class="title">Custom Brand Colors</h2>
        <p class="description">Match your brand perfectly with custom color themes.</p>
        <div class="form-container">
            <input type="email" class="email-input" placeholder="Enter your email address" />
            <button class="subscribe-button">Subscribe</button>
        </div>
    </div>
</div>
```

## License

This template is free to use for personal and commercial projects. 