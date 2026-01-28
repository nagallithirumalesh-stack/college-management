import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Cpu, Code, BookOpen, Calendar, Rocket, Globe } from 'lucide-react';
import Logo from '../components/Logo';

export default function StudentResources() {
    const navigate = useNavigate();
    const [selectedBook, setSelectedBook] = useState(null);

    // Mock Data
    const techNews = [
        {
            id: 1,
            title: "New AI Model 'Gemini' Breaks Benchmarks",
            source: "TechCrunch",
            time: "2h ago",
            category: "AI",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://blog.google/technology/ai/google-gemini-ai/"
        },
        {
            id: 2,
            title: "The Future of Quantum Computing in 2026",
            source: "The Verge",
            time: "5h ago",
            category: "Hardware",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://www.theverge.com/science"
        },
        {
            id: 3,
            title: "React 19 Server Components Explained",
            source: "Dev.to",
            time: "1d ago",
            category: "Web Dev",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300&h=200",
            url: "https://react.dev/blog"
        }
    ];

    const hackathons = [
        {
            id: 1,
            title: "Smart India Hackathon 2026",
            date: "Mar 15-16, 2026",
            location: "Virtual / New Delhi",
            tags: ["GovTech", "Innovation"],
            color: "bg-orange-500"
        },
        {
            id: 2,
            title: "Global AI Challenge",
            date: "Apr 02, 2026",
            location: "Online",
            tags: ["Machine Learning", "Python"],
            color: "bg-blue-500"
        },
        {
            id: 3,
            title: "Web3 BUILD Summit",
            date: "May 20, 2026",
            location: "Bangalore",
            tags: ["Blockchain", "DApps"],
            color: "bg-purple-500"
        }
    ];

    const books = [
        {
            id: 1,
            title: "Atomic Habits",
            author: "James Clear",
            desc: "Build good habits and break bad ones.",
            cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
            summary: `
                <div class="space-y-6">
                    <p class="font-medium text-lg text-gray-800">Atomic Habits by James Clear is a practical guide to building good habits and breaking bad ones through small, incremental changes that compound over time. Clear emphasizes that habits shape your identity, with every action acting as a vote for the person you want to become.</p>
                    
                    <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <h4 class="font-bold text-indigo-900 mb-2">Core Framework: Four Laws of Behavior Change</h4>
                        <p class="text-indigo-800 text-sm">The book revolves around a simple four-step habit loop—cue, craving, response, reward—and provides actionable laws to build positive habits: make them obvious, attractive, easy, and satisfying.</p>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Key Concepts</h3>
                    <ul class="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Small 1% improvements</strong> compound dramatically, like the British cycling team's success through marginal gains.</li>
                        <li><strong>Habit Stacking</strong>: Linking new habits to existing ones.</li>
                        <li><strong>Two-Minute Rule</strong>: Scale down habits to two minutes or less to get started.</li>
                        <li><strong>Environment Design</strong>: Placing cues visibly (e.g., water bottles) to boost good habits.</li>
                    </ul>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Chapter Breakdown</h3>
                    
                    <div class="grid gap-4">
                        <div class="border-l-4 border-blue-500 pl-4">
                            <h4 class="font-bold text-gray-900">Fundamentals (Chapters 1-3)</h4>
                            <p class="text-sm text-gray-600">The power of atomic habits as small changes that compound. Focus on habits shaping identity—vote for the person you want to become.</p>
                        </div>
                        <div class="border-l-4 border-green-500 pl-4">
                            <h4 class="font-bold text-gray-900">1st Law: Make It Obvious (Chapters 4-7)</h4>
                            <p class="text-sm text-gray-600">Details the habit loop and habit stacking. Emphasizes environment design over willpower.</p>
                        </div>
                        <div class="border-l-4 border-purple-500 pl-4">
                            <h4 class="font-bold text-gray-900">2nd Law: Make It Attractive (Chapters 8-11)</h4>
                            <p class="text-sm text-gray-600">Temptation bundling and understanding social influences. Reframing mindsets to fix bad habits.</p>
                        </div>
                        <div class="border-l-4 border-orange-500 pl-4">
                            <h4 class="font-bold text-gray-900">3rd Law: Make It Easy (Chapters 12-15)</h4>
                            <p class="text-sm text-gray-600">Reduce friction and apply the law of least effort. Use the two-minute rule and commitment devices.</p>
                        </div>
                        <div class="border-l-4 border-red-500 pl-4">
                            <h4 class="font-bold text-gray-900">4th Law: Make It Satisfying (Chapters 16-20)</h4>
                            <p class="text-sm text-gray-600">Use habit trackers for feedback and accountability partners. The Goldilocks Rule for peak motivation.</p>
                        </div>
                    </div>
                </div>
            `
        },
        {
            id: 2,
            title: "Deep Work",
            author: "Cal Newport",
            desc: "Rules for focused success in a distracted world.",
            cover: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
            summary: `
                <div class="space-y-6">
                    <p class="font-medium text-lg text-gray-800">Deep Work by Cal Newport presents a compelling case for mastering intense, distraction-free focus as the key to thriving in a distracted world. Newport defines "deep work" as professional activities performed in a state of distraction-free concentration that push cognitive capabilities to their limit.</p>
                    
                    <div class="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 class="font-bold text-blue-900 mb-2">The Central Hypothesis</h4>
                        <p class="text-blue-800 text-sm">Deep work is becoming rarer due to constant digital interruptions, yet more valuable in a knowledge economy where standing out requires rapid skill mastery and elite output.</p>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Four Rules of Deep Work</h3>
                    
                    <div class="space-y-4">
                        <div class="border-l-4 border-indigo-500 pl-4">
                            <h4 class="font-bold text-gray-900">Rule #1: Work Deeply</h4>
                            <p class="text-sm text-gray-600">Choose a philosophy: Monastic (total isolation), Bimodal (split days/weeks), Rhythmic (daily habits), or Journalistic (ad-hoc). Use rituals to signal focus and track lead measures.</p>
                        </div>
                        <div class="border-l-4 border-pink-500 pl-4">
                            <h4 class="font-bold text-gray-900">Rule #2: Embrace Boredom</h4>
                            <p class="text-sm text-gray-600">Focus is a muscle. Train it by resisting the urge for novelty. Use "productive meditation" to solve problems during downtime like commuting.</p>
                        </div>
                        <div class="border-l-4 border-red-500 pl-4">
                            <h4 class="font-bold text-gray-900">Rule #3: Quit Social Media</h4>
                            <p class="text-sm text-gray-600">Adopt the "Any-Benefit" mindset? No. Use the Craftsman Approach: only use tools that contribute significantly to your key life goals (80/20 rule).</p>
                        </div>
                        <div class="border-l-4 border-green-500 pl-4">
                            <h4 class="font-bold text-gray-900">Rule #4: Drain the Shallows</h4>
                            <p class="text-sm text-gray-600">Quantify and limit shallow work (email, meetings) to <4 hours/day. Schedule every minute of your day in blocks. Master saying "No".</p>
                        </div>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Why It Matters</h3>
                    <p class="text-gray-700">Implementing deep work accelerates learning (deliberate practice), produces standout results, and brings joy through mastery. In a world of infinite distractions, it is the "superpower of the 21st century".</p>
                </div>
            `
        },
        {
            id: 3,
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt",
            desc: "From journeyman to master.",
            cover: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg",
            summary: `
                <div class="space-y-6">
                    <p class="font-medium text-lg text-gray-800">The Pragmatic Programmer guides developers from journeyman to master level through timeless principles of effective software craftsmanship. It emphasizes mindset, practical techniques, and adaptability over specific technologies.</p>
                    
                    <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <h4 class="font-bold text-emerald-900 mb-2">Core Philosophy</h4>
                        <p class="text-emerald-800 text-sm">A pragmatic programmer cares deeply about their craft, thinks critically, and takes responsibility. They avoid "broken windows" (neglected code) and constantly seek to automate repetitive tasks.</p>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Key Tips & Practices</h3>
                    <ul class="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>DRY (Don't Repeat Yourself)</strong>: Abstract knowledge into reusable components. Duplicate logic is a liability.</li>
                        <li><strong>Good Naming</strong>: Use intention-revealing names. Code should be self-documenting.</li>
                        <li><strong>Tracer Bullets</strong>: Build end-to-end prototypes early to validate architecture, rather than building in isolation.</li>
                        <li><strong>Fix Broken Windows</strong>: Refactor messy code immediately to prevent "software rot".</li>
                    </ul>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Practical Techniques</h3>
                    
                    <div class="grid gap-4">
                        <div class="border-l-4 border-yellow-500 pl-4">
                            <h4 class="font-bold text-gray-900">Pragmatic Paranoia</h4>
                            <p class="text-sm text-gray-600">"Dead programs tell no lies." Crash early with clear errors. Use assertions and design by contract.</p>
                        </div>
                        <div class="border-l-4 border-cyan-500 pl-4">
                            <h4 class="font-bold text-gray-900">Automation</h4>
                            <p class="text-sm text-gray-600">Use shell scripts to automate builds and deployments. Text is the universal interface.</p>
                        </div>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Modern Relevance</h3>
                    <p class="text-gray-700">Updated for the cloud era, it covers microservices and functional programming, but principles like decoupling and refactoring remain universal. It is the definitive "sharpen the saw" guide for developers.</p>
                </div>
            `
        },
        {
            id: 4,
            title: "Clean Code",
            author: "Robert C. Martin",
            desc: "A handbook of agile software craftsmanship.",
            cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
            summary: `
                <div class="space-y-6">
                    <p class="font-medium text-lg text-gray-800">Clean Code by Robert C. Martin ("Uncle Bob") is a legendary guide on writing code that is easy to read, maintain, and extend. It argues that code is read far more often than it is written, so clarity is paramount.</p>
                    
                    <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <h4 class="font-bold text-gray-900 mb-2">The Boy Scout Rule</h4>
                        <p class="text-gray-700 text-sm">"Always leave the campground cleaner than you found it." Whenever you touch a file, improve it slightly—rename a variable, break up a large function, or fix a small bug.</p>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Core Principles</h3>
                    <ul class="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Meaningful Names</strong>: Variables should reveal intent. Avoid "magic numbers" and cryptic abbreviations.</li>
                        <li><strong>Functions</strong>: Should do one thing, do it well, and do it only. Ideally, they should be short (<20 lines).</li>
                        <li><strong>Comments</strong>: "Comments are failures." Good code explains itself. Only comment *why*, not *what*.</li>
                        <li><strong>Error Handling</strong>: Use exceptions instead of return codes. Handle errors gracefully without cluttering logic.</li>
                    </ul>
                </div>
            `
        },
        {
            id: 5,
            title: "The Psychology of Money",
            author: "Morgan Housel",
            desc: "Timeless lessons on wealth, greed, and happiness.",
            cover: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
            summary: `
                <div class="space-y-6">
                    <p class="font-medium text-lg text-gray-800">Morgan Housel's masterpiece isn't about spreadsheets or stock picks—it's about how we *think* about money. It teaches that doing well with money has a little to do with how smart you are and a lot to do with how you behave.</p>
                    
                    <div class="bg-green-50 p-4 rounded-xl border border-green-100">
                        <h4 class="font-bold text-green-900 mb-2">Wealth is What You Don't See</h4>
                        <p class="text-green-800 text-sm">Wealth is the nice cars not purchased. The diamonds not bought. The watches not worn. Wealth is financial assets that haven't yet been converted into the stuff you see.</p>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">Key Lessons</h3>
                    <ul class="list-disc pl-5 space-y-2 text-gray-700">
                        <li><strong>Compounding</strong>: $81.5 billion of Warren Buffett's $84.5 billion net worth came after his 65th birthday. Time is the most powerful force in investing.</li>
                        <li><strong>Getting vs. Staying Wealthy</strong>: Getting wealthy requires risk and optimism. Staying wealthy requires humility and paranoia.</li>
                        <li><strong>Finite Goals</strong>: Know when you have "enough". Moving the goalpost constantly leads to ruin.</li>
                    </ul>
                </div>
            `
        },
        {
            id: 6,
            title: "Mindset",
            author: "Carol S. Dweck",
            desc: "The new psychology of success.",
            cover: "https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg",
            summary: `
                <div class="space-y-6">
                    <p class="font-medium text-lg text-gray-800">World-renowned Stanford psychologist Carol Dweck explains why it's not just our abilities and talent that bring us success—but whether we approach them with a fixed or growth mindset.</p>
                    
                    <div class="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <h4 class="font-bold text-orange-900 mb-2">Fixed vs. Growth</h4>
                        <p class="text-orange-800 text-sm"><strong>Fixed Mindset</strong>: "I'm either good at it, or I'm not." (Avoids challenge, gives up easily).<br><strong>Growth Mindset</strong>: "I can learn anything I want to." (Embraces challenge, persists in the face of setbacks).</p>
                    </div>

                    <h3 class="text-xl font-bold text-gray-900 mt-6">In Practice</h3>
                    <p class="text-gray-700">People with a growth mindset see failure as a springboard for growth and for stretching their existing abilities. They believe that basic qualities can be cultivated through effort.</p>
                    
                    <h4 class="font-bold text-gray-900 mt-4">The Power of "Yet"</h4>
                    <p class="text-gray-600 text-sm">Instead of saying "I can't do this", say "I can't do this *yet*". This simple shift unlocks potential and persistence.</p>
                </div>
            `
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-700">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/student')}
                        className="p-2 -ml-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition mr-3 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 mr-3">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Tech Hub</h1>
                            <p className="text-xs font-medium text-gray-500">Resources for Growth</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-12 pb-24">

                {/* Tech News Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">
                                <Globe className="w-5 h-5" />
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">Trending Tech News</h2>
                        </div>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {techNews.map(news => (
                            <div key={news.id} onClick={() => window.open(news.url, '_blank')} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-md shadow-sm z-20">
                                        {news.category}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3 font-medium">
                                        <span className="flex items-center gap-1 text-indigo-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                            {news.source}
                                        </span>
                                        <span>{news.time}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {news.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hackathons Section */}
                <section>
                    <div className="flex items-center mb-6">
                        <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-3">
                            <Code className="w-5 h-5" />
                        </span>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Upcoming Hackathons</h2>
                            <p className="text-sm text-gray-500">Compete and level up your skills</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hackathons.map(hack => (
                            <div key={hack.id} className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:border-purple-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                                {/* Decorative Blur */}
                                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${hack.color} opacity-5 group-hover:scale-150 transition-transform duration-700 blur-2xl`}></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className={`w-12 h-12 rounded-xl ${hack.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                                            <Cpu className={`w-6 h-6 ${hack.color.replace('bg-', 'text-')}`} />
                                        </div>
                                        <span className="text-xs font-bold bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                                            {hack.location}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{hack.title}</h3>
                                    <p className="text-sm text-gray-500 flex items-center mb-5 font-medium">
                                        <Calendar className="w-4 h-4 mr-1.5 text-gray-400" /> {hack.date}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {hack.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition shadow-lg shadow-gray-200 flex items-center justify-center group-hover:translate-y-0.5">
                                        Register Now <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommended Books */}
                <section>
                    <div className="flex items-center mb-6">
                        <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3">
                            <BookOpen className="w-5 h-5" />
                        </span>
                        <h2 className="text-xl font-bold text-gray-900">Must-Read for Growth</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {books.map(book => (
                            <div key={book.id} onClick={() => setSelectedBook(book)} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex hover:shadow-lg transition-all duration-300 cursor-pointer">
                                <div className="relative">
                                    <img src={book.cover} alt={book.title} className="w-28 h-40 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300" />
                                </div>
                                <div className="flex-1 flex flex-col pl-5 py-1">
                                    <h3 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                                    <p className="text-sm font-medium text-gray-500 mb-3">{book.author}</p>
                                    <p className="text-xs text-gray-600 line-clamp-3 mb-auto leading-relaxed opacity-80">{book.desc}</p>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedBook(book); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 text-left mt-3 flex items-center">
                                        View Summary <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Book Summary Modal */}
                {selectedBook && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedBook(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="flex items-start justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center">
                                    <img src={selectedBook.cover} className="w-12 h-16 object-cover rounded shadow-sm mr-4" alt={selectedBook.title} />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedBook.title}</h2>
                                        <p className="text-sm text-gray-500">{selectedBook.author}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedBook(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                                    <ArrowLeft className="w-4 h-4 opacity-0" />
                                    <span className="sr-only">Close</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 overflow-y-auto custom-scrollbar leading-relaxed text-gray-700">
                                <div dangerouslySetInnerHTML={{ __html: selectedBook.summary }} />
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
                                <button onClick={() => setSelectedBook(null)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md">
                                    Close Summary
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
