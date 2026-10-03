const nav = document.querySelector(".nav");
const menuButton = document.querySelector(".menu-button");
const themeToggle = document.querySelector(".theme-toggle");

// Mobile menu
menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", open);
});

// Dark mode
function setTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

setTheme(localStorage.getItem("theme") || "light");

themeToggle.addEventListener("click", () => {
  const theme = document.documentElement.classList.contains("dark") ? "light" : "dark";
  localStorage.setItem("theme", theme);
  setTheme(theme);
});

// Events
const list = document.getElementById("event-list");

function formatDate(event) {
  const date = new Date(`${event.date}T${event.time}`);
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) + ", " + event.time;
}

function renderEvents(type) {
  const now = new Date();
  list.innerHTML = EVENTS
    .filter((e) => type === "All" || e.type === type)
    .map((e) => {
      const past = new Date(`${e.date}T${e.time}`) < now;
      return `<li class="${past ? "past" : ""}">
        <h3>${e.title}</h3>
        <div class="meta">${formatDate(e)} · ${e.place} · ${e.type}</div>
        <p>${e.description}</p>
      </li>`;
    })
    .join("");
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    button.classList.add("active");
    renderEvents(button.dataset.type);
  });
});

renderEvents("All");

// Countdown to the next event
function updateCountdown() {
  const next = EVENTS[0];
  const ms = new Date(`${next.date}T${next.time}`) - new Date();
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  document.getElementById("countdown").textContent = `${next.title} in ${days} days, ${hours} hours`;
}

updateCountdown();
setInterval(updateCountdown, 60000);
