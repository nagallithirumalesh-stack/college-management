export default function Logo({ className = "h-8 w-8" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={className}
            fill="none"
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
                    <stop offset="100%" stopColor="#7C3AED" /> {/* Violet-600 */}
                </linearGradient>
            </defs>

            {/* Abstract "S" / Circuit Shape representing Connectivity & Intelligence */}
            <path
                d="M30 20 H70 A20 20 0 0 1 90 40 V50 A10 10 0 0 1 80 60 H40 A10 10 0 0 0 30 70 V80 H80"
                stroke="url(#logoGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
            />
            <path
                d="M70 80 H30 A20 20 0 0 1 10 60 V50 A10 10 0 0 1 20 40 H60 A10 10 0 0 0 70 30 V20 H20"
                stroke="url(#logoGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
            />

            {/* Center Node/Spark */}
            <circle cx="50" cy="50" r="8" fill="#F472B6" />
        </svg>
    );
}
