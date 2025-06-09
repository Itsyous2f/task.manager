document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const descInput = document.getElementById("task-description");
  const dateInput = document.getElementById("task-date");
  const prioritySelect = document.getElementById("priority-select");
  const taskList = document.getElementById("task-list");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

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
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      </div>
    `;

    const checkbox = li.querySelector(".task-checkbox");
    const progressBarInner = li.querySelector(".progress-bar-inner");
    const progressPercent = li.querySelector(".task-progress-percent");
    const statusSpan = li.querySelector(".task-status");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");
    const titleSpan = li.querySelector(".task-title");
    const descP = li.querySelector(".task-description");
    const dateSpan = li.querySelector(".task-date");
    const prioritySpan = li.querySelector(".task-priority");

    // Progress update on checkbox click
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
      if (task.progress === 100) checkbox.checked = true;
    });

    // Delete task
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    // Edit task
    let isEditing = false;
    editBtn.addEventListener("click", () => {
      if (!isEditing) {
        // Enter edit mode - swap spans/p/labels with inputs/select
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.value = task.title;
        titleInput.classList.add("edit-title");

        const descInputEl = document.createElement("input");
        descInputEl.type = "text";
        descInputEl.value = task.description;
        descInputEl.classList.add("edit-desc");

        const dateInputEl = document.createElement("input");
        dateInputEl.type = "date";
        dateInputEl.value = task.date;
        dateInputEl.classList.add("edit-date");

        const prioritySelectEl = document.createElement("select");
        ["High", "Medium", "Low"].forEach((p) => {
          const opt = document.createElement("option");
          opt.value = p;
          opt.textContent = p;
          if (p === task.priority) opt.selected = true;
          prioritySelectEl.appendChild(opt);
        });
        prioritySelectEl.classList.add("edit-priority");

        titleSpan.replaceWith(titleInput);
        descP.replaceWith(descInputEl);
        dateSpan.replaceWith(dateInputEl);
        prioritySpan.replaceWith(prioritySelectEl);

        editBtn.textContent = "Save";
        isEditing = true;
      } else {
        // Save edits back to task object
        const titleInput = li.querySelector(".edit-title");
        const descInputEl = li.querySelector(".edit-desc");
        const dateInputEl = li.querySelector(".edit-date");
        const prioritySelectEl = li.querySelector(".edit-priority");

        task.title = titleInput.value.trim() || task.title;
        task.description = descInputEl.value.trim() || task.description;
        task.date = dateInputEl.value || task.date;
        task.priority = prioritySelectEl.value || task.priority;

        // Recreate static elements
        const newTitleSpan = document.createElement("span");
        newTitleSpan.classList.add("task-title");
        newTitleSpan.textContent = task.title;

        const newDescP = document.createElement("p");
        newDescP.classList.add("task-description");
        newDescP.textContent = task.description;

        const newDateSpan = document.createElement("span");
        newDateSpan.classList.add("task-date");
        newDateSpan.textContent = "Due: " + task.date;

        const newPrioritySpan = document.createElement("span");
        newPrioritySpan.classList.add("task-priority");
        newPrioritySpan.textContent = task.priority;

        titleInput.replaceWith(newTitleSpan);
        descInputEl.replaceWith(newDescP);
        dateInputEl.replaceWith(newDateSpan);
        prioritySelectEl.replaceWith(newPrioritySpan);

        editBtn.textContent = "Edit";
        isEditing = false;

        saveTasks();
      }
    });

    return li;
  }

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, i) => {
      taskList.appendChild(createTaskElement(task, i));
    });
  }

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

  renderTasks();
});
