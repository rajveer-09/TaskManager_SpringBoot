import React, { useEffect, useState } from 'react';
import { taskService } from '../services/api';
import Navbar from '../components/Navbar';
import { Plus, Trash2, CheckCircle, Clock, Calendar, AlertCircle, X, CheckSquare } from 'lucide-react';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', status: 'PENDING' });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (error) {
            console.error('Failed to load tasks', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await taskService.create(newTask);
            setIsCreating(false);
            setNewTask({ title: '', description: '', dueDate: '', status: 'PENDING' });
            loadTasks();
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task?')) {
            try {
                await taskService.delete(id);
                loadTasks();
            } catch (error) {
                console.error('Failed to delete', error);
            }
        }
    };

    const handleStatusToggle = async (task) => {
        try {
            const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
            await taskService.update(task.id, { ...task, status: newStatus });
            loadTasks();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            <Navbar />
            <div className="container animate-fade-in">

                {/* Header Section */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                    marginBottom: '3rem',
                    marginTop: '2rem'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            You have <strong style={{ color: 'var(--primary-color)' }}>{tasks.filter(t => t.status === 'PENDING').length}</strong> pending tasks today.
                        </p>
                    </div>

                    {!isCreating && (
                        <button onClick={() => setIsCreating(true)} className="btn btn-primary">
                            <Plus size={20} />
                            Create New Task
                        </button>
                    )}
                </div>

                {/* Create Task Panel */}
                {isCreating && (
                    <div style={{
                        backgroundColor: 'var(--card-bg)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '3rem',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-lg)',
                        animation: 'fadeIn 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>New Task</h3>
                            <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="input-group">
                                <label className="input-label">Title</label>
                                <input
                                    placeholder="What needs to be done?"
                                    className="input-field"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Description (Optional)</label>
                                <textarea
                                    placeholder="Add details details..."
                                    className="input-field"
                                    rows="3"
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsCreating(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Task</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Tasks Grid */}
                {tasks.length === 0 && !isCreating ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '5rem 2rem',
                        border: '2px dashed var(--border-color)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--text-secondary)'
                    }}>
                        <div style={{ margin: '0 auto 1.5rem', width: '64px', height: '64px', background: 'var(--card-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckSquare size={32} color="var(--primary-color)" />
                        </div>
                        <h3>No tasks found</h3>
                        <p style={{ marginTop: '0.5rem' }}>Get started by creating your first task above.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '2rem'
                    }}>
                        {tasks.map(task => (
                            <div key={task.id} style={{
                                backgroundColor: 'var(--card-bg)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                padding: '1.5rem',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                opacity: task.status === 'COMPLETED' ? 0.6 : 1
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--border-color)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        backgroundColor: task.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                        color: task.status === 'COMPLETED' ? 'var(--success-color)' : 'var(--primary-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.375rem'
                                    }}>
                                        {task.status === 'COMPLETED' ? <CheckCircle size={12} /> : <Clock size={12} />}
                                        {task.status}
                                    </div>

                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            padding: '0.25rem'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <h3 style={{
                                    fontSize: '1.25rem',
                                    marginBottom: '0.75rem',
                                    lineHeight: '1.4',
                                    textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none'
                                }}>
                                    {task.title}
                                </h3>

                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.95rem',
                                    marginBottom: '2rem',
                                    flexGrow: 1
                                }}>
                                    {task.description || "No description provided."}
                                </p>

                                <button
                                    onClick={() => handleStatusToggle(task)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--border-color)',
                                        background: 'transparent',
                                        color: task.status === 'COMPLETED' ? 'var(--text-secondary)' : 'var(--text-main)',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    {task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Completed'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
