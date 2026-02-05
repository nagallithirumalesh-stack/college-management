import { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Trophy, Medal, Award, TrendingUp, Star, Crown } from 'lucide-react';

export default function StudentLeaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [myRank, setMyRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('overall'); // overall, attendance, assignments

    useEffect(() => {
        fetchLeaderboard();
    }, [filter]);

    const fetchLeaderboard = async () => {
        const token = localStorage.getItem('token');
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/gamification/leaderboard?type=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeaderboard(data.leaderboard || []);
                setMyRank(data.myRank || null);
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-slate-400" />;
        if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
        return <span className="text-lg font-black text-muted">#{rank}</span>;
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
        if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-500 text-white';
        if (rank === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
        return 'bg-slate-100 text-headings';
    };

    return (
        <DashboardLayout role="student">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-headings flex items-center">
                            <Trophy className="w-8 h-8 mr-3 text-primary" />
                            Leaderboard
                        </h1>
                        <p className="text-secondary">See how you rank among your peers</p>
                    </div>

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-surface border border-slate-200 rounded-xl font-medium text-headings focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="overall">Overall Points</option>
                        <option value="attendance">Attendance</option>
                        <option value="assignments">Assignments</option>
                    </select>
                </div>

                {/* My Rank Card */}
                {myRank && (
                    <div className="bg-gradient-to-r from-primary to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">Your Rank</p>
                                <div className="flex items-center gap-3">
                                    {getRankIcon(myRank.rank)}
                                    <span className="text-4xl font-black">#{myRank.rank}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-90 mb-1">Total Points</p>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5" />
                                    <span className="text-3xl font-black">{myRank.points}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="bg-surface p-4 rounded-2xl border border-slate-200 animate-pulse h-20"></div>
                        ))}
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="bg-surface p-12 rounded-2xl border border-slate-200 text-center">
                        <Trophy className="w-16 h-16 mx-auto text-muted mb-4" />
                        <h3 className="text-lg font-bold text-headings mb-2">No Leaderboard Data</h3>
                        <p className="text-secondary">Start earning points to appear on the leaderboard!</p>
                    </div>
                ) : (
                    <div className="bg-surface rounded-2xl border border-slate-200 overflow-hidden">
                        <div className="divide-y divide-slate-100">
                            {leaderboard.map((student, index) => (
                                <div
                                    key={student.id}
                                    className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${student.isMe ? 'bg-primary/5 border-l-4 border-primary' : ''
                                        }`}
                                >
                                    {/* Rank & Name */}
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRankBadge(index + 1)}`}>
                                            {getRankIcon(index + 1)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-headings flex items-center gap-2">
                                                {student.name}
                                                {student.isMe && (
                                                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">You</span>
                                                )}
                                            </h3>
                                            <p className="text-xs text-secondary">{student.email}</p>
                                        </div>
                                    </div>

                                    {/* Points */}
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 text-warning" />
                                            <span className="text-2xl font-black text-headings">{student.points}</span>
                                        </div>
                                        <p className="text-xs text-muted">points</p>
                                    </div>

                                    {/* Trend */}
                                    {student.trend && (
                                        <div className="ml-4">
                                            <TrendingUp className={`w-5 h-5 ${student.trend === 'up' ? 'text-success' : 'text-danger'}`} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-headings mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-warning" />
                        How to Earn Points
                    </h3>
                    <ul className="space-y-2 text-sm text-secondary">
                        <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span><strong>Attendance:</strong> Earn points for each class attended</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span><strong>Assignments:</strong> Complete assignments on time for bonus points</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-success mr-2">✓</span>
                            <span><strong>Participation:</strong> Active engagement in class activities</span>
                        </li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}
