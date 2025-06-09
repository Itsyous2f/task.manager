document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const descInput = document.getElementById("task-description");
    const dateInput = document.getElementById("task-date");
    const prioritySelect = document.getElementById("priority-select");
    const taskList = document.getElementById("task-list");

    // Load tasks from localStorage or empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Save tasks array to localStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Create DOM element for a task and attach listeners
    function createTaskElement(task, index) {
        const li = document.createElement("li");
        li.classList.add("task-item");
        li.dataset.index = index;

        li.innerHTML = `
      <div class="task-card">
        <div class="task-header">
          <label>
            <input type="checkbox" class="task-checkbox" ${task.progress === 100 ? "checked" : ""}>
            <span class="task-title">${task.title}</span>
          </label>
          <span class="task-priority">${task.priority}</span>
        </div>
        <p class="task-description">${task.description}</p>
        <div class="task-meta">
          <span class="task-date">Due: ${task.date}</span>
          <span class="task-status">${task.progress === 100 ? "Completed" : "Pending"}</span>
        </div>
        <div class="progress-section">
          <span>Progress</span>
          <span class="task-progress-percent">${task.progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-inner" style="width: ${task.progress}%" data-progress="${task.progress}"></div>
        </div>
        <div class="task-actions">
          <button class="edit-btn" disabled>Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;

        // Progress bar elements
        const checkbox = li.querySelector(".task-checkbox");
        const progressBarInner = li.querySelector(".progress-bar-inner");
        const progressPercent = li.querySelector(".task-progress-percent");
        const statusSpan = li.querySelector(".task-status");

        // Checkbox click increments progress by 10% max 100%
        checkbox.addEventListener("click", () => {
            if (task.progress < 100) {
                task.progress += 10;
                if (task.progress > 100) task.progress = 100;
                progressBarInner.style.width = task.progress + "%";
                progressBarInner.dataset.progress = task.progress;
                progressPercent.textContent = task.progress + "%";
                statusSpan.textContent = task.progress === 100 ? "Completed" : "Pending";
                saveTasks();
            }
            // Prevent unchecking after full progress
            if (task.progress === 100) checkbox.checked = true;
        });

        // Delete button removes task from DOM and array
        li.querySelector(".delete-btn").addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        return li;
    }

    // Clear and render all tasks from array
    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, i) => {
            taskList.appendChild(createTaskElement(task, i));
        });
    }

    // Add new task handler
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = taskInput.value.trim();
        const description = descInput.value.trim();
        const date = dateInput.value;
        const priority = prioritySelect.value;

        if (!title || !description || !date || !priority) return;

        tasks.push({
            title,
            description,
            date,
            priority,
            progress: 0,
        });

        saveTasks();
        renderTasks();

        taskForm.reset();
    });

    // Initial render
    renderTasks();
});
