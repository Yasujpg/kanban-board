import TaskCard from "./TaskCard";

import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";

function Column({ title, status, tasks, openAddTask, deleteTask, openTask }) {

  const { setNodeRef } = useDroppable({
    id: status
  });

  const columnTasks = tasks.filter(
    task => task.status === status
  );

  return (

    <div ref={setNodeRef} className="column">

      <div className="column-header">

        <div className="column-title">
          {title}

          <span className="task-count">
            {columnTasks.length}
          </span>

        </div>

      </div>

      <button
        className="add-task"
        onClick={()=>openAddTask(status)}
      >
        + Add Task
      </button>

      <SortableContext
        items={columnTasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >

        {columnTasks.map(task => (

          <TaskCard
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            openTask={openTask}
          />

        ))}

      </SortableContext>

    </div>

  );
}

export default Column;