// Navigation drawer & menu
const hamburger = document.querySelector(".hamburger");
const drawer = document.getElementById("nav-drawer");
const overlay = document.querySelector(".drawer-overlay");

function openDrawer() {
  if (!drawer || !overlay) return;
  drawer.classList.add("open");
  drawer.removeAttribute("hidden");
  drawer.setAttribute("aria-modal", "true");
  drawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  if (hamburger) hamburger.setAttribute("aria-expanded", "true");
  const first = drawer.querySelector("a");
  if (first) setTimeout(() => first.focus(), 20);
  document.addEventListener("keydown", escDrawer);
}

function closeDrawer() {
  if (!drawer || !overlay) return;
  drawer.classList.remove("open");
  drawer.setAttribute("hidden", "");
  drawer.setAttribute("aria-modal", "false");
  drawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  if (hamburger) hamburger.setAttribute("aria-expanded", "false");
  document.removeEventListener("keydown", escDrawer);
}

function escDrawer(e) {
  if (e.key === "Escape") closeDrawer();
}

if (hamburger && drawer && overlay) {
  hamburger.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("open");
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener("click", closeDrawer);

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

// Theme toggle
const themeToggle = document.querySelector(".theme-toggle");

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme", theme);
  if (themeToggle) {
    themeToggle.innerHTML = isDark ? "☾" : "☀";
    themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
}

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
setTheme(initialTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });
}

// Events (runs only if event elements exist)
const list = document.getElementById("event-list");
const nextEventContainer = document.getElementById("next-event");

if (list) {
  let EVENTS = [];

  function formatDate(event) {
    const d = new Date(`${event.date}T${event.time}`);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) + ", " + event.time;
  }

  function downloadCalendarEvent(event) {
    const start = new Date(`${event.date}T${event.time}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const pad = (v) => String(v).padStart(2, "0");
    const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Campus Landing//Events//EN",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${esc(event.title)}`,
      `LOCATION:${esc(event.place)}`,
      `DESCRIPTION:${esc(event.description)}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function renderEvents(type) {
    const now = new Date();
    list.innerHTML = "";
    EVENTS.filter((e) => type === "All" || e.type === type).forEach((e) => {
      const past = new Date(`${e.date}T${e.time}`) < now;
      const card = document.createElement("article");
      card.className = "event-card" + (past ? " past" : "");
      card.innerHTML = `<h3>${escapeHtml(e.title)}</h3>
        <p class="event-meta">${escapeHtml(formatDate(e))} · ${escapeHtml(e.place)} · ${escapeHtml(e.type)}</p>
        <p class="event-desc">${escapeHtml(e.description)}</p>
        <button class="add-calendar">Add to calendar</button>`;
      card.querySelector(".add-calendar").addEventListener("click", () => downloadCalendarEvent(e));
      list.appendChild(card);
    });
  }

  function updateCountdown() {
    if (!nextEventContainer) return;
    const now = new Date();
    const next = EVENTS
      .map((ev) => ({ ev, d: new Date(`${ev.date}T${ev.time}`) }))
      .filter(({ d }) => d > now)
      .sort((a, b) => a.d - b.d)[0];

    if (!next) {
      nextEventContainer.innerHTML = '<h2 style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.15em;color:var(--text-muted);margin:0 0 6px;">Next event</h2><p style="margin:0;color:var(--text-secondary);">No upcoming events.</p>';
      return;
    }

    const ms = next.d - now;
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor((ms % 86400000) / 3600000);
    const d = new Date(`${next.ev.date}T${next.ev.time}`);
    const fmt = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) + " · " + next.ev.time;

    nextEventContainer.innerHTML = '<h2 style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.2em;color:var(--text-muted);margin:0 0 10px;font-weight:600;">Next event</h2>' +
      `<h3 style="font-size:1.4rem;font-weight:600;letter-spacing:-0.03em;margin:0 0 8px;color:var(--text);">${escapeHtml(next.ev.title)}</h3>` +
      `<p style="margin:0 0 6px;color:var(--text-secondary);font-size:0.95rem;">${escapeHtml(fmt)} · ${escapeHtml(next.ev.place)}</p>` +
      `<p style="margin:0 0 10px;color:var(--text-muted);font-size:0.9rem;">${escapeHtml(next.ev.type)}</p>` +
      `<p style="margin:0;font-size:0.85rem;color:var(--accent);font-weight:500;">In ${days} days, ${hours} hours</p>`;
  }

  document.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeFilter = document.querySelector(".filter.active");
      if (activeFilter) activeFilter.classList.remove("active");
      btn.classList.add("active");
      renderEvents(btn.dataset.type);
    });
  });

  fetch("events.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load events");
      }
      return response.json();
    })
    .then((events) => {
      EVENTS = events;
      renderEvents("All");
      updateCountdown();
    })
    .catch(() => {
      list.innerHTML = "<p>Events could not be loaded right now.</p>";
    });

  setInterval(updateCountdown, 60000);
}
