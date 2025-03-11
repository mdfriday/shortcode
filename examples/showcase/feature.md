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
            Primary Theme
        {{< /heading >}}
        
        {{< grid cols="3" gap="lg" >}}
            {{< feature 
                title="Simple Design" 
                icon="megaphone"
                variant="primary"
                highlight="true"
            >}}
                Primary variant with highlight effect. Shows the main color scheme of your theme.
            {{< /feature >}}

            {{< feature 
                title="With Animation" 
                icon="mobile"
                variant="primary"
                size="lg"
            >}}
                Large size primary feature with default styling.
            {{< /feature >}}

            {{< feature 
                title="Interactive" 
                icon="link"
                variant="primary"
                highlight="true"
                class="shadow-lg"
            >}}
                Primary feature with custom shadow and highlight animation.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section class="bg-gray-50" >}}
    {{< container >}}
        {{< heading level="2" class="text-3xl font-bold mb-8" >}}
            Secondary Theme
        {{< /heading >}}
        
        {{< grid cols="3" gap="lg" >}}
            {{< feature 
                title="Subtle Design" 
                icon="sun"
                variant="secondary"
                highlight="true"
            >}}
                Secondary variant with a more subtle color scheme.
            {{< /feature >}}

            {{< feature 
                title="Balanced Look" 
                icon="mobile"
                variant="secondary"
                class="bg-white"
            >}}
                Secondary feature with white background for contrast.
            {{< /feature >}}

            {{< feature 
                title="Elegant Style" 
                icon="megaphone"
                variant="secondary"
                highlight="true"
                class="shadow-md"
            >}}
                Secondary feature with medium shadow and animations.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section >}}
    {{< container >}}
        {{< heading level="2" class="text-3xl font-bold mb-8" >}}
            Outline Theme
        {{< /heading >}}
        
        {{< grid cols="2" gap="lg" >}}
            {{< feature 
                title="Bordered Style" 
                icon="link"
                variant="outline"
                size="lg"
                highlight="true"
            >}}
                Large outline feature with highlight effect. Perfect for important content that needs a subtle presentation.
            {{< /feature >}}

            {{< feature 
                title="Clean Design" 
                icon="sun"
                variant="outline"
                class="hover:border-blue-500"
            >}}
                Outline feature with custom hover effect on the border.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section class="bg-gray-900 text-white" >}}
    {{< container >}}
        {{< heading level="2" class="text-3xl font-bold mb-8 text-white" >}}
            Ghost Theme on Dark
        {{< /heading >}}
        
        {{< grid cols="3" gap="lg" >}}
            {{< feature 
                title="Minimal" 
                icon="megaphone"
                variant="ghost"
                highlight="true"
                class="text-white"
            >}}
                Ghost variant on dark background, showing versatility.
            {{< /feature >}}

            {{< feature 
                title="Transparent" 
                icon="mobile"
                variant="ghost"
                class="text-white hover:bg-white/5"
            >}}
                Ghost feature with subtle hover background effect.
            {{< /feature >}}

            {{< feature 
                title="Adaptive" 
                icon="link"
                variant="ghost"
                highlight="true"
                class="text-white border border-white/20"
            >}}
                Ghost feature with light border and highlight effect.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section >}}
    {{< container >}}
        {{< heading level="2" class="text-3xl font-bold mb-8" >}}
            Custom Styles
        {{< /heading >}}
        
        {{< grid cols="2" gap="lg" >}}
            {{< feature 
                title="Gradient Background" 
                icon="sun"
                variant="primary"
                highlight="true"
                class="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >}}
                Feature with custom gradient background and white text.
            {{< /feature >}}

            {{< feature 
                title="Glass Effect" 
                icon="mobile"
                variant="ghost"
                class="backdrop-blur-lg bg-white/30 border border-white/50 shadow-xl"
            >}}
                Feature with modern glass morphism effect.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section class="bg-gray-50" >}}
    {{< container >}}
        {{< flex direction="col" align="center" class="text-center max-w-3xl mx-auto" >}}
            {{< heading level="2" class="text-3xl font-bold mb-4" >}}
                Theme Configuration
            {{< /heading >}}
            {{< text class="text-xl text-gray-600 mb-8" >}}
                Features can be styled using theme variants, sizes, and custom classes. Mix and match to create your perfect design.
            {{< /text >}}
            {{< button variant="primary" size="lg" href="#" >}}
                View Documentation
            {{< /button >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}} 