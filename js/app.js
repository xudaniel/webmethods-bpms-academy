(function () {
  const A = window.ACADEMY;
  const T = window.L || ((en) => en);
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- navigation (hash-aware so sections can be linked) ----------
  const navBtns = document.querySelectorAll("nav button[data-section]");
  function show(id) {
    if (!$(id) || !$(id).classList.contains("section")) id = "start";
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
    $("arch-detail").innerHTML = `<div class="detail"><strong>${esc(c.name)}</strong> <span class="pill">${esc(c.role)}</span><p>${esc(c.text)}</p><p><em>${T("Tip:", "提示：")}</em> ${esc(c.tip)}</p></div>`;
  });
  $("audit-tables").innerHTML = A.auditTables.map(([t, d]) => `<tr><td><code>${esc(t)}</code></td><td>${esc(d)}</td></tr>`).join("");

  // ---------- BPMN ----------
  $("bpmn-groups").innerHTML = A.bpmn
    .map((g) => `<h3 data-g="${esc(g.key || g.group)}">${esc(g.group)}</h3><div class="table-wrap"><table>${g.items.map(([n, d]) => `<tr><td style="width:35%"><strong>${esc(n)}</strong></td><td>${esc(d)}</td></tr>`).join("")}</table></div>`)
    .join("");

  // ---------- patterns ----------
  const ZA = window.LANG === "zh" && window.ZH && window.ZH.academy;
  function renderPatterns(filter) {
    $("pattern-list").innerHTML = A.patterns
      .filter((p) => filter === "all" || p.tag === filter)
      .map((p) => `<div class="card"><span class="pill ${p.tag === "classic" ? "green" : ""}">${esc(ZA ? ZA.tags[p.tag] : p.tag)}</span><h3>${esc(p.name)}</h3>
        <p><strong>${T("Problem:", "问题：")}</strong> ${esc(p.problem)}</p><p><strong>${T("Solution:", "解决：")}</strong> ${esc(p.solution)}</p><p><strong>${T("Use for:", "适用于：")}</strong> ${esc(p.when)}</p></div>`)
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
  const ZM = window.LANG === "zh" && window.ZH && window.ZH.sim; // Chinese labels on screen; the audit-style log keeps the engine's English names
  let sim = null;
  function decide(amount, score, income) {
    const dti = amount / Math.max(income, 1);
    if (score < 580) return { outcome: "DECLINE", reason: ZM ? ZM.low : "Credit score below 580" };
    if (score >= 720 && dti <= 0.35) return { outcome: "APPROVE", reason: ZM ? ZM.ok : "Score ≥ 720 and loan/income ≤ 35%" };
    return { outcome: "REFER", reason: ZM ? ZM.refer(score, (dti * 100).toFixed(0)) : `Score ${score}, loan/income ${(dti * 100).toFixed(0)}% → needs underwriter` };
  }
  function simRender() {
    $("sim-steps").innerHTML = SIM_STEPS.map((s, i) => {
      let cls = "step";
      if (sim && i < sim.i) cls += " done";
      if (sim && i === sim.i) cls += " current";
      if (sim && sim.skip.includes(i)) cls = "step";
      const name = ZM ? ZM.steps[i] : s;
      const label = sim && sim.skip.includes(i) ? name + (ZM ? ZM.skipped : " (skipped)") : name;
      return `${i ? '<span class="arrow">→</span>' : ""}<span class="${cls}">${esc(label)}</span>`;
    }).join("");
    $("sim-log").textContent = sim ? sim.log.join("\n") : (ZM ? ZM.press : "Press Start to create a process instance.");
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
  const ZC = window.LANG === "zh" && window.ZH && window.ZH.scan;
  const zc = (m, s) => (ZC && ZC[m][s]) || s;
  function renderScan(data) {
    const res = score(data);
    const head = ZC ? ZC.head : ["Process / step", "Class", "Hours saved/mo", "Vol/mo", "Top outcome", "Determinism", "Work min", "Wait h"];
    $("scan-out").innerHTML = `<div class="table-wrap"><table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${res
      .map((r) => `<tr><td>${esc(zc("process", r.process))}<br><strong>${esc(zc("step", r.step))}</strong></td><td><span class="pill ${pillFor(r.cls)}">${esc(zc("cls", r.cls))}</span></td><td><strong>${r.saved ? Math.round(r.saved) : "–"}</strong></td><td>${Math.round(r.per)}</td><td>${pct(r.top)}</td><td>${pct(r.det)}</td><td>${r.work.toFixed(1)}</td><td>${r.wait.toFixed(1)}</td></tr>`)
      .join("")}</table></div><p class="sources">${ZC ? ZC.note : "Savings use placeholder automatable shares (rules 80%, rubber-stamp 60%, triage 40%). Calibrate on real data before quoting."}</p>`;
  }
  $("scan-sample").addEventListener("click", () => renderScan(sampleData()));
  $("scan-file").addEventListener("change", (e) => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader(); rd.onload = () => { try { renderScan(parseCSV(rd.result)); } catch (err) { $("scan-out").innerHTML = `<p class="callout">${ZC ? ZC.bad : "Could not read the CSV: "}${esc(err.message)}</p>`; } };
    rd.readAsText(f);
  });

  // ---------- market ----------
  $("market-sizing").innerHTML = A.market.sizing.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
  $("market-signals").innerHTML = A.market.signals.map((s) => `<li>${esc(s)}</li>`).join("");
  $("market-takeaways").innerHTML = A.market.takeaways.map((s) => `<li>${esc(s)}</li>`).join("");

  // ---------- glossary ----------
  // 中文: show the translated term and definition; terms without a translation stay English
  const ZG = window.LANG === "zh" && window.ZH && window.ZH.gloss;
  if (ZG) A.glossary = A.glossary.map(([t, d]) => ZG[t] ? [ZG[t][0], ZG[t][1]] : [t, d]);
  function renderGlossary(q) {
    q = (q || "").toLowerCase();
    $("glossary-list").innerHTML = A.glossary
      .filter(([t, d]) => !q || t.toLowerCase().includes(q) || d.toLowerCase().includes(q))
      .map(([t, d]) => `<tr><td style="width:30%"><strong>${esc(t)}</strong></td><td>${esc(d)}</td></tr>`)
      .join("") || `<tr><td colspan="2">${T("No match.", "没有找到。")}</td></tr>`;
  }
  renderGlossary("");
  $("glossary-search").addEventListener("input", (e) => renderGlossary(e.target.value));

  // ---------- quiz ----------
  const ZQ = window.LANG === "zh" && window.ZH && window.ZH.quiz;
  if (ZQ) A.quiz = A.quiz.map((q) => ZQ[q.q] ? Object.assign({}, q, ZQ[q.q]) : q);
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
    $("quiz-score").textContent = T(`Score: ${correct} / ${answered}`, `得分：${correct} / ${answered}`) + (answered === A.quiz.length ? T(" — done!", "：全部完成！") : "");
  });

  // ---------- sources ----------
  $("source-list").innerHTML = A.sources.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("");

  // ---------- IBM webMethods knowledge base ----------
  const K = window.KNOWLEDGE;
  if (K) {
    const src = (n) => K.sources[n];
    const srcLinks = (ns) => ns.map((n) => `<a href="${esc(src(n)[1])}" target="_blank" rel="noopener">${esc(src(n)[0])}</a>`).join(" · ");
    const factCount = K.topics.reduce((t, x) => t + x.facts.length, 0);
    $("kb-counter").innerHTML = [
      [K.topics.length, T("knowledge topics", "个知识主题")], [factCount, T("cited facts", "条带出处的事实")],
      [K.family.length, T("IBM webMethods components", "个 IBM webMethods 组件")], [Object.keys(K.sources).length, T("public sources", "个公开来源")],
      [A.glossary.length, T("glossary terms", "个术语")], [A.quiz.length, T("quiz questions", "道测验题")]
    ].map(([n, l]) => `<div class="tile kb-stat"><strong>${n}</strong><small>${esc(l)}</small></div>`).join("");
    $("quiz-count-tile").textContent = A.quiz.length + T(" questions", " 道题");
    const zh = window.LANG === "zh";
    $("kb-family").innerHTML = `<tr><th>${T("Component", "组件")}</th><th>${T("What it does in a BPMS solution", "在 BPMS 方案里做什么")}</th></tr>` +
      K.family.map(([n, d]) => `<tr><td><strong>${esc(n)}</strong></td><td>${esc(d)}</td></tr>`).join("");
    $("kb-family-src").innerHTML = T("Sources: ", "来源：") + srcLinks(K.familySources.concat([9, 17]));
    $("kb-tabs").innerHTML = K.topics.map((t) => `<button class="tile" data-kb="${t.id}"><strong>${esc(t.title)}</strong></button>`).join("");
    $("kb-topics").innerHTML = K.topics.map((t) => `<div class="card kb-topic" id="kb-${t.id}">
      <h3>${esc(t.title)}</h3><p class="lead">${esc(t.summary)}</p>
      ${t.image ? `<figure class="kb-fig"><img src="${esc(t.image)}" alt="${T("Diagram: ", "示意图：")}${esc(t.title)}" loading="lazy" onerror="this.closest('figure').remove()"></figure>` : ""}
      <ul class="kb-facts">${t.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <p class="callout"><strong>${T("In practice:", "实践建议：")}</strong> ${esc(t.practice)}</p>
      ${t.sources.length ? `<p class="sources">${T("Sources: ", "来源：")}${srcLinks(t.sources)}</p>` : `<p class="sources">${T("Synthesis of the topics above; author's practitioner view.", "以上主题的归纳；作者的实践观点。")}</p>`}
      ${t.reviewed ? `<p class="kb-reviewed">${T("Last reviewed against its sources: ", "最近一次对照来源核对：")}${new Date(t.reviewed + "T12:00:00").toLocaleDateString(zh ? "zh-CN" : "en-GB", { day: "numeric", month: zh ? "long" : "short", year: "numeric" })}</p>` : ""}
    </div>`).join("");
    $("kb-tabs").addEventListener("click", (e) => {
      const b = e.target.closest("[data-kb]"); if (!b) return;
      document.getElementById("kb-" + b.dataset.kb).scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ---------- How to use (guides by role, beginner path, customer demo) ----------
  const H = window.HOWTO;
  if (H) {
    const hl = (k) => `<a href="${esc(H.sources[k][1])}" target="_blank" rel="noopener">${esc(H.sources[k][0])}</a>`;
    $("beginner-path").innerHTML = H.beginner.map(([t, id, d]) => `<li><a href="#${id}"><strong>${esc(t)}</strong></a> — ${esc(d)}</li>`).join("");
    const HU = (window.LANG === "zh" && window.ZH && window.ZH.howto && window.ZH.howto.ui) || { demoTab: "Show a customer (10 min)", demoH: `Customer demo script <span class="pill">Author's view</span>`,
      demoLead: "Six beats, about ten minutes. Click the step, say the line, and you answer the question the customer is really asking.", say: "Say: ", answers: "Answers: ",
      source: "Source: ", worked: "You'll know it worked when:", tip: "Tip:" };
    const tabs = H.roles.map((r) => [r.id, r.role]).concat([["demo", HU.demoTab]]);
    $("howto-tabs").innerHTML = tabs.map(([id, n]) => `<button class="tile" data-role="${id}"><strong>${esc(n)}</strong></button>`).join("");
    function renderRole(id) {
      document.querySelectorAll("#howto-tabs .tile").forEach((b) => b.classList.toggle("selected", b.dataset.role === id));
      if (id === "demo") {
        $("howto-body").innerHTML = `<div class="card"><h3>${HU.demoH}</h3>
          <p>${HU.demoLead}</p>
          <ol class="howto-steps">${H.demo.map(([t, sec, click, say, q]) => `<li><strong>${esc(t)}</strong>
            <div class="where"><a href="#${sec}">${esc(click)}</a></div>
            <p>${HU.say}“${esc(say)}”</p><p class="sources">${HU.answers}${esc(q)}</p></li>`).join("")}</ol></div>`;
        return;
      }
      const r = H.roles.find((x) => x.id === id);
      $("howto-body").innerHTML = `<div class="card"><h3>${esc(r.title)}</h3><p class="lead">${esc(r.who)}</p>
        <ol class="howto-steps">${r.steps.map(([t, d, where, src]) => `<li><label class="done"><input type="checkbox"> <strong>${esc(t)}</strong></label>
          <div class="where">${esc(where)}</div><p>${esc(d)}</p><p class="sources">${HU.source}${src.map(hl).join(" · ")}</p></li>`).join("")}</ol>
        <p class="callout ok"><strong>${HU.worked}</strong> ${esc(r.check)}</p>
        <p class="callout"><strong>${HU.tip}</strong> ${esc(r.tip)}</p></div>`;
      if (window.renderCheat) window.renderCheat(id);
    }
    $("howto-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-role]"); if (b) renderRole(b.dataset.role); });
    document.querySelectorAll("[data-demo]").forEach((a) => a.addEventListener("click", () => setTimeout(() => renderRole("demo"), 0)));
    renderRole("user");
  }

  // ---------- Hands-on lab (progress kept in this browser only) ----------
  const L = window.LAB;
  if (L) {
    const H2 = window.HOWTO || { sources: {} };
    const src = (k) => L.sources[k] || H2.sources[k];
    const link = (k) => { const x = src(k); return x ? `<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>` : ""; };
    const KEY = "wm-academy-lab-v1";
    const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } };
    const save = (o) => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* storage unavailable: progress lasts for this visit */ } };
    let done = load();
    const total = L.stages.reduce((n, st) => n + st.steps.length, 0);
    $("lab-title").textContent = L.title;
    $("lab-scenario").textContent = L.scenario;
    $("lab-flow").innerHTML = L.flow.map((f) => `<li>${esc(f)}</li>`).join("");
    $("lab-prereqs").innerHTML = L.prereqs.map((x) => `<li>${esc(x)}</li>`).join("");
    $("lab-stages").innerHTML = L.stages.map((st, i) => `<div class="card lab-stage" id="lab-${st.id}">
      <h3>${i + 1}. ${esc(st.t)} <span class="pill">${st.min} ${T("min", "分钟")}</span></h3>
      <ol class="howto-steps">${st.steps.map(([t, where], j) => `<li><label class="done"><input type="checkbox" data-k="${st.id}-${j}"> <span>${esc(t)}</span></label><div class="where">${esc(where)}</div></li>`).join("")}</ol>
      <p class="callout ok"><strong>${T("Checkpoint:", "检查点：")}</strong> ${esc(st.check)}</p>
      <p class="sources">${T("Source: ", "来源：")}${st.src.map(link).filter(Boolean).join(" · ")}</p></div>`).join("");
    $("lab-pitfalls").innerHTML = `<tr><th>${T("Symptom", "症状")}</th><th>${T("Likely cause and fix", "可能的原因和办法")}</th></tr>` +
      L.pitfalls.map(([a, b, ks]) => `<tr><td><strong>${esc(a)}</strong></td><td>${esc(b)} <span class="sources">${ks.map(link).filter(Boolean).join(" · ")}</span></td></tr>`).join("");
    $("lab-practice").innerHTML = L.practice.map(([t, id, d]) => `<li><a href="#${id}"><strong>${esc(t)}</strong></a> — ${esc(d)}</li>`).join("");
    $("lab-levelup").textContent = L.levelup;
    function paint() {
      document.querySelectorAll("#lab-stages input[data-k]").forEach((c) => { c.checked = !!done[c.dataset.k]; });
      const n = Object.keys(done).filter((k) => done[k]).length;
      $("lab-count").textContent = T(`${n} / ${total} steps done`, `已完成 ${n} / ${total} 步`) + (n === total ? T(" — lab complete!", "：实验完成！") : "");
      $("lab-bar").style.width = Math.round((n / total) * 100) + "%";
    }
    $("lab-stages").addEventListener("change", (e) => { const c = e.target.closest("input[data-k]"); if (!c) return; done[c.dataset.k] = c.checked; save(done); paint(); });
    $("lab-reset").addEventListener("click", () => { done = {}; save(done); paint(); });
    paint();
  }

  // ---------- Troubleshooting, cheat sheets, teach a class ----------
  const S = window.SUPPORT;
  if (S) {
    const sl = (k) => { const x = S.src(k); return x ? `<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>` : ""; };
    const ZS = window.LANG === "zh" && window.ZH && window.ZH.support;
    const areaName = (a) => (ZS && ZS.areaNames[a]) || a;
    let area = "All";
    $("tr-areas").innerHTML = ["All"].concat(S.areas).map((a) => `<button class="tile" data-area="${esc(a)}"><strong>${esc(areaName(a))}</strong></button>`).join("");
    function renderTrouble() {
      const q = $("tr-search").value.trim().toLowerCase();
      const items = S.trouble.filter((t) => (area === "All" || t.area === area) &&
        (!q || [t.s, t.fix, t.where].concat(t.check).join(" ").toLowerCase().includes(q)));
      document.querySelectorAll("#tr-areas .tile").forEach((b) => b.classList.toggle("selected", b.dataset.area === area));
      $("tr-count").textContent = ZS ? ZS.ui.shown(items.length, S.trouble.length) : `${items.length} of ${S.trouble.length} problems shown`;
      $("tr-list").innerHTML = items.map((t) => `<details class="card trouble"${q ? " open" : ""}><summary><span class="pill">${esc(areaName(t.area))}</span>
        <h3>${esc(t.s)}</h3></summary><p><strong>${T("Check first", "先查这些")}</strong></p><ul>${t.check.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <p class="callout ok"><strong>${T("Fix:", "解决办法：")}</strong> ${esc(t.fix)}</p><div class="where">${esc(t.where)}</div>
        <p class="sources">${T("Source: ", "来源：")}${t.src.map(sl).filter(Boolean).join(" · ")}</p></details>`).join("") ||
        `<div class="card"><p>${ZS ? ZS.ui.none : `No match. Try another word, or <a href="https://github.com/Xudaniel/webmethods-bpms-academy/issues/new" target="_blank" rel="noopener">ask for a new entry</a>.`}</p></div>`;
    }
    $("tr-search").addEventListener("input", renderTrouble);
    $("tr-areas").addEventListener("click", (e) => { const b = e.target.closest("[data-area]"); if (b) { area = b.dataset.area; renderTrouble(); } });
    renderTrouble();

    window.renderCheat = function (id) {
      const c = S.cheats.find((x) => x.id === id); if (!c) return;
      const box = document.createElement("div");
      box.innerHTML = `<div class="card cheat-sheet"><h3>${ZS ? esc(ZS.ui.cheat(c.role)) : esc(c.role) + " cheat sheet"}</h3>
        <table class="cheat">${c.actions.map(([a, w]) => `<tr><td><strong>${esc(a)}</strong></td><td><span class="where">${esc(w)}</span></td></tr>`).join("")}</table>
        <p><strong>${T("Golden rules", "黄金法则")}</strong></p><ol>${c.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ol>
        <p class="sources">${ZS ? ZS.ui.byline : "IBM webMethods BPMS Academy · by Daniel Yuanpeng Xu · xudaniel.github.io/webmethods-bpms-academy · independent, not affiliated with IBM"}</p>
        <button class="tile print-cheat-btn" type="button"><strong>${T("Print this cheat sheet", "打印这张速查卡")}</strong></button></div>
        <div class="card self-check"><h3>${ZS ? esc(ZS.ui.checkYou(c.role)) : "Check yourself: " + esc(c.role)}</h3><p id="sc-score" class="lead">0 / ${c.check.length}</p>
        ${c.check.map((q, i) => `<div class="quiz-q" data-i="${i}"><strong>${i + 1}. ${esc(q.q)}</strong>${q.a.map((a, j) => `<button data-j="${j}">${esc(a)}</button>`).join("")}<div class="explain"></div></div>`).join("")}</div>`;
      while (box.firstChild) $("howto-body").appendChild(box.firstChild);
      let right = 0;
      $("howto-body").querySelector(".self-check").addEventListener("click", (e) => {
        const b = e.target.closest("button[data-j]"); if (!b) return;
        const qd = b.closest(".quiz-q"); if (qd.dataset.done) return; qd.dataset.done = "1";
        const q = c.check[qd.dataset.i], j = +b.dataset.j;
        qd.querySelectorAll("button").forEach((x, k) => { if (k === q.c) x.classList.add("correct"); else if (k === j) x.classList.add("wrong"); });
        if (j === q.c) right++;
        qd.querySelector(".explain").textContent = (j === q.c ? T("Right. ", "答对了。") : T("Not quite. ", "还差一点。")) + q.e;
        $("sc-score").textContent = `${right} / ${c.check.length}`;
      });
      $("howto-body").querySelector(".print-cheat-btn").addEventListener("click", () => {
        document.body.classList.add("print-cheat"); window.print();
        setTimeout(() => document.body.classList.remove("print-cheat"), 500);
      });
    };
    const firstRole = document.querySelector("#howto-tabs .tile.selected");
    if (firstRole && firstRole.dataset.role !== "demo") window.renderCheat(firstRole.dataset.role);

    const K2 = S.klass;
    $("teach-title").textContent = K2.title;
    $("teach-audience").textContent = K2.audience;
    $("teach-agenda").innerHTML = `<tr><th>${T("Time", "时间")}</th><th>${T("Min", "分钟")}</th><th>${T("Module", "模块")}</th><th>${T("How to run it", "怎么上")}</th></tr>` +
      K2.agenda.map(([t, m, n, sec, how]) => `<tr><td>${esc(t)}</td><td>${m}</td><td>${sec ? `<a href="#${sec}"><strong>${esc(n)}</strong></a>` : `<strong>${esc(n)}</strong>`}</td><td>${esc(how)}</td></tr>`).join("") +
      `<tr><td></td><td><strong>${K2.agenda.reduce((n, x) => n + x[1], 0)}</strong></td><td colspan="2">${T("minutes in total", "分钟合计")}</td></tr>`;
    $("teach-print").innerHTML = K2.print.map((x) => `<li>${esc(x)}</li>`).join("");
    $("teach-tips").innerHTML = K2.tips.map((x) => `<li>${esc(x)}</li>`).join("");
  }

  show(location.hash.slice(1) || "start");
})();
