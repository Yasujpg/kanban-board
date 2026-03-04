import { useState, useEffect } from "react";
import Column from "./Column";
import TaskDetails from "./TaskDetails";
import { initialTasks } from "../../data/tasks";
import Modal from "../ui/Modal";

import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";

function Board({ search }) {

  const [tasks,setTasks]=useState(()=>{
    const saved=localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [selectedTask,setSelectedTask]=useState(null);
  const [activeTask,setActiveTask]=useState(null);

  const [addModal,setAddModal]=useState(false);
  const [addColumn,setAddColumn]=useState(null);

  const [title,setTitle]=useState("");
  const [priority,setPriority]=useState("low");
  const [label,setLabel]=useState("");
  const [dueDate,setDueDate]=useState("");

  const [filterPriority,setFilterPriority]=useState("all");

  const sensors=useSensors(
    useSensor(PointerSensor,{
      activationConstraint:{distance:8}
    })
  );

  const columns=[
    {title:"To Do",status:"todo"},
    {title:"In Progress",status:"inProgress"},
    {title:"Completed",status:"done"}
  ];

  const filteredTasks = tasks
.filter(task => {

  const text = search.toLowerCase();

  const titleMatch =
  task.title?.toLowerCase().includes(text);

  const descriptionMatch =
  task.description?.toLowerCase().includes(text);

  const labelMatch =
  task.label?.toLowerCase().includes(text);

  return titleMatch || descriptionMatch || labelMatch;

})
.filter(task =>
  filterPriority === "all" || task.priority === filterPriority
);

  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
  },[tasks]);

  function openAddTask(status){
    setAddColumn(status);
    setAddModal(true);
  }

  function createTask(e){

    e.preventDefault();

    if(!title.trim()) return;

    const avatar=`https://i.pravatar.cc/40?img=${Math.floor(Math.random()*70)}`;

    const newTask={
      id:Date.now(),
      title,
      status:addColumn,
      priority,
      label,
      dueDate,
      users:[avatar],
      comments:[],
      description:""
    };

    setTasks(prev=>[...prev,newTask]);

    setTitle("");
    setPriority("low");
    setLabel("");
    setDueDate("");
    setAddModal(false);

  }

  function deleteTask(id){
    setTasks(prev=>prev.filter(t=>t.id!==id));
  }

  function openTask(task){
    setSelectedTask(task);
  }

  function updateTask(id,data){
    setTasks(prev =>
      prev.map(task =>
        task.id===id ? {...task,...data} : task
      )
    );
  }

  function handleDragStart(event){

    const task=tasks.find(t=>t.id===event.active.id);

    if(task){
      setActiveTask(task);
    }

  }

  function handleDragEnd(event){

    const {active,over}=event;

    if(!over){
      setActiveTask(null);
      return;
    }

    const activeId=active.id;
    const overId=over.id;

    const activeTask=tasks.find(t=>t.id===activeId);

    if(!activeTask){
      setActiveTask(null);
      return;
    }

    const columnIds=["todo","inProgress","done"];

    let newStatus=activeTask.status;

    if(columnIds.includes(overId)){
      newStatus=overId;
    }else{

      const overTask=tasks.find(t=>t.id===overId);

      if(overTask){
        newStatus=overTask.status;
      }

    }

    setTasks(prev =>
      prev.map(task =>
        task.id===activeId
          ? {...task,status:newStatus}
          : task
      )
    );

    setActiveTask(null);

  }

  return(

    <>

      <div className="board-toolbar">

        <select
        value={filterPriority}
        onChange={(e)=>setFilterPriority(e.target.value)}
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

      </div>

      <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      >

        <div className="board">

          {columns.map(col => (

            <Column
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={filteredTasks}
            openAddTask={openAddTask}
            deleteTask={deleteTask}
            openTask={openTask}
            />

          ))}

        </div>

        <DragOverlay dropAnimation={null}>

          {activeTask && (

            <div className="drag-preview">

              <div className="task-header">

                <div className="task-left">

                  <div className={`priority-dot priority-${activeTask.priority}`}></div>

                  <span className="badge">
                    {activeTask.priority}
                  </span>

                </div>

              </div>

              <p className="task-title">
                {activeTask.title}
              </p>

            </div>

          )}

        </DragOverlay>

      </DndContext>

      <Modal
      isOpen={addModal}
      onClose={()=>setAddModal(false)}
      >

        <h3>Create Task</h3>

        <form onSubmit={createTask}>

          <input
          type="text"
          placeholder="Task title..."
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          />

          <select
          value={priority}
          onChange={(e)=>setPriority(e.target.value)}
          >
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>

          <input
          type="text"
          placeholder="Label (design, bug, feature)"
          value={label}
          onChange={(e)=>setLabel(e.target.value)}
          />

          <input
          type="date"
          value={dueDate}
          onChange={(e)=>setDueDate(e.target.value)}
          />

          <div className="modal-actions">

            <button
            type="button"
            className="modal-btn modal-cancel"
            onClick={()=>setAddModal(false)}
            >
              Cancel
            </button>

            <button
            type="submit"
            className="modal-btn modal-create"
            >
              Create Task
            </button>

          </div>

        </form>

      </Modal>

      {selectedTask && (

        <TaskDetails
        task={selectedTask}
        close={()=>setSelectedTask(null)}
        updateTask={updateTask}
        />

      )}

    </>
  );
}

export default Board;