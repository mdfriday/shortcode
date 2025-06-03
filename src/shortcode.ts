import { PageLexer, PageRenderer, ShortcodeRenderer } from './compiler';
import { ShortcodeManager, ShortcodeMetadata, ShortcodeTemplateOptions } from "./shortcode-manager";

export class Shortcode {
    public readonly renderer: ShortcodeRenderer;
    private readonly pageRenderer: PageRenderer;
    private readonly manager: ShortcodeManager;

    constructor() {
        this.renderer = new ShortcodeRenderer();
        this.manager = new ShortcodeManager();
        this.pageRenderer = new PageRenderer(this.renderer);
    }

    /**
     * Register a shortcode template dynamically
     * @param metadata The metadata of the shortcode
     * @param options Additional options for the template (funcMap, dataProvider)
     * @returns true if the shortcode was registered, false if it already exists
     */
    registerShortcode(
        metadata: ShortcodeMetadata,
        options?: Partial<ShortcodeTemplateOptions>
    ): boolean {
        return this.manager.registerShortcode(metadata, this.renderer, options);
    }

    /**
     * Check if a shortcode with the given ID already exists
     * @param id The ID of the shortcode
     * @returns true if the shortcode exists, false otherwise
     */
    existsById(id: string | number): boolean {
        return this.manager.existsById(id);
    }

    /**
     * Find a shortcode by its name
     * @param name The name of the shortcode
     * @returns The shortcode metadata or undefined if not found
     */
    findByName(name: string): ShortcodeMetadata | undefined {
        return this.manager.findByName(name);
    }

    /**
     * Find a shortcode by its UUID
     * @param uuid The UUID of the shortcode
     * @returns The shortcode metadata or undefined if not found
     */
    findByUuid(uuid: string): ShortcodeMetadata | undefined {
        return this.manager.findByUuid(uuid);
    }

    /**
     * Find a shortcode by its ID
     * @param id The ID of the shortcode
     * @returns The shortcode metadata or undefined if not found
     */
    findById(id: string | number): ShortcodeMetadata | undefined {
        return this.manager.findById(id);
    }

    /**
     * Get all registered shortcodes
     * @returns An array of shortcode metadata
     */
    getAllShortcodes(): ShortcodeMetadata[] {
        return this.manager.getAllShortcodes();
    }

    /**
     * Get default function map that can be used with shortcodes
     * @returns The default function map
     */
    getDefaultFuncMap(): Map<string, (...args: any[]) => any> {
        return this.manager.getDefaultFuncMap();
    }

    /**
     * Get default data provider function
     * @returns A function that can be used as a data provider for shortcodes
     */
    getDefaultDataProvider(): (params: string[], content?: string) => Record<string, any> {
        return this.manager.getDefaultDataProvider();
    }

    /**
     * Extract all shortcode names from markdown customize
     * @param markdownContent The markdown customize to extract shortcode names from
     * @returns An array of shortcode names found in the customize
     */
    extractShortcodeNames(markdownContent: string): string[] {
        // Parse the customize using PageLexer
        const result = PageLexer.parse(markdownContent);
        
        // Set to collect unique shortcode names
        const shortcodeNames: Set<string> = new Set();
        
        // Recursive function to process items and collect shortcode names
        const processItems = (items: any[]) => {
            if (!items || !Array.isArray(items)) return;
            
            for (const item of items) {
                if (item.type === 'shortcode') {
                    // Add the shortcode name
                    shortcodeNames.add(item.name);
                    
                    // Process nested items if they exist
                    if (item.items && Array.isArray(item.items)) {
                        processItems(item.items);
                    }
                }
            }
        };
        
        // Process all items
        processItems(result.items);
        
        // Return the unique shortcode names as an array
        return Array.from(shortcodeNames);
    }

    /**
     * Perform a complete rendering of markdown customize with shortcodes
     * @param markdownContent The markdown customize to render
     * @returns The fully rendered customize
     */
    render(markdownContent: string): string {
        // Render the customize
        const renderedResult = this.pageRenderer.render(markdownContent);
        
        return renderedResult.content;
    }

    /**
     * First step of the rendering process - replaces shortcodes with placeholders
     * @param markdownContent The markdown customize to process
     * @returns The customize with shortcodes replaced by placeholders
     */
    stepRender(markdownContent: string): string {
        // Process the first step
        const stepResult = this.pageRenderer.render(markdownContent, { stepRender: true });
        
        return stepResult.content;
    }

    /**
     * Final step of the rendering process - replaces placeholders with rendered shortcodes
     * @param htmlContent The HTML customize with placeholders
     * @returns The fully rendered HTML customize
     */
    finalRender(htmlContent: string): string {
        // Process the final step
        return this.pageRenderer.finalRender(htmlContent);
    }
}
