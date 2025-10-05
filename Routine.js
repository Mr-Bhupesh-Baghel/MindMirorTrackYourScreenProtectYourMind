// 🔹 Default section define kar rahe hain jisme ek task diya gaya hai  
const sections = {
  "🛠️ Start ": [
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
// ✅ All progress and daily task data have been deleted function
 function deleteSpecificData() {
      for (let key in localStorage) {
        if (key.startsWith("daily-tasks-")) {
          localStorage.removeItem(key);
        }
      }
      localStorage.removeItem("progress");
      alert("✅ All progress and daily task data have been deleted.");
    }

// ✅ View previous days in a modal table
function viewPrevious() {
  // Get all keys that store daily tasks
  const keys = Object.keys(localStorage)
    .filter(k => k.startsWith("daily-tasks-"))
    .sort((a, b) => new Date(b.split("daily-tasks-")[1]) - new Date(a.split("daily-tasks-")[1]));

  // Create modal container if it doesn't exist
  let modal = document.getElementById("previousModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "previousModal";
    modal.style.cssText = `
      display:none; position:fixed; top:0; left:0; width:100%; height:100%;
      background:rgba(0,0,0,0.5); padding-top:80px; z-index:9999;
    `;
    modal.innerHTML = `
      <div style="background:white; margin:auto; padding:20px; border-radius:8px; width:80%; max-width:500px;">
        <h3>📅 Previous Progress</h3>
        <table id="previousTable" style="width:100%; border-collapse:collapse; margin-top:10px;">
          <tr>
            <th style="border-bottom:1px solid #ccc; padding:8px;">Date</th>
            <th style="border-bottom:1px solid #ccc; padding:8px;">Completion</th>
            <th style="border-bottom:1px solid #ccc; padding:8px;">Action</th>
          </tr>
        </table>
        <button id="closePrevious" style="margin-top:10px; padding:6px 10px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;">Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Close modal
    document.getElementById("closePrevious").onclick = () => {
      modal.style.display = "none";
    };
  }

  const table = document.getElementById("previousTable");

  // Clear old rows (except header)
  table.innerHTML = `
    <tr>
      <th style="border-bottom:1px solid #ccc; padding:8px;">Date</th>
      <th style="border-bottom:1px solid #ccc; padding:8px;">Completion</th>
      <th style="border-bottom:1px solid #ccc; padding:8px;">Action</th>
    </tr>
  `;

  // Add rows
  keys.forEach(k => {
    const date = k.split("daily-tasks-")[1];
    const data = JSON.parse(localStorage.getItem(k));
    const completed = Object.values(data).filter(x => x).length;
    const total = Object.keys(data).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Color for percentage
    let color = "#6c757d";
    if (percent >= 80) color = "#28a745";
    else if (percent >= 50) color = "#ffc107";
    else color = "#dc3545";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="padding:8px; border-bottom:1px solid #eee;">${date}</td>
      <td style="padding:8px; border-bottom:1px solid #eee; color:${color}; font-weight:bold;">${percent}%</td>
      <td style="padding:8px; border-bottom:1px solid #eee;">
        <button class="deletePrev" data-key="${k}" style="background:#dc3545; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">❌ Delete</button>
      </td>
    `;
    table.appendChild(row);
  });

  // Attach delete events
  table.querySelectorAll(".deletePrev").forEach(btn => {
    btn.onclick = () => {
      const key = btn.getAttribute("data-key");
      if (confirm(`Delete progress for ${key.split("daily-tasks-")[1]}?`)) {
        localStorage.removeItem(key);
        btn.closest("tr").remove();
      }
    };
  });

  // Show modal
  modal.style.display = "block";
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
