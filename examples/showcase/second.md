---
title: Dark Theme Showcase
description: A demonstration of our component system with dark theme
theme: dark
---

{{< section variant="dark" >}}
    {{< container size="md" >}}
        {{< heading level="h1" >}}
            Dark Theme Experience
        {{< /heading >}}
        {{< text variant="light" >}}
            Discover our products in an elegant dark theme
        {{< /text >}}
    {{< /container >}}
{{< /section >}}

{{< section variant="primary" >}}
    {{< container size="lg" >}}
        {{< heading level="h2" >}}
            Featured Collections
        {{< /heading >}}
        {{< grid cols="3" gap="lg" >}}
            {{< card 
                variant="dark"
                size="md"
                title="Night Series"
                subtitle="Designed for the night"
                image="https://via.placeholder.com/800x600"
                imageAlt="Night Series Product"
                primaryAction="Explore"
                primaryActionUrl="#"
                secondaryAction="Preview"
                secondaryActionUrl="#"
            >}}
                Experience our premium night series, perfect for those who appreciate darkness.
            {{< /card >}}

            {{< card 
                variant="dark"
                size="md"
                title="Dark Edition"
                subtitle="Limited collection"
                image="https://via.placeholder.com/800x600"
                imageAlt="Dark Edition"
                primaryAction="View Details"
                primaryActionUrl="#"
            >}}
                Exclusive dark edition items with unique features and design.
            {{< /card >}}

            {{< card 
                variant="dark"
                size="md"
                title="Midnight Launch"
                subtitle="Coming soon"
                image="https://via.placeholder.com/800x600"
                imageAlt="Midnight Launch"
                primaryAction="Pre-order"
                primaryActionUrl="#"
            >}}
                Be the first to get our new midnight collection.
            {{< /card >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section variant="dark" >}}
    {{< container size="md" >}}
        {{< flex direction="col" align="center" gap="md" >}}
            {{< heading level="h2" >}}
                Join the Dark Side
            {{< /heading >}}
            {{< text variant="light" size="lg" >}}
                Experience the elegance of darkness
            {{< /text >}}
            {{< flex gap="md" >}}
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