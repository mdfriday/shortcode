---
title: John Doe - Full Stack Developer
description: Personal brand page of John Doe, showcasing portfolio, skills, and achievements
theme: modern-minimal
---

{{< hero
    title="John Doe"
    subtitle="Full Stack Developer & Tech Educator"
    background="/assets/hero-bg.jpg"
>}}
    Transforming ideas into elegant solutions through code and creativity
{{< /hero >}}

{{< section id="about" class="py-20" >}}
    {{< container >}}
        {{< profile-card
            avatar="/assets/avatar.jpg"
            name="John Doe"
            title="Senior Full Stack Developer"
            location="San Francisco, CA"
            available="Open to opportunities"
            github="johndoe"
            twitter="johndoe"
            linkedin="john-doe"
        >}}
            With over 8 years of experience in full-stack development, I specialize in building
            scalable web applications and mentoring development teams. My passion lies in creating
            elegant solutions to complex problems while maintaining code quality and performance.
        {{< /profile-card >}}
    {{< /container >}}
{{< /section >}}

{{< section id="skills" class="bg-light py-20" >}}
    {{< container >}}
        {{< section-header 
            title="Skills & Expertise"
            subtitle="Technologies I work with"
        />}}

        {{< skill-grid >}}
            {{< skill-card
                icon="react"
                title="Frontend Development"
                level="95"
            >}}
                React, Vue.js, TypeScript, Tailwind CSS
            {{< /skill-card >}}

            {{< skill-card
                icon="node"
                title="Backend Development"
                level="90"
            >}}
                Node.js, Python, Go, PostgreSQL
            {{< /skill-card >}}

            {{< skill-card
                icon="cloud"
                title="Cloud & DevOps"
                level="85"
            >}}
                AWS, Docker, Kubernetes, CI/CD
            {{< /skill-card >}}

            {{< skill-card
                icon="tools"
                title="Development Tools"
                level="92"
            >}}
                Git, VS Code, Jest, WebPack
            {{< /skill-card >}}
        {{< /skill-grid >}}
    {{< /container >}}
{{< /section >}}

{{< section id="projects" class="py-20" >}}
    {{< container >}}
        {{< section-header 
            title="Featured Projects"
            subtitle="Some of my recent work"
        />}}

        {{< project-grid >}}
            {{< project-card
                title="E-commerce Platform"
                image="/assets/project1.jpg"
                tags="React,Node.js,PostgreSQL"
                demo="https://demo.example.com"
                github="https://github.com/johndoe/ecommerce"
            >}}
                A full-featured e-commerce platform with real-time inventory management,
                payment processing, and analytics dashboard.
            {{< /project-card >}}

            {{< project-card
                title="Task Management App"
                image="/assets/project2.jpg"
                tags="Vue.js,Express,MongoDB"
                demo="https://tasks.example.com"
                github="https://github.com/johndoe/task-manager"
            >}}
                A collaborative task management application with real-time updates,
                team management, and progress tracking.
            {{< /project-card >}}
        {{< /project-grid >}}
    {{< /container >}}
{{< /section >}}

{{< section id="blog" class="bg-light py-20" >}}
    {{< container >}}
        {{< section-header 
            title="Latest Articles"
            subtitle="Sharing knowledge and experiences"
        />}}

        {{< post-grid >}}
            {{< post-card
                title="Building Scalable Web Applications"
                date="2024-03-01"
                image="/assets/blog1.jpg"
                url="/blog/scalable-web-apps"
                readTime="8 min read"
            >}}
                Learn the best practices for building scalable web applications
                using modern architecture patterns.
            {{< /post-card >}}

            {{< post-card
                title="Mastering TypeScript"
                date="2024-02-15"
                image="/assets/blog2.jpg"
                url="/blog/mastering-typescript"
                readTime="12 min read"
            >}}
                A comprehensive guide to TypeScript features and best practices
                for large-scale applications.
            {{< /post-card >}}
        {{< /post-grid >}}
    {{< /container >}}
{{< /section >}}

{{< section id="contact" class="py-20" >}}
    {{< container >}}
        {{< section-header 
            title="Get in Touch"
            subtitle="Let's discuss your next project"
        />}}

        {{< contact-form
            action="/api/contact"
            success-message="Thanks for reaching out! I'll get back to you soon."
        >}}
            {{< form-field
                type="text"
                name="name"
                label="Your Name"
                placeholder="John Smith"
                required=true
            />}}

            {{< form-field
                type="email"
                name="email"
                label="Your Email"
                placeholder="john@example.com"
                required=true
            />}}

            {{< form-field
                type="select"
                name="subject"
                label="Subject"
                options="Project Inquiry,Job Opportunity,Collaboration,Other"
                required=true
            />}}

            {{< form-field
                type="textarea"
                name="message"
                label="Message"
                placeholder="Tell me about your project..."
                rows=5
                required=true
            />}}
        {{< /contact-form >}}
    {{< /container >}}
{{< /section >}}

{{< footer >}}
    {{< social-links
        github="johndoe"
        twitter="johndoe"
        linkedin="john-doe"
        email="john@example.com"
    />}}
    
    {{< newsletter-form
        title="Subscribe to my newsletter"
        description="Get the latest updates on web development and tech trends"
        action="/api/subscribe"
        button-text="Subscribe"
    />}}

    {{< copyright
        text="© 2024 John Doe. All rights reserved."
        links="Privacy Policy,Terms of Service"
    />}}
{{< /footer >}} 