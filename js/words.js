// Plain words: tap any underlined term for a plain-English explanation, and an optional Beginner mode.
// Works on the course (index.html) and the reading version (read.html). Load after every other script.
window.WORDS = {
  // [key, words as they appear in the text (case-sensitive, longest first is handled for you), plain explanation, glossary term]
  terms: [
    ["bpms", ["BPMS"], "The whole toolkit for running business processes: draw the steps, run them, hand work to people, watch progress and keep the rules.", "BPMS"],
    ["bpmn", ["BPMN"], "The picture language for processes. Circles start and end a process, boxes are work, diamonds are decisions, arrows show the order.", "BPMN"],
    ["pe", ["Process Engine"], "The part that actually runs your process, step by step, like a conductor following the score.", "Process Engine"],
    ["te", ["Task Engine"], "The part that hands work to people: it puts tasks in their inbox and waits until they finish.", "Task Engine"],
    ["is", ["Integration Server", "IS"], "The main webMethods server. Your services and the Process Engine run here.", "Integration Server (IS)"],
    ["mws", ["My webMethods Server", "My webMethods", "MWS"], "The website people log in to: task inboxes, monitoring and admin screens.", "My webMethods Server (MWS)"],
    ["designer", ["Designer"], "The desktop tool where you draw processes and write rules, then send them to the server.", null],
    ["model", ["process model", "process models", "Process model"], "The drawing of your process. Each saved version can be switched on to run.", null],
    ["instance", ["process instance", "process instances", "Process instance"], "One run of a process, like one order or one loan application. One model can have thousands of runs.", null],
    ["ruletask", ["Rule task", "Rule Task", "rule task", "rule tasks"], "A box in the process that asks the rules a question, like “approve or refer?”, and carries on with the answer.", "Rule task"],
    ["br", ["Business Rules"], "The webMethods rules component: decisions kept as tables you can change without touching the process.", null],
    ["dt", ["Decision table", "decision table", "decision tables"], "A spreadsheet-like rule: each row says IF these conditions, THEN this result.", "Decision table"],
    ["hot", ["Hot Deploy", "hot deploy"], "Update the rules on the live server without redeploying the process. Like changing a price list without reprinting the menu.", "Hot Deploy"],
    ["enable", ["Execution Enabled", "Enable for execution", "Enable for Execution", "enable for execution"], "The on-switch for a process version in My webMethods. Forget it and nothing starts: the most common beginner mistake.", "Execution Enabled"],
    ["build", ["Build and upload", "build and upload"], "The Designer action that sends your finished process to the server so it can run.", "Build and upload"],
    ["project", ["Process project", "process project"], "A folder in Designer that holds your processes. Every process must live in one.", "Process project"],
    ["audit", ["Process Audit database", "Process Audit", "audit trail"], "The history book: every step each run took, when, and any errors. Monitor reads from it.", "Process Audit database"],
    ["monitor", ["Monitor"], "The screen in My webMethods where you see running processes, their status and errors, and can resubmit them.", null],
    ["resubmit", ["Resubmit", "resubmit"], "Run a failed process again from a chosen step, after you fix the cause.", "Resubmit"],
    ["qos", ["Quality of service", "quality of service", "QoS"], "A per-process choice: safe and saved (slower), or kept in memory only (faster, but lost if the server fails).", "Quality of service (Process Engine)"],
    ["volatile", ["Volatile Tracking", "Volatile tracking", "volatile tracking"], "The “fast but forgetful” setting: status lives only in memory, so Monitor cannot show it.", "Volatile tracking"],
    ["usertask", ["user task", "user tasks", "User task", "User Task", "human task", "human tasks"], "A step that waits for a person, like a manager approving a request. It shows up in their inbox.", null],
    ["gateway", ["gateway", "gateways", "Gateway"], "A diamond in BPMN: the process picks which path to take, or splits to do things in parallel.", null],
    ["um", ["Universal Messaging"], "The webMethods messaging server. It carries messages between systems, like a post office.", "Universal Messaging"],
    ["trigger", ["Subscription trigger", "subscription trigger"], "A listener that starts a process, or wakes a waiting one, when a matching message arrives.", "Subscription trigger"],
    ["transition", ["Transition document", "transition document"], "The internal note the engine passes from one step to the next. You rarely see it.", "Transition document"],
    ["msgstart", ["Message start event", "message start event"], "A start circle that waits for a message; each message that arrives starts a new run.", "Message start event"],
    ["aware", ["Process Aware"], "A decision-table setting to tick when a rule can hand work to a person.", "Process Aware"],
    ["odmoc", ["ODMoC"], "ODM run for you by IBM in the cloud.", "ODMoC"],
    ["odm", ["ODM"], "IBM's dedicated decision engine: write, test and version business rules outside the process.", "ODM"],
    ["mcp", ["MCP"], "A common plug that lets AI agents call tools and read data in a standard way.", "MCP"],
    ["hitl", ["Human-in-the-loop", "human-in-the-loop", "human in the loop"], "A person checks or approves before an automated or AI action goes ahead.", "Human-in-the-loop"],
    ["agent", ["AI agents", "AI agent"], "Software that uses an AI model to read, decide and act on its own, within limits you set.", null],
    ["optimize", ["Optimize"], "webMethods' dashboard for business numbers (KPIs), like how long approvals take.", "Optimize"],
    ["eom", ["EOM", "EOS"], "End of Maintenance and End of Support: dates after which a version gets no more fixes or help.", "EOM / EOS"],
    ["boat", ["BOAT"], "Gartner's name for platforms that combine processes, connections and AI agents.", "BOAT"]
  ],
  // Sections a beginner can skip on the first pass
  advanced: ["knowledge", "teach", "lifecycle", "architecture", "patterns", "scan", "market"],
  // “In plain words” box shown at the top of each beginner section in Beginner mode
  plain: {
    start: "Pick who you are and follow 3 to 5 steps. You do not need to install anything to begin.",
    overview: "What IBM webMethods is made of, in one table. Skim it; you will meet each part again later.",
    howto: "Choose your role to get step-by-step instructions, like a recipe.",
    lab: "Build your first process yourself in about 30 minutes. Tick each step as you go.",
    decisions: "Play with a real-looking decision table: move the limits, test an application, and see why rules change faster than processes.",
    trouble: "Something not working? Search the symptom, read the likely cause, try the fix.",
    bpmn: "The picture language for processes: circles start and end, boxes are work, diamonds are decisions.",
    cases: "Real examples from start to finish, each with the lesson behind it.",
    simulator: "Run a pretend process step by step and watch what the engine does. Nothing can break.",
    glossary: "Every word in the course in one searchable list. You can also tap any underlined word anywhere.",
    quiz: "Check yourself. Wrong answers are fine: each one explains why."
  }
};

