// Program ka shuru hone ka samay record karte hain
let startTime = Date.now();

// Pehle se localStorage me stored app usage data uthate hain ya naya object banate hain
let appUsage = JSON.parse(localStorage.getItem("appUsage")) || {};

// Total seconds (kul samay) bhi localStorage se uthate hain, ya 0 se shuru karte hain
let totalSeconds = parseInt(localStorage.getItem("totalSeconds")) || 0;

// HTML ke elements ko JS me access karte hain
const totalTimeEl = document.getElementById("totalTime"); // Total time dikhane ke liye
const appListEl = document.getElementById("appList");     // App-wise list dikhane ke liye
const reminderBox = document.getElementById("reminderBox"); // Reminder dikhane ke liye

// Kuch dummy apps ka list banate hain (ye simulate kiya gaya hai)
const dummyApps = ["Google Chrome", "VS Code", "YouTube", "Figma", "WhatsApp Web"];

// Current app randomly select karte hain
let currentApp = dummyApps[Math.floor(Math.random() * dummyApps.length)];

// Seconds ko hh:mm:ss format me convert karne ka function
function formatTime(seconds) {
  let h = Math.floor(seconds / 3600); // hours
  let m = Math.floor((seconds % 3600) / 60); // minutes
  let s = seconds % 60; // seconds
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":"); // 2 digit format me join karte hain
}

// Dashboard (UI) ko update karne ka kaam karta hai
function updateDashboard() {
  totalTimeEl.textContent = formatTime(totalSeconds); // Total time dikhate hain

  appListEl.innerHTML = ""; // Pehle se jo list hai use clear karte hain
  for (let app in appUsage) {
    let time = formatTime(appUsage[app]); // Har app ka time format karte hain
    const div = document.createElement("div"); // Naya div banate hain
    div.className = "app-item"; // CSS class lagate hain
    div.textContent = `📌 ${app}: ${time}`; // Text content set karte hain
    appListEl.appendChild(div); // List me add karte hain
  }
}

// App ko random tarike se badalne ka function (simulate)
function simulateAppSwitch() {
  currentApp = dummyApps[Math.floor(Math.random() * dummyApps.length)];
}

// Har second par ye kaam chalega
setInterval(() => {
  totalSeconds++; // Total time badhao
  appUsage[currentApp] = (appUsage[currentApp] || 0) + 1; // Current app ka time badhao

  // Har 60 second me data ko localStorage me save karo
  if (totalSeconds % 60 === 0) {
    localStorage.setItem("totalSeconds", totalSeconds);
    localStorage.setItem("appUsage", JSON.stringify(appUsage));
  }

  // Har 30 minutes (1800 sec) me reminder box dikhao 10 seconds ke liye
  if (totalSeconds % 1800 === 0) {
    reminderBox.style.display = "block";
    setTimeout(() => reminderBox.style.display = "none", 10000); // 10 sec baad band karo
  }

  // Har 5 minutes (300 sec) me app change karo (simulate)
  if (totalSeconds % 300 === 0) {
    simulateAppSwitch();
  }

  // Dashboard update karo
  updateDashboard();
}, 1000); // Ye sab har 1 second me chalega

// Jab page load ho to ek baar dashboard update karo
updateDashboard();
