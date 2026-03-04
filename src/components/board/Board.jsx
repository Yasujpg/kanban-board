import { useState, useEffect } from "react";
import Column from "./Column";
import TaskDetails from "./TaskDetails";
import TaskCard from "./TaskCard";
import Modal from "../ui/Modal";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";

function Board({ search }) {

  const [tasks,setTasks] = useState(()=>{
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTask,setSelectedTask] = useState(null);
  const [activeTask,setActiveTask] = useState(null);

  const [addModal,setAddModal] = useState(false);
  const [addColumn,setAddColumn] = useState(null);
  const [title,setTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor,{
      activationConstraint:{ distance:8 }
    })
  );

  const columns = [
    {title:"To Do",status:"todo"},
    {title:"In Progress",status:"inProgress"},
    {title:"Completed",status:"done"}
  ];

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(()=>{
    localStorage.setItem("tasks",JSON.stringify(tasks));
  },[tasks]);

  useEffect(()=>{

    const firstVisit = localStorage.getItem("kanban-intro");

    if(!firstVisit){

      const introTask = {
        id: Date.now(),
        title: "WELCOME",
        status: "todo",
        priority: "medium",
        description: `This is my Kanban Board built with React.

Features included:

• Drag & Drop tasks between columns
• Dark Mode toggle
• Task priorities (Low / Medium / High)
• Add comments to tasks
• Upload your own profile avatar
• Responsive design for mobile and desktop

Feel free to create your own tasks and start organizing your workflow.`,
        images: [],
        comments: []
      };

      setTasks([introTask]);

      localStorage.setItem("kanban-intro",true);
    }

  },[]);


  function openAddTask(status){
    setAddColumn(status);
    setAddModal(true);
  }


  function createTask(e){

    e.preventDefault();

    if(!title.trim()) return;

    const newTask={
      id:Date.now(),
      title,
      status:addColumn,
      priority:"low",
      description:"",
      images:[],
      comments:[]
    };

    setTasks(prev=>[...prev,newTask]);

    setTitle("");
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

    const { active } = event;

    const task = tasks.find(t => t.id === active.id);

    if(task){
      setActiveTask(task);
    }

  }


  function handleDragEnd(event){

    const { active, over } = event;

    setActiveTask(null);

    if(!over) return;

    const activeId = active.id;
    const overId = over.id;

    const columnIds = ["todo","inProgress","done"];

    let newStatus = null;

    if(columnIds.includes(overId)){
      newStatus = overId;
    } else {

      const overTask = tasks.find(t => t.id === overId);

      if(overTask){
        newStatus = overTask.status;
      }

    }

    if(!newStatus) return;

    setTasks(prev =>
      prev.map(task =>
        task.id === activeId
          ? { ...task, status: newStatus }
          : task
      )
    );
  }


  return(

    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >

        <div className="board">

          {columns.map(col=>(

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

        <DragOverlay>

          {activeTask ? (

            <TaskCard
              task={activeTask}
              deleteTask={()=>{}}
              openTask={()=>{}}
            />

          ) : null}

        </DragOverlay>

      </DndContext>


      <Modal isOpen={addModal} onClose={()=>setAddModal(false)}>

        <h3>Create Task</h3>
        <p>Add a new task to this column</p>

        <form onSubmit={createTask}>

          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
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
              Create
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