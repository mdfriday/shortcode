import { ShortcodeRenderer } from '@mdfriday/shortcode-compiler';

// Default function map used by most shortcodes
const defaultFuncMap = new Map<string, (...args: any[]) => any>([
  ['split', (str: any, sep: any) => {
    const safeStr = typeof str === 'string' ? str : '';
    const safeSep = typeof sep === 'string' ? sep : ',';
    return safeStr.split(safeSep);
  }],
  ['eq', (a: any, b: any) => a === b],
  ['len', (arr: any[]) => arr.length],
  ['lt', (a: number, b: number) => a < b],
  ['sub', (a: number, b: number) => a - b],
  ['add', (a: number, b: number) => a + b],
  ['div', (a: number, b: number) => a / b],
  ['mul', (a: number, b: number) => a * b],
  ['float', (str: string) => parseFloat(str)],
  ['ge', (a: number, b: number) => a >= b],
  ['and', (a: any, b: any) => a && b],
  ['index', (arr: any[], i: number) => arr[i]]
]);

// Type for shortcode metadata
export interface ShortcodeMetadata {
  id: string | number;
  uuid?: string;
  slug?: string;
  name: string;
  template: string;
  example?: string;
  asset?: string;
  tags?: string[];
  width?: number;
  height?: number;
  timestamp?: number;
  updated?: number;
  status?: string;
  namespace?: string;
  hash?: string;
}

// Type for shortcode template options
export interface ShortcodeTemplateOptions {
  template: string;
  funcMap?: Map<string, (...args: any[]) => any>;
  dataProvider?: (params: string[], content?: string) => Record<string, any>;
}

/**
 * The ShortcodeManager class provides functionality to register, manage, and query shortcodes.
 */
export class ShortcodeManager {
  private shortcodes: Map<string, ShortcodeMetadata> = new Map();
  private shortcodesByUuid: Map<string, ShortcodeMetadata> = new Map();
  private shortcodesById: Map<string | number, ShortcodeMetadata> = new Map();
  
  constructor() {
    // Simplified constructor without ThemeManager
  }
  
  /**
   * Register a shortcode template with metadata.
   * @param metadata The metadata of the shortcode
   * @param renderer The shortcode renderer
   * @param options Additional options for the template (funcMap, dataProvider)
   * @returns true if the shortcode was registered, false if it already exists
   */
  registerShortcode(
    metadata: ShortcodeMetadata, 
    renderer: ShortcodeRenderer, 
    options?: Partial<ShortcodeTemplateOptions>
  ): boolean {
    // Check if shortcode is already registered
    if (metadata.id && this.shortcodesById.has(metadata.id)) {
      return false;
    }
    
    if (metadata.uuid && this.shortcodesByUuid.has(metadata.uuid)) {
      return false;
    }
    
    const shortcodeName = metadata.name;
    
    // Prepare template options
    const templateOptions: ShortcodeTemplateOptions = {
      template: metadata.template,
      funcMap: options?.funcMap || this.getDefaultFuncMap(),
      dataProvider: options?.dataProvider || this.getDefaultDataProvider()
    };
    
    // Register the shortcode
    renderer.registerTemplateShortcode(shortcodeName, templateOptions);
    
    // Store metadata for management
    this.shortcodes.set(shortcodeName, metadata);
    
    if (metadata.uuid) {
      this.shortcodesByUuid.set(metadata.uuid, metadata);
    }
    
    if (metadata.id) {
      this.shortcodesById.set(metadata.id, metadata);
    }
    
    return true;
  }
  
  /**
   * Find a shortcode by its name.
   * @param name The name of the shortcode
   * @returns The shortcode metadata or undefined if not found
   */
  findByName(name: string): ShortcodeMetadata | undefined {
    return this.shortcodes.get(name);
  }
  
  /**
   * Find a shortcode by its UUID.
   * @param uuid The UUID of the shortcode
   * @returns The shortcode metadata or undefined if not found
   */
  findByUuid(uuid: string): ShortcodeMetadata | undefined {
    return this.shortcodesByUuid.get(uuid);
  }
  
  /**
   * Find a shortcode by its ID.
   * @param id The ID of the shortcode
   * @returns The shortcode metadata or undefined if not found
   */
  findById(id: string | number): ShortcodeMetadata | undefined {
    return this.shortcodesById.get(id);
  }
  
  /**
   * Check if a shortcode exists by its ID.
   * @param id The ID of the shortcode
   * @returns true if the shortcode exists, false otherwise
   */
  existsById(id: string | number): boolean {
    return this.shortcodesById.has(id);
  }
  
  /**
   * Get all registered shortcodes.
   * @returns An array of shortcode metadata
   */
  getAllShortcodes(): ShortcodeMetadata[] {
    return Array.from(this.shortcodes.values());
  }
  
  /**
   * Get the default data provider function
   * @returns A function that can be used as a data provider for shortcodes
   */
  getDefaultDataProvider(): (params: string[], content?: string) => Record<string, any> {
    return (params: string[], content?: string) => ({
      Inner: content
    });
  }
  
  /**
   * Get the default function map
   * @returns The default function map for use with shortcodes
   */
  getDefaultFuncMap(): Map<string, (...args: any[]) => any> {
    return defaultFuncMap;
  }
} 