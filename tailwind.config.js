/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1.5rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },
        extend: {
            colors: {
                'bg-primary': '#0F0F0F',
                'bg-secondary': '#161616',
                'accent-gold': '#D4AF37',
                'accent-gold-light': '#F1D575',
                'text-primary': '#FFFFFF',
                'text-secondary': '#A0A0A0',
                'glass-bg': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                heading: ['Orbitron', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            screens: {
                '2xl': '1536px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
