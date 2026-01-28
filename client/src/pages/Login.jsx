import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Lock, Mail, Github, Chrome } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [videoLoaded, setVideoLoaded] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-blue-100">
            {/* Left Section - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo / Brand */}
                    <div className="flex items-center space-x-2 group cursor-default">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                            <Logo className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                            SmartCampus
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Please enter your details to sign in
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-100 flex items-center space-x-2 text-red-600 animate-fade-in">
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                    placeholder="Email address or Username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-gray-700 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Sign in
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <Chrome className="w-5 h-5 mr-2 text-slate-700" />
                                Google
                            </button>
                            <button type="button" className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <Github className="w-5 h-5 mr-2 text-slate-700" />
                                GitHub
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-slate-400">
                    © 2026 Smart Digital Campus. All rights reserved.
                </div>
            </div>

            {/* Right Section - Image/Showcase */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-900/90 mix-blend-multiply z-10" />

                {/* Abstract Shapes */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

                <div className="absolute inset-0 z-20 flex flex-col justify-center px-16 text-white">
                    <div className="mb-6 inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl w-fit border border-white/20 shadow-2xl">
                        <Logo className="w-8 h-8 text-blue-300" />
                    </div>
                    <h2 className="text-5xl font-bold leading-tight mb-6">
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                            Digital Education
                        </span>
                    </h2>
                    <p className="text-xl text-blue-100/80 leading-relaxed max-w-md">
                        Seamlessly connect with faculty, track your academic progress, and collaborate with peers in one unified platform.
                    </p>

                    {/* Glassmorphism Card */}
                    <div className="mt-12 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl max-w-sm transform rotate-2 hover:rotate-0 transition-transform duration-500 hover:shadow-2xl">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-white shadow-lg">
                                A+
                            </div>
                            <div>
                                <p className="font-semibold text-white">Academic Excellence</p>
                                <p className="text-xs text-blue-200">Track your verified achievements</p>
                            </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                            <div className="bg-emerald-400 h-2 rounded-full w-3/4 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                        </div>
                        <div className="flex justify-between text-xs text-blue-200">
                            <span>Progress</span>
                            <span>Top 5%</span>
                        </div>
                    </div>
                </div>

                <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2940"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                    alt="Campus Life"
                />
            </div>
        </div>
    );
}
