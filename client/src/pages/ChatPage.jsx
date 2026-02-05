import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, FileText, Image as ImageIcon, Loader2, Bot, Mic, MicOff, Volume2, VolumeX, Sparkles, Trash2, Download } from 'lucide-react';

export default function ChatPage() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            setMessages([
                { id: 1, role: 'system', content: 'Hi! I am your AI academic assistant. You can ask me questions or upload images/PDFs for analysis. I can speak my responses - toggle voice with the speaker icon!' }
            ]);
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
    }, [messages]);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join('');
                setInput(transcript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    alert("Microphone access blocked. Please allow permissions in your browser settings to use voice chat.");
                }
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            cancelSpeech();
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakText = (text) => {
        if (!voiceEnabled || !text) return;

        cancelSpeech();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        // Pick a nice voice if available
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
        if (preferredVoice) utterance.voice = preferredVoice;

        synthRef.current.speak(utterance);
    };

    const cancelSpeech = () => {
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    };

    const toggleVoice = () => {
        if (voiceEnabled) {
            cancelSpeech();
        }
        setVoiceEnabled(!voiceEnabled);
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((!input.trim() && !file) || isLoading) return;

        // Stop listening if sending
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: input,
            file: file,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setFile(null);
        setIsLoading(true);

        const formData = new FormData();
        formData.append('message', userMessage.content);
        if (file) {
            formData.append('file', file);
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                const assistantMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: data.reply,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, assistantMessage]);

                // Auto-play voice response
                setTimeout(() => {
                    speakText(data.reply);
                }, 100);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: `Error: ${data.reply || data.error || data.message || 'Something went wrong.'}`,
                    timestamp: new Date().toISOString()
                }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: "I'm having trouble connecting right now.",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all chat history?')) {
            setMessages([
                { id: 1, role: 'system', content: 'Chat history cleared. How can I help you today?' }
            ]);
            localStorage.removeItem('chatHistory');
        }
    };

    const exportChat = () => {
        const chatText = messages.map(m => {
            const time = m.timestamp ? new Date(m.timestamp).toLocaleString() : '';
            return `[${time}] ${m.role.toUpperCase()}: ${m.content}`;
        }).join('\n\n');

        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl -z-10"></div>

            {/* Header */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-white/50 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/student')}
                        className="p-2.5 -ml-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-white/50 transition mr-3 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 mr-3">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI Assistant</h1>
                            <p className="text-xs font-medium text-gray-600">Powered by Llama 4 Scout</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleVoice}
                        className={`p-2.5 rounded-xl transition-all ${voiceEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}
                        title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
                    >
                        {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={exportChat}
                        className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                        title="Export chat"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                    <button
                        onClick={clearHistory}
                        className="p-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition"
                        title="Clear history"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Container */}
            <div className="max-w-5xl mx-auto px-4 py-6 h-[calc(100vh-180px)]">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 h-full flex flex-col overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2 shadow-md">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500">AI Assistant</span>
                                        </div>
                                    )}
                                    <div
                                        className={`px-5 py-3 rounded-2xl ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                                                : msg.role === 'system'
                                                    ? 'bg-gray-100 text-gray-700 border border-gray-200'
                                                    : 'bg-white text-gray-800 shadow-md border border-gray-100'
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        {msg.file && (
                                            <div className="mt-2 flex items-center text-xs opacity-80">
                                                {msg.file.type?.startsWith('image/') ? (
                                                    <ImageIcon className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <FileText className="w-3 h-3 mr-1" />
                                                )}
                                                {msg.file.name}
                                            </div>
                                        )}
                                        {msg.timestamp && (
                                            <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white shadow-md border border-gray-100 px-5 py-3 rounded-2xl flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                    <span className="text-sm text-gray-600">AI is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-gray-100 p-4 bg-gray-50/50 backdrop-blur-xl">
                        {file && (
                            <div className="mb-3 flex items-center justify-between bg-white px-4 py-2 rounded-xl border border-gray-200">
                                <div className="flex items-center text-sm text-gray-700">
                                    {file.type?.startsWith('image/') ? (
                                        <ImageIcon className="w-4 h-4 mr-2 text-indigo-600" />
                                    ) : (
                                        <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                                    )}
                                    <span className="font-medium truncate max-w-xs">{file.name}</span>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-gray-400 hover:text-red-500 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                    placeholder="Ask me anything... (Shift+Enter for new line)"
                                    className="w-full px-4 py-3 pr-24 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none bg-white transition"
                                    rows="1"
                                    style={{ minHeight: '48px', maxHeight: '120px' }}
                                />
                                <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition"
                                        title="Attach file"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`p-2 rounded-lg transition ${isListening
                                                ? 'bg-red-100 text-red-600 animate-pulse'
                                                : 'hover:bg-gray-100 text-gray-500 hover:text-indigo-600'
                                            }`}
                                        title={isListening ? 'Stop listening' : 'Start voice input'}
                                    >
                                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || (!input.trim() && !file)}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {isSpeaking && <span className="text-indigo-600 font-medium animate-pulse">🔊 Speaking...</span>}
                            {isListening && <span className="text-red-600 font-medium animate-pulse">🎤 Listening...</span>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
