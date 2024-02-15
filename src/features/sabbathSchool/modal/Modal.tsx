// ModalComponent.tsx

import React from "react";
import './ModalStyles.css'
const Modal = ({ showModal, toggleModal, children }: { showModal: boolean, toggleModal: () => void, children: React.ReactNode }) => {
    return (
        showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleModal}>
                ×
              </span>
              {children}
            </div>
          </div>
        )
      );
        }

export default Modal;

