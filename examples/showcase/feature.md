---
title: Feature Component
description: Showcase of the Feature component with different styles and themes
---

{{< section class="bg-gradient-to-b from-white to-gray-50" >}}
    {{< container >}}
        {{< flex direction="col" align="center" class="text-center max-w-3xl mx-auto mb-16" >}}
            {{< heading level="1" class="text-4xl md:text-5xl font-bold mb-4" >}}
                Feature Component
            {{< /heading >}}
            {{< text class="text-xl text-gray-600" >}}
                A versatile component for highlighting features, services, or key points in your content.
            {{< /text >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}}

{{< section >}}
    {{< container >}}
        {{< heading level="2" class="text-3xl font-bold mb-8" >}}
            Basic Features
        {{< /heading >}}
        
        {{< grid cols="3" gap="lg" >}}
            {{< feature 
                title="Simple Design" 
                icon="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            >}}
                Basic feature component with title, icon, and description.
            {{< /feature >}}

            {{< feature 
                title="With Highlight" 
                icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                highlight="true"
            >}}
                Feature component with highlight effect to make it stand out.
            {{< /feature >}}

            {{< feature 
                title="With Link" 
                icon="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                link="#"
            >}}
                Clickable feature component that links to other pages.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section class="bg-gray-50" >}}
    {{< container >}}
        {{< heading level="2" class="text-3xl font-bold mb-8" >}}
            Different Themes
        {{< /heading >}}
        
        {{< grid cols="3" gap="lg" >}}
            {{< feature 
                title="Light Theme" 
                icon="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                class="bg-white shadow-sm"
            >}}
                Feature component with light background theme.
            {{< /feature >}}

            {{< feature 
                title="Dark Theme" 
                icon="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                class="bg-gray-800 text-white"
            >}}
                Feature component with dark background theme.
            {{< /feature >}}

            {{< feature 
                title="Accent Theme" 
                icon="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                class="bg-primary-50"
                highlight="true"
            >}}
                Feature component with accent color theme.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section >}}
    {{< container >}}
        {{< heading level="2" class="text-3xl font-bold mb-8" >}}
            Advanced Examples
        {{< /heading >}}
        
        {{< grid cols="2" gap="lg" >}}
            {{< feature 
                title="Large Feature" 
                icon="M13 10V3L4 14h7v7l9-11h-7z"
                class="p-8"
                highlight="true"
            >}}
                A larger feature component with more padding and emphasis. This example shows how the component can be used for primary features or key selling points.
            {{< /feature >}}

            {{< feature 
                title="Custom Styled" 
                icon="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                class="border-2 border-primary-500 rounded-xl"
            >}}
                Feature component with custom border styling and rounded corners. Shows the flexibility of the component's design.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section class="bg-gray-50" >}}
    {{< container >}}
        {{< flex direction="col" align="center" class="text-center max-w-3xl mx-auto" >}}
            {{< heading level="2" class="text-3xl font-bold mb-4" >}}
                Usage Guidelines
            {{< /heading >}}
            {{< text class="text-xl text-gray-600 mb-8" >}}
                The Feature component is highly customizable and can be used in various contexts. Use it to highlight services, benefits, or key aspects of your product.
            {{< /text >}}
            {{< button variant="primary" size="lg" href="#" >}}
                View Documentation
            {{< /button >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}} 