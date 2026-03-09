// ✅ Holiday Task JS (with checkboxes)
function loadHolidayTasks() {
  const container = document.getElementById("HtaskContainer");
  container.innerHTML = "";

  const list = JSON.parse(localStorage.getItem("holidayTasks") || "[]");
  const checked = JSON.parse(localStorage.getItem("holidayTasksChecked") || "[]");

  if (list.length === 0) return;

  const holidayBox = document.createElement("div");
  holidayBox.className = "task-group";

  const heading = document.createElement("h2");
  heading.textContent = "🎉 Holiday, 🐸Frog! Tasks";
  holidayBox.appendChild(heading);

  list.forEach((task, index) => {
    const label = document.createElement("label");
    label.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked.includes(task);

    checkbox.addEventListener("change", () => toggleHolidayTask(task, checkbox.checked));

    const span = document.createElement("span");
    span.textContent = task;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => removeHolidayTask(index);

    label.appendChild(checkbox);
    label.appendChild(span);
    label.appendChild(deleteBtn);
    holidayBox.appendChild(label);
  });

  container.appendChild(holidayBox);
}

// ✅ Add Holiday Task
function addHolidayTask() {
  const input = document.getElementById("HolidayTaskInput");
  const task = input.value.trim();

  if (!task) return;

  const list = JSON.parse(localStorage.getItem("holidayTasks") || "[]");

  if (list.includes(task)) {
    alert("⚠️ This task already exists.");
    return;
  }

  list.push(task);
  localStorage.setItem("holidayTasks", JSON.stringify(list));

  input.value = "";
  loadHolidayTasks();
}

// ✅ Remove Holiday Task
function removeHolidayTask(index) {
  const list = JSON.parse(localStorage.getItem("holidayTasks") || "[]");
  const checked = JSON.parse(localStorage.getItem("holidayTasksChecked") || "[]");

  const removedTask = list[index];
  list.splice(index, 1);

  // remove from checked list too
  const newChecked = checked.filter(t => t !== removedTask);

  localStorage.setItem("holidayTasks", JSON.stringify(list));
  localStorage.setItem("holidayTasksChecked", JSON.stringify(newChecked));

  loadHolidayTasks();
}

// ✅ Toggle Holiday Task Done/Undone
function toggleHolidayTask(task, isChecked) {
  let checked = JSON.parse(localStorage.getItem("holidayTasksChecked") || "[]");

  if (isChecked) {
    if (!checked.includes(task)) checked.push(task);
  } else {
    checked = checked.filter(t => t !== task);
  }

  localStorage.setItem("holidayTasksChecked", JSON.stringify(checked));
}

// ✅ Init
loadHolidayTasks();