(function () {
  const W = window.WORDS, A = window.ACADEMY || { glossary: [] };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isCourse = !!document.querySelector("nav button[data-section]");
  const KEY = "wm-academy-words-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } };

  // ---------- Glossary lookup ----------
  const gloss = {};
  A.glossary.forEach(([t, d]) => { gloss[t.toLowerCase()] = [t, d]; });
  const byKey = {}, byWord = {};
  W.terms.forEach(([k, words, plain, g]) => {
    byKey[k] = { name: words[0], plain, tech: g ? gloss[g.toLowerCase()] : null };
    words.forEach((w) => { byWord[w] = k; });
  });
  const words = Object.keys(byWord).sort((a, b) => b.length - a.length).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const RX = new RegExp(`(?<![\\w-])(${words.join("|")})(?![\\w-])`, "g");

  // ---------- Underline terms ----------
  const SKIP = "a, button, input, textarea, select, label, summary, code, pre, script, style, svg, figure, h1, h2, h3, h4, nav, header, " +
    ".term, .quiz-q, #ex-sort, #glossary, #r-gloss, .menu-sheet, .prevnext, .fab, .role-chips, .sources, #term-pop, .plain-box, .adv-banner, [contenteditable]";
  // One underline per term per card, so pages stay calm
  const scopeOf = (el) => el.closest(".card, .lab-stage, .trouble, .kb-topic, section") || document.body;

  function wrap(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (!n.nodeValue.trim() || !n.parentElement || n.parentElement.closest(SKIP)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const text = node.nodeValue;
      RX.lastIndex = 0;
      if (!RX.test(text)) return;
      const scope = scopeOf(node.parentElement);
      const seen = new Set([...scope.querySelectorAll(".term")].map((b) => b.dataset.t));
      const frag = document.createDocumentFragment();
      let last = 0, changed = false, m;
      RX.lastIndex = 0;
      while ((m = RX.exec(text))) {
        const k = byWord[m[1]];
        if (seen.has(k)) continue;
        seen.add(k); changed = true;
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const b = document.createElement("button");
        b.type = "button"; b.className = "term"; b.dataset.t = k; b.textContent = m[1];
        b.setAttribute("aria-haspopup", "dialog");
        b.title = "What does this mean?";
        frag.appendChild(b);
        last = m.index + m[1].length;
      }
      if (!changed) return;
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  // ---------- Pop-up explanation ----------
  const pop = document.createElement("div");
  pop.id = "term-pop"; pop.hidden = true;
  pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "Term explained");
  document.body.appendChild(pop);
  let opener = null;
  const glossHref = isCourse ? "#glossary" : (document.getElementById("r-gloss") ? "#r-gloss" : "index.html#glossary");

  function show(btn) {
    const t = byKey[btn.dataset.t]; if (!t) return;
    opener = btn;
    pop.innerHTML = `<div class="tp-head"><strong>${esc(t.tech ? t.tech[0] : t.name)}</strong><button type="button" class="tp-close" aria-label="Close">✕</button></div>` +
      `<p class="tp-plain">${esc(t.plain)}</p>` +
      (t.tech ? `<p class="tp-tech"><span>Technically:</span> ${esc(t.tech[1])}</p>` : "") +
      `<a class="tp-more" href="${glossHref}">All terms in the glossary →</a>`;
    pop.hidden = false;
    if (window.innerWidth > 600) {
      const r = btn.getBoundingClientRect(), w = Math.min(340, window.innerWidth - 24);
      pop.style.width = w + "px";
      pop.style.left = Math.max(12, Math.min(r.left, window.innerWidth - w - 12)) + "px";
      const below = r.bottom + 8, h = pop.offsetHeight;
      pop.style.top = (below + h > window.innerHeight - 8 ? Math.max(8, r.top - h - 8) : below) + "px";
    } else {
      pop.style.left = pop.style.top = pop.style.width = "";
    }
    pop.querySelector(".tp-close").focus({ preventScroll: true });
  }
  function hide(back) {
    if (pop.hidden) return;
    pop.hidden = true;
    if (back && opener) opener.focus({ preventScroll: true });
  }
  // Capture phase, so a term inside a clickable card opens the explanation and nothing else
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest(".term");
    if (b) { e.preventDefault(); e.stopPropagation(); return show(b); }
    if (e.target.closest && e.target.closest(".tp-close")) return hide(true);
    if (!pop.hidden && !pop.contains(e.target)) hide(false);
    if (e.target.closest && e.target.closest(".tp-more")) {
      hide(false);
      if (isCourse && location.hash === "#glossary") window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(true); });
  window.addEventListener("scroll", () => { if (window.innerWidth > 600) hide(false); }, { passive: true });
  window.addEventListener("hashchange", () => hide(false));

  // ---------- Re-run when sections re-render ----------
  const main = document.querySelector("main") || document.body;
  let timer = 0;
  const observer = new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(run, 80); });
  function run() {
    observer.disconnect();
    wrap(main);
    observer.observe(main, { childList: true, subtree: true });
  }
  run();

  if (!isCourse) return;

  // ---------- Beginner mode (course only) ----------
  const adv = new Set(W.advanced);
  const titles = {};
  (window.PHONE ? window.PHONE.groups : []).forEach(([, items]) => items.forEach(([id, t]) => { titles[id] = t; }));
  const order = [...document.querySelectorAll("nav button[data-section]")].map((b) => b.dataset.section);
  const title = (id) => titles[id] || id;

  // Mark advanced entries in the tab bar and the ☰ menu
  document.querySelectorAll("nav button[data-section], #menu-sheet [data-goto]").forEach((el) => {
    if (adv.has(el.dataset.section || el.dataset.goto)) el.classList.add("adv-nav");
  });
  // Plain-words box and advanced banner at the top of each section
  order.forEach((id) => {
    const sec = $(id); if (!sec) return;
    const box = document.createElement("div");
    if (adv.has(id)) {
      box.className = "adv-banner";
      box.innerHTML = `🧭 <strong>Advanced section.</strong> Fine to skip on your first pass; come back once the hands-on lab makes sense. <a href="#start">← Back to Start here</a>`;
    } else {
      box.className = "plain-box";
      box.innerHTML = `🌱 <strong>In plain words:</strong> ${esc(W.plain[id] || "")}`;
    }
    sec.insertBefore(box, sec.firstChild);
  });
  const menuNote = document.createElement("p");
  menuNote.className = "menu-note";
  menuNote.innerHTML = `🌱 Beginner mode shows ${order.length - adv.size} of ${order.length} sections. <button type="button" class="link" data-bm="off">Show all</button>`;
  const panel = document.querySelector("#menu-sheet .menu-panel");
  if (panel) panel.insertBefore(menuNote, panel.children[1] || null);

  // Previous / Next: skip advanced sections in Beginner mode
  function relink(on) {
    const visible = (id) => !on || !adv.has(id);
    order.forEach((id, i) => {
      const pn = $(id) && $(id).querySelector(".prevnext"); if (!pn) return;
      let p = i - 1; while (p >= 0 && !visible(order[p])) p--;
      let n = i + 1; while (n < order.length && !visible(order[n])) n++;
      const prev = order[p], next = order[n];
      pn.innerHTML = (prev ? `<a href="#${prev}" class="pn-prev"><small>Previous</small><strong>← ${esc(title(prev))}</strong></a>` : "<span></span>") +
        (next ? `<a href="#${next}" class="pn-next"><small>Next</small><strong>${esc(title(next))} →</strong></a>` : "<span></span>");
    });
  }

  // Header switch
  const toggle = document.createElement("button");
  toggle.type = "button"; toggle.id = "bm-toggle"; toggle.className = "mode-toggle";
  const head = document.querySelector("header");
  if (head) head.appendChild(toggle);

  function set(on, persist) {
    document.body.classList.toggle("beginner", on);
    toggle.setAttribute("aria-pressed", String(on));
    toggle.innerHTML = on ? "🌱 Beginner mode: <strong>on</strong>" : "🌱 New here? <strong>Beginner mode</strong>";
    relink(on);
    if (persist) { const s = load(); s.beginner = on; save(s); }
  }
  toggle.addEventListener("click", () => set(!document.body.classList.contains("beginner"), true));
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-bm]");
    if (b) set(b.dataset.bm === "on", true);
  });
  set(!!load().beginner, false);
})();
