import type { Task } from "../services/api";

type Props = {
  task: Task;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (task: Task) => void;
};

export default function TaskItem({ task, toggleComplete, deleteTask, editTask }: Props) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="border p-4 rounded-lg mb-3 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task._id)}
            className="mt-1"
          />
          <div className="flex-1">
            <h3 className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                Priorité: {task.priority === 'high' ? 'Élevée' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}
              </span>
              {task.dueDate && (
                <span>Échéance: {new Date(task.dueDate).toLocaleDateString('fr-FR')}</span>
              )}
              <span>Créé: {new Date(task.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => editTask(task)}
            className="text-blue-500 hover:text-blue-700 p-1"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={() => deleteTask(task._id)}
            className="text-red-500 hover:text-red-700 p-1"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
