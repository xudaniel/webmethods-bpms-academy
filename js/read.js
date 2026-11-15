// Reading version: renders the whole course as static text from the same
// content files as the interactive site, so the two never drift apart.
(function () {
  const A = window.ACADEMY, X = window.EXPLAINER;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rows = (arr) => arr.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");

  // 1. Why this matters
  $("r-story").innerHTML = `<div class="table-wrap"><table><tr><th>Without a BPMS</th><th>With a BPMS</th></tr>${X.story.without
    .map((w, i) => `<tr><td>${esc(w)}</td><td>${esc(X.story.with[i])}</td></tr>`).join("")}</table></div>`;
  $("r-sort").insertAdjacentHTML("beforeend", rows(X.sort.map((s) => [esc(s.item), `<strong>${X.owners[s.owner]}</strong>`, esc(s.why)])));

  // 3. Architecture components
  $("r-arch-list").innerHTML = A.architecture
    .map((c) => `<h3>${esc(c.name)} <span class="pill">${esc(c.role)}</span></h3><p>${esc(c.text)}</p><p class="sources">Tip: ${esc(c.tip)}</p>`).join("");

  // 4. Audit tables
  $("r-audit").insertAdjacentHTML("beforeend", rows(A.auditTables.map(([t, d]) => [`<code>${esc(t)}</code>`, esc(d)])));

  // 5. Lifecycle + dates
  $("r-life").innerHTML = A.lifecycle.map(([n, d]) => `<li><strong>${esc(n)}.</strong> ${esc(d)}</li>`).join("");
  $("r-dates").insertAdjacentHTML("beforeend", rows(A.lifecycleDates.map(([k, v]) => [esc(k), `<strong>${esc(v)}</strong>`])));

  // 6. BPMN
  $("r-bpmn-body").innerHTML = A.bpmn
    .map((g) => `<h3>${esc(g.group)}</h3><div class="table-wrap"><table>${rows(g.items.map(([n, d]) => [`<strong>${esc(n)}</strong>`, esc(d)]))}</table></div>`).join("");

  // 7. Patterns
  $("r-pat").innerHTML = A.patterns
    .map((p) => `<h3>${esc(p.name)} <span class="pill ${p.tag === "classic" ? "green" : ""}">${esc(p.tag)}</span></h3>
      <p><strong>Problem:</strong> ${esc(p.problem)} <strong>Solution:</strong> ${esc(p.solution)} <strong>Use for:</strong> ${esc(p.when)}</p>`).join("");

  // 8. Decision guard example (fixed policy: min delay 4 h, limit $500, key accounts 2x)
  const limit = 500, minDelay = 4;
  $("r-guard-table").insertAdjacentHTML("beforeend", rows(X.guardCases.map((c) => {
    let o, r;
    if (c.delay < minDelay) { o = "DENY"; r = `delay under ${minDelay} h`; }
    else if (c.amount <= limit || (c.tier === "key" && c.amount <= limit * 2)) { o = "ALLOW"; r = c.amount <= limit ? `≤ $${limit}` : `key account ≤ $${limit * 2}`; }
    else { o = "REFER"; r = `over the limit → person approves`; }
    const pill = o === "ALLOW" ? "green" : o === "REFER" ? "yellow" : "red";
    return [`<strong>${c.id}</strong> ${esc(c.desc)}`, `$${c.amount}`, `<span class="pill ${pill}">${o}</span> ${esc(r)}`];
  })));

  // 9. Cases
  $("r-case-list").innerHTML = A.cases
    .map((c) => `<h3>${esc(c.name)}</h3><p>${c.flow.map(esc).join(" → ")}</p><p class="sources">Lesson: ${esc(c.lesson)}</p>`).join("");

  // 11. Market
  $("r-sizing").insertAdjacentHTML("beforeend", rows(A.market.sizing.map((r) => r.map(esc))));
  $("r-signals").innerHTML = A.market.signals.map((s) => `<li>${esc(s)}</li>`).join("");
  $("r-view").innerHTML = X.marketView.map(([h, t]) => `<p><strong>${esc(h)}.</strong> ${esc(t)}</p>`).join("");

  // 12. Ideas
  $("r-idea-list").innerHTML = X.ideas.map((i) => `<li><strong>${esc(i.name)}.</strong> ${esc(i.text)}</li>`).join("");

  // IBM webMethods family + knowledge base
  const K = window.KNOWLEDGE;
  if (K) {
    const facts = K.topics.reduce((t, x) => t + x.facts.length, 0);
    $("r-kb-count").innerHTML = `<strong>${K.topics.length}</strong> knowledge topics · <strong>${facts}</strong> cited facts · <strong>${K.family.length}</strong> components · <strong>${A.glossary.length}</strong> glossary terms · <strong>${A.quiz.length}</strong> quiz questions`;
    $("r-family").innerHTML = "<tr><th>Component</th><th>Role in a BPMS solution</th></tr>" + K.family.map(([n, d]) => `<tr><td><strong>${esc(n)}</strong></td><td>${esc(d)}</td></tr>`).join("");
    const link = (n) => `<a href="${esc(K.sources[n][1])}" target="_blank" rel="noopener">${esc(K.sources[n][0])}</a>`;
    $("r-kb").innerHTML = K.topics.map((t, i) => `<h3>3.${i + 1} ${esc(t.title)}</h3><p>${esc(t.summary)}</p>
      <ul>${t.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
      <p class="callout"><strong>In practice:</strong> ${esc(t.practice)}</p>
      <p class="sources">${t.sources.length ? "Sources: " + t.sources.map(link).join(" · ") : "Synthesis of the topics above; author's practitioner view."}</p>`).join("");
  }

  // How to use
  const H = window.HOWTO;
  if (H) {
    const hl = (k) => `<a href="${esc(H.sources[k][1])}" target="_blank" rel="noopener">${esc(H.sources[k][0])}</a>`;
    $("r-path").innerHTML = H.beginner.map(([t, id, d]) => `<li><strong>${esc(t)}</strong> — ${esc(d)}</li>`).join("");
    $("r-roles").innerHTML = H.roles.map((r, i) => `<h3>4.${i + 1} ${esc(r.role)}: ${esc(r.title)}</h3><p><em>${esc(r.who)}</em></p>
      <ol>${r.steps.map(([t, d, where, src]) => `<li><strong>${esc(t)}.</strong> ${esc(d)} <br><code>${esc(where)}</code> <span class="sources">(${src.map(hl).join(" · ")})</span></li>`).join("")}</ol>
      <p class="callout"><strong>You'll know it worked when:</strong> ${esc(r.check)} <strong>Tip:</strong> ${esc(r.tip)}</p>`).join("");
    $("r-demo").innerHTML = H.demo.map(([t, sec, click, say, q]) => `<li><strong>${esc(t)}.</strong> ${esc(click)} Say: “${esc(say)}” <em>Answers: ${esc(q)}</em></li>`).join("");
  }

  // Hands-on lab (printable sheet with tick boxes)
  const LB = window.LAB;
  if (LB) {
    const H3 = window.HOWTO || { sources: {} };
    const ln = (k) => { const x = LB.sources[k] || H3.sources[k]; return x ? `<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>` : ""; };
    $("r-lab-scenario").textContent = LB.scenario;
    $("r-lab-flow").textContent = LB.flow.join(" → ");
    $("r-lab-prereqs").innerHTML = LB.prereqs.map((x) => `<li>${esc(x)}</li>`).join("");
    $("r-lab-stages").innerHTML = LB.stages.map((st, i) => `<h3>5.${i + 1} ${esc(st.t)} (${st.min} min)</h3>
      <ul class="ticks">${st.steps.map(([t, where]) => `<li>☐ ${esc(t)} <br><code>${esc(where)}</code></li>`).join("")}</ul>
      <p class="callout"><strong>Checkpoint:</strong> ${esc(st.check)} <span class="sources">(${st.src.map(ln).filter(Boolean).join(" · ")})</span></p>`).join("");
    $("r-lab-pitfalls").innerHTML = "<tr><th>Symptom</th><th>Likely cause and fix</th></tr>" + LB.pitfalls.map(([a1, b1]) => `<tr><td>${esc(a1)}</td><td>${esc(b1)}</td></tr>`).join("");
    $("r-lab-levelup").textContent = LB.levelup;
  }

  // 13. Glossary
  $("r-gloss").innerHTML = A.glossary.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join("");

  // 14. Quiz with answer key
  const L = "ABCD";
  $("r-q").innerHTML = A.quiz.map((q) => `<li>${esc(q.q)}<ol>${q.a.map((a) => `<li>${esc(a)}</li>`).join("")}</ol></li>`).join("");
  $("r-a").innerHTML = A.quiz.map((q) => `<li><strong>${L[q.c]}</strong> — ${esc(q.a[q.c])}. ${esc(q.e)}</li>`).join("");

  // 15. Sources
  $("r-src").innerHTML = A.sources.map(([t, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a></li>`).join("");
})();
