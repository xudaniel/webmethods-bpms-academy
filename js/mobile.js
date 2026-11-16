// Phone guide and mobile helpers: section menu, previous/next, back to top, offline support.
window.PHONE = {
  groups: [
    ["Start", [["start", "Start here", "What a BPMS is, in six hands-on steps"], ["crash", "10-minute course", "Know nothing? Start here: five steps, three checks"], ["basics", "Basics 101", "Seven fundamental lessons, 15 minutes"], ["overview", "Overview", "IBM webMethods at a glance"]]],
    ["Do", [["howto", "How to use", "Step-by-step guides by role"], ["lab", "Hands-on lab", "Your first process in 30 minutes"], ["decisions", "Decision lab", "Change a rule, test it, see why"], ["puzzles", "Fix the diagram", "Five broken processes to repair"], ["trouble", "Troubleshooting", "Symptom → cause → fix"], ["simulator", "Simulator", "Run a loan process"], ["scan", "Agent Scan Lab", "Find rule and agent candidates"], ["quiz", "Quiz", "Test yourself"]]],
    ["Learn", [["knowledge", "Knowledge base", "Cited facts on how it behaves"], ["controls", "Controls", "For banks and insurers: controls and evidence"], ["architecture", "Architecture", "Engines, databases, audit tables"], ["lifecycle", "Lifecycle", "Process stages and release dates"], ["bpmn", "BPMN", "Notation essentials"], ["patterns", "Patterns", "Classic and agent-era patterns"], ["cases", "Cases", "Worked examples"], ["market", "Market", "Where the market is going"], ["glossary", "Glossary", "Searchable terms"]]],
    ["Teach", [["teach", "Teach a class", "Half-day workshop plan"]]]
  ],
  guide: {
    iphone: [
      "Open the link in Safari.",
      "Tap Share (or ⋯ next to the address bar, then Share).",
      "Scroll down and tap Add to Home Screen. If it is missing, tap Edit Actions at the bottom and add it.",
      "Keep Open as Web App on, then tap Add."
    ],
    android: [
      "Open the link in Chrome.",
      "Tap ⋮ (top right) → Add to home screen.",
      "Choose Install (or Install app) and confirm."
    ],
    use: [
      ["Find a section", "Tap ☰ Sections at the top left, or swipe the tab bar sideways."],
      ["Move on", "Every section ends with Previous and Next. The ↑ button takes you back to the top."],
      ["Read offline", "After your first visit, the saved app opens without a connection. Lab progress stays on your phone."],
      ["Bigger text", "Use your browser's text-size setting, or pinch to zoom; the layout reflows."],
      ["Just read or print", "Open the Reading version: one page, five diagrams, every guide. Use your browser's Share or Print option to save it as a PDF."]
    ]
  }
};

