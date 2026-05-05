import React, { useState, useEffect } from "react";
import styles from "./TaskModal.module.css";

function TaskModal({ isOpen, task, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority || "medium");
      setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (title.trim() === "") {
      alert("Task title cannot be empty");
      return;
    }

    const updatedData = {
      title: title.trim(),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    onSave(updatedData);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
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

  const getPriorityEmoji = (p) => {
    switch (p) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "";
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Edit Task</h2>

        {/* Title Input */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Task Title</label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter task title"
            autoFocus
          />
        </div>

        {/* Priority Selection */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Priority</label>
          <div className={styles.priorityOptions}>
            {["low", "medium", "high"].map((p) => (
              <button
                key={p}
                className={`${styles.priorityButton} ${
                  priority === p ? styles.activePriority : ""
                }`}
                onClick={() => setPriority(p)}
                title={p.charAt(0).toUpperCase() + p.slice(1)}
              >
                {getPriorityEmoji(p)} {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date Input */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Due Date</label>
          <input
            type="date"
            className={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Changes
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
