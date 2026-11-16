// "Who are you?" role paths and the clickable "BPMS in one picture" map.
// Choice and progress stay in this browser only.
window.PATHS = {
  roles: [
    { id: "new", icon: "🌱", name: "New here", intro: "No webMethods experience needed. Five short stops, about 30 minutes.",
      steps: [
        { go: "crash", t: "The 10-minute course", why: "Know nothing yet? Five short steps and three checks." },
        { go: "basics", t: "Basics 101", why: "Seven short lessons: processes, tasks, rules and the engine." },
        { go: "simulator", t: "Run a process", why: "Watch a loan move through a rule and a human task." },
        { go: "howto", role: "user", t: "How to use: business user", why: "The everyday work: accept and complete tasks." },
        { go: "quiz", t: "Quiz", why: "Check what stuck." }
      ] },
    { id: "customer", icon: "💼", name: "Customer", intro: "Is this right for us, and is it mature? About 20 minutes.",
      steps: [
        { go: "start", t: "Start here: before and after a BPMS", why: "The business problem in two minutes." },
        { go: "cases", t: "Worked cases", why: "Approvals, loans and logistics exceptions you will recognise." },
        { go: "knowledge", kb: "engine", t: "How it behaves under load", why: "Quality of service: guaranteed or fast, per process." },
        { go: "howto", role: "analyst", t: "Change a rule without IT", why: "How the business changes a policy with Hot Deploy." },
        { go: "market", t: "Where the market is going", why: "Upgrade deadlines, regulation and agents." }
      ] },
    { id: "user", icon: "📥", name: "Business user", intro: "You receive tasks from processes. About 12 minutes.",
      steps: [
        { go: "howto", role: "user", t: "Work your tasks", why: "My Inbox → Accept → Complete, plus a cheat sheet and a self-check." },
        { go: "trouble", area: "Tasks", t: "When a task misbehaves", why: "Can't accept, can't find, delegated but stuck." },
        { go: "glossary", t: "Glossary", why: "Look up any word you meet." },
        { go: "quiz", t: "Quiz", why: "Check what stuck." }
      ] },
    { id: "dev", icon: "🛠️", name: "Process developer", intro: "You build processes in Designer. About 1 hour including the lab.",
      steps: [
        { go: "overview", t: "The product family", why: "Which component does what." },
        { go: "knowledge", kb: "engine", t: "Process Engine and quality of service", why: "The settings that decide speed versus guarantees." },
        { go: "howto", role: "dev", t: "Model, build and switch on", why: "Including the step everyone misses: Execution Enabled." },
        { go: "lab", t: "Hands-on lab", why: "Your first running process in 30 minutes." },
        { go: "trouble", area: "Start and deploy", t: "When it won't start", why: "The flowchart and the usual causes." }
      ] },
    { id: "analyst", icon: "📐", name: "Business analyst", intro: "You own the rules and the policy. About 20 minutes.",
      steps: [
        { go: "knowledge", kb: "rules", t: "webMethods Business Rules", why: "Rule projects, decision tables and where they run." },
        { go: "howto", role: "analyst", t: "Change a rule safely", why: "Lock, edit, verify, Hot Deploy." },
        { go: "patterns", t: "Patterns", why: "Agent proposes, rules decide, process executes." },
        { go: "trouble", area: "Rules", t: "When a rule won't deploy", why: "Greyed-out Hot Deploy and other traps." }
      ] },
    { id: "ops", icon: "🚦", name: "Operations", intro: "You keep processes healthy. About 20 minutes.",
      steps: [
        { go: "architecture", t: "Architecture", why: "Engines, databases and where history lives." },
        { go: "howto", role: "ops", t: "Watch, fix and resubmit", why: "Instance states, permissions and a cheat sheet." },
        { go: "knowledge", kb: "history", t: "Execution history and audit", why: "What is logged, and where task history really is." },
        { go: "trouble", area: "Monitor and operations", t: "Monitor problems", why: "Missing buttons, invisible instances, odd resubmits." }
      ] },
    { id: "trainer", icon: "🎓", name: "Trainer", intro: "You teach a team or a customer group. About 30 minutes to prepare.",
      steps: [
        { go: "teach", t: "Teach a class", why: "A 3-hour agenda, print list and tips." },
        { go: "howto", role: "demo", t: "Customer demo script", why: "Six beats in ten minutes." },
        { go: "lab", t: "Hands-on lab", why: "The exercise pairs will do in class." },
        { go: "trouble", t: "Troubleshooting", why: "What to say when someone gets stuck." }
      ] }
  ],

  // The map: each box links to the place that teaches that step.
  map: [
    { k: "model", n: 1, t: ["Model the process", "Designer · BPMN"], go: "howto", role: "dev", r: "r-bpmn" },
    { k: "build", n: 2, t: ["Build and upload", "Process Developer mode"], go: "howto", role: "dev", r: "r-howto" },
    { k: "enable", n: 3, t: ["Enable for execution", "the step beginners miss!"], go: "trouble", flow: 1, r: "r-trouble" },
    { k: "run", n: 4, t: ["Process Engine runs it", "inside Integration Server"], go: "knowledge", kb: "engine", r: "r-knowledge" },
    { k: "people", n: 5, t: ["People work tasks", "My Inbox"], go: "howto", role: "user", r: "r-howto" },
    { k: "rules", n: 6, t: ["Rules decide", "change via Hot Deploy"], go: "howto", role: "analyst", r: "r-howto" },
    { k: "monitor", n: 7, t: ["Monitor and fix", "suspend · resubmit"], go: "howto", role: "ops", r: "r-howto" },
    { k: "audit", n: 8, t: ["Audit history", "Process Audit DB"], go: "architecture", r: "r-history" },
    { k: "agent", n: 9, t: ["AI agents propose", "rules decide"], go: "start", guard: 1, r: "r-guard" }
  ]
};

