// MindMirror Page Time Tracker (per-page)
    (function () {
  const KEY = "pageTimes_v2";

  // Page name priority: data-page (on script) > body[data-page] > <title> > file name
        const script = document.currentScript;
        const fromAttr = script && script.dataset && script.dataset.page;
        const fromBody = document.body && document.body.getAttribute("data-page");
        const fromTitle = document.title && document.title.trim();
        const fromPath = (location.pathname.split("/").pop() || "home").trim();
        const PAGE_NAME = (fromAttr || fromBody || fromTitle || fromPath || "page").trim();

        function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { }; }
        catch { return { }; }
  }
        function save(obj) {
            localStorage.setItem(KEY, JSON.stringify(obj));
  }
        function format(sec) {
    const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
  }

        let times = load();
        if (typeof times[PAGE_NAME] !== "number") times[PAGE_NAME] = 0;

        // Tick every second only when page is visible
        let tickCount = 0;
  const intervalId = setInterval(() => {
    if (!document.hidden) {
            times[PAGE_NAME] += 1;
        tickCount++;
        if (tickCount % 5 === 0) save(times);     // save every 5s
        // Optional live UI
        const el = document.getElementById("pageTimer");
        if (el) el.textContent = format(times[PAGE_NAME]);
    }
  }, 1000);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) save(times);
  });

  window.addEventListener("beforeunload", () => {
            save(times);
        clearInterval(intervalId);
  });

        // Expose helpers for summary page (optional)
        window.__MM__ = window.__MM__ || { };
        window.__MM__.KEY = KEY;
        window.__MM__.format = format;
})();
