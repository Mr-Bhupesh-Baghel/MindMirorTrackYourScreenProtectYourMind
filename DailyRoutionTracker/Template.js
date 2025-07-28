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

// 🔹 Completed task track karne ke liye (currently unused, future ke liye useful ho sakta hai)
let completed = new Set();


// ✅ Function: loadTasks()
// 🔹 Default aur Custom tasks ko page par dikhata hai
function loadTasks() {
  // 🔹 Purane tasks ko HTML se hata dete hain
  document.getElementById("taskContainer").innerHTML = '';
  allTasks = [];

  // 🔹 Default tasks ko load karte hain
  for (let [section, tasks] of Object.entries(sections)) {
    const box = document.createElement("div");
    box.className = "task-group";
    box.innerHTML = `<h2>${section}</h2>`;

    // 🔹 Har task ke liye checkbox banate hain
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

  // 🔹 Custom tasks ko localStorage se read kar ke dikhate hain
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

  // 🔹 Har task ke checkbox ko check karke ginte hain ki kitne complete hue
  allTasks.forEach(id => {
    const box = document.getElementById(id);
    if (box?.checked) done++;
  });

  // 🔹 Completion percentage calculate karte hain
  const percent = Math.round((done / allTasks.length) * 100);

  // 🔹 Progress bar ko update karte hain
  const bar = document.getElementById("progress");
  bar.style.width = percent + "%";
  bar.textContent = percent + "%";

  // 🔹 Status save karte hain localStorage mein
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

  // 🔹 Aaj ke din ke liye status save karte hain
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

  loadTasks();    // 🔄 UI reload
  loadStatus();   // ✅ Checkbox status reload
}


// ✅ Function: removeCustomTask(index)
// 🔹 Custom task ko delete karta hai
function removeCustomTask(index) {
  const list = JSON.parse(localStorage.getItem("customTasks") || "[]");
  list.splice(index, 1);
  localStorage.setItem("customTasks", JSON.stringify(list));

  loadTasks();    // 🔄 UI reload
  loadStatus();   // ✅ Checkbox status reload
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
// 🔹 Har raat 12 baje ke baad agar date change ho gayi to task status reset karta hai
function autoReset() {
  const currentDate = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem("lastOpenedDate");

  if (lastDate !== currentDate) {
    // 🔹 Nayi date update karte hain
    localStorage.setItem("lastOpenedDate", currentDate);

    // 🔹 Purani date ka task progress delete karte hain
    localStorage.removeItem(`daily-tasks-${lastDate}`);

    // 🔹 Storage key update karte hain naye date ke liye
    storageKey = `daily-tasks-${currentDate}`;

    // 🔄 UI aur progress reset kar dete hain
    loadTasks();
    loadStatus();
  }
}


// ✅ Initialization: Page load par ye sab chalega
autoReset();        // 🔁 Sabse pehle check karega date change to nahi hui
loadTasks();        // 📋 Tasks show karega
loadStatus();       // ✅ Checkbox status restore karega

// 🔄 Har 1 minute mein check karega ki date change ho gayi ya nahi (12:00AM ka automatic reset)
setInterval(autoReset, 60 * 1000);
