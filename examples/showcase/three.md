---
title: Component Showcase
description: A showcase of our beautiful Tailwind-styled components
---

{{< section class="bg-gradient-to-b from-white to-gray-50" >}}
    {{< container >}}
        {{< flex direction="col" align="center" class="text-center max-w-3xl mx-auto mb-16" >}}
            {{< heading level="1" class="text-4xl md:text-5xl font-bold mb-4" >}}
                Modern Components for Modern Web
            {{< /heading >}}
            {{< text class="text-xl text-gray-600" >}}
                Discover our collection of beautiful, responsive, and accessible components built with Tailwind CSS.
            {{< /text >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}}

{{< section >}}
    {{< container >}}
        {{< heading level="2" class="text-3xl font-bold text-center mb-12" >}}
            Why Choose Our Components?
        {{< /heading >}}

        {{< grid cols="3" gap="lg" >}}
            {{< feature 
                title="Modern Design" 
                icon="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                highlight="true"
                link="#"
            >}}
                Clean and modern design that follows the latest web trends and best practices.
            {{< /feature >}}

            {{< feature 
                title="Fully Responsive" 
                icon="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            >}}
                Components that look great on any device, from mobile to desktop.
            {{< /feature >}}

            {{< feature 
                title="Customizable" 
                icon="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            >}}
                Easy to customize with Tailwind CSS utility classes and theme configuration.
            {{< /feature >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section class="bg-gray-50" >}}
    {{< container >}}
        {{< flex direction="col" align="center" class="text-center mb-12" >}}
            {{< heading level="2" class="text-3xl font-bold mb-4" >}}
                What Our Users Say
            {{< /heading >}}
            {{< text class="text-xl text-gray-600" >}}
                Don't just take our word for it - hear from some of our satisfied users
            {{< /text >}}
        {{< /flex >}}

        {{< grid cols="2" gap="lg" >}}
            {{< testimonial 
                author="Emily Chen"
                role="Product Designer"
                avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                rating="5"
                highlight="true"
            >}}
                "These components have saved me countless hours of development time. The attention to detail and design quality is outstanding."
            {{< /testimonial >}}

            {{< testimonial 
                author="James Wilson"
                role="Frontend Developer"
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                rating="5"
            >}}
                "The best component library I've used. Clean code, great documentation, and excellent design out of the box."
            {{< /testimonial >}}

            {{< testimonial 
                author="Sarah Martinez"
                role="UX Designer"
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                rating="4"
            >}}
                "Perfect balance of flexibility and consistency. These components make it easy to maintain a cohesive design system."
            {{< /testimonial >}}

            {{< testimonial 
                author="David Kim"
                role="Tech Lead"
                avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                rating="5"
            >}}
                "Implementing these components in our project has significantly improved our development workflow and code quality."
            {{< /testimonial >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section >}}
    {{< container >}}
        {{< flex direction="col" align="center" class="text-center bg-primary-50 rounded-2xl p-12" >}}
            {{< heading level="2" class="text-3xl font-bold mb-4" >}}
                Ready to Get Started?
            {{< /heading >}}
            {{< text class="text-xl text-gray-600 mb-8" >}}
                Join thousands of developers building better websites with our components
            {{< /text >}}
            {{< flex gap="4" >}}
                {{< button variant="primary" size="lg" href="#" >}}
                    Get Started
                {{< /button >}}
                {{< button variant="outline" size="lg" href="#" >}}
                    View Documentation
                {{< /button >}}
            {{< /flex >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}} 