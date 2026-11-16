// 10-minute crash course (#64): five 2-minute steps for someone who knows nothing, then three checks.
// Pictures come from js/diagrams.js (placeholders mounted there). Facts match the cited sections linked from each step.
window.CRASH = {
  steps: [
    { title: "What a BPMS is", dg: "b-model-instance",
      body: ["A process is like a recipe: you write the steps once and use them again and again. The written steps are the <b>process model</b>.",
        "Every time someone follows it, that is one <b>instance</b>. 500 purchase requests today = one model, 500 instances.",
        "A <b>BPMS</b> keeps the recipe and runs every instance for you: it calls systems, gives people tasks, applies rules and records what happened."],
      remember: "One model, many instances.", more: ["Basics 101, lesson 1", "basics"] },
    { title: "Who does each step", dg: "b-bpmn-shapes",
      body: ["Every step is done by a <b>system</b> (a service task: call software, send an email), a <b>person</b> (a user task: waits in an inbox) or a <b>rule</b> (a rule task: limits, eligibility, prices).",
        "Five shapes are enough to read most diagrams: ○ start, ◉ end, ▭ task, ◇ gateway (pick a path or split), → what happens next."],
      remember: "System, person or rule; five shapes.", more: ["BPMN essentials", "bpmn"] },
    { title: "The IBM webMethods parts", dg: "arch-map",
      body: ["<b>Designer</b>: the desktop tool where you draw processes and write rules.",
        "<b>Integration Server</b>: the server. Its <b>Process Engine</b> runs every instance, and <b>Business Rules</b> answer the decisions.",
        "<b>My webMethods Server</b>: the website where people get tasks (the <b>Task Engine</b>) and operations watch and fix instances in <b>Monitor</b>.",
        "<b>Process Audit database</b>: the history book of every step."],
      remember: "Designer draws, Integration Server runs, My webMethods is where people work.", more: ["Architecture", "architecture"] },
    { title: "From drawing to running", dg: "build-pipeline",
      body: ["Draw → build and upload → <b>enable for execution</b> → run → monitor, then improve.",
        "⚠️ The classic beginner mistake: a new upload is <b>not enabled by default</b>. Until someone enables it in My webMethods, nothing starts.",
        "💡 To change a limit, change the rule and <b>Hot Deploy</b> it. The process itself does not need to be redeployed."],
      remember: "Enable it, or nothing starts. Change rules with Hot Deploy.", more: ["Hands-on lab", "lab"] },
    { title: "Why it matters now", dg: "agent-pattern",
      body: ["AI agents are arriving. The safe pattern: the <b>agent proposes</b>, the <b>rules decide</b>, a <b>person approves</b> the exceptions, and <b>every step is logged</b>.",
        "Banks and insurers need exactly that: decisions you can trace, people who can step in, and work that recovers after a failure. A BPMS gives you all three."],
      remember: "Agent proposes, rules decide, people approve, everything is logged.", more: ["Controls for regulated industries", "controls"] }
  ],
  checks: [
    { q: "500 purchase requests follow one approval process. How many instances is that?", a: ["1", "500", "It depends on the rules"], c: 1, e: "One model, 500 instances: each request is its own run." },
    { q: "You uploaded a new process but nothing starts. Most likely cause?", a: ["The diagram is too small", "It was not enabled for execution", "The rules are wrong"], c: 1, e: "New uploads are not enabled by default; enable that version in My webMethods." },
    { q: "The approval limit changes from $500 to $800. What do you change?", a: ["The whole process", "Only the rule, then Hot Deploy it", "Nothing; restart the server"], c: 1, e: "Only the decision changed, so only the rule changes; the process stays as it is." }
  ]
};

(function () {
  const X = window.CRASH, $ = (id) => document.getElementById(id);
  const root = $("crash-body"); if (!root) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const N = X.steps.length;
  let started = null;

  root.innerHTML = X.steps.map((s, i) => `<div class="cc-step" data-i="${i}" ${i ? "hidden" : ""}>
      <p class="cc-kicker">Minutes ${2 * i}–${2 * i + 2} · step ${i + 1} of ${N}</p>
      <h3>${esc(s.title)}</h3>
      ${s.body.map((p) => `<p>${p}</p>`).join("")}
      <div data-mount-dg="${s.dg}"></div>
      <p class="cc-remember">📌 <strong>Remember:</strong> ${esc(s.remember)}</p>
      <p class="b-deeper">Go deeper later: <a href="#${s.more[1]}">${esc(s.more[0])} →</a></p>
    </div>`).join("") +
    `<div class="cc-step" data-i="${N}" hidden><p class="cc-kicker">Final minute · check yourself</p><h3>Three quick questions</h3>
      ${X.checks.map((c, i) => `<div class="quiz-q cc-check" data-i="${i}"><strong>${i + 1}. ${esc(c.q)}</strong>${c.a.map((a, j) => `<button type="button" data-j="${j}">${esc(a)}</button>`).join("")}<div class="explain"></div></div>`).join("")}
      <div class="cc-done" id="cc-done" hidden></div></div>`;

  const nav = $("crash-nav");
  function show(i) {
    root.querySelectorAll(".cc-step").forEach((el) => { el.hidden = +el.dataset.i !== i; });
    const left = Math.max(0, 10 - 2 * i);
    $("crash-bar").style.width = (100 * Math.min(i, N) / N) + "%";
    $("crash-left").textContent = i >= N ? "Last step: check yourself" : `Step ${i + 1} of ${N} · about ${left} min left`;
    nav.querySelector(".cc-back").disabled = i === 0;
    nav.querySelector(".cc-next").hidden = i >= N;
    nav.querySelector(".cc-next").textContent = i === N - 1 ? "Check yourself →" : "Next →";
    nav.dataset.i = i;
    if (!started) started = Date.now();
  }
  nav.addEventListener("click", (e) => {
    const i = +nav.dataset.i;
    if (e.target.closest(".cc-next")) { show(i + 1); $("crash").scrollIntoView({ behavior: "smooth", block: "start" }); }
    if (e.target.closest(".cc-back")) { show(i - 1); $("crash").scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
  let right = 0, answered = 0;
  root.addEventListener("click", (e) => {
    const b = e.target.closest(".cc-check button"); if (!b) return;
    const box = b.closest(".cc-check"); if (box.dataset.done) return;
    const c = X.checks[box.dataset.i], j = +b.dataset.j;
    box.dataset.done = "1"; answered++;
    box.querySelectorAll("button")[c.c].classList.add("correct");
    if (j === c.c) right++; else b.classList.add("wrong");
    box.querySelector(".explain").textContent = c.e;
    if (answered === X.checks.length) {
      const mins = Math.max(1, Math.round((Date.now() - (started || Date.now())) / 60000));
      const done = $("cc-done"); done.hidden = false;
      done.innerHTML = `<h3>${right === X.checks.length ? "🎉 You know the core of IBM webMethods BPMS." : "👍 Good start."}</h3>
        <p>${right} / ${X.checks.length} right, in about ${mins} min. Next, pick one:</p>
        <ul><li><a href="#basics">Basics 101</a>: the same ideas in seven 2-minute lessons, with a check each.</li>
        <li><a href="#puzzles">Fix the diagram</a>: repair five broken processes by tapping.</li>
        <li><a href="#lab">Hands-on lab</a>: build a real one in 30 minutes.</li></ul>`;
    }
  });
  show(0); started = null;
})();
