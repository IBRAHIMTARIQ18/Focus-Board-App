import React, { useState, useEffect } from "react";
import TaskModal from "./TaskModal";
import styles from "./Todo.module.css";

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // all, completed, pending
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
      completed: false,
      priority: "medium",
      dueDate: null,
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Toggle task completion
  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
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
  const updateTask = (updatedData) => {
    if (!editingTask) return;

    setTasks(
      tasks.map((task) =>
        task.id === editingTask.id ? { ...task, ...updatedData } : task,
      ),
    );
    closeEditModal();
  };

  // Filter and search tasks
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Status filter
    if (statusFilter === "completed") {
      filtered = filtered.filter((task) => task.completed);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((task) => !task.completed);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  };

  const filteredTasks = getFilteredTasks();

  // Handle Enter key press in input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff4444";
      case "medium":
        return "#ffaa00";
      case "low":
        return "#44aa44";
      default:
        return "#00d4ff";
    }
  };

  // Get priority emoji
  const getPriorityEmoji = (priority) => {
    switch (priority) {
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
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Focus Board</h1>

        {/* Stats Section */}
        {tasks.length > 0 && (
          <div className={styles.statsSection}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.total}</div>
              <div className={styles.statLabel}>Total Tasks</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.completed}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.pending}</div>
              <div className={styles.statLabel}>Pending</div>
            </div>
          </div>
        )}

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

        {/* Search Section */}
        <div className={styles.searchSection}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className={styles.filterSection}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Status:</span>
            <button
              className={`${styles.filterButton} ${
                statusFilter === "all" ? styles.active : ""
              }`}
              onClick={() => setStatusFilter("all")}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                statusFilter === "pending" ? styles.active : ""
              }`}
              onClick={() => setStatusFilter("pending")}
            >
              ⏳ Pending
            </button>
            <button
              className={`${styles.filterButton} ${
                statusFilter === "completed" ? styles.active : ""
              }`}
              onClick={() => setStatusFilter("completed")}
            >
              ✅ Completed
            </button>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Priority:</span>
            <button
              className={`${styles.filterButton} ${
                priorityFilter === "all" ? styles.active : ""
              }`}
              onClick={() => setPriorityFilter("all")}
            >
              All
            </button>
            <button
              className={`${styles.filterButton} ${
                priorityFilter === "high" ? styles.active : ""
              }`}
              onClick={() => setPriorityFilter("high")}
            >
              🔴 High
            </button>
            <button
              className={`${styles.filterButton} ${
                priorityFilter === "medium" ? styles.active : ""
              }`}
              onClick={() => setPriorityFilter("medium")}
            >
              🟡 Medium
            </button>
            <button
              className={`${styles.filterButton} ${
                priorityFilter === "low" ? styles.active : ""
              }`}
              onClick={() => setPriorityFilter("low")}
            >
              🟢 Low
            </button>
          </div>
        </div>

        {/* Task List Section */}
        <div className={styles.taskListContainer}>
          {filteredTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                {tasks.length === 0
                  ? "No tasks yet. Add one to get started! 🎯"
                  : "No tasks match your filters. 🔍"}
              </p>
            </div>
          ) : (
            <ul className={styles.taskList}>
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`${styles.taskItem} ${
                    task.completed ? styles.completed : ""
                  }`}
                >
                  <div className={styles.taskContent}>
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      title="Mark as complete"
                    />
                    <div className={styles.taskInfo}>
                      <span
                        className={`${styles.taskTitle} ${
                          task.completed ? styles.completedText : ""
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className={styles.taskMeta}>
                        <span
                          className={styles.priorityBadge}
                          title={`Priority: ${task.priority}`}
                        >
                          {getPriorityEmoji(task.priority)}
                        </span>
                        {task.dueDate && (
                          <span className={styles.dueDateBadge}>
                            📅 {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.actionButtons}>
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(task)}
                      title="Edit task"
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteTask(task.id)}
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