(function () {
  const $ = (id) => document.getElementById(id);
  const tl = window.L || ((en) => en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const P = window.PHONE;
  const ZP = window.LANG === "zh" && window.ZH && window.ZH.phone;
  if (ZP) { P.groups = ZP.groups; P.guide = ZP.guide; }
  const U = ZP ? ZP.ui : { sections: "Sections", all: "All sections", close: "Close", other: "Other", read: "Reading version", readSub: "Everything on one page, printable",
    phone: "On your phone", phoneSub: "Save to Home Screen, read offline", prev: "Previous", next: "Next", top: "Back to top", toc: "Back to contents",
    using: "Using it", iphone: "iPhone (Safari)", android: "Android (Chrome)" };
  const isCourse = !!document.querySelector("nav button[data-section]");

  // --- Back to top (both pages); reading version also gets a Contents button ---
  const fab = document.createElement("div");
  fab.className = "fab";
  fab.innerHTML = (document.querySelector("nav.toc") ? `<button type="button" id="fab-toc" aria-label="${U.toc}">${tl("Contents", "目录")}</button>` : "") +
    `<button type="button" id="fab-top" aria-label="${U.top}">↑</button>`;
  document.body.appendChild(fab);
  const onScroll = () => fab.classList.toggle("show", window.scrollY > window.innerHeight * 1.5);
  window.addEventListener("scroll", onScroll, { passive: true });
  $("fab-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  if ($("fab-toc")) $("fab-toc").addEventListener("click", () => document.querySelector("nav.toc").scrollIntoView({ behavior: "smooth" }));

  if (isCourse) {
    // --- Sections menu ---
    const nav = document.querySelector("nav");
    const btn = document.createElement("button");
    btn.type = "button"; btn.id = "menu-btn"; btn.className = "menu-btn";
    btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = `☰ <span>${U.sections}</span>`;
    nav.insertBefore(btn, nav.firstChild);
    const sheet = document.createElement("div");
    sheet.id = "menu-sheet"; sheet.className = "menu-sheet"; sheet.hidden = true;
    sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-label", U.all);
    sheet.innerHTML = `<div class="menu-panel"><div class="menu-head"><strong>${U.all}</strong><button type="button" id="menu-close" aria-label="${U.close}">✕</button></div>` +
      P.groups.map(([g, items]) => `<p class="menu-group">${esc(g)}</p><div class="menu-grid">` +
        items.map(([id, t, d]) => `<button type="button" class="menu-item" data-goto="${id}"><strong>${esc(t)}</strong><small>${esc(d)}</small></button>`).join("") + `</div>`).join("") +
      `<p class="menu-group">${U.other}</p><div class="menu-grid"><a class="menu-item" href="read.html"><strong>${U.read}</strong><small>${U.readSub}</small></a>` +
      `<button type="button" class="menu-item" data-goto="start" data-phone="1"><strong>${U.phone}</strong><small>${U.phoneSub}</small></button></div></div>`;
    document.body.appendChild(sheet);
    const open = (v) => { sheet.hidden = !v; btn.setAttribute("aria-expanded", String(v)); document.body.classList.toggle("menu-open", v); if (v) $("menu-close").focus(); };
    btn.addEventListener("click", () => open(true));
    $("menu-close").addEventListener("click", () => open(false));
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) return open(false);
      const it = e.target.closest("[data-goto]"); if (!it) return;
      open(false);
      if (location.hash === "#" + it.dataset.goto) window.dispatchEvent(new HashChangeEvent("hashchange")); else location.hash = it.dataset.goto;
      if (it.dataset.phone) setTimeout(() => { const g = $("phone-guide"); if (g) { g.open = true; g.scrollIntoView({ behavior: "smooth" }); } }, 60);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !sheet.hidden) open(false); });

    // --- Previous / Next at the end of every section (in tab-bar order) ---
    const order = [...document.querySelectorAll("nav button[data-section]")].map((b) => [b.dataset.section, b.textContent.trim()]);
    order.forEach(([id], i) => {
      const sec = $(id); if (!sec) return;
      const prev = order[i - 1], next = order[i + 1];
      const pn = document.createElement("div");
      pn.className = "prevnext";
      pn.innerHTML = (prev ? `<a href="#${prev[0]}" class="pn-prev"><small>${U.prev}</small><strong>← ${esc(prev[1])}</strong></a>` : "<span></span>") +
        (next ? `<a href="#${next[0]}" class="pn-next"><small>${U.next}</small><strong>${esc(next[1])} →</strong></a>` : "<span></span>");
      sec.appendChild(pn);
    });

    // --- Keep the active tab visible in the tab bar ---
    const reveal = () => {
      const a = nav.querySelector("button.active");
      if (a) nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
    };
    window.addEventListener("hashchange", () => setTimeout(reveal, 0));
    setTimeout(reveal, 0);

    // --- Phone guide on Start here ---
    const G = P.guide;
    if ($("phone-guide-body")) {
      $("phone-guide-body").innerHTML =
        `<div class="phone-cols"><div><p><strong>${U.iphone}</strong></p><ol>${G.iphone.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>` +
        `<div><p><strong>${U.android}</strong></p><ol>${G.android.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div></div>` +
        `<p><strong>${U.using}</strong></p><ul>${G.use.map(([t, d]) => `<li><strong>${esc(t)}${tl(":", "：")}</strong> ${esc(d)}</li>`).join("")}</ul>`;
    }
  }

  // Opening a link to a section should not hide the header behind the tab bar
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  // The browser jumps to the element named in the hash after load; undo that once so the header shows.
  if (isCourse) {
    const top = () => window.scrollTo(0, 0);
    window.addEventListener("load", () => { top(); requestAnimationFrame(top); setTimeout(top, 60); });
  }

  // --- Offline support (network first, so updates always show when online) ---
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
})();
