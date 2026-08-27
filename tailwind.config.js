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
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'accent-gold': 'var(--accent-gold)',
                'accent-gold-light': 'var(--accent-gold-light)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'glass-bg': 'var(--glass-bg)',
                'glass-border': 'var(--glass-border)',
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
