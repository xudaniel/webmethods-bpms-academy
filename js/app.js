(function () {
  const A = window.ACADEMY;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- navigation (hash-aware so sections can be linked) ----------
  const navBtns = document.querySelectorAll("nav button");
  function show(id) {
    if (!$(id)) id = "start";
    navBtns.forEach((b) => b.classList.toggle("active", b.dataset.section === id));
    document.querySelectorAll(".section").forEach((s) => s.classList.toggle("active", s.id === id));
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
    window.scrollTo(0, 0);
  }
  navBtns.forEach((b) => b.addEventListener("click", () => show(b.dataset.section)));
  window.addEventListener("hashchange", () => show(location.hash.slice(1)));

  // ---------- lifecycle ----------
  $("lifecycle-steps").innerHTML = A.lifecycle
    .map(([n, t], i) => `<button class="tile" data-i="${i}"><strong>${i + 1}. ${esc(n)}</strong><small>${esc(t.split(".")[0])}</small></button>`)
    .join("");
  $("lifecycle-steps").addEventListener("click", (e) => {
    const t = e.target.closest(".tile"); if (!t) return;
    document.querySelectorAll("#lifecycle-steps .tile").forEach((x) => x.classList.toggle("selected", x === t));
    const [n, d] = A.lifecycle[t.dataset.i];
    $("lifecycle-detail").innerHTML = `<div class="detail"><strong>${esc(n)}</strong><br>${esc(d)}</div>`;
  });
  $("dates").innerHTML = A.lifecycleDates.map(([k, v]) => `<tr><td>${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`).join("");

  // ---------- architecture ----------
  $("arch-grid").innerHTML = A.architecture
    .map((c) => `<button class="tile" data-id="${c.id}"><strong>${esc(c.name)}</strong><small>${esc(c.role)}</small></button>`)
    .join("");
  $("arch-grid").addEventListener("click", (e) => {
    const t = e.target.closest(".tile"); if (!t) return;
    document.querySelectorAll("#arch-grid .tile").forEach((x) => x.classList.toggle("selected", x === t));
    const c = A.architecture.find((x) => x.id === t.dataset.id);
    $("arch-detail").innerHTML = `<div class="detail"><strong>${esc(c.name)}</strong> <span class="pill">${esc(c.role)}</span><p>${esc(c.text)}</p><p><em>Tip:</em> ${esc(c.tip)}</p></div>`;
  });
  $("audit-tables").innerHTML = A.auditTables.map(([t, d]) => `<tr><td><code>${esc(t)}</code></td><td>${esc(d)}</td></tr>`).join("");

  // ---------- BPMN ----------
  $("bpmn-groups").innerHTML = A.bpmn
    .map((g) => `<h3>${esc(g.group)}</h3><div class="table-wrap"><table>${g.items.map(([n, d]) => `<tr><td style="width:35%"><strong>${esc(n)}</strong></td><td>${esc(d)}</td></tr>`).join("")}</table></div>`)
    .join("");

  // ---------- patterns ----------
  function renderPatterns(filter) {
    $("pattern-list").innerHTML = A.patterns
      .filter((p) => filter === "all" || p.tag === filter)
      .map((p) => `<div class="card"><span class="pill ${p.tag === "classic" ? "green" : ""}">${esc(p.tag)}</span><h3>${esc(p.name)}</h3>
        <p><strong>Problem:</strong> ${esc(p.problem)}</p><p><strong>Solution:</strong> ${esc(p.solution)}</p><p><strong>Use for:</strong> ${esc(p.when)}</p></div>`)
      .join("");
  }
  renderPatterns("all");
  $("pattern-filter").addEventListener("change", (e) => renderPatterns(e.target.value));

  // ---------- cases ----------
  $("case-list").innerHTML = A.cases
    .map((c) => `<div class="card"><h3>${esc(c.name)}</h3><div class="steps">${c.flow.map((s, i) => `${i ? '<span class="arrow">→</span>' : ""}<span class="step">${esc(s)}</span>`).join("")}</div><p class="lead">${esc(c.lesson)}</p></div>`)
    .join("");

  // ---------- simulator: loan process with a rule task and a human path ----------
  const SIM_STEPS = ["Application received", "Fetch credit data", "Rule: eligibility", "Underwriter review", "Send decision"];
  let sim = null;
  function decide(amount, score, income) {
    const dti = amount / Math.max(income, 1);
    if (score < 580) return { outcome: "DECLINE", reason: "Credit score below 580" };
    if (score >= 720 && dti <= 0.35) return { outcome: "APPROVE", reason: "Score ≥ 720 and loan/income ≤ 35%" };
    return { outcome: "REFER", reason: `Score ${score}, loan/income ${(dti * 100).toFixed(0)}% → needs underwriter` };
  }
  function simRender() {
    $("sim-steps").innerHTML = SIM_STEPS.map((s, i) => {
      let cls = "step";
      if (sim && i < sim.i) cls += " done";
      if (sim && i === sim.i) cls += " current";
      if (sim && sim.skip.includes(i)) cls = "step";
      const label = sim && sim.skip.includes(i) ? `${s} (skipped)` : s;
      return `${i ? '<span class="arrow">→</span>' : ""}<span class="${cls}">${esc(label)}</span>`;
    }).join("");
    $("sim-log").textContent = sim ? sim.log.join("\n") : "Press Start to create a process instance.";
    $("sim-next").disabled = !sim || sim.i >= SIM_STEPS.length;
    $("sim-human").style.display = sim && sim.waitingHuman ? "flex" : "none";
  }
  function logRow(step, status, extra) {
    const ts = new Date(Date.now() + sim.log.length * 60000).toISOString().slice(0, 19);
    sim.log.push(`PRA_PROCESS_STEP  inst=${sim.id}  step="${step}"  status=${status}  ts=${ts}${extra ? "  " + extra : ""}`);
  }
  $("sim-start").addEventListener("click", () => {
    sim = { id: "LN-" + Math.floor(1000 + Math.random() * 9000), i: 0, skip: [], log: [], waitingHuman: false,
      amount: +$("sim-amount").value, score: +$("sim-score").value, income: +$("sim-income").value };
    sim.log.push(`PRA_PROCESS       inst=${sim.id}  status=STARTED`);
    simRender();
  });
  $("sim-next").addEventListener("click", () => {
    if (!sim || sim.waitingHuman) return;
    const step = SIM_STEPS[sim.i];
    if (sim.i === 2) {
      sim.decision = decide(sim.amount, sim.score, sim.income);
      logRow(step, "COMPLETED", `outcome=${sim.decision.outcome}`);
      sim.log.push(`PRA_STEP_LOGGED_FIELD inst=${sim.id}  field=reason  value="${sim.decision.reason}"`);
      if (sim.decision.outcome !== "REFER") sim.skip.push(3);
      sim.i = sim.decision.outcome === "REFER" ? 3 : 4;
      if (sim.i === 3) { sim.waitingHuman = true; logRow(SIM_STEPS[3], "TASK_QUEUED", "inbox=Underwriters"); }
    } else if (sim.i === 4) {
      logRow(step, "COMPLETED", `final=${sim.final || sim.decision.outcome}`);
      sim.log.push(`PRA_PROCESS       inst=${sim.id}  status=COMPLETED`);
      sim.i = 5;
    } else {
      logRow(step, "COMPLETED");
      sim.i++;
    }
    simRender();
  });
  document.querySelectorAll("#sim-human button").forEach((b) =>
    b.addEventListener("click", () => {
      sim.final = b.dataset.v; sim.waitingHuman = false;
      logRow(SIM_STEPS[3], "COMPLETED", `user=underwriter1  outcome=${sim.final}`);
      sim.i = 4; simRender();
    })
  );
  simRender();

  // ---------- Agent Scan Lab (port of agent_scan.py) ----------
  function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296); }
  function sampleData() {
    const r = rng(7), rows = [];
    const spec = [
      ["Shipment exception", "Review delay claim", "user_task", 1800, 12, 6, 0.94, 0.5],
      ["Shipment exception", "Assign carrier credit", "user_task", 900, 8, 30, 0.97, 0.9],
      ["Shipment exception", "Escalate to manager", "user_task", 120, 25, 48, 0.6, 0.2],
      ["Shipment exception", "Call TMS update", "service", 2700, 0, 0, null, null],
      ["Customs hold", "Classify documents", "user_task", 600, 20, 36, 0.75, 0.3],
      ["Customs hold", "Release approval", "user_task", 600, 6, 20, 0.92, 0.85]
    ];
    for (const [process, step, type, n, work, wait, share, detf] of spec) {
      for (let i = 0; i < n * 6; i++) {
        let outcome = null, key = null;
        if (share !== null) {
          const k = Math.floor(r() * 40); key = "k" + k;
          outcome = k < 40 * detf || r() < share ? "approve" : "reject";
        }
        rows.push({ process, step, step_type: type, wait_min: Math.max(0, wait * 60 + (r() - 0.5) * wait * 20),
          work_min: type === "user_task" ? Math.max(1, work + (r() - 0.5) * work * 0.6) : 0,
          outcome, input_key: key, loop_count: r() < 0.08 ? 1 : 0, error: type === "service" && r() < 0.07 ? 1 : 0 });
      }
    }
    return { rows, months: 6 };
  }
  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/); const h = lines.shift().split(",").map((s) => s.trim());
    const rows = lines.map((l) => { const v = l.split(","); const o = {}; h.forEach((k, i) => (o[k] = v[i] === "" ? null : v[i])); return o; });
    rows.forEach((o) => ["wait_min", "work_min", "loop_count", "error"].forEach((k) => (o[k] = +o[k] || 0)));
    let months = 6;
    if (h.includes("start_ts") && h.includes("end_ts")) {
      const ts = rows.flatMap((o) => [Date.parse(o.start_ts), Date.parse(o.end_ts)]).filter((x) => !isNaN(x));
      if (ts.length) months = Math.max(1, (Math.max(...ts) - Math.min(...ts)) / 864e5 / 30.4);
    }
    return { rows, months };
  }
  function score({ rows, months }) {
    const groups = {};
    rows.forEach((o) => { const k = [o.process, o.step, o.step_type].join("|"); (groups[k] = groups[k] || []).push(o); });
    const out = Object.entries(groups).map(([k, g]) => {
      const [process, step, type] = k.split("|");
      const per = g.length / months, mean = (f) => g.reduce((s, o) => s + f(o), 0) / g.length;
      const outs = g.filter((o) => o.outcome);
      let top = null, det = null;
      if (outs.length) {
        const c = {}; outs.forEach((o) => (c[o.outcome] = (c[o.outcome] || 0) + 1)); top = Math.max(...Object.values(c)) / outs.length;
        const byKey = {}; outs.filter((o) => o.input_key).forEach((o) => ((byKey[o.input_key] = byKey[o.input_key] || []).push(o.outcome)));
        let w = 0, hit = 0;
        Object.values(byKey).forEach((arr) => { const cc = {}; arr.forEach((x) => (cc[x] = (cc[x] || 0) + 1)); w += arr.length; if (Math.max(...Object.values(cc)) / arr.length >= 0.95) hit += arr.length; });
        if (w) det = hit / w;
      }
      const work = mean((o) => o.work_min), wait = mean((o) => o.wait_min) / 60, err = mean((o) => o.error);
      let cls = "Keep human";
      if (type === "service") cls = err >= 0.05 ? "Integration fix" : "Leave as is";
      else if (type !== "user_task") cls = "Leave as is";
      else if (det !== null && det >= 0.8) cls = "Rule candidate (ODM)";
      else if (top !== null && top >= 0.9 && work <= 15) cls = "Agent candidate (rubber-stamp)";
      else if (top !== null && wait >= 24 && top >= 0.7) cls = "Agent candidate (triage + human approve)";
      const shareMap = { "Rule candidate (ODM)": 0.8, "Agent candidate (rubber-stamp)": 0.6, "Agent candidate (triage + human approve)": 0.4 };
      const hrs = (per * work) / 60;
      return { process, step, type, per, work, wait, top, det, err, cls, saved: hrs * (shareMap[cls] || 0) };
    });
    return out.sort((a, b) => b.saved - a.saved || b.err - a.err);
  }
  const pct = (x) => (x === null ? "–" : Math.round(x * 100) + "%");
  const pillFor = (c) => (c.startsWith("Rule") ? "green" : c.startsWith("Agent") ? "" : c === "Integration fix" ? "red" : "yellow");
  function renderScan(data) {
    const res = score(data);
    $("scan-out").innerHTML = `<div class="table-wrap"><table><tr><th>Process / step</th><th>Class</th><th>Hours saved/mo</th><th>Vol/mo</th><th>Top outcome</th><th>Determinism</th><th>Work min</th><th>Wait h</th></tr>${res
      .map((r) => `<tr><td>${esc(r.process)}<br><strong>${esc(r.step)}</strong></td><td><span class="pill ${pillFor(r.cls)}">${esc(r.cls)}</span></td><td><strong>${r.saved ? Math.round(r.saved) : "–"}</strong></td><td>${Math.round(r.per)}</td><td>${pct(r.top)}</td><td>${pct(r.det)}</td><td>${r.work.toFixed(1)}</td><td>${r.wait.toFixed(1)}</td></tr>`)
      .join("")}</table></div><p class="sources">Savings use placeholder automatable shares (rules 80%, rubber-stamp 60%, triage 40%). Calibrate on real data before quoting.</p>`;
  }
  $("scan-sample").addEventListener("click", () => renderScan(sampleData()));
  $("scan-file").addEventListener("change", (e) => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader(); rd.onload = () => { try { renderScan(parseCSV(rd.result)); } catch (err) { $("scan-out").innerHTML = `<p class="callout">Could not read the CSV: ${esc(err.message)}</p>`; } };
    rd.readAsText(f);
  });

  // ---------- market ----------
  $("market-sizing").innerHTML = A.market.sizing.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
  $("market-signals").innerHTML = A.market.signals.map((s) => `<li>${esc(s)}</li>`).join("");
  $("market-takeaways").innerHTML = A.market.takeaways.map((s) => `<li>${esc(s)}</li>`).join("");

  // ---------- glossary ----------
  function renderGlossary(q) {
    q = (q || "").toLowerCase();
    $("glossary-list").innerHTML = A.glossary
      .filter(([t, d]) => !q || t.toLowerCase().includes(q) || d.toLowerCase().includes(q))
      .map(([t, d]) => `<tr><td style="width:30%"><strong>${esc(t)}</strong></td><td>${esc(d)}</td></tr>`)
      .join("") || `<tr><td colspan="2">No match.</td></tr>`;
  }
  renderGlossary("");
  $("glossary-search").addEventListener("input", (e) => renderGlossary(e.target.value));

  // ---------- quiz ----------
  let answered = 0, correct = 0;
  $("quiz-list").innerHTML = A.quiz
    .map((q, i) => `<div class="quiz-q" data-i="${i}"><strong>${i + 1}. ${esc(q.q)}</strong>${q.a.map((a, j) => `<button data-j="${j}">${esc(a)}</button>`).join("")}<div class="explain"></div></div>`)
    .join("");
  $("quiz-list").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const box = b.closest(".quiz-q"); if (box.dataset.done) return;
    const q = A.quiz[box.dataset.i], j = +b.dataset.j;
    box.dataset.done = 1; answered++;
    box.querySelectorAll("button")[q.c].classList.add("correct");
    if (j === q.c) correct++; else b.classList.add("wrong");
    box.querySelector(".explain").textContent = q.e;
    $("quiz-score").textContent = `Score: ${correct} / ${answered}` + (answered === A.quiz.length ? " — done!" : "");
  });

  // ---------- sources ----------
  $("source-list").innerHTML = A.sources.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("");

  show(location.hash.slice(1) || "start");
})();
