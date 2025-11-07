import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, CheckSquare } from 'lucide-react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import API from '../services/api';
import type { Task } from '../services/api';

const Dashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [token]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await API.listAuthenticated(token!);
      setTasks(data);
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: { title: string; description?: string; priority?: 'low' | 'medium' | 'high'; dueDate?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await API.addAuthenticated({ ...task, priority: task.priority || 'medium' }, token!);
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Erreur lors de l\'ajout de la tâche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await API.removeAuthenticated(id, token!);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la tâche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await API.toggleAuthenticated(id, token!);
      if (!updated) return;
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (task: Task) => {
    setLoading(true);
    setError(null);
    try {
      const newTitle = prompt('Modifier le titre :', task.title);
      if (!newTitle) return;

      const newDescription = prompt('Modifier la description :', task.description || '') || undefined;
      const newPriority = prompt('Modifier la priorité (low/medium/high) :', task.priority) as 'low' | 'medium' | 'high';
      const newDueDateInput = prompt('Modifier la date d\'échéance (AAAA-MM-JJ) :', task.dueDate || '');
      const newDueDate = newDueDateInput === null ? undefined : (newDueDateInput === '' ? undefined : newDueDateInput as string);

      const updates: Partial<Task> = {};
      if (newTitle !== task.title) updates.title = newTitle;
      if (newDescription !== task.description) updates.description = newDescription;
      if (newPriority && newPriority !== task.priority && ['low', 'medium', 'high'].includes(newPriority)) {
        updates.priority = newPriority;
      }
      if (newDueDate !== task.dueDate) updates.dueDate = newDueDate;

      if (Object.keys(updates).length === 0) return;

      const updated = await API.updateAuthenticated(task._id, updates, token!);
      if (!updated) return;

      setTasks(tasks.map((t) => (t._id === task._id ? updated : t)));
    } catch (err) {
      setError('Erreur lors de la modification de la tâche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) =>
      filter === 'active'
        ? !t.completed
        : filter === 'completed'
        ? t.completed
        : true
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg bg-cyan-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-8 w-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Tableau de Bord</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Bienvenue, {user?.username}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 rounded-md hover:bg-white/30 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading && <div className="text-center py-4">Chargement...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <TaskForm addTask={addTask} />
        <SearchBar search={search} setSearch={setSearch} />

        <TaskList
          tasks={filteredTasks}
          setFilter={setFilter}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      </main>
    </div>
  );
};

export default Dashboard;
