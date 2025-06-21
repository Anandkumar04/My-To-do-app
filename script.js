const inputField = document.getElementById("inputfield");
const addButton = document.getElementById("addtask");
const taskList = document.getElementById("tasklist");
const toggleTheme = document.getElementById("toggleTheme");
const filters = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add Enter key support
inputField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") addButton.click();
});

addButton.addEventListener("click", () => {
  const input = inputField.value.trim();
  if (!input) return;

  const task = {
    id: Date.now(),
    text: input,
    done: false,
    time: new Date().toLocaleString()
  };

  tasks.push(task);
  saveAndRender();
  inputField.value = "";
  inputField.focus();
});

function saveAndRender(filter = "all") {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks(filter);
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task =>
    filter === "done" ? task.done :
    filter === "pending" ? !task.done : true
  );

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.done) li.classList.add("done");

    const span = document.createElement("span");
    span.innerText = task.text;

    const timestamp = document.createElement("div");
    timestamp.innerText = `🕒 ${task.time}`;
    timestamp.className = "timestamp";

    const btnGroup = document.createElement("div");
    btnGroup.className = "task-buttons";

    // Done
    const doneBtn = document.createElement("button");
    doneBtn.className = "btn";
    doneBtn.innerText = "✔️";
    doneBtn.addEventListener("click", () => {
      task.done = !task.done;
      saveAndRender(filter);
    });

    // Edit
    const editBtn = document.createElement("button");
    editBtn.className = "btn";
    editBtn.innerText = "✏️";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit Task:", task.text);
      if (newText) {
        task.text = newText;
        saveAndRender(filter);
      }
    });

    // Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn";
    deleteBtn.innerText = "🗑️";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveAndRender(filter);
    });

    btnGroup.append(doneBtn, editBtn, deleteBtn);
    li.append(span, timestamp, btnGroup);
    taskList.appendChild(li);
  });
}

// Theme toggle
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Filter buttons
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    const type = btn.dataset.filter;
    renderTasks(type);
  });
});

// Initial load
renderTasks();
