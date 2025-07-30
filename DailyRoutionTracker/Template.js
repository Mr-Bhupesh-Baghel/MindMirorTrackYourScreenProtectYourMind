// 🔹 Default section define kar rahe hain jisme ek task diya gaya hai
const sections = {
  "🛠️ Start Work": [
    "🔹Do any work for at least 10 minutes"
  ]
};

// 🔹 Aaj ki date ko YYYY-MM-DD format mein le rahe hain
const today = new Date().toISOString().split('T')[0];

// 🔹 Aaj ki date ke saath ek storage key bana rahe hain jisme task status store hoga
let storageKey = `daily-tasks-${today}`;

// 🔹 Saare task IDs ko store karne ke liye array
let allTasks = [];

// 🔹 Completed task track karne ke liye (future use ke liye)
let completed = new Set();


// ✅ Function: loadTasks()
// 🔹 Default aur Custom tasks ko page par dikhata hai
function loadTasks() {
  document.getElementById("taskContainer").innerHTML = '';
  allTasks = [];

  // 🔹 Default tasks dikhana
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

  // 🔹 Custom tasks load karna
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


// ✅ Function: updateProgress()
// 🔹 Kitne task complete hue uska percentage calculate karta hai
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

  // 🔹 localStorage mein status save karna
  saveStatus();
}


// ✅ Function: saveStatus()
// 🔹 Saare checkbox ke status ko localStorage mein save karta hai
function saveStatus() {
  const status = {};

  allTasks.forEach(id => {
    const box = document.getElementById(id);
    status[id] = box?.checked || false;
  });

  localStorage.setItem(storageKey, JSON.stringify(status));
}


// ✅ Function: loadStatus()
// 🔹 localStorage se saved checkbox status ko load karta hai
function loadStatus() {
  const data = JSON.parse(localStorage.getItem(storageKey) || "{}");

  for (let id in data) {
    const box = document.getElementById(id);
    if (box) box.checked = data[id];
  }

  updateProgress();
}


// ✅ Function: addCustomTask()
// 🔹 Naye custom task ko add karta hai
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


// ✅ Function: removeCustomTask(index)
// 🔹 Custom task ko delete karta hai
function removeCustomTask(index) {
  const list = JSON.parse(localStorage.getItem("customTasks") || "[]");
  list.splice(index, 1);
  localStorage.setItem("customTasks", JSON.stringify(list));

  loadTasks();
  loadStatus();
}


// ✅ Function: viewPrevious()
// 🔹 Pichhle dino ki task performance dikhata hai
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


// ✅ Function: autoReset()
// 🔹 Raat 12 baje ke baad agar date badal gayi ho to naye din ke tasks load karega
function autoReset() {
  const currentDate = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem("lastOpenedDate");

  if (lastDate !== currentDate) {
    localStorage.setItem("lastOpenedDate", currentDate);
    localStorage.removeItem(`daily-tasks-${lastDate}`);

    storageKey = `daily-tasks-${currentDate}`;

    loadTasks();
    loadStatus();
  }
}


// ✅ ✅ ✅ Function: Submit button for "Next Day"
// 🔹 Jab user "Submit" button par click kare to agla din load kare
function submitAndNextDay() {
  // 🔹 Pehle current task ka progress save karo
  saveStatus();

  // 🔹 Aaj ki date lo aur ek din aage badhao
  const todayDate = new Date();
  const tomorrowDate = new Date(todayDate);
  tomorrowDate.setDate(todayDate.getDate() + 1);

  // 🔹 New date ke hisaab se key banao
  const tomorrow = tomorrowDate.toISOString().split('T')[0];
  localStorage.setItem("lastOpenedDate", tomorrow);
  storageKey = `daily-tasks-${tomorrow}`;

  // 🔹 UI reload karke naye din ke tasks dikhao
  loadTasks();
  loadStatus();
}


// ✅ Page load par initialize karna
autoReset();        // 🔁 Date change hui to reset kare
loadTasks();        // 📋 Task list dikhaye
loadStatus();       // ✅ Checkbox status wapas laaye

// 🔄 Har 1 minute mein date auto check kare
setInterval(autoReset, 60 * 1000);
