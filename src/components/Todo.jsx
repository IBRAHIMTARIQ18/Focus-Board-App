import React, { useState, useEffect } from "react";
import TaskModal from "./TaskModal";
import styles from "./Todo.module.css";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("todoTasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const addTask = () => {
    if (inputValue.trim() === "") return;

    const newTask = {
      id: Date.now() + Math.random(),
      title: inputValue.trim(),
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Open edit modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Update task
  const updateTask = (newTitle) => {
    if (!editingTask) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id ? { ...task, title: newTitle } : task,
      ),
    );
    closeEditModal();
  };

  // Handle Enter key press in input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>My Tasks</h1>

        {/* Input Section */}
        <div className={styles.inputSection}>
          <input
            type="text"
            className={styles.input}
            placeholder="Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className={styles.addButton}
            onClick={addTask}
            disabled={inputValue.trim() === ""}
          >
            Add Task
          </button>
        </div>

        {/* Task List Section */}
        <div className={styles.taskListContainer}>
          {tasks.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tasks yet. Add one to get started! 🎯</p>
            </div>
          ) : (
            <ul className={styles.taskList}>
              {tasks.map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(task)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Task Counter */}
        {tasks.length > 0 && (
          <div className={styles.taskCounter}>
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          task={editingTask}
          onSave={updateTask}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}

export default Todo;
