// Unplugged classroom kit (#54): play the Process Engine, the rules and Sam's inbox with a printed board,
// coins and cards. Every product claim on a card links to the section of the course that cites it.
// English text lives here; the Chinese text is in js/zh/kit.js (window.ZH.kit) and has the same shape.
(function () {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const EN = {
    title: "Unplugged classroom kit: play the engine",
    sub: "A board, coins and cards for a 40-minute table game. Teams play the Process Engine, the rules and the manager's inbox, write their own audit log, then compare it with what Monitor would show. No laptops, no licences. By Daniel Yuanpeng Xu.",
    back: "← Back to the course", printBoard: "Print the board (A3)", printCards: "Print cards and sheets (A4 / Letter)", printAll: "Print everything",
    fictional: "All people, requests and amounts are fictional. Independent learning resource; not affiliated with or endorsed by IBM. Product names are trademarks of their owners.",
    // facilitator notes
    notes: "Facilitator notes",
    setupH: "Set up (5 minutes before the class)",
    setup: [
      "Print the board on A3 (or on two A4 sheets taped together), one per team of 4 to 6 people.",
      "Print the cards on A4 or Letter and cut along the dashed lines. Each team gets the 12 request cards, rule card version 1, the four-eyes control card and an audit log sheet. Keep rule card version 2 and the event cards yourself.",
      "Give each team a handful of coins: one coin is one running instance (one request travelling through the process).",
      "Optional: open the course on a projector at Teach a class, so you can show the matching section after each round."
    ],
    rolesH: "Roles at each table",
    roles: [
      ["Engine", "Moves each coin along the arrows, one step at a time, and says out loud which step runs next. Never decides anything itself."],
      ["Rules", "Holds the rule card. When a coin reaches “Check the approval rule”, reads the card and answers: approve automatically, or send to the manager."],
      ["Sam's inbox", "Plays Sam, the manager. When a coin reaches his task, reads the manager's note at the bottom of the request card and approves or rejects."],
      ["Operations", "Handles the event cards you hand out: reassigns tasks, fixes failed steps and resubmits."],
      ["Auditor", "Writes one row in the audit log for every step that runs: which request, which step, who or what did it, the result and the rule version."]
    ],
    rolesNote: "Fewer than five people? One person can play Engine and Auditor together.",
    roundsH: "Three rounds of 10 minutes, then a debrief",
    rounds: [
      ["Round 1 · Run as is", "Play requests R1 to R6 with rule card version 1. Goal: every coin reaches an end event and every step is in the audit log.",
        "Ask: which requests never reached a person? That is the rule doing its job.", "#cases"],
      ["Round 2 · Change the rule mid-game", "Play R7 and R8. Then hand out event card E6 (Hot Deploy) and swap in rule card version 2. Play R9 and R10; R9 also triggers event card E8 (four-eyes).",
        "Ask: which requests used version 1 and which version 2? Did anyone have to rebuild the board? (No: the process did not change, only the rule.)", "#decisions"],
      ["Round 3 · Incidents", "Play R11 and R12. While they run, hand out two event cards from E1, E2, E3, E4, E5 and E7. Operations handles them; the Auditor logs every action.",
        "Ask: which incident would you have noticed only from Monitor, and which one from an angry user?", "#drills"]
    ],
    debriefH: "Debrief: your audit log against Monitor (10 minutes)",
    debrief: [
      ["Put two audit logs side by side. Would Monitor show the same rows? Monitor reads the Process Audit database: process and step status, transitions and errors. In 10.15, who accepted, delegated or completed a task comes from the Task Engine audit instead, because task logging into Process Audit is off by default.", "#knowledge"],
      ["Which rows would be missing if Volatile Tracking had been on for this process?", "#knowledge"],
      ["Find the row where the rule version changed. How would an auditor know which version decided each request?", "#controls"],
      ["Which step could a rule take over completely? Which needs a person? Try the same question in Swipe sort.", "#swipe"]
    ],
    keyH: "Answer key: where each request should go",
    keyCols: ["Card", "Rule version", "Route", "Expected end"],
    // the board
    board: "The board",
    boardNote: "Put a coin on “Request submitted” for each new request. Move it one arrow at a time.",
    lanes: ["Requesters", "Rules", "Sam (manager)", "Systems"],
    nodes: {
      start: "Request submitted", rule: ["Check the", "approval rule"], ruleSub: "read the rule card", gw1: "Auto-approved?", task: ["Approve the", "request"], taskSub: "Sam's inbox · 48 h timer",
      gw2: "Approved?", order: ["Create the", "order"], orderSub: "ordering system", endOk: "Order created", endOk2: "requester notified", endNo: "Rejected,", endNo2: "requester notified",
      yes: "yes", no: "no", approved: "approved", rejected: "rejected", timer: "48 h", coin: "coin", audit: "Every step that runs → one row in the audit log sheet"
    },
    // the cards
    cards: "Cards to cut out",
    reqLabel: "Request", amountLabel: "Amount", ccLabel: "Cost centre", urgLabel: "Urgency", noteLabel: "Manager's note (read only if the request reaches Sam)", roundLabel: "Round",
    urgency: { low: "low", normal: "normal", urgent: "urgent" },
    requests: [
      { id: "R1", round: 1, who: "Mia", item: "Laptop (her old one is six years old)", amount: 1200, cc: "IT-100", urg: "normal", note: "Approve: the old laptop is out of warranty." },
      { id: "R2", round: 1, who: "Leo", item: "Second monitor", amount: 320, cc: "IT-100", urg: "low", note: "Approve." },
      { id: "R3", round: 1, who: "Priya", item: "Rules modelling course", amount: 850, cc: "OPS-300", urg: "normal", note: "Approve: it is in her development plan." },
      { id: "R4", round: 1, who: "Omar", item: "On-call phone", amount: 450, cc: "OPS-300", urg: "urgent", note: "Approve." },
      { id: "R5", round: 1, who: "Noor", item: "Conference trip", amount: 2400, cc: "MKT-200", urg: "normal", note: "Reject: no travel budget left this quarter." },
      { id: "R6", round: 1, who: "Ben", item: "Keyboard", amount: 90, cc: "IT-100", urg: "low", note: "Approve." },
      { id: "R7", round: 2, who: "Kai", item: "Design software licence", amount: 1100, cc: "IT-100", urg: "urgent", note: "Approve." },
      { id: "R8", round: 2, who: "Lena", item: "Office chair", amount: 640, cc: "OPS-300", urg: "normal", note: "Approve: the doctor asked for it." },
      { id: "R9", round: 2, who: "Sam", item: "Team offsite day", amount: 780, cc: "MKT-200", urg: "normal", note: "Sam wrote this request himself. See event card E8." },
      { id: "R10", round: 2, who: "Mia", item: "Docking station", amount: 260, cc: "IT-100", urg: "normal", note: "Approve." },
      { id: "R11", round: 3, who: "Leo", item: "Test server", amount: 9800, cc: "IT-100", urg: "urgent", note: "Approve: the old test server failed." },
      { id: "R12", round: 3, who: "Priya", item: "Diagram tool", amount: 540, cc: "MKT-200", urg: "normal", note: "Reject: the team already has a licence." }
    ],
    ruleH: "Rule card", ruleV: "version",
    rules: [
      { v: 1, lines: ["Amount up to $500 → approve automatically.", "Above $500 → send to the manager (Sam)."], foot: "The process only routes on the answer. The rule lives outside the process, so it can change without rebuilding it." },
      { v: 2, lines: ["Cost centre IT-100: up to $1,500 → approve automatically.", "Every other cost centre: up to $500 → approve automatically.", "Everything else → send to the manager (Sam)."], foot: "Swap this card in when event card E6 is played. Requests that already passed the rule step keep their answer." }
    ],
    controlH: "Control card · four-eyes",
    control: ["Nobody approves their own request.", "If the requester is the person the task would go to, send it to the next manager up (the facilitator plays this person)."],
    controlFoot: "Four-eyes approval and segregation of duties: see Controls in the course.",
    eventH: "Event card", seeLabel: "In the course:",
    events: [
      { id: "E1", icon: "⏰", title: "48 hours pass", text: "Sam has not answered a task in his inbox for 48 hours. The task's timer fires: the task escalates to Sam's deputy (the facilitator), who decides it now.", log: "Log it: “timer fired, escalated”.", see: ["Patterns: timer escalation", "#patterns"] },
      { id: "E2", icon: "🏖️", title: "Sam is on holiday", text: "Operations reassigns all of Sam's open tasks to Priya in Task List Management. Priya plays Sam's inbox until the end of the round.", log: "Log one row per reassigned task.", see: ["How to use: Operations", "#howto"] },
      { id: "E3", icon: "🔌", title: "The ordering system is down", text: "The next “Create the order” step fails. The coin stops there. When the facilitator says the system is back, Operations presses Resubmit and the step runs again. If the step is not safe to run twice, the order would be created twice.", log: "Log the failure and the resubmit.", see: ["How to use: Operations (resubmit)", "#howto"] },
      { id: "E4", icon: "📦", title: "A new version, not switched on", text: "Leo uploads version 2 of the process (it adds a “notify finance” step) but forgets to tick Execution Enabled. New uploads are not enabled by default, and only one version can be enabled at a time, so new requests keep following version 1.", log: "Log which version each new request follows.", see: ["Troubleshooting: the process never starts", "#trouble"] },
      { id: "E5", icon: "💥", title: "The server restarts", text: "The server restarts while a coin sits between two steps. If Volatile Tracking was on for this process, its status was kept only in memory: Monitor shows nothing for that request. With Volatile Tracking off (the default), the status is in the database.", log: "Cross out that request's rows if tracking was volatile.", see: ["Knowledge base: quality of service", "#knowledge"] },
      { id: "E6", icon: "🔁", title: "Hot Deploy a new rule", text: "Priya changes the approval rule and Hot Deploys it. Swap in rule card version 2. Nobody rebuilds the process. Requests that already passed the rule step keep their answer; new ones use version 2.", log: "From now on, write “v2” in the rule-version column.", see: ["How to use: Business analyst (Hot Deploy)", "#howto"] },
      { id: "E7", icon: "📨", title: "Sam delegates", text: "Sam delegates one task from his inbox to Priya. Priya must accept it before she can work on it. The delegation is recorded.", log: "Log the delegation and the acceptance.", see: ["How to use: Business user (delegate)", "#howto"] },
      { id: "E8", icon: "🪞", title: "Sam's own request", text: "Request R9 comes from Sam and would land in his own inbox. Use the four-eyes control card: the next manager up (the facilitator) decides it.", log: "Log who approved, not just “approved”.", see: ["Controls: four-eyes approval", "#controls"] }
    ],
    logH: "Audit log sheet", logTeam: "Team:", logCols: ["#", "Round", "Request", "Step", "Who or what", "Result", "Rule version"],
    logFoot: "Monitor shows rows like these from the Process Audit database. After the game, compare yours with another team's.",
    // answer key rows: [card, rule version, route, end]
    route: { auto: "rule → order", mgr: "rule → Sam → order", mgrNo: "rule → Sam → rejected", four: "rule → next manager up (four-eyes)" },
    endOk: "order created", endNo: "rejected", endFac: "facilitator decides"
  };

  const Z = window.LANG === "zh" && window.ZH && window.ZH.kit;
  const T = Z || EN;
  // Numbers, ids and rounds always come from the English data; Chinese replaces only the words.
  const reqs = EN.requests.map((r, i) => Object.assign({}, r, Z ? Z.requests[i] : {}));
  const events = EN.events.map((e, i) => Object.assign({}, e, Z ? Z.events[i] : {}));
  const rules = EN.rules.map((r, i) => Object.assign({}, r, Z ? Z.rules[i] : {}));
  const money = (n) => "$" + n.toLocaleString("en-US");
  const course = (hash) => "index.html" + (window.LANG === "zh" ? "?lang=zh" : "") + hash;

  // Expected route for each request under the rule version in force when it is played (see the rounds).
  function decide(r, v) {
    const own = r.id === "R9";
    const auto = v === 1 ? r.amount <= 500 : (r.cc === "IT-100" ? r.amount <= 1500 : r.amount <= 500);
    if (auto) return [T.route.auto, T.endOk];
    if (own) return [T.route.four, T.endFac];
    return /^(Reject|驳回)/.test(r.note) ? [T.route.mgrNo, T.endNo] : [T.route.mgr, T.endOk];
  }
  const versionOf = (r) => (r.round === 1 || r.id === "R7" || r.id === "R8" ? 1 : 2);

  // ---------- the board (SVG, black and white friendly) ----------
  function board() {
    const N = T.nodes, W = 1400, H = 820, lanes = [[40, 210], [210, 380], [380, 550], [550, 720]];
    const t = (x, y, s, o) => `<text x="${x}" y="${y}" text-anchor="${(o && o.a) || "middle"}" font-size="${(o && o.fs) || 22}"${o && o.b ? ' font-weight="700"' : ""}>${esc(s)}</text>`;
    const lines = (x, y, arr, fs) => arr.map((s, i) => t(x, y + i * (fs || 22) * 1.2, s, { fs: fs || 22, b: true })).join("");
    const coin = (x, y) => `<circle cx="${x}" cy="${y}" r="17" class="coin"/>`;
    const arrow = (d, label, lx, ly) => `<path d="${d}" class="ln" marker-end="url(#kit-ah)"/>` + (label ? t(lx, ly, label, { fs: 19 }) : "");
    let s = `<svg viewBox="0 0 ${W} ${H}" class="kit-board" role="img" aria-label="${esc(T.board)}" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="kit-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#161616"/></marker></defs>`;
    lanes.forEach(([y0, y1], i) => {
      s += `<rect x="20" y="${y0}" width="${W - 40}" height="${y1 - y0}" class="lane${i % 2 ? " alt" : ""}"/>`;
      s += `<text x="50" y="${(y0 + y1) / 2 + 6}" transform="rotate(-90 50 ${(y0 + y1) / 2})" text-anchor="middle" font-size="18" font-weight="700">${esc(T.lanes[i])}</text>`;
    });
    s += `<line x1="80" y1="40" x2="80" y2="720" class="sep"/>`;
    // start
    s += `<circle cx="210" cy="125" r="30" class="ev"/>` + t(210, 185, N.start, { fs: 19, b: true }) + coin(210, 70);
    // rule task
    s += `<rect x="330" y="250" width="230" height="90" rx="14" class="task"/>` + lines(445, 287, N.rule) + t(445, 365, N.ruleSub, { fs: 17 }) + coin(330, 245);
    // gateway 1
    s += `<polygon points="650,255 690,295 650,335 610,295" class="gw"/>` + t(650, 303, "×", { fs: 30 }) + t(650, 235, N.gw1, { fs: 19, b: true });
    // manager task
    s += `<rect x="720" y="420" width="230" height="90" rx="14" class="task"/>` + lines(835, 457, N.task) + t(825, 540, N.taskSub, { fs: 17 }) + coin(950, 415);
    s += `<circle cx="945" cy="510" r="20" class="timer"/>` + t(945, 517, "⏱", { fs: 20 }) + t(972, 535, N.timer, { fs: 17, a: "start" });
    // gateway 2
    s += `<polygon points="1060,425 1100,465 1060,505 1020,465" class="gw"/>` + t(1060, 473, "×", { fs: 30 }) + t(1060, 405, N.gw2, { fs: 19, b: true });
    // create order
    s += `<rect x="1000" y="590" width="220" height="90" rx="14" class="task"/>` + lines(1110, 627, N.order) + t(1110, 706, N.orderSub, { fs: 17 }) + coin(1220, 585);
    // ends
    s += `<circle cx="1310" cy="625" r="28" class="ev end"/>` + t(1310, 682, N.endOk, { fs: 17, b: true }) + t(1310, 702, N.endOk2, { fs: 15 });
    s += `<circle cx="1310" cy="150" r="28" class="ev end"/>` + t(1310, 80, N.endNo, { fs: 17, b: true }) + t(1310, 100, N.endNo2, { fs: 15 });
    // arrows
    s += arrow("M240,125 H445 V246");
    s += arrow("M560,295 H606");
    s += arrow("M650,335 V620 H996", N.yes, 625, 470);
    s += arrow("M690,295 H835 V416", N.no, 760, 285);
    s += arrow("M950,465 H1016");
    s += arrow("M1060,505 V586", "", 0, 0) + t(1070, 555, N.approved, { fs: 19, a: "start" });
    s += arrow("M1100,465 H1230 V150 H1278", N.rejected, 1180, 300);
    s += arrow("M1220,625 H1278");
    s += `<rect x="20" y="740" width="${W - 40}" height="60" rx="10" class="auditbar"/>` + t(W / 2, 778, "📒 " + N.audit, { fs: 21, b: true });
    s += `<text x="${W - 30}" y="${H - 4}" text-anchor="end" font-size="13">${esc("IBM webMethods BPMS Academy · " + T.title)}</text>`;
    return s + "</svg>";
  }

  // ---------- cards ----------
  const reqCard = (r) => `<div class="kcard req"><div class="kc-top"><strong>${esc(T.reqLabel)} ${r.id}</strong><span>${esc(T.roundLabel)} ${r.round}</span></div>
      <p class="kc-who">${esc(r.who)}</p><p class="kc-item">${esc(r.item)}</p>
      <dl><dt>${esc(T.amountLabel)}</dt><dd class="kc-amt">${money(r.amount)}</dd><dt>${esc(T.ccLabel)}</dt><dd>${esc(r.cc)}</dd><dt>${esc(T.urgLabel)}</dt><dd>${esc(T.urgency[r.urg])}</dd></dl>
      <div class="kc-note"><small>${esc(T.noteLabel)}</small><p>${esc(r.note)}</p></div></div>`;
  const ruleCard = (r) => `<div class="kcard rule"><div class="kc-top"><strong>${esc(T.ruleH)}</strong><span>${esc(T.ruleV)} ${r.v}</span></div>
      <ul>${r.lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul><p class="kc-foot">${esc(r.foot)}</p></div>`;
  const controlCard = () => `<div class="kcard rule"><div class="kc-top"><strong>${esc(T.controlH)}</strong><span>🔒</span></div>
      <ul>${T.control.map((l) => `<li>${esc(l)}</li>`).join("")}</ul><p class="kc-foot">${esc(T.controlFoot)} <a href="${course("#controls")}">#controls</a></p></div>`;
  const eventCard = (e) => `<div class="kcard event"><div class="kc-top"><strong>${esc(T.eventH)} ${e.id}</strong><span>${e.icon}</span></div>
      <p class="kc-title">${esc(e.title)}</p><p>${esc(e.text)}</p><p class="kc-log">✍️ ${esc(e.log)}</p>
      <p class="kc-foot">${esc(T.seeLabel)} <a href="${course(e.see[1])}">${esc(e.see[0])}</a></p></div>`;

  // ---------- facilitator notes ----------
  function notes() {
    const keyRows = reqs.map((r) => { const v = versionOf(r), [route, end] = decide(r, v); return `<tr><td>${r.id} · ${esc(r.who)} · ${money(r.amount)} · ${esc(r.cc)}</td><td>v${v}</td><td>${esc(route)}</td><td>${esc(end)}</td></tr>`; }).join("");
    return `<h2>${esc(T.notes)}</h2>
      <h3>${esc(T.setupH)}</h3><ol>${T.setup.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
      <h3>${esc(T.rolesH)}</h3><ul class="kit-roles">${T.roles.map(([r, d]) => `<li><strong>${esc(r)}</strong> — ${esc(d)}</li>`).join("")}</ul><p><small>${esc(T.rolesNote)}</small></p>
      <h3>${esc(T.roundsH)}</h3><ol class="kit-rounds">${T.rounds.map(([h, d, ask, link]) => `<li><strong>${esc(h)}</strong><br>${esc(d)}<br><em>${esc(ask)}</em> <a href="${course(link)}" class="no-print-url">${esc(link)}</a></li>`).join("")}</ol>
      <h3>${esc(T.debriefH)}</h3><ol>${T.debrief.map(([q, link]) => `<li>${esc(q)} <a href="${course(link)}">${esc(link)}</a></li>`).join("")}</ol>
      <h3>${esc(T.keyH)}</h3><div class="table-wrap"><table class="kit-key"><tr>${T.keyCols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>${keyRows}</table></div>`;
  }

  function logSheet() {
    const rows = Array.from({ length: 18 }, (_, i) => `<tr><td>${i + 1}</td>${"<td></td>".repeat(T.logCols.length - 1)}</tr>`).join("");
    return `<h2>📒 ${esc(T.logH)}</h2><p>${esc(T.logTeam)} ______________________</p>
      <div class="table-wrap"><table class="kit-log"><tr>${T.logCols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr>${rows}</table></div><p class="kc-foot">${esc(T.logFoot)}</p>`;
  }

  // ---------- page ----------
  document.title = T.title + (window.LANG === "zh" ? " — IBM webMethods BPMS 学院" : " — IBM webMethods BPMS Academy");
  const $ = (id) => document.getElementById(id);
  $("kit-back").textContent = T.back;
  $("kit-back").href = course("#teach");
  $("kit-print-board").textContent = T.printBoard;
  $("kit-print-cards").textContent = T.printCards;
  $("kit-print-all").textContent = T.printAll;
  $("kit-intro").innerHTML = `<h1>${esc(T.title)}</h1><p class="lead">${esc(T.sub)}</p><p class="kc-foot">${esc(T.fictional)}</p>`;
  $("kit-notes").innerHTML = notes();
  $("kit-board").innerHTML = `<h2 class="no-print-board">${esc(T.board)}</h2><p class="no-print-board">${esc(T.boardNote)}</p>${board()}`;
  $("kit-cards").innerHTML = `<h2>✂️ ${esc(T.cards)}</h2>
    <div class="kit-grid">${reqs.map(reqCard).join("")}</div>
    <div class="kit-grid">${rules.map(ruleCard).join("")}${controlCard()}</div>
    <div class="kit-grid">${events.map(eventCard).join("")}</div>`;
  $("kit-log").innerHTML = logSheet();

  // Print one part, or everything. The board prints on A3 landscape, the rest on the default paper size.
  const pageStyle = document.createElement("style");
  document.head.appendChild(pageStyle);
  document.querySelectorAll("[data-kit-print]").forEach((b) => b.addEventListener("click", () => {
    const what = b.dataset.kitPrint;
    document.body.dataset.print = what;
    pageStyle.textContent = what === "board" ? "@page { size: A3 landscape; margin: 8mm; }" : "@page { margin: 10mm; }";
    window.print();
    setTimeout(() => { delete document.body.dataset.print; }, 500);
  }));

  window.KIT = { requests: reqs, events, rules, decide, versionOf };
})();
