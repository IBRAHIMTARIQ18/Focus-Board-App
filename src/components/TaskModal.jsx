import React, { useState, useEffect } from "react";
import styles from "./TaskModal.module.css";

function TaskModal({ isOpen, task, onSave, onClose }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (task) {
      setInputValue(task.title);
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (inputValue.trim() === "") {
      alert("Task title cannot be empty");
      return;
    }

    if (inputValue !== task.title) {
      onSave(inputValue.trim());
    } else {
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Edit Task</h2>
        <input
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
