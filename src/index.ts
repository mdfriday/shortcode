import { Shortcode } from "./shortcode";
import { ShortcodeManager, ShortcodeMetadata, ShortcodeTemplateOptions } from "./shortcode-manager";

// Named exports for ES modules
export { Shortcode, ShortcodeManager, ShortcodeMetadata, ShortcodeTemplateOptions };

// Default export for better CommonJS compatibility
// Create a complete export object with all exported items
const defaultExport = {
  Shortcode,
  ShortcodeManager,
  ShortcodeMetadata: {} as ShortcodeMetadata
};

// Create a helper function to ensure backward compatibility
// This approach avoids hardcoding specific method names
function ensureBackwardCompatibility() {
  // Detect if Shortcode prototype has been extended with new methods
  // that are not reflected in the default export
  const shortcodePrototypeMethods = Object.getOwnPropertyNames(Shortcode.prototype)
    .filter(method => typeof (Shortcode.prototype as any)[method] === 'function')
    .filter(method => method !== 'constructor');
  
  // Keep the default export up-to-date with any prototype extensions
  shortcodePrototypeMethods.forEach(method => {
    if (!(method in defaultExport)) {
      Object.defineProperty(defaultExport, method, {
        enumerable: true,
        configurable: true,
        get: function() {
          return (Shortcode.prototype as any)[method];
        }
      });
    }
  });
}

// Run the compatibility check
ensureBackwardCompatibility();

export default defaultExport;
