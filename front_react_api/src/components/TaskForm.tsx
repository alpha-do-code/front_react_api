import { useState } from "react";

type Props = {
  addTask: (task: { title: string; description?: string; priority?: 'low' | 'medium' | 'high'; dueDate?: string }) => void;
};

export default function TaskForm({ addTask }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({ title, description, priority, dueDate: dueDate || undefined });
    setTitle("");
    setDescription("");
    setPriority('medium');
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Ajouter une nouvelle tâche..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Ajouter une nouvelle description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <select
          className="border p-2 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
        >
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Élevée</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4 rounded">Ajouter</button>
      </div>
    </form>
  );
}
