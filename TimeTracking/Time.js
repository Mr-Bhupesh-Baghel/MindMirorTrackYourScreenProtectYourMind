// =========================
// 🕒 Daily Screen Time Tracker with History Table + Delete Option
// =========================

// Load data from localStorage
let usageHistory = JSON.parse(localStorage.getItem("usageHistory") || "{}");

// Get today's date (YYYY-MM-DD format)
function getToday() {
  return new Date().toISOString().split("T")[0];
}

let today = getToday();
let totalSeconds = usageHistory[today] || 0;

// DOM elements
const totalTimeEl = document.getElementById("totalTime");
const historyBtn = document.getElementById("viewHistory");
const historyModal = document.getElementById("historyModal");
const historyTable = document.getElementById("historyTable");
const closeModal = document.getElementById("closeModal");

// Format seconds → HH:MM:SS
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
}

// Update today's time display
function updateTime() {
  totalTimeEl.textContent = formatTime(totalSeconds);
}

// Save data to localStorage
function saveData() {
  usageHistory[today] = totalSeconds;
  localStorage.setItem("usageHistory", JSON.stringify(usageHistory));
}

// Increment time every second
setInterval(() => {
  if (getToday() !== today) { // date change at midnight
    today = getToday();
    totalSeconds = 0;
  }
  totalSeconds++;
  saveData();
  updateTime();
}, 1000);

// Show history in modal table
historyBtn.addEventListener("click", () => {
  historyTable.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Screen Time</th>
      <th>Action</th>
    </tr>
  `;
  Object.keys(usageHistory)
    .sort((a, b) => new Date(b) - new Date(a)) // latest first
    .forEach(date => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${date}</td>
        <td>${formatTime(usageHistory[date])}</td>
        <td>
          <button class="deleteBtn" data-date="${date}">❌ Delete</button>
        </td>
      `;
      historyTable.appendChild(row);
    });

  // Attach delete button events
  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const date = btn.getAttribute("data-date");
      if (confirm(`Delete record for ${date}?`)) {
        delete usageHistory[date];
        localStorage.setItem("usageHistory", JSON.stringify(usageHistory));
        btn.closest("tr").remove();
      }
    });
  });

  historyModal.style.display = "block";
});

// Close modal
closeModal.addEventListener("click", () => {
  historyModal.style.display = "none";
});
