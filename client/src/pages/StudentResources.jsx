import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Cpu, Code, BookOpen, Calendar, Rocket, Globe, Sparkles, TrendingUp } from 'lucide-react';

export default function StudentResources() {
    const navigate = useNavigate();
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedHackathon, setSelectedHackathon] = useState(null);

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
            gradient: "from-orange-500 to-red-500",
            description: "India's biggest hackathon for solving real-world problems using technology. Organized by the Government of India, this event brings together students to create innovative solutions for various ministries and departments.",
            prizes: "₹1,00,000 for winners + Certificates",
            teamSize: "6 members per team",
            eligibility: "Students from recognized institutions",
            registrationSteps: [
                {
                    step: 1,
                    title: "Visit Official Website",
                    description: "Go to sih.gov.in and create an account using your college email ID."
                },
                {
                    step: 2,
                    title: "Form Your Team",
                    description: "Assemble a team of 6 members. Ensure diversity in skills (coding, design, domain knowledge)."
                },
                {
                    step: 3,
                    title: "Select Problem Statement",
                    description: "Browse through 50+ problem statements from various ministries. Choose one that aligns with your team's expertise."
                },
                {
                    step: 4,
                    title: "Submit Idea",
                    description: "Write a detailed proposal (max 1000 words) explaining your solution approach, tech stack, and implementation plan."
                },
                {
                    step: 5,
                    title: "Wait for Shortlisting",
                    description: "Shortlisted teams will be notified via email within 2 weeks. Top 100 teams advance to the grand finale."
                },
                {
                    step: 6,
                    title: "Prepare for Finals",
                    description: "Build a working prototype and prepare a 10-minute pitch presentation for the finale."
                }
            ]
        },
        {
            id: 2,
            title: "Global AI Challenge",
            date: "Apr 02, 2026",
            location: "Online",
            tags: ["Machine Learning", "Python"],
            gradient: "from-blue-500 to-cyan-500",
            description: "A 48-hour online hackathon focused on building AI/ML solutions for real-world challenges. Compete with developers worldwide and showcase your machine learning expertise.",
            prizes: "$10,000 in prizes + Cloud credits",
            teamSize: "1-4 members per team",
            eligibility: "Open to all (students & professionals)",
            registrationSteps: [
                {
                    step: 1,
                    title: "Register on Platform",
                    description: "Sign up on devpost.com/global-ai-challenge using GitHub or Google account."
                },
                {
                    step: 2,
                    title: "Join Discord Community",
                    description: "Join the official Discord server to connect with mentors, sponsors, and fellow participants."
                },
                {
                    step: 3,
                    title: "Review Challenge Tracks",
                    description: "Choose from 4 tracks: Healthcare AI, Climate Tech, FinTech, or Open Innovation."
                },
                {
                    step: 4,
                    title: "Set Up Environment",
                    description: "Prepare your dev environment. Free cloud credits will be provided for Google Cloud, AWS, or Azure."
                },
                {
                    step: 5,
                    title: "Build Your Solution",
                    description: "Develop your ML model during the 48-hour window. Use provided datasets or bring your own."
                },
                {
                    step: 6,
                    title: "Submit Project",
                    description: "Upload code to GitHub, deploy a demo, and submit a 3-minute video walkthrough before the deadline."
                }
            ]
        },
        {
            id: 3,
            title: "Web3 BUILD Summit",
            date: "May 20, 2026",
            location: "Bangalore",
            tags: ["Blockchain", "DApps"],
            gradient: "from-purple-500 to-pink-500",
            description: "Build the future of decentralized applications! This in-person hackathon focuses on blockchain, smart contracts, and Web3 technologies. Network with industry leaders and VCs.",
            prizes: "₹5,00,000 + Mentorship from Web3 founders",
            teamSize: "2-5 members per team",
            eligibility: "Developers with basic blockchain knowledge",
            registrationSteps: [
                {
                    step: 1,
                    title: "Early Bird Registration",
                    description: "Register at web3build.in before April 1st to get early bird benefits and exclusive swag."
                },
                {
                    step: 2,
                    title: "Complete Profile",
                    description: "Fill out your developer profile including GitHub, previous projects, and blockchain experience level."
                },
                {
                    step: 3,
                    title: "Attend Pre-Event Workshop",
                    description: "Join the online workshop on May 10th covering Solidity, Ethereum, and DApp architecture (optional but recommended)."
                },
                {
                    step: 4,
                    title: "Book Travel & Accommodation",
                    description: "Venue is in Koramangala, Bangalore. Limited accommodation support available for outstation participants."
                },
                {
                    step: 5,
                    title: "Hackathon Day",
                    description: "Arrive at 9 AM for registration. Hacking starts at 11 AM and runs for 24 hours straight."
                },
                {
                    step: 6,
                    title: "Demo & Judging",
                    description: "Present your DApp to judges (5 min demo + 3 min Q&A). Winners announced at closing ceremony."
                }
            ]
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 flex flex-col font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-200/15 to-blue-200/15 rounded-full blur-3xl -z-10"></div>

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
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tech Hub</h1>
                            <p className="text-xs font-medium text-gray-600">Resources for Growth & Innovation</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-12 pb-24">

                {/* Tech News Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-3 shadow-md">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Trending Tech News</h2>
                                <p className="text-sm text-gray-600">Stay updated with the latest</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {techNews.map(news => (
                            <div key={news.id} onClick={() => window.open(news.url, '_blank')} className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg z-20">
                                        {news.category}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 font-medium">
                                        <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                            {news.source}
                                        </span>
                                        <span>{news.time}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {news.title}
                                    </h3>
                                    <div className="flex items-center text-indigo-600 text-sm font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Read more <ExternalLink className="w-3.5 h-3.5 ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hackathons Section */}
                <section>
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-3 shadow-md">
                            <Code className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">Upcoming Hackathons</h2>
                            <p className="text-sm text-gray-600">Compete and level up your skills</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hackathons.map(hack => (
                            <div
                                key={hack.id}
                                onClick={() => setSelectedHackathon(hack)}
                                className="relative group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
                            >
                                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${hack.gradient} opacity-10 group-hover:scale-150 transition-transform duration-700 blur-2xl`}></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${hack.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                            <Cpu className="w-7 h-7 text-white" />
                                        </div>
                                        <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl border border-gray-200">
                                            {hack.location}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{hack.title}</h3>
                                    <p className="text-sm text-gray-600 flex items-center mb-5 font-medium">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" /> {hack.date}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {hack.tags.map(tag => (
                                            <span key={tag} className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg border border-gray-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedHackathon(hack); }}
                                        className={`w-full py-3 bg-gradient-to-r ${hack.gradient} text-white rounded-xl font-bold text-sm hover:shadow-xl transition-all shadow-lg flex items-center justify-center group-hover:scale-105`}
                                    >
                                        View Details <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommended Books */}
                <section>
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mr-3 shadow-md">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">Must-Read for Growth</h2>
                            <p className="text-sm text-gray-600">Curated books to transform your mindset</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {books.map(book => (
                            <div key={book.id} onClick={() => setSelectedBook(book)} className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-5 flex hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                <div className="relative">
                                    <img src={book.cover} alt={book.title} className="w-28 h-40 object-cover rounded-xl shadow-md group-hover:shadow-2xl transition-shadow duration-300" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-3.5 h-3.5 text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col pl-5 py-1">
                                    <h3 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{book.title}</h3>
                                    <p className="text-sm font-medium text-gray-500 mb-3">{book.author}</p>
                                    <p className="text-xs text-gray-600 line-clamp-3 mb-auto leading-relaxed">{book.desc}</p>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedBook(book); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 text-left mt-3 flex items-center">
                                        View Summary <ArrowLeft className="w-3 h-3 ml-1 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hackathon Details Modal */}
                {selectedHackathon && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedHackathon(null)}>
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className={`relative p-6 border-b border-gray-100 bg-gradient-to-r ${selectedHackathon.gradient} rounded-t-3xl`}>
                                <div className="absolute inset-0 bg-black/10 rounded-t-3xl"></div>
                                <div className="relative z-10 flex items-start justify-between">
                                    <div className="flex items-center">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                                            <Cpu className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-white mb-1">{selectedHackathon.title}</h2>
                                            <p className="text-white/90 text-sm font-medium flex items-center">
                                                <Calendar className="w-4 h-4 mr-2" /> {selectedHackathon.date} • {selectedHackathon.location}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedHackathon(null)} className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 overflow-y-auto custom-scrollbar">
                                {/* Description */}
                                <p className="text-gray-700 leading-relaxed mb-6">{selectedHackathon.description}</p>

                                {/* Quick Info Grid */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
                                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Prizes</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedHackathon.prizes}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border border-blue-100">
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Team Size</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedHackathon.teamSize}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100">
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Eligibility</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedHackathon.eligibility}</p>
                                    </div>
                                </div>

                                {/* Registration Steps */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center">
                                        <Sparkles className="w-5 h-5 mr-2 text-indigo-600" /> Registration Steps
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedHackathon.registrationSteps.map((step, idx) => (
                                            <div key={step.step} className="flex gap-4 group">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${selectedHackathon.gradient} flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform`}>
                                                    {step.step}
                                                </div>
                                                <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:border-indigo-200 group-hover:bg-white transition-all">
                                                    <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                                                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {selectedHackathon.tags.map(tag => (
                                        <span key={tag} className="text-xs font-bold uppercase tracking-wide px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg border border-gray-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50/50 backdrop-blur-xl rounded-b-3xl flex justify-between items-center">
                                <button onClick={() => setSelectedHackathon(null)} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition font-medium">
                                    Close
                                </button>
                                <button className={`px-6 py-2.5 bg-gradient-to-r ${selectedHackathon.gradient} text-white rounded-xl font-bold hover:shadow-xl transition-all shadow-lg flex items-center`}>
                                    Start Registration <ExternalLink className="w-4 h-4 ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Book Summary Modal */}
                {selectedBook && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedBook(null)}>
                        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-start justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center">
                                    <img src={selectedBook.cover} className="w-12 h-16 object-cover rounded-lg shadow-sm mr-4" alt={selectedBook.title} />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedBook.title}</h2>
                                        <p className="text-sm text-gray-500">{selectedBook.author}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedBook(null)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar leading-relaxed text-gray-700">
                                <div dangerouslySetInnerHTML={{ __html: selectedBook.summary }} />
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50/50 backdrop-blur-xl rounded-b-3xl flex justify-end">
                                <button onClick={() => setSelectedBook(null)} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200">
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
