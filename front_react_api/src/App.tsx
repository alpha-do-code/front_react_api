import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import { CheckSquare } from "lucide-react";
import TaskList from "./components/TaskList";
import SearchBar from "./components/SearchBar";
import API from "./services/api";
import type { Task } from "./services/api";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await API.list();
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
      const newTask = await API.add({ ...task, priority: task.priority || 'medium' });
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Erreur lors de l\'ajout de la tâche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await API.remove(id);
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
      const updated = await API.toggle(id);
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
      const newTitle = prompt("Modifier le titre :", task.title);
      if (!newTitle) return;

      const newDescription = prompt("Modifier la description :", task.description || "") || undefined;
      const newPriority = prompt("Modifier la priorité (low/medium/high) :", task.priority) as 'low' | 'medium' | 'high';
      const newDueDateInput = prompt("Modifier la date d'échéance (AAAA-MM-JJ) :", task.dueDate || "");
      const newDueDate = newDueDateInput === null ? undefined : (newDueDateInput === "" ? undefined : newDueDateInput as string);

      const updates: Partial<Task> = {};
      if (newTitle !== task.title) updates.title = newTitle;
      if (newDescription !== task.description) updates.description = newDescription;
      if (newPriority && newPriority !== task.priority && ['low', 'medium', 'high'].includes(newPriority)) {
        updates.priority = newPriority;
      }
      if (newDueDate !== task.dueDate) updates.dueDate = newDueDate;

      if (Object.keys(updates).length === 0) return;

      const updated = await API.update(task._id, updates);
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
      filter === "active"
        ? !t.completed
        : filter === "completed"
        ? t.completed
        : true
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <header className="bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg bg-cyan-500 mb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold ">Gestionnaire de Tâches</h1>
          </div>
          <p className="text-primary-foreground/90 text-sm md:text-base">
            Organisez votre travail et suivez vos progrès
          </p>
        </div>
      </header>

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
    </div>
  );
}
