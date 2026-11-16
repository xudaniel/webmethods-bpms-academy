// Fix the diagram (#52): five broken processes. Tap a piece to place it, press Run, and watch a token go through.
// Load after js/diagrams.js (uses its drawing helpers). Progress stays in this browser.
(function () {
  const G = window.DIAGRAMS, $ = (id) => document.getElementById(id);
  const root = $("pz-levels");
  if (!G || !root) return;
  const { box } = G;
  const svg = (...a) => G.tr(G.svg(...a)); // Chinese labels when the page is in Chinese
  const ZP = window.LANG === "zh" && window.ZH && window.ZH.puzzles;
  const U = ZP ? ZP.ui : { level: (n) => `Level ${n}`, pieces: "Pieces to place", run: "▶ Run", clear: "Clear", fixed: "Fixed.", notQuite: "Not quite.", hint: "Hint:",
    next: (n) => `Next: level ${n} →`, all: `<strong>All five fixed.</strong> <a href="#lab">Now build a real one in the hands-on lab →</a>`,
    count: (n, m) => `${n} / ${m} fixed`, done: (n, m) => `${n} / ${m} fixed: you are a process fixer! 🧩` };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ln = (id, d, dash) => `<path d="${d}" class="ln${dash ? " dash" : ""}" marker-end="url(#ah-${id})"/>`;
  const slot = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" class="pz-slot"/><text x="${x + w / 2}" y="${y + h / 2 + 7}" class="pz-q" text-anchor="middle">?</text>`;
  const gw = (x, y, sym) => `<polygon points="${x},${y - 18} ${x + 18},${y} ${x},${y + 18} ${x - 18},${y}" class="gw"/>` +
    (sym === "o" ? `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#b28600" stroke-width="2"/>` : `<text x="${x}" y="${y + 5}" class="t" font-size="15">${sym}</text>`);
  const note = (x, y, t, anchor) => `<text x="${x}" y="${y}" class="note" text-anchor="${anchor || "middle"}">${esc(t)}</text>`;

  // Each level: draw(choice) → SVG body; run(choice) → { pts, ok, msg }. Exactly one choice is right.
  const LEVELS = [
    { id: 1, title: "Connect the end event", goal: "Mia's request is approved… and then? Give the process a proper finish.", lesson: ["Basics 101: five BPMN shapes", "basics"],
      choices: [["start", "○ Start event"], ["end", "◉ End event"], ["gw", "◇ Gateway"]], right: "end",
      draw: (c) => svg("pz1", 340, 130, "Level 1", [
        `<circle cx="22" cy="62" r="12" class="ev"/>`, ln("pz1", "M34,62 H46"),
        box(48, 40, 74, 44, "soft", ["Submit", "request"], 12), ln("pz1", "M122,62 H140"),
        box(142, 40, 74, 44, "hl", ["Sam", "approves"], 12), ln("pz1", "M216,62 H244"),
        c === "end" ? `<circle cx="270" cy="62" r="14" class="ev endok"/>` : c === "start" ? `<circle cx="270" cy="62" r="14" class="ev"/>` : c === "gw" ? gw(270, 62, "×") : slot(246, 36, 52, 52),
        note(170, 118, "Tap a piece below, then press Run.")
      ].join(""), true),
      run: (c) => ({ pts: [[22, 62], [85, 62], [179, 62], [256, 62]].concat(c === "end" ? [[270, 62]] : []), ok: c === "end",
        msg: c === "end" ? "The token reaches the end event: the instance completes and Monitor shows it as finished."
          : c === "start" ? "A start event begins a run; it cannot finish one. The token has nowhere to go and the instance never completes."
          : "A gateway with nothing after it is a dead end: the token arrives and waits forever." }) },

    { id: 2, title: "Pick the right gateway", goal: "Both checks must happen before the decision. Which gateway splits the work and waits for both?", lesson: ["BPMN essentials: gateways", "bpmn"],
      choices: [["x", "× Exclusive"], ["p", "+ Parallel"], ["o", "○ Inclusive"]], right: "p",
      draw: (c) => svg("pz2", 340, 210, "Level 2", [
        box(2, 84, 62, 40, "soft", ["Receive"], 12), ln("pz2", "M64,104 H80"),
        c ? gw(100, 104, c === "x" ? "×" : c === "p" ? "+" : "o") : slot(82, 86, 36, 36),
        `<path d="M100,86 V48 H130" class="ln" marker-end="url(#ah-pz2)"/><path d="M100,122 V160 H130" class="ln" marker-end="url(#ah-pz2)"/>`,
        box(132, 28, 92, 40, "soft", ["Check credit"], 12), box(132, 140, 92, 40, "soft", ["Check ID"], 12),
        `<path d="M224,48 H246 V86" class="ln"/><path d="M224,160 H246 V122" class="ln"/>`,
        c ? gw(246, 104, c === "x" ? "×" : c === "p" ? "+" : "o") : slot(228, 86, 36, 36), ln("pz2", "M264,104 H280"),
        box(282, 84, 56, 40, "hl", ["Decide"], 12),
        note(170, 204, "The closing gateway mirrors the opening one.")
      ].join(""), true),
      run: (c) => ({ pts: c === "p" ? [[33, 104], [100, 104], [100, 48], [178, 48], [246, 48], [246, 104], [310, 104]] : [[33, 104], [100, 104], [100, 48], [178, 48], [246, 48], [246, 104], [310, 104]],
        ok: c === "p",
        msg: c === "p" ? "Parallel (+) runs both checks, and the closing + waits for both before the decision."
          : c === "x" ? "Exclusive (×) takes exactly one path, so the ID check was skipped. The decision was made with half the facts."
          : "Inclusive (○) runs only the paths whose conditions are true. When both checks are always needed, parallel (+) says so plainly and cannot skip one." }) },

    { id: 3, title: "Move the limit into a rule", goal: "“Up to $500 is approved automatically.” Next month Priya will change the limit. Where should it live?", lesson: ["Basics 101: keep decisions out of the drawing", "basics"],
      choices: [["gw", "Write “amount ≤ 500” in the gateway"], ["rule", "⚖️ Rule task: purchase limit"], ["none", "Send every request to Sam"]], right: "rule",
      draw: (c) => svg("pz3", 340, 196, "Level 3", [
        box(2, 34, 60, 40, "soft", ["Request"], 12), ln("pz3", "M62,54 H78"),
        c === "rule" ? box(80, 26, 96, 56, "agent head", ["Rule task", "purchase limit"], 12) : c === "gw" ? box(80, 26, 96, 56, "warn", ["(no rule:", "limit is in", "the gateway)"], 11) :
          c === "none" ? box(80, 26, 96, 56, "soft", ["(no check)"], 12) : slot(80, 26, 96, 56),
        ln("pz3", "M176,54 H190"), gw(210, 54, "×"),
        c === "gw" ? note(210, 90, "amount ≤ 500?") : c === "rule" ? note(210, 90, "result?") : "",
        `<path d="M210,36 V18 H250" class="ln" marker-end="url(#ah-pz3)"/><path d="M228,54 H236 V96 H250" class="ln" marker-end="url(#ah-pz3)"/>`,
        box(252, 2, 86, 32, "ok", ["Auto-approve"], 12), box(252, 80, 86, 32, "hl", ["Sam approves"], 12),
        `<rect x="2" y="128" width="336" height="60" rx="10" class="bx soft"/>`,
        note(170, 152, "Then Priya raises the limit to $800…"),
        c === "rule" ? note(170, 174, "✅ Hot Deploy the rule. The process is untouched.") : c === "gw" ? note(170, 174, "❌ Edit the gateway, build, upload, enable a new version.") :
          c === "none" ? note(170, 174, "❌ Sam still checks every request, even $12 pens.") : note(170, 174, "Which piece makes this change easy?")
      ].join(""), true),
      run: (c) => ({ pts: [[32, 54], [128, 54], [210, 54], [236, 96], [295, 96]], ok: c === "rule",
        msg: c === "rule" ? "The process asks the rule and routes on the answer. When the limit changes, Priya hot deploys the rule and nobody rebuilds the process."
          : c === "gw" ? "It runs today, but the limit is welded into the drawing. Every budget change means a new process version: build, upload, enable, test."
          : "Nothing is automated: Sam becomes the bottleneck, and requests wait in his inbox." }) },

    { id: 4, title: "Add a timer", goal: "Sam is on holiday for two weeks. What stops Mia's request from waiting all that time?", lesson: ["Patterns: timer escalation", "patterns"],
      choices: [["msg", "✉ Message start event"], ["none", "Nothing: just wait"], ["timer", "⏰ Timer on the task (24 h)"]], right: "timer",
      draw: (c) => svg("pz4", 340, 200, "Level 4", [
        `<circle cx="20" cy="56" r="12" class="ev"/>`, ln("pz4", "M32,56 H70"),
        box(72, 30, 132, 52, "hl", ["Sam approves", "(user task)"], 12), ln("pz4", "M204,56 H290"),
        `<circle cx="306" cy="56" r="13" class="ev endok"/>`,
        c === "timer" ? `<circle cx="138" cy="82" r="13" fill="#fff" stroke="#525252" stroke-width="1.6"/><circle cx="138" cy="82" r="9.5" fill="none" stroke="#525252" stroke-width="1.2"/><path d="M138,76 V82 H143" stroke="#525252" stroke-width="1.6" fill="none"/>` +
          `<path d="M138,95 V150 H172" class="ln" marker-end="url(#ah-pz4)"/>` + box(174, 130, 120, 40, "warn", ["Escalate to", "Sam's deputy"], 12) + `<path d="M294,150 H306 V71" class="ln" marker-end="url(#ah-pz4)"/>` + note(146, 120, "after 24 h", "start")
          : c === "msg" ? `<circle cx="138" cy="82" r="13" class="ev"/>` + note(138, 122, "a start event cannot sit on a task")
          : c === "none" ? note(138, 112, "(no boundary event)") : slot(118, 70, 40, 34),
        note(170, 192, "Event: Sam is away for 14 days.")
      ].join(""), true),
      run: (c) => ({ pts: c === "timer" ? [[20, 56], [138, 56], [138, 82], [138, 150], [234, 150], [306, 150], [306, 70]] : [[20, 56], [138, 56]], ok: c === "timer",
        msg: c === "timer" ? "After 24 hours the timer fires, the request goes to Sam's deputy, and Mia gets her laptop this week."
          : c === "msg" ? "A message start event begins a new process; it cannot hang on a task's border. The token is stuck in Sam's inbox."
          : "The token waits in Sam's inbox for 14 days. Every user task with a deadline needs a timer and an escalation path." }) },

    { id: 5, title: "Only exceptions go to people", goal: "Sam checks every request by hand, even $12 pens. Change the design so he only sees the ones that need judgement.", lesson: ["Patterns: human exception path", "patterns"],
      choices: [["all", "Send everything to Sam"], ["auto", "Approve everything automatically"], ["rule", "⚖️ Rule + gateway: refer only exceptions"]], right: "rule",
      draw: (c) => svg("pz5", 340, 210, "Level 5", [
        box(2, 40, 60, 40, "soft", ["Request"], 12), ln("pz5", "M62,60 H78"),
        c === "rule" ? box(80, 36, 70, 48, "agent", ["Rule", "task"], 12) + ln("pz5", "M150,60 H162") + gw(180, 60, "×") +
          `<path d="M180,42 V16 H222" class="ln" marker-end="url(#ah-pz5)"/>` + box(224, 2, 112, 30, "ok", ["Auto-approve"], 12) + `<path d="M198,60 H222" class="ln" marker-end="url(#ah-pz5)"/>` + note(212, 76, "exception")
          : c === "auto" ? box(80, 36, 140, 48, "bad", ["Approve", "everything"], 12) + ln("pz5", "M220,60 H244") + `<circle cx="258" cy="60" r="12" class="ev endok"/>`
          : c === "all" ? `<path d="M80,60 H222" class="ln" marker-end="url(#ah-pz5)"/>` : slot(80, 30, 140, 60),
        c === "auto" ? "" : box(224, 44, 112, 40, "hl", ["Sam checks"], 12),
        `<rect x="2" y="120" width="336" height="80" rx="10" class="bx soft"/>`,
        note(170, 142, "Out of 100 requests (illustrative):"),
        c === "rule" ? note(170, 166, "✅ about 90 approved by the rule, about 10 to Sam") + note(170, 186, "Every decision is logged.")
          : c === "auto" ? note(170, 166, "❌ 100 approved, including a $9,000 laptop") + note(170, 186, "nobody looked at")
          : c === "all" ? note(170, 166, "❌ 100 tasks in Sam's inbox") + note(170, 186, "Requests wait days; Sam rubber-stamps.") : note(170, 166, "Which design sends Sam only the hard ones?")
      ].join(""), true),
      run: (c) => ({ pts: c === "rule" ? [[32, 60], [115, 60], [180, 60], [180, 16], [280, 16]] : c === "auto" ? [[32, 60], [150, 60], [258, 60]] : [[32, 60], [280, 64]], ok: c === "rule",
        msg: c === "rule" ? "Routine requests flow straight through; only exceptions reach Sam, with the full context. That is the human exception path."
          : c === "auto" ? "Fast, but there is no control at all. One bad approval and the audit asks who decided, and on what basis."
          : "Sam becomes a rubber stamp and the bottleneck. Put the policy in a rule and send him only what needs judgement." }) }
  ];

  // 中文: titles, goals, piece labels and messages; the piece keys and the drawings' logic stay the same
  if (ZP) LEVELS.forEach((L) => {
    const z = ZP.levels[L.id]; if (!z) return;
    L.title = z.title; L.goal = z.goal; L.lesson = [z.lesson, L.lesson[1]];
    L.choices.forEach((c, i) => { c[1] = z.choices[i]; });
    const run = L.run; L.run = (c) => { const r = run(c); r.msg = z.msg[c] || r.msg; return r; };
  });

  const KEY = "wm-academy-puzzles-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } };
  const st = Object.assign({ solved: {} }, load());
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const picks = {};

  root.innerHTML = LEVELS.map((L) => `<div class="card pz-level" id="pz-${L.id}" data-l="${L.id}" hidden>
    <h3>${U.level(L.id)} · ${esc(L.title)}</h3><p class="lead">${esc(L.goal)}</p>
    <div class="pz-fig"></div>
    <div class="pz-palette" role="group" aria-label="${U.pieces}">${L.choices.map(([k, t]) => `<button type="button" class="pz-piece" data-k="${k}">${esc(t)}</button>`).join("")}</div>
    <div class="row"><button type="button" class="btn pz-run" disabled>${U.run}</button><button type="button" class="link pz-clear">${U.clear}</button></div>
    <div class="pz-out" aria-live="polite"></div>
  </div>`).join("");

  function draw(L) {
    const el = $("pz-" + L.id);
    el.querySelector(".pz-fig").innerHTML = `<figure class="dg">${L.draw(picks[L.id] || null)}</figure>`;
    el.querySelectorAll(".pz-piece").forEach((b) => b.classList.toggle("selected", b.dataset.k === picks[L.id]));
    el.querySelector(".pz-run").disabled = !picks[L.id];
  }
  function paint() {
    const n = LEVELS.filter((L) => st.solved[L.id]).length;
    $("pz-count").textContent = n === LEVELS.length ? U.done(n, LEVELS.length) : U.count(n, LEVELS.length);
    $("pz-bar").style.width = (100 * n / LEVELS.length) + "%";
    document.querySelectorAll("#pz-chips .pz-chip").forEach((c) => c.classList.toggle("done", !!st.solved[c.dataset.l]));
  }
  function show(id) {
    LEVELS.forEach((L) => { $("pz-" + L.id).hidden = L.id !== id; });
    document.querySelectorAll("#pz-chips .pz-chip").forEach((c) => c.classList.toggle("selected", +c.dataset.l === id));
    draw(LEVELS[id - 1]);
  }
  $("pz-chips").innerHTML = LEVELS.map((L) => `<button type="button" class="pz-chip" data-l="${L.id}" aria-label="${U.level(L.id)}: ${esc(L.title)}">${L.id}</button>`).join("");
  $("pz-chips").addEventListener("click", (e) => { const c = e.target.closest(".pz-chip"); if (c) show(+c.dataset.l); });

  // Move a token along a list of points, then call done()
  function animate(svgEl, pts, done) {
    const tok = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    tok.setAttribute("r", "7"); tok.setAttribute("class", "tok pz-tok");
    svgEl.appendChild(tok);
    const put = ([x, y]) => { tok.setAttribute("cx", x); tok.setAttribute("cy", y); };
    if (reduce || pts.length < 2) { put(pts[pts.length - 1]); return done(); }
    let i = 0, t0 = null; const seg = 380;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const k = Math.min(1, (ts - t0) / seg), a = pts[i], b = pts[i + 1];
      put([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
      if (k < 1) return requestAnimationFrame(step);
      i++; t0 = null;
      if (i < pts.length - 1) requestAnimationFrame(step); else done();
    };
    put(pts[0]); requestAnimationFrame(step);
  }

  root.addEventListener("click", (e) => {
    const lvl = e.target.closest(".pz-level"); if (!lvl) return;
    const L = LEVELS[lvl.dataset.l - 1], out = lvl.querySelector(".pz-out");
    const piece = e.target.closest(".pz-piece");
    if (piece) { picks[L.id] = piece.dataset.k; out.innerHTML = ""; return draw(L); }
    if (e.target.closest(".pz-clear")) { delete picks[L.id]; out.innerHTML = ""; return draw(L); }
    const run = e.target.closest(".pz-run"); if (!run || run.disabled) return;
    draw(L); run.disabled = true; out.innerHTML = "";
    const r = L.run(picks[L.id]);
    animate(lvl.querySelector(".pz-fig svg"), r.pts, () => {
      run.disabled = false;
      lvl.classList.toggle("pz-win", r.ok); lvl.classList.toggle("pz-fail", !r.ok);
      const next = LEVELS[L.id];
      out.innerHTML = r.ok
        ? `<p class="pz-ok">✅ <strong>${U.fixed}</strong> ${esc(r.msg)}</p>` + (next ? `<button type="button" class="btn pz-next" data-next="${next.id}">${U.next(next.id)}</button>` : `<p>${U.all}</p>`)
        : `<p class="pz-bad">❌ <strong>${U.notQuite}</strong> ${esc(r.msg)}</p><p class="b-deeper">${U.hint} <a href="#${L.lesson[1]}">${esc(L.lesson[0])} →</a></p>`;
      if (r.ok && !st.solved[L.id]) {
        st.solved[L.id] = new Date().toISOString().slice(0, 10); save(st); paint();
        if (LEVELS.every((x) => st.solved[x.id])) document.dispatchEvent(new CustomEvent("puzzles:done"));
      }
    });
  });
  root.addEventListener("click", (e) => { const n = e.target.closest(".pz-next"); if (n) { show(+n.dataset.next); $("pz-" + n.dataset.next).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); } });
  $("pz-reset").addEventListener("click", () => { st.solved = {}; save(st); paint(); });

  const first = LEVELS.find((L) => !st.solved[L.id]);
  show(first ? first.id : 1);
  paint();
})();
