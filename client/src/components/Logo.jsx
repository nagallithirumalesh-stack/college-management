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
                    <stop offset="0%" stopColor="#3B82F6" /> {/* Blue-500 */}
                    <stop offset="50%" stopColor="#6366F1" /> {/* Indigo-500 */}
                    <stop offset="100%" stopColor="#8B5CF6" /> {/* Purple-500 */}
                </linearGradient>
                <linearGradient id="logoGradientAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" /> {/* Emerald-500 */}
                    <stop offset="100%" stopColor="#14B8A6" /> {/* Teal-500 */}
                </linearGradient>
            </defs>

            {/* Graduation Cap Base */}
            <path
                d="M50 25 L15 40 L50 55 L85 40 Z"
                fill="url(#logoGradient)"
                opacity="0.9"
            />

            {/* Graduation Cap Top Diamond */}
            <path
                d="M50 15 L45 20 L50 25 L55 20 Z"
                fill="url(#logoGradientAccent)"
            />

            {/* Tassel */}
            <line
                x1="50"
                y1="17"
                x2="58"
                y2="10"
                stroke="url(#logoGradientAccent)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="58" cy="8" r="3" fill="url(#logoGradientAccent)" />

            {/* Book Pages (Left side) */}
            <path
                d="M25 45 L25 75 L48 70 L48 40 Z"
                fill="url(#logoGradient)"
                opacity="0.7"
            />

            {/* Book Pages (Right side) */}
            <path
                d="M75 45 L75 75 L52 70 L52 40 Z"
                fill="url(#logoGradient)"
                opacity="0.85"
            />

            {/* Book Spine */}
            <rect
                x="48"
                y="40"
                width="4"
                height="30"
                fill="url(#logoGradientAccent)"
            />

            {/* Digital Circuit Dots */}
            <circle cx="35" cy="55" r="2" fill="#60A5FA" opacity="0.8" />
            <circle cx="42" cy="60" r="2" fill="#60A5FA" opacity="0.8" />
            <circle cx="58" cy="60" r="2" fill="#60A5FA" opacity="0.8" />
            <circle cx="65" cy="55" r="2" fill="#60A5FA" opacity="0.8" />

            {/* Connecting Lines */}
            <line x1="35" y1="55" x2="42" y2="60" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
            <line x1="58" y1="60" x2="65" y2="55" stroke="#60A5FA" strokeWidth="1" opacity="0.5" />
        </svg>
    );
}
