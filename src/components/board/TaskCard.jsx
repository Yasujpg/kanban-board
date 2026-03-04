import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";

function TaskCard({ task, deleteTask, openTask }) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const priorityIcon = {
    high: "🔴",
    medium: "🟡",
    low: "🔵"
  };

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
      onClick={()=>openTask(task)}
    >

      <div className="task-header">

        <div className="task-left">

          <span className="priority-icon">
            {priorityIcon[task.priority] || "🔵"}
          </span>

          <span className="badge">
            {task.priority}
          </span>

          {task.label && (
            <span className="badge">
              {task.label}
            </span>
          )}

        </div>

        <Trash2
          size={16}
          className="delete-icon"
          onClick={(e)=>{
            e.stopPropagation();
            deleteTask(task.id);
          }}
        />

      </div>

      <p className="task-title">
        {task.title}
      </p>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      <div className="task-footer">

        {task.dueDate && (
          <span className="due-date">
            📅 {task.dueDate}
          </span>
        )}

        <div className="task-users">

          {task.users?.map((u,i)=>(
            <img key={i} src={u} alt="user" />
          ))}

        </div>

      </div>

    </div>

  );
}

export default TaskCard;