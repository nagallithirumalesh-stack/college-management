/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                // White/Light Theme Palette
                background: '#F8FAFC', // Slate-50
                surface: '#FFFFFF',    // White
                primary: {
                    DEFAULT: '#4F46E5', // Indigo-600
                    hover: '#4338CA',   // Indigo-700
                    light: '#E0E7FF',   // Indigo-100 (for backgrounds)
                },
                secondary: '#475569',   // Slate-600
                muted: '#94A3B8',       // Slate-400
                headings: '#0F172A',    // Slate-900

                // Status Colors
                success: '#16A34A',     // Green-600
                warning: '#F59E0B',     // Amber-500
                danger: '#DC2626',      // Red-600
                info: '#0EA5E9',        // Sky-500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                blob: "blob 7s infinite",
                'fade-in': "fadeIn 0.5s ease-out forwards",
            },
            keyframes: {
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                },
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                }
            },
        },
    },
    plugins: [],
}
