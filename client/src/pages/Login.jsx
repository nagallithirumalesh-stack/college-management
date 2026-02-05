import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Lock, Mail, Github, Chrome, Shield, CheckCircle, Zap } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

            {/* Ambient Gradients - Much softer/smaller than before */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-50 to-transparent opacity-60 blur-3xl -z-10" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center group">
                    <div className="bg-white p-2.5 rounded-xl shadow-lg shadow-slate-200/50 group-hover:scale-105 transition-transform duration-300">
                        <Logo className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
                    Sign in to EdTrack
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Your professional campus management portal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">
                <div className="bg-white py-8 px-4 shadow-[0_0_40px_-10px_rgba(0,0,0,0.08)] sm:rounded-2xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                                <Shield className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                <Chrome className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-slate-600">Google</span>
                            </button>
                            <button
                                type="button"
                                className="w-full inline-flex justify-center py-2.5 px-4 border border-slate-200 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                <Github className="h-5 w-5 text-slate-800 mr-2" />
                                <span className="text-slate-600">GitHub</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <p className="mt-8 text-center text-xs text-slate-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                        Sign up for free
                    </Link>
                </p>
                <div className="mt-4 flex justify-center gap-4 text-xs text-slate-400">
                    <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                    <span>•</span>
                    <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    );
}
