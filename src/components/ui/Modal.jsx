import { X } from "lucide-react";

function Modal({ isOpen, onClose, children, className = "" }) {

  if (!isOpen) return null;

  return (

    <div className="modal-overlay">

      <div className={`modal-container ${className}`}>

        <button
          className="modal-close"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {children}

      </div>

    </div>

  );
}

export default Modal;