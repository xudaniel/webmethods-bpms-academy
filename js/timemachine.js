// Instance time machine (#51): after the loan simulator finishes, replay the instance from its audit rows.
// Drag the slider (or use ⏮ ◀ ▶ ▶▶ and the arrow keys): the token moves on the loan diagram and the matching
// PRA_* row lights up. A toggle shows what Monitor would not have if Volatile Tracking were on.
// Load after js/diagrams.js (it draws the loan diagram) and js/app.js (it writes the log).
(function () {
  const $ = (id) => document.getElementById(id);
  const log = $("sim-log"), sec = $("simulator");
  if (!log || !sec) return;
  const zh = window.LANG === "zh";
  const T = (en, cn) => (zh ? cn : en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Where each step sits on the loan diagram (SVG units of the sim-loan drawing)
  const STEPS = ["Application received", "Fetch credit data", "Rule: eligibility", "Underwriter review", "Send decision"];
  const STEP_ZH = ["收到申请", "获取信用数据", "规则：资格", "核保员审核", "发出决定"];
  const AT = { start: [170, 20], 0: [170, 20], 1: [170, 66], 2: [170, 144], 3: [260, 261], 4: [120, 322], end: [120, 378] };
  const where = (line) => {
    if (/^PRA_PROCESS\s/.test(line)) return /STARTED/.test(line) ? "start" : "end";
    if (/^PRA_STEP_LOGGED_FIELD/.test(line)) return 2;
    const m = line.match(/step="([^"]+)"/); return m ? STEPS.indexOf(m[1]) : "start";
  };
  const label = (k) => k === "start" ? T("Instance started", "实例启动") : k === "end" ? T("Instance completed", "实例完成") : T(STEPS[k], STEP_ZH[k]);
  const ts = (line) => { const m = line.match(/ts=(\S+)/); return m ? m[1].slice(11, 16) : "—"; };

  const box = document.createElement("div");
  box.className = "card tm"; box.id = "tm"; box.hidden = true;
  box.innerHTML = `<h3>⏪ ${T("Instance time machine", "实例时光机")}</h3>
    <p>${T("This is what the Process Audit database remembers about the instance you just ran. Drag the slider: the token moves on the diagram above and the matching row lights up.",
      "这就是 Process Audit 数据库对你刚才那个实例记住的内容。拖动滑块：令牌会在上面的流程图上移动，对应的那一行会亮起来。")}</p>
    <div class="tm-ctl"><button type="button" class="btn secondary" data-tm="first" aria-label="${T("First row", "第一行")}">⏮</button>
      <button type="button" class="btn secondary" data-tm="prev" aria-label="${T("Previous row", "上一行")}">◀</button>
      <button type="button" class="btn" data-tm="play" aria-label="${T("Play", "播放")}">▶</button>
      <button type="button" class="btn secondary" data-tm="next" aria-label="${T("Next row", "下一行")}">▶▶</button></div>
    <input type="range" id="tm-slider" min="0" max="0" value="0" aria-label="${T("Audit row", "审计记录行")}">
    <p class="tm-now" id="tm-now" aria-live="polite"></p>
    <label class="tm-vt"><input type="checkbox" id="tm-vt"> ${T("What if Volatile Tracking were on?", "如果打开了 Volatile Tracking 会怎样？")}</label>
    <p class="callout tm-vt-note" id="tm-vt-note" hidden>${T("With Volatile Tracking on, process status is kept in memory only: it is lost if a server fails mid-step, and the instance is not visible in Monitor. None of these rows would be there to replay.",
      "打开 Volatile Tracking 后，流程状态只放在内存里：步骤进行中服务器出故障，状态就会丢失，Monitor 里也看不到这个实例。上面这些记录一行都不会留下来，也就没法回放。")}
      <a href="#knowledge" id="tm-kb">${T("Process Engine and quality of service →", "Process Engine 和服务质量 →")}</a></p>
    <ol class="tm-rows" id="tm-rows"></ol>`;
  log.insertAdjacentElement("afterend", box);

  let rows = [], cur = 0, timer = 0, tok = null;
  const svg = () => sec.querySelector('figure[data-dg="sim-loan"] svg');
  function token() {
    const s = svg(); if (!s) return null;
    if (!tok || !s.contains(tok)) {
      tok = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      tok.setAttribute("r", "8"); tok.setAttribute("class", "tok tm-tok"); s.appendChild(tok);
    }
    return tok;
  }
  function go(i) {
    cur = Math.max(0, Math.min(rows.length - 1, i));
    const r = rows[cur], t = token(), [x, y] = AT[r.at];
    if (t) { t.setAttribute("cx", x); t.setAttribute("cy", y); }
    $("tm-slider").value = cur;
    $("tm-rows").querySelectorAll("li").forEach((li, k) => { li.classList.toggle("tm-on", k === cur); li.classList.toggle("tm-past", k < cur); });
    $("tm-now").innerHTML = `<strong>${T("Row", "第")} ${cur + 1}${T("", " 行")} / ${rows.length}</strong> · ${esc(r.time)} · ${esc(label(r.at))}`;
  }
  function stop() { clearInterval(timer); timer = 0; box.querySelector('[data-tm="play"]').textContent = "▶"; }
  function play() {
    if (timer) return stop();
    if (cur >= rows.length - 1) go(0);
    box.querySelector('[data-tm="play"]').textContent = "⏸";
    timer = setInterval(() => { if (cur >= rows.length - 1) return stop(); go(cur + 1); }, reduce ? 1400 : 900);
  }
  function build() {
    rows = log.textContent.split("\n").filter(Boolean).map((line) => ({ line, at: where(line), time: ts(line) }));
    // Compact on a phone: table · step · status (or the logged field); the full row is in the tooltip
    const brief = (r) => {
      const table = r.line.split(/\s/)[0], st = (r.line.match(/status=(\S+)/) || [])[1], f = r.line.match(/field=(\S+)\s+value="([^"]*)"/);
      const extra = (r.line.match(/(outcome|final|user|inbox)=(\S+)/g) || []).join(" ");
      return `<code>${esc(table)}</code> ${esc(label(r.at))}${f ? ` · ${esc(f[1])} = “${esc(f[2])}”` : ""}${st ? ` · <strong>${esc(st)}</strong>` : ""}${extra ? ` <small>${esc(extra)}</small>` : ""}`;
    };
    $("tm-rows").innerHTML = rows.map((r, k) => `<li data-k="${k}" title="${esc(r.line)}"><span class="tm-ts">${esc(r.time)}</span> ${brief(r)}</li>`).join("");
    $("tm-slider").max = rows.length - 1;
    box.hidden = false; go(0);
  }
  function reset() { stop(); box.hidden = true; if (tok) { tok.remove(); tok = null; } }

  // Show the player when the instance completes; hide it again when a new instance starts
  new MutationObserver(() => {
    const done = /^PRA_PROCESS\s.*status=COMPLETED/m.test(log.textContent);
    if (done && box.hidden) build(); else if (!done && !box.hidden) reset();
  }).observe(log, { childList: true, characterData: true, subtree: true });

  box.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tm]");
    if (b) { const a = b.dataset.tm; if (a !== "play") stop(); if (a === "first") go(0); if (a === "prev") go(cur - 1); if (a === "next") go(cur + 1); if (a === "play") play(); return; }
    const li = e.target.closest(".tm-rows li"); if (li) { stop(); go(+li.dataset.k); }
    if (e.target.id === "tm-kb") setTimeout(() => { const t = document.getElementById("kb-engine"); if (t) t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }, 60);
  });
  $("tm-slider").addEventListener("input", (e) => { stop(); go(+e.target.value); });
  box.addEventListener("keydown", (e) => {
    if (e.target.id === "tm-slider") return; // the range input handles its own arrow keys
    if (e.key === "ArrowRight") { e.preventDefault(); stop(); go(cur + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); stop(); go(cur - 1); }
  });
  $("tm-vt").addEventListener("change", (e) => { box.classList.toggle("tm-volatile", e.target.checked); $("tm-vt-note").hidden = !e.target.checked; });
  window.addEventListener("hashchange", stop);
})();
