const API_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const authService = {
    login: async (username, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
        }
        return data;
    },
    register: async (username, email, password) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        if (!response.ok) throw new Error('Registration failed');
        return await response.json();
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
    }
};

export const taskService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/tasks`, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return await response.json();
    },
    create: async (task) => {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to create task');
        return await response.json();
    },
    update: async (id, task) => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Failed to update task');
        return await response.json();
    },
    delete: async (id) => {
        const response = await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete task');
    }
};
