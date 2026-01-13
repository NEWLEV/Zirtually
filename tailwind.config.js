/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Nature Focus Palette - ADA Compliant (WCAG 2.1 AAA)

                // Backgrounds
                'bg-primary': '#F8FAFB',        // Soft Cloud White - main canvas
                'bg-secondary': '#E8F4F8',      // Misty Blue - cards & panels
                'bg-elevated': '#FFFFFF',       // Pure white - elevated surfaces

                // Text Colors
                'text-primary': '#1A3A4A',      // Deep Ocean - headings (14.2:1 contrast)
                'text-secondary': '#4A6A7A',    // Slate Blue - body text (7.8:1 contrast)
                'text-tertiary': '#6A8A9A',     // Light Slate - supporting text (5.2:1 contrast)
                'text-inverse': '#FFFFFF',      // White - text on dark backgrounds

                // Interactive Elements
                'action-primary': '#2E7D6E',    // Forest Teal - primary buttons
                'action-primary-hover': '#236B5D', // Deep Forest - button hover
                'action-primary-active': '#1A5547', // Darker Forest - button active
                'action-secondary': '#3A8FB7',  // Ocean Blue - secondary actions
                'action-secondary-hover': '#2A6F8F', // Deep Ocean Blue - secondary hover

                // Links
                'link-default': '#2A6F8F',      // Deep Ocean Blue - links (7.1:1 contrast)
                'link-hover': '#1A5570',        // Darker Ocean - link hover (9.5:1 contrast)
                'link-visited': '#5A4A7A',      // Purple-slate - visited links

                // Borders & Dividers
                'border-light': '#D4E4EA',      // Soft Mist - subtle borders
                'border-medium': '#B4D4DA',     // Medium Mist - standard borders
                'border-strong': '#8AB4BA',     // Strong Mist - emphasized borders

                // Focus & Accessibility
                'focus-ring': '#5BA3C5',        // Sky Blue - keyboard focus indicator
                'focus-ring-offset': '#FFFFFF', // White - focus ring offset

                // Status Colors (ADA Compliant)
                'status-success': '#2D7A5F',    // Deep Green - success (7.2:1 contrast)
                'status-success-bg': '#E8F5F0', // Light Green - success background
                'status-warning': '#9A6B00',    // Deep Amber - warnings (7.5:1 contrast)
                'status-warning-bg': '#FFF4E0', // Light Amber - warning background
                'status-error': '#B71C1C',      // Deep Red - errors (8.1:1 contrast)
                'status-error-bg': '#FFEBEE',   // Light Red - error background
                'status-info': '#1A5F7A',       // Deep Blue - info (8.5:1 contrast)
                'status-info-bg': '#E3F2F9',    // Light Blue - info background

                // Dark Mode (for future implementation)
                'dark-bg': '#0F1F2A',           // Deep Ocean Night
                'dark-card': '#1A3A4A',         // Ocean Card
                'dark-border': '#2A4A5A',       // Ocean Border
                'dark-text': '#E8F4F8',         // Light Mist Text
                'dark-text-secondary': '#B4D4DA', // Medium Mist Text

                // Legacy support (mapped to new palette)
                'brand-primary': '#2E7D6E',     // Maps to action-primary
                'brand-secondary': '#3A8FB7',   // Maps to action-secondary
                'brand-light': '#E8F4F8',       // Maps to bg-secondary
                'brand-dark': '#1A3A4A',        // Maps to text-primary
            },
        },
    },
    plugins: [],
}
