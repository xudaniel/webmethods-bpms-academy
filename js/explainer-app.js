(function () {
  const ZX = window.LANG === "zh" && window.ZH && window.ZH.explainer;
  const X = ZX || window.EXPLAINER;
  const U = ZX ? ZX.ui : { right: "Right. ", better: (o) => `Better owner: ${o}. `, score: (r, n) => `${r} / ${n} right`,
    wrap: " — process orchestrates, rules judge, people handle exceptions, agents propose.", h: " h", case: "Case", agent: "Agent", rules: "Rules decide",
    proposes: "Agent proposes credit", auto: "automatic", toPerson: "to a person", denied: "denied",
    lt: (d) => `delay < ${d} h`, le: (l) => `≤ $${l}`, key: (l) => `key account ≤ $${l}`, gt: (l) => `> $${l} → human approval`, out: { ALLOW: "ALLOW", REFER: "REFER", DENY: "DENY" } };
  const money = (n) => (ZX ? n + " 美元" : "$" + n);
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // 1. Before / after: one request with and without a BPMS
  const story = X.story;
  function renderStory(mode) {
    document.querySelectorAll("#ex-toggle button").forEach((b) => b.classList.toggle("selected", b.dataset.mode === mode));
    $("ex-story").innerHTML = `<div class="steps">${story[mode].map((s, i) => `${i ? '<span class="arrow">→</span>' : ""}<span class="step ${mode === "with" ? "done" : ""}">${esc(s)}</span>`).join("")}</div>
      <p class="lead">${mode === "with" ? (ZX ? ZX.storyWith : "Same request, but the work is routed, timed, decided by rule and recorded. That is what a BPMS does.") : (ZX ? ZX.storyWithout : "Every step depends on someone remembering. Nothing is measured, nothing is explainable later.")}</p>`;
  }
  document.querySelectorAll("#ex-toggle button").forEach((b) => b.addEventListener("click", () => renderStory(b.dataset.mode)));
  renderStory("without");

  // 2. Sorting game: who should own each job?
  let sortDone = 0, sortRight = 0;
  $("ex-sort").innerHTML = X.sort
    .map((s, i) => `<div class="quiz-q" data-i="${i}"><strong>${esc(s.item)}</strong><div class="row">${Object.entries(X.owners)
      .map(([k, v]) => `<button class="btn secondary" data-o="${k}" style="flex:1;min-width:70px">${v}</button>`).join("")}</div><div class="explain"></div></div>`)
    .join("");
  $("ex-sort").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-o]"); if (!b) return;
    const box = b.closest(".quiz-q"); if (box.dataset.done) return;
    const s = X.sort[box.dataset.i]; box.dataset.done = 1; sortDone++;
    const ok = b.dataset.o === s.owner; if (ok) sortRight++;
    box.querySelectorAll("button[data-o]").forEach((x) => {
      if (x.dataset.o === s.owner) x.style.cssText += ";background:#defbe6;border-color:#24a148;color:#0e6027";
      else if (x === b) x.style.cssText += ";background:#fff1f1;border-color:#da1e28;color:#a2191f";
    });
    box.querySelector(".explain").textContent = (ok ? U.right : U.better(X.owners[s.owner])) + s.why;
    $("ex-sort-score").textContent = U.score(sortRight, sortDone) + (sortDone === X.sort.length ? U.wrap : "");
  });

  // 3. Decision guard: agent proposes, rules decide
  let ruleVersion = 1;
  function guard() {
    const limit = +$("ex-limit").value, minDelay = +$("ex-mindelay").value, keyAuto = $("ex-key").checked;
    $("ex-limit-v").textContent = money(limit); $("ex-mindelay-v").textContent = minDelay + U.h;
    let allow = 0, refer = 0, deny = 0; const log = [];
    const rows = X.guardCases.map((c) => {
      let outcome, reason;
      if (c.delay < minDelay) { outcome = "DENY"; reason = U.lt(minDelay); deny++; }
      else if (c.amount <= limit || (keyAuto && c.tier === "key" && c.amount <= limit * 2)) { outcome = "ALLOW"; reason = c.amount <= limit ? U.le(limit) : U.key(limit * 2); allow++; }
      else { outcome = "REFER"; reason = U.gt(limit); refer++; }
      log.push(`decision case=${c.id} rule_version=v${ruleVersion} proposed=$${c.amount} outcome=${outcome} reason="${reason}"`);
      const pill = outcome === "ALLOW" ? "green" : outcome === "REFER" ? "yellow" : "red";
      return `<tr><td><strong>${c.id}</strong> ${esc(c.desc)}</td><td>${U.proposes} <strong>${money(c.amount)}</strong></td><td><span class="pill ${pill}">${U.out[outcome]}</span> ${esc(reason)}</td></tr>`;
    });
    $("ex-guard").innerHTML = `<div class="table-wrap"><table><tr><th>${U.case}</th><th>${U.agent}</th><th>${U.rules}</th></tr>${rows.join("")}</table></div>
      <p><strong>${allow}</strong> ${U.auto} · <strong>${refer}</strong> ${U.toPerson} · <strong>${deny}</strong> ${U.denied}</p>`;
    $("ex-guard-log").textContent = log.join("\n");
  }
  ["ex-limit", "ex-mindelay", "ex-key"].forEach((id) => $(id).addEventListener("input", () => { ruleVersion++; guard(); }));
  guard();

  // 4. Timeline
  $("ex-timeline").innerHTML = X.timeline
    .map(([d, t, w], i) => `<button class="tile" data-i="${i}"><strong>${esc(d)}</strong><small>${esc(t)}</small></button>`).join("");
  $("ex-timeline").addEventListener("click", (e) => {
    const t = e.target.closest(".tile"); if (!t) return;
    document.querySelectorAll("#ex-timeline .tile").forEach((x) => x.classList.toggle("selected", x === t));
    const [d, ti, w] = X.timeline[t.dataset.i];
    $("ex-timeline-detail").innerHTML = `<div class="detail"><strong>${esc(d)} — ${esc(ti)}</strong><br>${esc(w)}</div>`;
  });

  // 5. Market view (layers) and 6. ideas
  $("ex-market").innerHTML = X.marketView
    .map(([h, t], i) => `<button class="tile" data-i="${i}" style="width:100%;margin-bottom:.5rem"><strong>${i + 1}. ${esc(h)}</strong><small class="ex-hide">${esc(t)}</small></button>`).join("");
  $("ex-market").addEventListener("click", (e) => {
    const t = e.target.closest(".tile"); if (!t) return; t.classList.toggle("selected");
    const s = t.querySelector("small"); s.classList.toggle("ex-hide");
  });
  $("ex-ideas").innerHTML = X.ideas
    .map((x, i) => `<details class="card" style="margin-bottom:.6rem"><summary><strong>${i + 1}. ${esc(x.name)}</strong></summary><p>${esc(x.text)}</p></details>`).join("");
})();
