let startTime = Date.now();
let appUsage = JSON.parse(localStorage.getItem("appUsage")) || {};
let totalSeconds = parseInt(localStorage.getItem("totalSeconds")) || 0;

const totalTimeEl = document.getElementById("totalTime");
const appListEl = document.getElementById("appList");
const reminderBox = document.getElementById("reminderBox");

const dummyApps = ["Google Chrome", "VS Code", "YouTube", "Figma", "WhatsApp Web"];
let currentApp = dummyApps[Math.floor(Math.random() * dummyApps.length)];

function formatTime(seconds) {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

function updateDashboard() {
  totalTimeEl.textContent = formatTime(totalSeconds);

  appListEl.innerHTML = "";
  for (let app in appUsage) {
    let time = formatTime(appUsage[app]);
    const div = document.createElement("div");
    div.className = "app-item";
    div.textContent = `📌 ${app}: ${time}`;
    appListEl.appendChild(div);
  }
}

function simulateAppSwitch() {
  currentApp = dummyApps[Math.floor(Math.random() * dummyApps.length)];
}

// update every second
setInterval(() => {
  totalSeconds++;
  appUsage[currentApp] = (appUsage[currentApp] || 0) + 1;

  if (totalSeconds % 60 === 0) {
    localStorage.setItem("totalSeconds", totalSeconds);
    localStorage.setItem("appUsage", JSON.stringify(appUsage));
  }

  if (totalSeconds % 1800 === 0) { // every 30 mins
    reminderBox.style.display = "block";
    setTimeout(() => reminderBox.style.display = "none", 10000);
  }

  if (totalSeconds % 300 === 0) { // simulate app switch every 5 mins
    simulateAppSwitch();
  }

  updateDashboard();
}, 1000);

// Initial render
updateDashboard();
