// Original SVG diagrams for the IBM webMethods BPMS Academy (no IBM artwork).
// Works in the browser (mounts diagrams) and in Node (tools/build_diagrams.js writes standalone SVG files).
(function (root) {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- drawing helpers ----------
  function box(x, y, w, h, cls, lines, fs) {
    fs = fs || 14;
    const lh = fs * 1.25, n = lines.length, y0 = y + h / 2 - ((n - 1) * lh) / 2 + fs * 0.35;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" class="bx ${cls || ""}"/>` +
      lines.map((l, i) => `<text x="${x + w / 2}" y="${y0 + i * lh}" class="t${i === 0 && n > 1 && cls && cls.includes("head") ? " b" : ""}" font-size="${fs}">${esc(l)}</text>`).join("");
  }
  function arrow(id, d, opts) {
    opts = opts || {};
    return `<path d="${d}" class="ln${opts.dash ? " dash" : ""}" marker-end="url(#ah-${id})"/>` +
      (opts.label ? `<text x="${opts.lx}" y="${opts.ly}" class="lbl" text-anchor="${opts.anchor || "middle"}">${esc(opts.label)}</text>` : "");
  }
  function svg(id, w, h, title, body, standalone) {
    const style = standalone ? `<style>${STYLE}</style>` : "";
    return `<svg ${standalone ? 'xmlns="http://www.w3.org/2000/svg" ' : ""}class="dg-svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="dgt-${id}">` +
      `<title id="dgt-${id}">${esc(title)}</title>${style}<defs><marker id="ah-${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ahead"/></marker></defs>${body}</svg>`;
  }
  const STYLE = `.dg-svg{font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
.dg-svg .bx{fill:#fff;stroke:#8d8d8d;stroke-width:1.4}.dg-svg .bx.hl{fill:#edf5ff;stroke:#0f62fe}.dg-svg .bx.ok{fill:#defbe6;stroke:#24a148}
.dg-svg .bx.bad{fill:#fff1f1;stroke:#da1e28}.dg-svg .bx.warn{fill:#fcf4d6;stroke:#b28600}.dg-svg .bx.agent{fill:#f6f2ff;stroke:#8a3ffc}.dg-svg .bx.soft{fill:#f4f4f4;stroke:#c6c6c6}
.dg-svg .t{fill:#161616;text-anchor:middle}.dg-svg .t.b{font-weight:600}.dg-svg .lbl{fill:#0043ce;font-size:12px;font-weight:600}.dg-svg .note{fill:#525252;font-size:12px}
.dg-svg .ln{stroke:#525252;stroke-width:1.6;fill:none}.dg-svg .ln.dash{stroke-dasharray:5 4}.dg-svg .ahead{fill:#525252}
.dg-svg .ev{fill:#fff;stroke:#24a148;stroke-width:2}.dg-svg .ev.end{stroke:#da1e28;stroke-width:4}.dg-svg .ev.endok{stroke:#24a148;stroke-width:4}.dg-svg .gw{fill:#fcf4d6;stroke:#b28600;stroke-width:1.6}
.dg-svg .tok{fill:#0f62fe}`;

  // ---------- the diagrams ----------
  const D = {};

  D["process-vs-rules"] = {
    title: "Process vs rules: who decides what",
    caption: "The process owns the order of work; the rules own the decisions. A rule task asks, the rules answer, so a rule can change without redeploying the process.",
    draw: (sa) => svg("pvr", 340, 300, "Process vs rules", [
      box(8, 10, 150, 34, "hl head", ["Process (BPMN)"], 15),
      box(182, 10, 150, 34, "agent head", ["Business rules"], 15),
      box(8, 52, 150, 170, "hl", ["order of steps", "who does what", "waits and timers", "human tasks", "audit trail"], 13),
      box(182, 52, 150, 170, "agent", ["thresholds", "eligibility", "routing", "decision tables", "change by analysts"], 13),
      arrow("pvr", "M158,112 H180", { label: "asks", lx: 170, ly: 104 }),
      arrow("pvr", "M182,160 H160", { label: "answer", lx: 170, ly: 178 }),
      `<text x="170" y="250" class="note" text-anchor="middle">Rule task: the process calls a rule set or decision entity</text>`,
      `<text x="170" y="270" class="note" text-anchor="middle">Change a rule → hot deploy; no process redeploy</text>`
    ].join(""), sa)
  };

  D["rule-task-hot-deploy"] = {
    title: "Changing a rule with Hot Deploy",
    caption: "Rule projects built in Designer are exported to the My webMethods Server repository; an analyst edits, verifies and hot deploys them to the Rules Engine on Integration Server. The process model stays the same.",
    draw: (sa) => svg("hd", 340, 420, "Hot Deploy path for a business rule", [
      box(60, 8, 220, 48, "soft", ["Designer", "rule project"], 14),
      arrow("hd", "M170,56 V82", { label: "export", lx: 178, ly: 73, anchor: "start" }),
      box(60, 84, 220, 48, "soft", ["My webMethods Server", "repository"], 14),
      arrow("hd", "M170,132 V158", { label: "edit in the browser", lx: 178, ly: 149, anchor: "start" }),
      box(40, 160, 260, 48, "agent", ["Business Rules UI", "lock · edit table · verify"], 14),
      arrow("hd", "M170,208 V250", { label: "Hot Deploy", lx: 178, ly: 233, anchor: "start" }),
      box(40, 252, 260, 52, "hl", ["Rules Engine on Integration Server", "(WmBusinessRules package)"], 13),
      arrow("hd", "M170,360 V306", { label: "rule task calls", lx: 178, ly: 340, anchor: "start" }),
      box(60, 362, 220, 48, "ok", ["Running process", "model unchanged"], 14)
    ].join(""), sa)
  };

  D["task-lifecycle"] = {
    title: "A human task, from inbox to done",
    caption: "Accept makes the task yours; Submit saves without finishing; Complete lets the process continue. Delegation does not change who accepted it, so release the task if a colleague should take over.",
    draw: (sa) => svg("tl", 340, 360, "Task lifecycle", [
      box(10, 10, 190, 48, "soft", ["In your inbox", "(you, your group or role)"], 13),
      arrow("tl", "M105,58 V112", { label: "Accept", lx: 112, ly: 90, anchor: "start" }),
      box(10, 114, 190, 48, "hl", ["Accepted by you"], 15),
      `<text x="105" y="180" class="note" text-anchor="middle">Submit = save, keep working</text>`,
      arrow("tl", "M105,190 V246", { label: "Complete", lx: 112, ly: 224, anchor: "start" }),
      box(10, 248, 190, 48, "ok", ["Completed", "process continues"], 13),
      arrow("tl", "M10,138 H2 V34 H8", { label: "Release", lx: 6, ly: 92, anchor: "start", dash: true }),
      arrow("tl", "M200,138 H226", {}),
      `<text x="280" y="106" class="lbl" text-anchor="middle">Delegate →</text>`,
      box(228, 114, 104, 48, "warn", ["Colleague's", "inbox"], 13),
      `<text x="280" y="180" class="note" text-anchor="middle">still accepted</text>`,
      `<text x="280" y="195" class="note" text-anchor="middle">by you until</text>`,
      `<text x="280" y="210" class="note" text-anchor="middle">you release it</text>`,
      `<text x="170" y="335" class="note" text-anchor="middle">Every action is recorded in the task's audit view.</text>`
    ].join(""), sa)
  };

  D["instance-states"] = {
    title: "Process instance states and operator actions",
    caption: "Operators suspend, resume, stop and resubmit instances in Monitor. Completed, Failed, Failed (Escalated) and Stopped instances cannot be suspended; a failed instance is fixed and resubmitted instead.",
    draw: (sa) => svg("is", 340, 330, "Process instance states", [
      box(110, 16, 120, 44, "hl", ["Running"], 15),
      arrow("is", "M140,60 L70,118", { label: "Suspend", lx: 78, ly: 86, anchor: "end" }),
      arrow("is", "M170,60 V118", { label: "done", lx: 176, ly: 96, anchor: "start" }),
      arrow("is", "M200,60 L272,118", { label: "step fails", lx: 252, ly: 86, anchor: "start" }),
      box(5, 120, 105, 44, "warn", ["Suspended"], 14),
      box(120, 120, 100, 44, "ok", ["Completed"], 14),
      box(230, 120, 105, 44, "bad", ["Failed"], 14),
      arrow("is", "M22,120 V38 H108", { label: "Resume", lx: 26, ly: 30, anchor: "start", dash: true }),
      arrow("is", "M318,120 V38 H232", { label: "fix + Resubmit", lx: 336, ly: 30, anchor: "end", dash: true }),
      arrow("is", "M58,164 L140,222", { label: "Stop", lx: 84, ly: 206, anchor: "end" }),
      box(120, 224, 100, 44, "soft", ["Stopped"], 14),
      `<text x="170" y="292" class="note" text-anchor="middle">Stop also works on a running instance.</text>`,
      `<text x="170" y="310" class="note" text-anchor="middle">Completed, failed or stopped: no suspend.</text>`
    ].join(""), sa)
  };

  D["build-pipeline"] = {
    title: "From model to running instances",
    caption: "Build and upload runs only in Process Developer mode. New uploads are not enabled by default, and only one version of a model is enabled at a time.",
    draw: (sa) => svg("bp", 340, 360, "Build pipeline", [
      box(50, 8, 240, 46, "soft", ["Model in Designer", "(Process Developer mode)"], 13),
      arrow("bp", "M170,54 V84", { label: "Build and Upload", lx: 178, ly: 74, anchor: "start" }),
      box(50, 86, 240, 46, "hl", ["Runtime elements on", "Integration Server"], 13),
      arrow("bp", "M170,132 V162", { label: "not enabled yet!", lx: 178, ly: 152, anchor: "start" }),
      box(50, 164, 240, 46, "warn", ["My webMethods: tick", "Execution Enabled → Save"], 13),
      arrow("bp", "M170,210 V240", { label: "start document arrives", lx: 178, ly: 230, anchor: "start" }),
      box(50, 242, 240, 46, "ok", ["Instances run", "and appear in Monitor"], 13),
      `<text x="170" y="318" class="note" text-anchor="middle">Enabling a new version disables the old one;</text>`,
      `<text x="170" y="336" class="note" text-anchor="middle">new instances use the enabled version.</text>`
    ].join(""), sa)
  };

  D["lab-process"] = {
    title: "The lab's purchase-approval process (BPMN)",
    caption: "Message start event → user task → exclusive gateway → two end events. The blue token shows one request taking the Approved path.",
    draw: (sa, still) => svg("lp", 340, 210, "Purchase approval process", [
      `<circle cx="22" cy="100" r="14" class="ev"/>`,
      `<text x="4" y="134" class="note">Request</text><text x="4" y="148" class="note">received</text>`,
      `<path d="M36,100 H56" class="ln" marker-end="url(#ah-lp)"/>`,
      box(58, 74, 112, 52, "hl", ["Approve", "request"], 13),
      `<text x="114" y="146" class="note" text-anchor="middle">user task</text>`,
      `<path d="M170,100 H182" class="ln" marker-end="url(#ah-lp)"/>`,
      `<polygon points="206,78 228,100 206,122 184,100" class="gw"/><text x="206" y="105" class="t" font-size="15">×</text>`,
      `<text x="233" y="104" class="note" text-anchor="start">Approved?</text>`,
      `<path d="M206,78 V45 H284" class="ln" marker-end="url(#ah-lp)"/><text x="244" y="38" class="lbl" text-anchor="middle">yes</text>`,
      `<path d="M206,122 V160 H284" class="ln" marker-end="url(#ah-lp)"/><text x="244" y="153" class="lbl" text-anchor="middle">no</text>`,
      `<circle cx="300" cy="45" r="14" class="ev endok"/><text x="300" y="80" class="note" text-anchor="middle">Approved</text>`,
      `<circle cx="300" cy="160" r="14" class="ev end"/><text x="300" y="195" class="note" text-anchor="middle">Rejected</text>`,
      still ? "" : `<circle r="6" class="tok"><animateMotion dur="6s" repeatCount="indefinite" path="M22,100 H114 H206 V45 H300" keyPoints="0;0.12;0.38;0.55;0.75;1;1" keyTimes="0;0.1;0.35;0.5;0.7;0.9;1" calcMode="linear"/></circle>`
    ].join(""), sa)
  };

  D["trouble-flow"] = {
    title: "Flowchart: the process won't start",
    caption: "Check the three usual causes in order: build, enablement, then the start document.",
    draw: (sa) => svg("tf", 340, 380, "Process won't start flowchart", [
      box(4, 8, 182, 58, "warn", ["Built and uploaded", "without errors?"], 13),
      arrow("tf", "M186,37 H214", { label: "no", lx: 200, ly: 29 }),
      box(216, 8, 120, 58, "ok", ["Process Developer", "mode → Build", "and Upload"], 12),
      arrow("tf", "M95,66 V100", { label: "yes", lx: 103, ly: 88, anchor: "start" }),
      box(4, 102, 182, 58, "warn", ["Version Execution", "Enabled?"], 13),
      arrow("tf", "M186,131 H214", { label: "no", lx: 200, ly: 123 }),
      box(216, 102, 120, 58, "ok", ["Enable it in", "My webMethods", "→ Save"], 12),
      arrow("tf", "M95,160 V194", { label: "yes", lx: 103, ly: 182, anchor: "start" }),
      box(4, 196, 182, 58, "warn", ["Published the start", "event's receive document?"], 12),
      arrow("tf", "M186,225 H214", { label: "no", lx: 200, ly: 217 }),
      box(216, 196, 120, 58, "ok", ["Publish the", "right document"], 12),
      arrow("tf", "M95,254 V288", { label: "yes", lx: 103, ly: 276, anchor: "start" }),
      box(4, 290, 332, 52, "hl", ["An instance should start —", "follow it in Monitor → Process Instances"], 13),
      `<text x="170" y="368" class="note" text-anchor="middle">Still nothing? Check logging level and volatile tracking.</text>`
    ].join(""), sa)
  };

  // ---------- Basics 101 (#40) ----------
  D["b-model-instance"] = {
    title: "One model, many instances",
    caption: "The model is the recipe; each request that follows it is an instance, with its own data and its own current step.",
    draw: (sa) => svg("bmi", 340, 236, "Process model and instances", [
      box(70, 8, 200, 50, "hl head", ["Process model", "“Approve a purchase”"], 14),
      arrow("bmi", "M140,58 L62,114"), arrow("bmi", "M170,58 V114"), arrow("bmi", "M200,58 L278,114"),
      box(6, 118, 104, 62, "warn head", ["Instance #101", "waiting for", "the manager"], 12),
      box(118, 118, 104, 62, "ok head", ["Instance #102", "approved"], 12),
      box(230, 118, 104, 62, "bad head", ["Instance #103", "rejected"], 12),
      `<text x="170" y="206" class="note" text-anchor="middle">One recipe, many dinners:</text>`,
      `<text x="170" y="224" class="note" text-anchor="middle">every run is an instance.</text>`
    ].join(""), sa)
  };
  D["b-three-workers"] = {
    title: "Who does each step?",
    caption: "A system, a person or a rule. The process decides the order; AI agents can help too, inside the limits the rules set.",
    draw: (sa) => svg("btw", 340, 214, "Three kinds of steps", [
      box(4, 8, 104, 36, "soft head", ["⚙️ System"], 14),
      box(118, 8, 104, 36, "hl head", ["🙋 Person"], 14),
      box(232, 8, 104, 36, "agent head", ["⚖️ Rule"], 14),
      box(4, 52, 104, 104, "soft", ["service task", "calls other", "software,", "sends email"], 12),
      box(118, 52, 104, 104, "hl", ["user task", "waits in an", "inbox until", "someone acts"], 12),
      box(232, 52, 104, 104, "agent", ["rule task", "answers:", "limits, prices,", "eligibility"], 12),
      `<text x="170" y="184" class="note" text-anchor="middle">The process decides the order of the steps;</text>`,
      `<text x="170" y="202" class="note" text-anchor="middle">each step is done by one of these three.</text>`
    ].join(""), sa)
  };
  D["b-bpmn-shapes"] = {
    title: "Five BPMN shapes to know first",
    caption: "Start and end events, tasks, gateways and the arrows between them. That is enough to read most process diagrams.",
    draw: (sa) => {
      const row = (y, name, what) => `<text x="84" y="${y + 5}" class="note"><tspan font-weight="600" fill="#161616">${esc(name)}</tspan>  ${esc(what)}</text>`;
      return svg("bbs", 340, 236, "Five BPMN shapes", [
        `<circle cx="40" cy="26" r="13" class="ev"/>`, row(26, "Start event", "a run begins"),
        box(14, 56, 52, 32, "hl", [""], 12), row(72, "Task", "a piece of work"),
        `<polygon points="40,100 60,120 40,140 20,120" class="gw"/><text x="40" y="125" class="t" font-size="15">×</text>`, row(120, "Gateway", "pick a path or split"),
        `<circle cx="40" cy="168" r="13" class="ev endok"/>`, row(168, "End event", "the run is finished"),
        `<path d="M14,210 H64" class="ln" marker-end="url(#ah-bbs)"/>`, row(210, "Sequence flow", "what happens next")
      ].join(""), sa);
    }
  };
  D["b-token-audit"] = {
    title: "The engine runs it; the audit trail remembers it",
    caption: "The blue token is one instance moving through the steps. Every step is written down, and the monitor reads that history.",
    draw: (sa, still) => svg("bta", 340, 270, "Engine and audit trail", [
      box(4, 14, 96, 50, "soft", ["Receive", "request"], 13),
      arrow("bta", "M100,39 H120"),
      box(122, 14, 96, 50, "hl", ["Manager", "approves"], 13),
      arrow("bta", "M218,39 H238"),
      box(240, 14, 96, 50, "soft", ["Create", "order"], 13),
      still ? `<circle cx="170" cy="76" r="6" class="tok"/>` : `<circle r="6" class="tok"><animateMotion dur="5s" repeatCount="indefinite" path="M52,76 H288" keyPoints="0;0;0.5;0.5;1;1" keyTimes="0;0.15;0.4;0.6;0.85;1" calcMode="linear"/></circle>`,
      arrow("bta", "M170,88 V116", { dash: true, label: "every step is written down", lx: 178, ly: 106, anchor: "start" }),
      box(10, 120, 320, 140, "warn", [""], 12),
      `<text x="22" y="144" class="note"><tspan font-weight="600" fill="#161616">Audit trail</tspan>  (the monitor reads it)</text>`,
      `<text x="22" y="170" class="note">09:01  Receive request  ·  completed</text>`,
      `<text x="22" y="192" class="note">09:01  Manager approves  ·  started</text>`,
      `<text x="22" y="214" class="note">11:40  Manager approves  ·  completed by Ana</text>`,
      `<text x="22" y="236" class="note">11:41  Create order  ·  completed</text>`
    ].join(""), sa)
  };

  D["qos"] = { title: "Quality of service: guaranteed or fast?", caption: "Toggle the three Process Engine settings. Defaults: Optimize Locally on, Volatile Transition Documents on, Volatile Tracking off." };

  // Interactive QoS widget (HTML + SVG bar)
  function qosWidget(still) {
    const opts = [
      ["ol", "Optimize Locally", true, "Adjacent steps run on the same Integration Server without publishing transition documents."],
      ["vtd", "Volatile Transition Documents", true, "Transition documents stay in memory; faster, but a messaging failure mid-step means no automatic recovery."],
      ["vt", "Volatile Tracking", false, "Process status stays in memory only; status is lost on failure and the instance is not visible in Monitor."]
    ];
    const ctl = still ? "" : `<div class="qos-ctl">${opts.map(([k, n, on]) => `<label class="qos-opt"><input type="checkbox" data-q="${k}"${on ? " checked" : ""}> ${esc(n)}</label>`).join("")}</div>`;
    return `<div class="qos" data-still="${still ? 1 : 0}">${ctl}
      <svg class="dg-svg" viewBox="0 0 340 92" role="img" aria-label="Position between guaranteed and fast">
        <defs><linearGradient id="qg" x1="0" x2="1"><stop offset="0" stop-color="#24a148"/><stop offset="1" stop-color="#0f62fe"/></linearGradient></defs>
        <rect x="14" y="34" width="312" height="12" rx="6" fill="url(#qg)"/>
        <text x="14" y="24" class="note">More guaranteed</text><text x="326" y="24" class="note" text-anchor="end">Faster</text>
        <g class="qos-mark" transform="translate(222,0)"><circle cx="0" cy="40" r="11" fill="#fff" stroke="#161616" stroke-width="2"/><text x="0" y="74" class="lbl" text-anchor="middle">you</text></g>
      </svg>
      <ul class="qos-out"></ul>
      <p class="sources">Defaults shown. Per process model; see the sources in this topic.</p></div>`;
  }
  function wireQos(el) {
    const out = el.querySelector(".qos-out"), mark = el.querySelector(".qos-mark");
    const state = () => ({ ol: q("ol"), vtd: q("vtd"), vt: q("vt") });
    function q(k) { const c = el.querySelector(`[data-q="${k}"]`); return c ? c.checked : { ol: true, vtd: true, vt: false }[k]; }
    function paint() {
      const s = state(), score = (s.ol ? 1 : 0) + (s.vtd ? 1 : 0) + (s.vt ? 1 : 0);
      mark.setAttribute("transform", `translate(${26 + score * 96},0)`);
      const lines = [
        s.vt ? ["bad", "Not visible in Monitor; status lost if a server fails mid-step."] : ["ok", "Visible and controllable in Monitor."],
        s.vtd ? ["warn", "If messaging fails mid-step, no automatic recovery."] : ["ok", "Transition documents persisted; recovers after messaging failures."],
        s.ol ? ["ok", "Adjacent steps on one server skip the messaging round-trip."] : ["warn", "Every transition goes through messaging: slower, more traffic."]
      ];
      out.innerHTML = lines.map(([c, t]) => `<li class="q-${c}">${esc(t)}</li>`).join("") +
        `<li class="q-tip">${score === 0 ? "Maximum quality of service: guaranteed, recoverable, fully visible." : score === 3 ? "Maximum speed: use only for short, replayable flows." : s.vt ? "Fast, but blind in Monitor: think twice for auditable work." : "Balanced: the default trade-off."}</li>`;
    }
    el.addEventListener("change", paint); paint();
  }

  const API = { D, svg, box, arrow, STYLE, qosWidget, wireQos };
  if (typeof module !== "undefined" && module.exports) { module.exports = API; return; }
  root.DIAGRAMS = API;

  // ---------- mount in the page ----------
  const fig = (key, still) => {
    const d = D[key];
    const body = key === "qos" ? qosWidget(still) : d.draw(false, still);
    return `<figure class="dg" data-dg="${key}">${body}<figcaption><strong>${esc(d.title)}${/[.?!]$/.test(d.title) ? "" : "."}</strong> ${esc(d.caption)}</figcaption></figure>`;
  };
  const after = (el, html) => { if (el) el.insertAdjacentHTML("afterend", html); };
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isRead = !!document.querySelector("nav.toc");

  if (!isRead) {
    // Knowledge: interactive QoS in the Process Engine topic
    const eng = document.querySelector("#kb-engine .lead");
    after(eng, fig("qos")); const w = document.querySelector('#kb-engine .qos'); if (w) wireQos(w);
    // How to use: one diagram per role, re-added whenever a role is shown
    const roleFig = { user: "task-lifecycle", dev: "build-pipeline", analyst: "rule-task-hot-deploy", ops: "instance-states" };
    const orig = window.renderCheat;
    window.renderCheat = function (id) {
      if (orig) orig(id);
      const k = roleFig[id]; const lead = document.querySelector("#howto-body .card .lead");
      if (k && lead && !document.querySelector("#howto-body figure.dg")) after(lead, fig(k));
    };
    const sel = document.querySelector("#howto-tabs .tile.selected");
    if (sel && roleFig[sel.dataset.role] && !document.querySelector("#howto-body figure.dg")) after(document.querySelector("#howto-body .card .lead"), fig(roleFig[sel.dataset.role]));
    // Lab, troubleshooting, teach
    after(document.getElementById("lab-flow"), fig("lab-process", reduce));
    const trc = document.getElementById("tr-count");
    if (trc) trc.insertAdjacentHTML("afterend", `<details class="dg-more"><summary>Show the flowchart: the process won't start</summary>${fig("trouble-flow")}</details>`);
    after(document.querySelector("#teach .table-wrap"), `<div id="teach-timeline"></div>`);
  } else {
    const h3 = (re) => [...document.querySelectorAll("#r-kb h3, #r-roles h3")].find((h) => re.test(h.textContent));
    const afterPara = (h, html) => { if (h && h.nextElementSibling) h.nextElementSibling.insertAdjacentHTML("afterend", html); };
    afterPara(h3(/Process Engine runtime/), fig("qos", true));
    afterPara(h3(/webMethods Business Rules$/), fig("process-vs-rules"));
    afterPara(h3(/Rule Engine configuration/), fig("rule-task-hot-deploy"));
    afterPara(h3(/Business user/), fig("task-lifecycle"));
    afterPara(h3(/Process developer/), fig("build-pipeline"));
    afterPara(h3(/Operations/), fig("instance-states"));
    const lf = document.getElementById("r-lab-flow"); if (lf) lf.parentElement.insertAdjacentHTML("afterend", fig("lab-process", true));
    const tr = document.getElementById("r-tr"); if (tr) tr.insertAdjacentHTML("beforebegin", fig("trouble-flow"));
    const ta = document.getElementById("r-teach-agenda"); if (ta) ta.closest(".table-wrap").insertAdjacentHTML("afterend", `<div id="teach-timeline"></div>`);
    document.querySelectorAll('.qos[data-still="1"]').forEach(wireQos);
  }

  // Placeholders from other modules (Basics 101), both pages
  document.querySelectorAll("[data-mount-dg]").forEach((el) => {
    const k = el.dataset.mountDg;
    if (D[k]) el.outerHTML = fig(k, isRead || reduce);
  });

  // Workshop timeline (HTML bars), both pages
  const tt = document.getElementById("teach-timeline");
  if (tt && window.SUPPORT) {
    const ag = window.SUPPORT.klass.agenda, total = ag.reduce((n, a) => n + a[1], 0);
    tt.innerHTML = `<figure class="dg timeline"><div class="tl-bar">${ag.map(([t, m, n], i) => `<span class="tl-seg tl-${i % 6}${n === "Break" ? " tl-break" : ""}" style="flex:${m}" title="${esc(t + " · " + n)}"></span>`).join("")}</div>
      <ol class="tl-legend">${ag.map(([t, m, n], i) => `<li><span class="tl-dot tl-${i % 6}${n === "Break" ? " tl-break" : ""}"></span><strong>${esc(t)}</strong> ${esc(n)} <small>${m} min</small></li>`).join("")}</ol>
      <figcaption><strong>Workshop timeline.</strong> ${total} minutes; the hands-on lab takes a third of the morning.</figcaption></figure>`;
  }
})(typeof window !== "undefined" ? window : globalThis);
