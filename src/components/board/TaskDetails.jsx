import { useState } from "react";
import Modal from "../ui/Modal";

function TaskDetails({ task, close, updateTask }) {

  const [title,setTitle] = useState(task.title);
  const [description,setDescription] = useState(task.description || "");
  const [comment,setComment] = useState("");
  const [comments,setComments] = useState(task.comments || []);

  function saveChanges(){

    updateTask(task.id,{
      title,
      description,
      comments
    });

    close();
  }

  function addComment(){

    if(!comment.trim()) return;

    const newComment={
      text:comment,
      date:new Date().toLocaleString()
    };

    const updated=[...comments,newComment];

    setComments(updated);
    setComment("");

    updateTask(task.id,{
      comments:updated
    });
  }

  return(

    <Modal
      isOpen={true}
      onClose={close}
      className="modal-large"
    >

      <div className="task-details">

        <div className="task-details-left">

          <input
            className="task-title-input"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />

          <div className="task-section">

            <h4>Description</h4>

            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder="Add description..."
            />

          </div>

        </div>

        <div className="task-details-right">

          <h4>Comments</h4>

          <input
            className="comment-input"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e)=>setComment(e.target.value)}
          />

          <button
            className="comment-button"
            onClick={addComment}
          >
            Add comment
          </button>

          <div className="task-comments">

            {comments.map((c,i)=>(

              <div
                key={i}
                className="comment"
              >

                {c.text}

                <br/>

                <span>
                  {c.date}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      <div className="modal-actions">

        <button
          className="modal-btn modal-cancel"
          onClick={close}
        >
          Cancel
        </button>

        <button
          className="modal-btn modal-create"
          onClick={saveChanges}
        >
          Save changes
        </button>

      </div>

    </Modal>

  );
}

export default TaskDetails;