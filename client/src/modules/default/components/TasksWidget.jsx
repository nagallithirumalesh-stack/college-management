import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Calendar, Tag } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const TasksWidget = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchTodos = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://localhost:5000/api/todos', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setTodos(await res.json());
            } catch (err) {
                console.error(err);
            }
        };
        fetchTodos();
    }, [user]);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        // Optimistic UI update
        const tempId = Date.now();
        const newTask = { id: tempId, task: newTodo.trim(), completed: false, tag: 'General', due: 'Today' };
        setTodos([newTask, ...todos]);
        setNewTodo('');

        try {
            const token = localStorage.getItem('token');
            await fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: newTask.task })
            });
            // In real app, we'd replace tempId with real ID from response
        } catch (error) { console.error(error); }
    };

    const handleToggleTodo = async (id) => {
        // Optimistic
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) { console.error(error); }
    };

    const handleDeleteTodo = async (id, e) => {
        e.stopPropagation();
        setTodos(todos.filter(t => t.id !== id));
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) { console.error(error); }
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col min-h-[400px]">

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2 text-indigo-500" /> Today's Tasks
                </h3>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">
                    {todos.filter(t => !t.completed).length} Pending
                </span>
            </div>

            {/* Smart Input Group */}
            <form onSubmit={handleAddTodo} className={`flex items-center bg-white border transition-all duration-300 rounded-xl overflow-hidden mb-6 ${isFocused ? 'ring-2 ring-indigo-100 border-indigo-400 shadow-md' : 'border-gray-200'}`}>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent placeholder-gray-400"
                />
                <button
                    type="submit"
                    disabled={!newTodo.trim()}
                    className={`px-4 py-3 transition-colors ${newTodo.trim() ? 'text-indigo-600 hover:bg-indigo-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                >
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                {todos.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-6 opacity-60">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                            <CheckSquare className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">All caught up! 🎉</p>
                        <p className="text-xs text-gray-400 mt-1">Enjoy your free time.</p>
                    </div>
                ) : (
                    todos.map(todo => (
                        <div
                            key={todo.id}
                            onClick={() => handleToggleTodo(todo.id)}
                            className={`group flex items-start p-3 rounded-xl transition-all duration-200 border cursor-pointer ${todo.completed ? 'bg-gray-50 border-transparent opacity-60' : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-sm'}`}
                        >
                            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors mr-3 flex-shrink-0 ${todo.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                                {todo.completed && <Plus className="w-3 h-3 text-white transform rotate-45" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium transition-all ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                    {todo.task}
                                </p>
                                {/* Metadata Chips (Mocked for now) */}
                                {!todo.completed && (
                                    <div className="flex items-center space-x-2 mt-1.5">
                                        <span className="inline-flex items-center text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                                            <Tag className="w-2.5 h-2.5 mr-1 opacity-70" /> {todo.tag || 'Study'}
                                        </span>
                                        <span className="inline-flex items-center text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded font-medium">
                                            <Calendar className="w-2.5 h-2.5 mr-1 opacity-70" /> {todo.due || 'Today'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={(e) => handleDeleteTodo(todo.id, e)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TasksWidget;
