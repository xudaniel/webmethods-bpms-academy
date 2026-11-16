// Reading times, explorer progress, badges and "Did you know?".
// Everything stays in this browser (localStorage); no tracking, no network calls.
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isRead = !!document.querySelector("nav.toc");
  const WPM = 200;

  // ---------- reading time ----------
  function minutesFor(el) {
    const c = el.cloneNode(true);
    c.querySelectorAll(".sources, .prevnext, .readtime, script, svg, nav.toc, .fab").forEach((x) => x.remove());
    const words = (c.textContent || "").trim().split(/\s+/).filter(Boolean).length;
    const figs = el.querySelectorAll("figure.dg, .kb-fig").length;
    return Math.max(1, Math.round(words / WPM + figs * 0.25));
  }
  const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? (m % 60) + " min" : ""}`.trim() : `${m} min`);
  const handsOn = { lab: () => (window.LAB ? window.LAB.stages.reduce((n, s) => n + s.min, 0) : 30), simulator: () => 5, scan: () => 5, quiz: () => 10 };

  const times = {};
  window.READTIMES = times;
  if (!isRead) {
    let total = 0;
    document.querySelectorAll("main > .section").forEach((sec) => {
      const m = minutesFor(sec); times[sec.id] = m; total += m;
      const extra = handsOn[sec.id] ? ` · ${handsOn[sec.id]()} min hands-on` : "";
      sec.insertAdjacentHTML("afterbegin", `<p class="readtime">⏱ ${fmt(m)} read${extra}</p>`);
    });
    document.querySelectorAll("#menu-sheet [data-goto]").forEach((b) => {
      const sm = b.querySelector("small"); const m = times[b.dataset.goto];
      if (sm && m && !b.dataset.phone) sm.insertAdjacentHTML("beforeend", ` <span class="rt">· ${m} min</span>`);
    });
    const intro = document.querySelector("#start .card .lead");
    if (intro) intro.insertAdjacentHTML("afterend", `<p class="readtime total">⏱ The whole course is about ${fmt(total)} of reading. Each section shows its own time at the top.</p>`);
  } else {
    let total = 0;
    document.querySelectorAll("main section.card").forEach((sec) => {
      const h = sec.querySelector("h2"); if (!h) return;
      const m = minutesFor(sec); total += m;
      h.insertAdjacentHTML("afterend", `<p class="readtime">⏱ ${fmt(m)} read</p>`);
    });
    const toc = document.querySelector("nav.toc h2");
    if (toc) toc.insertAdjacentHTML("afterend", `<p class="readtime total">⏱ About ${fmt(total)} to read everything. Each chapter shows its own time.</p>`);
    return; // progress and badges live on the interactive version
  }

  // ---------- progress and badges ----------
  const KEY = "wm-academy-fun-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* progress lasts for this visit */ } };
  const st = Object.assign({ visited: {}, badges: {}, opened: 0 }, load());
  const sections = [...document.querySelectorAll("nav button[data-section]")].map((b) => b.dataset.section);
  const BADGES = [
    ["explorer", "🧭", "Explorer", "Visit every section"],
    ["agent", "🤖", "Agent tamer", "Change the agent's policy on Start here"],
    ["sim", "⚙️", "Simulator", "Run the loan process to the end"],
    ["scan", "🔬", "Scanner", "Run the Agent Scan Lab"],
    ["fixer", "🛠️", "Fixer", "Open 5 troubleshooting entries"],
    ["role", "🎯", "Role ready", "Score 3 / 3 in a role self-check"],
    ["basics", "🧱", "Basics done", "Pass all seven Basics 101 checks"],
    ["fixer2", "🧩", "Process fixer", "Fix all five broken diagrams"],
    ["lab", "🧪", "Lab finisher", "Tick every step of the hands-on lab"],
    ["quiz", "🏆", "Quiz ace", "Answer every quiz question correctly"]
  ];

  // Start-page card: progress, badges, did you know
  const anchor = document.getElementById("phone-guide") || document.querySelector("#start .card");
  if (anchor) anchor.insertAdjacentHTML("afterend", `<div class="card fun" id="fun-card">
      <h3>Your progress <small class="muted">(saved only in this browser)</small></h3>
      <div class="lab-progress"><div class="bar"><span id="fun-bar"></span></div><span id="fun-count"></span></div>
      <div class="badges" id="fun-badges"></div>
      <div class="dyk" id="dyk"><p class="dyk-h">💡 Did you know?</p><p id="dyk-text"></p><p class="dyk-act"><a href="#knowledge" id="dyk-link">Read the topic →</a> <button type="button" class="link" id="dyk-next">Another fact</button></p></div>
    </div>`);
  const head = document.querySelector("#menu-sheet .menu-head strong");
  if (head) head.insertAdjacentHTML("afterend", ` <span class="menu-progress" id="menu-progress"></span>`);

  function paint() {
    const n = sections.filter((s) => st.visited[s]).length;
    if ($("fun-count")) $("fun-count").textContent = `🧭 ${n} / ${sections.length} sections explored`;
    if ($("fun-bar")) $("fun-bar").style.width = Math.round((n / sections.length) * 100) + "%";
    if ($("menu-progress")) $("menu-progress").textContent = `🧭 ${n} / ${sections.length}`;
    if ($("fun-badges")) $("fun-badges").innerHTML = BADGES.map(([k, ic, name, how]) =>
      `<div class="badge${st.badges[k] ? " earned" : ""}" title="${esc(how)}"><span class="ic">${ic}</span><strong>${esc(name)}</strong><small>${st.badges[k] ? "Unlocked" : esc(how)}</small></div>`).join("");
  }
  function award(k) {
    if (st.badges[k]) return;
    st.badges[k] = new Date().toISOString().slice(0, 10); save(); paint();
    const b = BADGES.find((x) => x[0] === k); celebrate(`${b[1]} Badge unlocked: ${b[2]}`);
  }
  function celebrate(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.classList.add("out"), 2600); setTimeout(() => t.remove(), 3200);
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = document.createElement("div"); box.className = "confetti"; box.setAttribute("aria-hidden", "true");
    const em = ["🎉", "✨", "🎊", "⭐", "💙"];
    box.innerHTML = Array.from({ length: 18 }, (_, i) => `<span style="left:${5 + Math.random() * 90}%;animation-delay:${(Math.random() * 0.4).toFixed(2)}s">${em[i % em.length]}</span>`).join("");
    document.body.appendChild(box); setTimeout(() => box.remove(), 2600);
  }

  function visit() {
    const id = (location.hash || "#start").slice(1);
    if (sections.includes(id) && !st.visited[id]) { st.visited[id] = 1; save(); paint(); }
    if (sections.every((s) => st.visited[s])) award("explorer");
  }
  window.addEventListener("hashchange", visit);
  visit(); paint();

  // Badge triggers (read the page state; no changes to other scripts needed)
  const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
  on("ex-limit", "input", () => award("agent"));
  on("ex-mindelay", "input", () => award("agent"));
  on("scan-sample", "click", () => setTimeout(() => award("scan"), 50));
  on("sim-next", "click", () => setTimeout(() => { if (/COMPLETED/.test(($("sim-log") || {}).textContent || "")) award("sim"); }, 50));
  document.addEventListener("toggle", (e) => { if (e.target.matches && e.target.matches("details.trouble") && e.target.open) { st.opened = (st.opened || 0) + 1; save(); if (st.opened >= 5) award("fixer"); } }, true);
  on("howto-body", "click", () => setTimeout(() => { const s = $("sc-score"); if (s && /^3 \/ 3/.test(s.textContent)) award("role"); }, 30));
  document.addEventListener("basics:done", () => award("basics"));
  document.addEventListener("puzzles:done", () => award("fixer2"));
  on("lab-stages", "change", () => setTimeout(() => { if (/lab complete/.test(($("lab-count") || {}).textContent || "")) award("lab"); }, 30));
  on("quiz-list", "click", () => setTimeout(() => {
    const m = (($("quiz-score") || {}).textContent || "").match(/(\d+)\s*\/\s*(\d+).*done/);
    if (m && m[1] === m[2]) award("quiz");
  }, 30));

  // Did you know?
  const K = window.KNOWLEDGE;
  if (K && $("dyk-text")) {
    const pool = []; K.topics.forEach((t) => t.facts.forEach((f) => pool.push([t.id, t.title, f])));
    let last = -1;
    const pick = () => {
      let i = Math.floor(Math.random() * pool.length); if (i === last) i = (i + 1) % pool.length; last = i;
      const [id, title, f] = pool[i];
      $("dyk-text").textContent = f;
      $("dyk-link").textContent = `${title} →`;
      $("dyk-link").onclick = () => setTimeout(() => { const el = document.getElementById("kb-" + id); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 80);
    };
    $("dyk-next").addEventListener("click", pick); pick();
  }
})();
