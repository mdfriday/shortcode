import { ShortcodeRenderer } from '../../src/shortcodeRenderer';
import { lightTheme } from './styles/themes/light';
import { registerSectionShortcode } from './components/layout/Section';
import { registerContainerShortcode } from './components/layout/Container';
import { registerGridShortcode } from './components/layout/Grid';
import { registerFlexShortcode } from './components/layout/Flex';
import { registerCardShortcode } from './components/content/Card';
import { registerHeadingShortcode } from './components/content/Heading';
import { registerTextShortcode } from './components/content/Text';
import { registerButtonShortcode } from './components/content/Button';
import { registerFeatureShortcode } from './components/content/Feature';
import { registerTestimonialShortcode } from './components/content/Testimonial';

// 创建 shortcode 渲染器实例
const shortcodeRenderer = new ShortcodeRenderer();

// 注册所有组件
registerSectionShortcode(shortcodeRenderer, lightTheme);
registerContainerShortcode(shortcodeRenderer, lightTheme);
registerGridShortcode(shortcodeRenderer, lightTheme);
registerFlexShortcode(shortcodeRenderer, lightTheme);
registerCardShortcode(shortcodeRenderer, lightTheme);
registerHeadingShortcode(shortcodeRenderer, lightTheme);
registerTextShortcode(shortcodeRenderer, lightTheme);
registerButtonShortcode(shortcodeRenderer, lightTheme);
registerFeatureShortcode(shortcodeRenderer, lightTheme);
registerTestimonialShortcode(shortcodeRenderer, lightTheme);

export { shortcodeRenderer, lightTheme }; 