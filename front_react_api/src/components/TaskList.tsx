import type { Task } from "../services/api";
import TaskItem from "./TaskItem";

type Props = {
  tasks: Task[];
  setFilter: (filter: "all" | "active" | "completed") => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (task: Task) => void;
};

export default function TaskList({
  tasks,
  setFilter,
  toggleComplete,
  deleteTask,
  editTask,
}: Props) {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter("all")} className="bg-blue-500 text-white px-4 rounded">Toutes</button>
        <button onClick={() => setFilter("active")} className="bg-green-500 text-white px-4 rounded">Actives</button>
        <button onClick={() => setFilter("completed")} className="bg-red-500 text-white px-4 rounded">Complétées</button>
      </div>

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      ))}
    </div>
  );
}
