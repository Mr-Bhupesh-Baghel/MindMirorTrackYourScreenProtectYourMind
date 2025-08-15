// 🔹 Default section define kar rahe hain jisme ek task diya gaya hai  
const sections = {
  "🛠️ Start ": [
    "🔹Do Any Work For At Least 10 Minutes",
    "🔹Breathe 🫁 Focus 👀 (What is necessary now) Attack"
  ]
};

let today = new Date().toISOString().split('T')[0];
let storageKey = `daily-tasks-${today}`;
let allTasks = [];

// ✅ Load tasks
function loadTasks() {
  const container = document.getElementById("taskContainer");
  container.innerHTML = '';
  allTasks = [];

  // Default tasks
  for (let [section, tasks] of Object.entries(sections)) {
    const box = document.createElement("div");
    box.className = "task-group";
    const heading = document.createElement("h2");
    heading.textContent = section;
    box.appendChild(heading);

    tasks.forEach((task, index) => {
      const id = `${section}-${index}`;
      allTasks.push(id);

      const label = document.createElement("label");
      label.className = "task-item";

      const span = document.createElement("span");
      span.textContent = task;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.onchange = updateProgress;

      label.appendChild(span);
      label.appendChild(checkbox);
      box.appendChild(label);
    });

    container.appendChild(box);
  }

  // Custom tasks
  const custom = JSON.parse(localStorage.getItem("customTasks") || "[]");

  if (custom.length) {
    const customBox = document.createElement("div");
    customBox.className = "task-group";
    const heading = document.createElement("h2");
    heading.textContent = "📝 Custom Tasks";
    customBox.appendChild(heading);

    custom.forEach((task, index) => {
      const id = `custom-${index}`;
      allTasks.push(id);

      const label = document.createElement("label");
      label.className = "task-item";

      const span = document.createElement("span");
      span.textContent = task;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.onchange = updateProgress;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.onclick = () => removeCustomTask(index);

      const upBtn = document.createElement("button");
      upBtn.textContent = "🔼";
      upBtn.onclick = () => moveCustomTask(index, -1);
      upBtn.disabled = index === 0;

      const downBtn = document.createElement("button");
      downBtn.textContent = "🔽";
      downBtn.onclick = () => moveCustomTask(index, 1);
      downBtn.disabled = index === custom.length - 1;

      label.appendChild(span);
      label.appendChild(checkbox);
      label.appendChild(deleteBtn);
      label.appendChild(upBtn);
      label.appendChild(downBtn);

      customBox.appendChild(label);
    });

    container.appendChild(customBox);
  }
}

// ✅ Update progress
function updateProgress() {
  let done = 0;

  allTasks.forEach(id => {
    const box = document.getElementById(id);
    if (box?.checked) done++;
  });

  const percent = allTasks.length === 0 ? 0 : Math.round((done / allTasks.length) * 100);

  const bar = document.getElementById("progress");
  bar.style.width = percent + "%";
  bar.textContent = percent + "%";

  saveStatus();
}

// ✅ Save status
function saveStatus() {
  const status = {};

  allTasks.forEach(id => {
    const box = document.getElementById(id);
    status[id] = box?.checked || false;
  });

  localStorage.setItem(storageKey, JSON.stringify(status));
}

// ✅ Load status
function loadStatus() {
  const data = JSON.parse(localStorage.getItem(storageKey) || "{}");

  for (let id in data) {
    const box = document.getElementById(id);
    if (box) box.checked = data[id];
  }

  updateProgress();
}

// ✅ Add custom task
function addCustomTask() {
  const input = document.getElementById("customTaskInput");
  const task = input.value.trim();

  if (!task) return;

  const list = JSON.parse(localStorage.getItem("customTasks") || "[]");

  if (list.includes(task)) {
    alert("⚠️ This task already exists.");
    return;
  }

  list.push(task);
  localStorage.setItem("customTasks", JSON.stringify(list));

  input.value = '';

  loadTasks();
  loadStatus();
}

// ✅ Remove custom task
function removeCustomTask(index) {
  const list = JSON.parse(localStorage.getItem("customTasks") || "[]");
  list.splice(index, 1);
  localStorage.setItem("customTasks", JSON.stringify(list));

  loadTasks();
  loadStatus();
}

// ✅ Move custom task
function moveCustomTask(index, direction) {
  const list = JSON.parse(localStorage.getItem("customTasks") || "[]");
  const newIndex = index + direction;

  if (newIndex < 0 || newIndex >= list.length) return;

  [list[index], list[newIndex]] = [list[newIndex], list[index]];
  localStorage.setItem("customTasks", JSON.stringify(list));

  loadTasks();
  loadStatus();
}

// ✅ View previous days
function viewPrevious() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("daily-tasks-"));

  const log = keys.map(k => {
    const date = k.split("daily-tasks-")[1];
    const data = JSON.parse(localStorage.getItem(k));
    const completed = Object.values(data).filter(x => x).length;
    const total = Object.keys(data).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return `${date} – ${percent}% completed`;
  }).join("\n");

  alert("📅 Previous Progress:\n\n" + log);
}

// ✅ Auto reset
function autoReset() {
  const currentDate = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem("lastOpenedDate");

  if (lastDate !== currentDate) {
    localStorage.setItem("lastOpenedDate", currentDate);
    storageKey = `daily-tasks-${currentDate}`;
    loadTasks();
    loadStatus();
  }
}

// ✅ Submit and go to next day
function submitAndNextDay() {
  saveStatus();

  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);

  const tomorrow = tomorrowDate.toISOString().split('T')[0];
  localStorage.setItem("lastOpenedDate", tomorrow);
  storageKey = `daily-tasks-${tomorrow}`;

  loadTasks();
  loadStatus();
}

// ✅ Export to Excel
function exportToExcel() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith("daily-tasks-"));
  const data = [["Date", "Completed (%)"]];

  keys.forEach(k => {
    const date = k.split("daily-tasks-")[1];
    const savedData = JSON.parse(localStorage.getItem(k) || "{}");
    const completed = Object.values(savedData).filter(x => x).length;
    const total = Object.keys(savedData).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    data.push([date, percent]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Performance");
  XLSX.writeFile(workbook, "Performance.xlsx");
}

// ✅ Init
autoReset();
loadTasks();
loadStatus();
setInterval(autoReset, 60 * 1000);
