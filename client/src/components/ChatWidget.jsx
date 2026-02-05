import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Paperclip, FileText, Image as ImageIcon, Loader2, Minimize2, Maximize2, Bot, Mic, MicOff, Volume2, VolumeX, BarChart2, Maximize } from 'lucide-react';

export default function ChatWidget() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, role: 'system', content: 'Hi! I am your AI academic assistant. You can ask me questions or upload images/PDFs for analysis.' }
    ]);
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
    }, [messages, isOpen]);

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
                } else if (event.error === 'network') {
                    alert("Voice recognition requires an internet connection.");
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
            file: file
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
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: data.reply
                }]);
                // Speak the response
                speakText(data.reply);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: `Error: ${data.reply || data.error || data.message || 'Something went wrong.'}`
                }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: "I'm having trouble connecting right now."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 flex items-center justify-center transition-all hover:scale-105 z-50 animate-bounce-slow"
            >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
                <MessageSquare className="w-6 h-6 relative z-10" />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 transition-all duration-300 flex flex-col ${isMinimized ? 'w-72 h-14' : 'w-96 h-[600px]'}`}>
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-md p-3 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 flex items-center">
                            AI Assistant
                            {isSpeaking && <BarChart2 className="w-3 h-3 ml-2 text-indigo-500 animate-pulse" />}
                        </h3>
                        {!isMinimized && <p className="text-xs text-green-500 flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> Online</p>}
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={toggleVoice}
                        className={`p-1.5 rounded-lg transition ${voiceEnabled ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        title={voiceEnabled ? "Mute Bot" : "Unmute Bot"}
                    >
                        {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => navigate('/student/chat')}
                        className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 transition"
                        title="Open full chat page"
                    >
                        <Maximize className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg text-gray-500 transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                                    }`}>
                                    {msg.file && (
                                        <div className="mb-2 p-2 bg-white/10 rounded-lg flex items-center space-x-2 border border-white/20">
                                            {msg.file.type.startsWith('image/') ? (
                                                <ImageIcon className="w-4 h-4" />
                                            ) : (
                                                <FileText className="w-4 h-4" />
                                            )}
                                            <span className="text-xs truncate max-w-[150px]">{msg.file.name}</span>
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                    <span className="text-xs text-gray-500">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100">
                        {file && (
                            <div className="flex items-center justify-between bg-indigo-50 px-3 py-2 rounded-lg mb-2 text-xs text-indigo-700 border border-indigo-100">
                                <div className="flex items-center truncate">
                                    {file.type.startsWith('image/') ? <ImageIcon className="w-3 h-3 mr-2" /> : <FileText className="w-3 h-3 mr-2" />}
                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                </div>
                                <button onClick={() => setFile(null)} className="p-1 hover:bg-indigo-100 rounded-full">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*,.pdf"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                title="Attach Image or PDF"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>

                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isListening ? "Listening..." : "Ask something..."}
                                    className={`w-full bg-gray-50 border ${isListening ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'} text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pr-10 outline-none transition-all placeholder:text-gray-400`}
                                />
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:bg-gray-200'}`}
                                    title="Voice Input"
                                >
                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={(!input.trim() && !file) || isLoading}
                                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-indigo-200"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
