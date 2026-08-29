document.addEventListener("DOMContentLoaded", () => {

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Render tasks to the page
  function renderTasks() {
    const uncompletedList = document.getElementById("uncompleted-list");
    const completedList = document.getElementById("completed-list");

    uncompletedList.innerHTML = "";
    completedList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.classList.add(task.completed ? "completed" : "uncompleted");

      // Checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      // Expand arrow
      const arrow = document.createElement("span");
      arrow.className = "task-arrow";
      arrow.textContent = task.expanded ? "▾" : "▸";

      arrow.addEventListener("click", () => {
        task.expanded = !task.expanded;
        saveTasks();
        renderTasks();
      });

      // Title
      const title = document.createElement("span");
      title.textContent = task.title;
      title.className = "task-title";

      if (task.completed) {
        title.style.textDecoration = "line-through";
        title.style.color = "#2e1c01";
      }

      // Description box
      const desc = document.createElement("textarea");
      desc.className = "task-desc";
      desc.value = task.description || "";
      desc.placeholder = "Notes";
      desc.style.display = task.expanded ? "block" : "none";

      desc.addEventListener("input", () => {
        task.description = desc.value;
        saveTasks();
      });

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-btn";

      deleteBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      });

      // Top row
      const topRow = document.createElement("div");
      topRow.className = "task-top";
      topRow.appendChild(checkbox);
      topRow.appendChild(arrow);
      topRow.appendChild(title);
      topRow.appendChild(deleteBtn);

      // Build task item
      li.appendChild(topRow);
      li.appendChild(desc);

      // Sort into correct list
      if (task.completed) {
        completedList.appendChild(li);
      } else {
        uncompletedList.appendChild(li);
      }
    });
  }

  // --- iOS-style modal logic ---
const modal = document.getElementById("confirm-modal");
const modalMessage = document.getElementById("modal-message");
const modalCancel = document.getElementById("modal-cancel");
const modalConfirm = document.getElementById("modal-confirm");

let modalAction = null;

function showModal(message, action) {
  modalMessage.textContent = message;
  modal.style.display = "flex";
  modalAction = action;
}

modalCancel.addEventListener("click", () => {
  modal.style.display = "none";
  modalAction = null;
});

modalConfirm.addEventListener("click", () => {
  modal.style.display = "none";
  if (modalAction) modalAction();
  modalAction = null;
});

  // Add new task
  const addBtn = document.getElementById("add-btn");
  const taskInput = document.getElementById("task-input");

  addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text === "") return;

    tasks.push({
      title: text,
      description: "",
      completed: false,
      expanded: false
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
  });

  // Clear ONLY uncompleted tasks
  const clearUncompletedBtn = document.getElementById("clear-uncompleted-btn");
  clearUncompletedBtn.addEventListener("click", () => {
    showModal("Delete ALL uncompleted tasks?", () => {
      tasks = tasks.filter(task => task.completed === true);
      saveTasks();
      renderTasks();
    });
  });  

  // Clear ONLY completed tasks
  const clearCompletedBtn = document.getElementById("clear-completed-btn");
  clearCompletedBtn.addEventListener("click", () => {
    showModal("Clear ALL completed tasks?", () => {
      tasks = tasks.filter(task => task.completed === false);
      saveTasks();
      renderTasks();
    });
  });
  

  // Initial render
  renderTasks();

});
