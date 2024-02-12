import React from "react";

const VersePopup = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default VersePopup;
