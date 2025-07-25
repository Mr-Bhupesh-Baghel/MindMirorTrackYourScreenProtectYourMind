const sections = { 
  "🛠️ Start Work": [
    "🔹Do any work for at least 10 minutes"
  ]
};

const today = new Date().toISOString().split('T')[0];
const storageKey = `daily-tasks-${today}`;
let allTasks = [];
let completed = new Set();

function loadTasks() {
  document.getElementById("taskContainer").innerHTML = '';
  allTasks = [];

  // Load default sections
  for (let [section, tasks] of Object.entries(sections)) {
    const box = document.createElement("div");
    box.className = "task-group";
    box.innerHTML = `<h2>${section}</h2>`;
    tasks.forEach((task, index) => {
      const id = `${section}-${index}`;
      allTasks.push(id);
      box.innerHTML += `
        <label class="task-item">
          <span>${task}</span>
          <input type="checkbox" id="${id}" onchange="updateProgress()">
        </label>
      `;
    });
    document.getElementById("taskContainer").appendChild(box);
  }

  // Load persistent custom tasks
  const custom = JSON.parse(localStorage.getItem("customTasks") || "[]");
  if (custom.length) {
    const customBox = document.createElement("div");
    customBox.className = "task-group";
    customBox.innerHTML = `<h2>📝 Custom Tasks</h2>`;
    custom.forEach((task, index) => {
      const id = `custom-${index}`;
      allTasks.push(id);
      customBox.innerHTML += `
        <label class="task-item">
          <span>${task}</span>
          <input type="checkbox" id="${id}" onchange="updateProgress()">
          <button onclick="removeCustomTask(${index})">❌</button>
        </label>
      `;
    });
    document.getElementById("taskContainer").appendChild(customBox);
  }
}

function updateProgress() {
  let done = 0;
  allTasks.forEach(id => {
    const box = document.getElementById(id);
    if (box?.checked) done++;
  });
  const percent = Math.round((done / allTasks.length) * 100);
  const bar = document.getElementById("progress");
  bar.style.width = percent + "%";
  bar.textContent = percent + "%";
  saveStatus();
}

function saveStatus() {
  const status = {};
  allTasks.forEach(id => {
    const box = document.getElementById(id);
    status[id] = box?.checked || false;
  });
  localStorage.setItem(storageKey, JSON.stringify(status));
}

function loadStatus() {
  const data = JSON.parse(localStorage.getItem(storageKey) || "{}");
  for (let id in data) {
    const box = document.getElementById(id);
    if (box) box.checked = data[id];
  }
  updateProgress();
}

function addCustomTask() {
  const input = document.getElementById("customTaskInput");
  const task = input.value.trim();
  if (!task) return;
  const list = JSON.parse(localStorage.getItem("customTasks") || "[]");
  list.push(task);
  localStorage.setItem("customTasks", JSON.stringify(list));
  input.value = '';
  loadTasks();
  loadStatus();
}

function removeCustomTask(index) {
  const list = JSON.parse(localStorage.getItem("customTasks") || "[]");
  list.splice(index, 1);
  localStorage.setItem("customTasks", JSON.stringify(list));
  loadTasks();
  loadStatus();
}

function viewPrevious() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("daily-tasks-"));
  const log = keys.map(k => {
    const date = k.split("daily-tasks-")[1];
    const data = JSON.parse(localStorage.getItem(k));
    const completed = Object.values(data).filter(x => x).length;
    const total = Object.keys(data).length;
    const percent = Math.round((completed / total) * 100);
    return `${date} – ${percent}% completed`;
  }).join("\n");
  alert("📅 Previous Progress:\n\n" + log);
}

function autoReset() {
  const lastDate = localStorage.getItem("lastOpenedDate");
  if (lastDate !== today) {
    localStorage.setItem("lastOpenedDate", today);
    // ⚠️ No clearing of customTasks here anymore
    localStorage.removeItem(storageKey); // clear only task completion for the day
  }
}

// Initialize
autoReset();
loadTasks();
loadStatus();
