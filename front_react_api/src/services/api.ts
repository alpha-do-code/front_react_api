import axios from 'axios';

export interface Task {
  _id: string;
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  user: {
    _id: string;
    username: string;
  };
}

const BASE_URL = "http://localhost:3000/api";

const api = {
  // Public endpoints 
  list(): Promise<Task[]> {
    return axios.get(`${BASE_URL}/tasks/public`)
      .then(response => response.data);
  },

  add(task: Omit<Task, "_id" | "id" | "completed" | "createdAt" | "user">): Promise<Task> {
    return axios.post(`${BASE_URL}/tasks/public`, task)
      .then(response => response.data);
  },

  remove(id: string): Promise<void> {
    return axios.delete(`${BASE_URL}/tasks/public/${id}`);
  },

  toggle(id: string): Promise<Task> {
    return axios.get(`${BASE_URL}/tasks/public/${id}`)
      .then(response => {
        const task = response.data;
        const updatedTask = { ...task, completed: !task.completed };
        return axios.patch(`${BASE_URL}/tasks/public/${id}`, { completed: updatedTask.completed })
          .then(response => response.data);
      });
  },

  update(id: string, changes: Partial<Omit<Task, "_id" | "id" | "createdAt" | "user">>): Promise<Task> {
    return axios.patch(`${BASE_URL}/tasks/public/${id}`, changes)
      .then(response => response.data);
  },

  // Authenticated endpoints
  listAuthenticated(token: string): Promise<Task[]> {
    return axios.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.data);
  },

  addAuthenticated(task: Omit<Task, "_id" | "id" | "completed" | "createdAt" | "user">, token: string): Promise<Task> {
    return axios.post(`${BASE_URL}/tasks`, task, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.data);
  },

  removeAuthenticated(id: string, token: string): Promise<void> {
    return axios.delete(`${BASE_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  toggleAuthenticated(id: string, token: string): Promise<Task> {
    return axios.get(`${BASE_URL}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const task = response.data;
        const updatedTask = { ...task, completed: !task.completed };
        return axios.put(`${BASE_URL}/tasks/${id}`, { completed: updatedTask.completed }, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(response => response.data);
      });
  },

  updateAuthenticated(id: string, changes: Partial<Omit<Task, "_id" | "id" | "createdAt" | "user">>, token: string): Promise<Task> {
    return axios.put(`${BASE_URL}/tasks/${id}`, changes, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => response.data);
  },
};

export default api;
