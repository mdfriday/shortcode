---
title: Theme System Showcase
description: Demonstration of our new theme system with various components and variants
---

{{< section variant="primary" size="lg" >}}
    {{< container variant="primary" >}}
        {{< flex direction="col" align="center" class="text-center max-w-3xl mx-auto" >}}
            {{< heading variant="primary" size="xl" >}}
                Theme System Components
            {{< /heading >}}
            {{< text variant="secondary" size="lg" class="mt-4" >}}
                Explore our flexible theme system with various components, variants, and sizes
            {{< /text >}}
            {{< flex gap="4" class="mt-8" >}}
                {{< button variant="primary" size="lg" href="#" >}}
                    Get Started
                {{< /button >}}
                {{< button variant="outline" size="lg" href="#" >}}
                    Learn More
                {{< /button >}}
            {{< /flex >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}}

{{< section variant="secondary" size="lg" >}}
    {{< container >}}
        {{< heading variant="primary" size="lg" class="text-center mb-12" >}}
            Button Variants
        {{< /heading >}}
        
        {{< flex direction="col" gap="8" >}}
            {{< flex justify="center" gap="4" >}}
                {{< button variant="primary" size="md" href="#" >}}Primary Button{{< /button >}}
                {{< button variant="secondary" size="md" href="#" >}}Secondary Button{{< /button >}}
                {{< button variant="outline" size="md" href="#" >}}Outline Button{{< /button >}}
                {{< button variant="ghost" size="md" href="#" >}}Ghost Button{{< /button >}}
            {{< /flex >}}

            {{< flex justify="center" gap="4" >}}
                {{< button variant="primary" size="sm" href="#" >}}Small{{< /button >}}
                {{< button variant="primary" size="md" href="#" >}}Medium{{< /button >}}
                {{< button variant="primary" size="lg" href="#" >}}Large{{< /button >}}
                {{< button variant="primary" size="xl" href="#" >}}Extra Large{{< /button >}}
            {{< /flex >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}}

{{< section variant="primary" size="lg" >}}
    {{< container >}}
        {{< heading variant="primary" size="lg" class="text-center mb-12" >}}
            Feature Cards
        {{< /heading >}}

        {{< grid cols="3" gap="lg" >}}
            {{< feature 
                variant="primary"
                title="Primary Feature" 
                icon="M13 10V3L4 14h7v7l9-11h-7z"
            >}}
                This is a primary feature card with shadow and white background.
            {{< /feature >}}

            {{< feature 
                variant="secondary"
                title="Secondary Feature" 
                icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            >}}
                A secondary feature card with lighter shadow and gray background.
            {{< /feature >}}

            {{< feature 
                variant="outline"
                title="Outline Feature" 
                icon="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            >}}
                An outline feature card with border and transparent background.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section variant="secondary" size="lg" >}}
    {{< container >}}
        {{< heading variant="primary" size="lg" class="text-center mb-12" >}}
            Testimonials
        {{< /heading >}}

        {{< grid cols="2" gap="lg" >}}
            {{< testimonial 
                variant="primary"
                author="Alex Johnson"
                role="Product Designer"
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                rating="5"
            >}}
                "The theme system is incredibly flexible and easy to use. It has transformed how we build our interfaces."
            {{< /testimonial >}}

            {{< testimonial 
                variant="secondary"
                author="Sarah Chen"
                role="Frontend Developer"
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                rating="4"
            >}}
                "The component variants make it simple to maintain consistency across our applications."
            {{< /testimonial >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section variant="primary" size="lg" >}}
    {{< container >}}
        {{< flex direction="col" align="center" class="text-center bg-primary-50 rounded-2xl p-12" >}}
            {{< heading variant="primary" size="lg" class="mb-4" >}}
                Ready to Get Started?
            {{< /heading >}}
            {{< text variant="secondary" size="lg" class="mb-8 max-w-2xl" >}}
                Experience the power of our theme system and build beautiful, consistent interfaces with ease.
            {{< /text >}}
            {{< flex gap="4" >}}
                {{< button variant="primary" size="lg" href="#" >}}
                    Start Building
                {{< /button >}}
                {{< button variant="outline" size="lg" href="#" >}}
                    View Documentation
                {{< /button >}}
            {{< /flex >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}} 