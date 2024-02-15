import React from "react";
import "./ModalStyles.css";
const Modal = ({ showModal, toggleModal, children }: { showModal: boolean, toggleModal: () => void, children: React.ReactNode }) => {
  return (
   showModal && 
   ( <div className="fixed inset-0 z-40 overflow-y-auto h-50%">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50"></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="modal-content z-50 bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="p-6 text-justify">
            <span
            className="close absolute top-0 right-0 m-4 text-2xl cursor-pointer"
            onClick={toggleModal}
            >
            ×
            </span>
          {children}
          </div>
        </div>
      </div>
    </div>)
  
  );
}

export default Modal;