(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const P = window.PATHS;
  const isRead = !!document.querySelector("nav.toc");

  // ---------- the map (SVG) ----------
  function mapSvg(linkFor) {
    const G = window.DIAGRAMS;
    if (!G) return "";
    const pos = {
      model: [40, 8, 260, 46, "soft"], build: [40, 74, 260, 46, "soft"], enable: [40, 140, 260, 46, "warn"], run: [40, 206, 260, 46, "hl"],
      people: [6, 288, 158, 50, "ok"], rules: [176, 288, 158, 50, "agent"], monitor: [6, 372, 158, 50, "soft"],
      agent: [176, 372, 158, 50, "agent dashed"], audit: [40, 458, 260, 46, "soft"]
    };
    const nodes = P.map.map((m) => {
      const [x, y, w, h, cls] = pos[m.k];
      const inner = G.box(x, y, w, h, cls, m.t, 13) +
        `<circle cx="${x + 3}" cy="${y + 3}" r="10" class="num"/><text x="${x + 3}" y="${y + 7}" class="numt">${m.n}</text>`;
      const href = linkFor(m);
      return href ? `<a href="${href}" class="map-node" data-k="${m.k}" aria-label="${esc(m.n + ". " + m.t.join(", "))}">${inner}</a>` : inner;
    }).join("");
    const A = (d, o) => G.arrow("map", d, o || {});
    const edges = [
      A("M170,54 V72"), A("M170,120 V138"), A("M170,186 V204"),
      A("M120,252 L86,286"), A("M220,252 L254,286"),
      A("M255,372 V340", { dash: true, label: "proposes", lx: 262, ly: 362, anchor: "start" }),
      A("M85,422 V456"), A("M255,422 V456", { dash: true }),
      `<text x="170" y="444" class="note" text-anchor="middle">everything is logged</text>`,
      `<text x="170" y="526" class="note" text-anchor="middle">Numbers show the order a request flows through.</text>`
    ].join("");
    return G.svg("map", 348, 540, "IBM webMethods BPMS in one picture", `<g transform="translate(6,6)">${edges + nodes}</g>`, false);
  }

  if (isRead) {
    // Static map + "which chapters should I read?" table in chapter 1 (the 10-minute course is interactive only; Basics covers it here)
    const why = document.getElementById("r-why");
    if (why) {
      const fig = `<figure class="dg" data-dg="map">${mapSvg((m) => "#" + m.r)}<figcaption><strong>IBM webMethods BPMS in one picture.</strong> From model to audit trail; each box links to the chapter that explains it.</figcaption></figure>`;
      const rid = { start: "r-why", overview: "r-overview", basics: "r-basics", knowledge: "r-knowledge", howto: "r-howto", lab: "r-lab", trouble: "r-trouble", teach: "r-teach",
        quiz: "r-quiz", glossary: "r-glossary", cases: "r-cases", market: "r-market", patterns: "r-patterns", architecture: "r-arch" };
      const chap = (go) => {
        const sec = document.getElementById(rid[go] || ""), h = sec && sec.querySelector("h2"), m = h && h.textContent.match(/^(\d+)\./);
        return m ? "ch. " + m[1] : "interactive version";
      };
      const rows = P.roles.map((r) => `<tr><td><strong>${r.icon} ${esc(r.name)}</strong></td><td>${r.steps.filter((st) => st.go !== "crash").map((st) => esc(st.t) + " (" + esc(chap(st.go)) + ")").join(" → ")}</td></tr>`).join("");
      why.querySelector("h2").insertAdjacentHTML("afterend", fig +
        `<h3>Which chapters should I read?</h3><div class="table-wrap"><table id="r-paths"><tr><th>You are</th><th>Read in this order</th></tr>${rows}</table></div>`);
    }
    return;
  }

  // ---------- interactive: map ----------
  if ($("bpms-map")) $("bpms-map").innerHTML = `<figure class="dg map">${mapSvg((m) => "#" + m.go)}</figure>`;

  // Deep links: section + role tab / knowledge topic / troubleshooting area or flowchart / agent guard
  function land(o) {
    setTimeout(() => {
      if (o.role) { const b = document.querySelector(`#howto-tabs [data-role="${o.role}"]`); if (b) b.click(); }
      if (o.area) { const b = document.querySelector(`#tr-areas [data-area="${o.area}"]`); if (b) b.click(); }
      if (o.flow) { const d = document.querySelector("#trouble details.dg-more"); if (d) { d.open = true; setTimeout(() => d.scrollIntoView({ behavior: "smooth", block: "start" }), 80); } }
      if (o.kb) { const el = document.getElementById("kb-" + o.kb); if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }
      if (o.guard) { const el = document.getElementById("ex-guard"); if (el) setTimeout(() => el.closest(".card").scrollIntoView({ behavior: "smooth", block: "start" }), 80); }
    }, 30);
  }
  function go(o) {
    if (location.hash === "#" + o.go) window.dispatchEvent(new HashChangeEvent("hashchange")); else location.hash = o.go;
    land(o);
  }
  document.addEventListener("click", (e) => {
    const n = e.target.closest("a.map-node");
    if (!n) return;
    e.preventDefault();
    go(P.map.find((m) => m.k === n.dataset.k));
  });

  // ---------- interactive: role paths ----------
  const KEY = "wm-academy-path-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } };
  const st = Object.assign({ role: "new", done: {} }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* this visit only */ } };
  const role = () => P.roles.find((r) => r.id === st.role) || P.roles[0];
  const stepKey = (r, i) => `${r.id}:${i}`;
  const mins = (s) => { const t = window.READTIMES || {}; return s.go === "lab" ? 30 : (t[s.go] || ""); };

  $("role-chips").innerHTML = P.roles.map((r) => `<button type="button" class="role-chip" role="radio" data-r="${r.id}"><span>${r.icon}</span> ${esc(r.name)}</button>`).join("");
  function paint() {
    const r = role();
    document.querySelectorAll(".role-chip").forEach((b) => { const on = b.dataset.r === r.id; b.classList.toggle("selected", on); b.setAttribute("aria-checked", String(on)); });
    const n = r.steps.filter((_, i) => st.done[stepKey(r, i)]).length;
    $("path-intro").innerHTML = `${esc(r.intro)} <strong class="path-count">${n} / ${r.steps.length} done</strong>`;
    $("beginner-path").innerHTML = r.steps.map((s, i) => `<li class="${st.done[stepKey(r, i)] ? "done-step" : ""}">
      <a href="#${s.go}" data-step="${i}"><strong>${esc(s.t)}</strong></a>${mins(s) ? ` <span class="rt">· ${mins(s)} min</span>` : ""}<br><small>${esc(s.why)}</small></li>`).join("");
  }
  $("role-chips").addEventListener("click", (e) => { const b = e.target.closest(".role-chip"); if (!b) return; st.role = b.dataset.r; save(); paint(); });
  $("beginner-path").addEventListener("click", (e) => {
    const a = e.target.closest("a[data-step]"); if (!a) return;
    e.preventDefault();
    const r = role(), i = +a.dataset.step; st.done[stepKey(r, i)] = 1; save(); paint();
    go(r.steps[i]);
  });

  // "Your path: next step" at the end of each section that is on the path
  function nextBanner() {
    document.querySelectorAll(".path-next").forEach((x) => x.remove());
    const cur = (location.hash || "#start").slice(1), r = role();
    const i = r.steps.findIndex((s) => s.go === cur);
    if (i < 0 || cur === "start" && i === 0 && !st.done[stepKey(r, 0)]) return;
    st.done[stepKey(r, i)] = 1; save(); paint();
    const sec = document.getElementById(cur), pn = sec && sec.querySelector(".prevnext");
    if (!sec) return;
    const nxt = r.steps[i + 1];
    const html = `<div class="path-next">${r.icon} <strong>Your path (${esc(r.name)})</strong>: step ${i + 1} of ${r.steps.length}. ` +
      (nxt ? `<a href="#${nxt.go}" data-next="${i + 1}">Next: ${esc(nxt.t)} →</a>` : `<span>Path complete 🎉 <a href="#start">Pick another role</a></span>`) + `</div>`;
    if (pn) pn.insertAdjacentHTML("beforebegin", html); else sec.insertAdjacentHTML("beforeend", html);
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest(".path-next a[data-next]"); if (!a) return;
    e.preventDefault(); const r = role(), i = +a.dataset.next; st.done[stepKey(r, i)] = 1; save(); go(r.steps[i]);
  });
  window.addEventListener("hashchange", () => setTimeout(nextBanner, 0));
  paint(); setTimeout(nextBanner, 0);
})();
