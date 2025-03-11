---
title: Product Showcase
description: A demonstration of our component system with different themes and styles
theme: light
---

{{< section variant="primary" >}}
    {{< container size="md" >}}
        {{< heading level="h1" >}}
            Welcome to Our Product Showcase
        {{< /heading >}}
        {{< text variant="light" >}}
            Discover our amazing products with different styles and themes
        {{< /text >}}
    {{< /container >}}
{{< /section >}}

{{< section variant="light" >}}
    {{< container size="lg" >}}
        {{< heading level="h2" >}}
            Featured Products
        {{< /heading >}}
        {{< grid cols="3" gap="lg" >}}
            {{< card 
                variant="light"
                size="md"
                title="Premium Product"
                subtitle="High-quality craftsmanship"
                image="https://via.placeholder.com/800x600"
                imageAlt="Premium Product"
                primaryAction="Learn More"
                primaryActionUrl="#"
                secondaryAction="Buy Now"
                secondaryActionUrl="#"
            >}}
                Experience the finest quality with our premium product line, designed for those who appreciate excellence.
            {{< /card >}}

            {{< card 
                variant="dark"
                size="md"
                title="Special Edition"
                subtitle="Limited time offer"
                image="https://via.placeholder.com/800x600"
                imageAlt="Special Edition"
                primaryAction="View Details"
                primaryActionUrl="#"
            >}}
                Get your hands on our exclusive special edition items before they're gone.
            {{< /card >}}

            {{< card 
                variant="bordered"
                size="md"
                title="New Arrival"
                subtitle="Just launched"
                image="https://via.placeholder.com/800x600"
                imageAlt="New Arrival"
                primaryAction="Explore"
                primaryActionUrl="#"
            >}}
                Be among the first to try our latest product innovation.
            {{< /card >}}
        {{< /grid >}}
    {{< /container >}}
{{< /section >}}

{{< section variant="dark" >}}
    {{< container size="md" >}}
        {{< flex direction="col" align="center" gap="md" >}}
            {{< heading level="h2" >}}
                Ready to Get Started?
            {{< /heading >}}
            {{< text variant="light" size="lg" >}}
                Join thousands of satisfied customers today
            {{< /text >}}
            {{< flex gap="md" >}}
                {{< button variant="white" size="lg" href="#" >}}
                    Sign Up Now
                {{< /button >}}
                {{< button variant="outline" size="lg" href="#" >}}
                    Learn More
                {{< /button >}}
            {{< /flex >}}
        {{< /flex >}}
    {{< /container >}}
{{< /section >}} 