// Swipe sort (#53): rule, agent or keep human? A phone-first card game.
// Every card is synthetic. Its answer comes from SCAN_CLASSIFY, the same rule the Agent Scan Lab uses (js/app.js),
// so the game and the lab always agree. Swipe ← rule, → agent, ↑ keep human; buttons and arrow keys do the same.
(function () {
  const $ = (id) => document.getElementById(id);
  const root = $("swipe-game");
  const classify = window.SCAN_CLASSIFY;
  if (!root || !classify) return;
  const zh = window.LANG === "zh";
  const T = (en, cn) => (zh ? cn : en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // [step (en), step (中文), process (en), process (中文), top outcome share, determinism, work minutes, wait hours]
  const CARDS = [
    ["Approve office supplies under the limit", "批准限额内的办公用品", "Purchasing", "采购", 0.96, 0.85, 3, 2],
    ["Check an expense receipt against policy", "按政策核对报销单据", "Expenses", "报销", 0.88, 0.92, 6, 5],
    ["Apply the loan pricing tier", "套用贷款定价档位", "Lending", "贷款", 0.70, 0.95, 8, 3],
    ["Verify the shipping address format", "核对收货地址格式", "Orders", "订单", 0.93, 0.90, 2, 1],
    ["Set the claim fast-track flag", "设置理赔快速通道标记", "Claims", "理赔", 0.82, 0.87, 5, 10],
    ["Route an invoice to the cost-centre owner", "把发票转给成本中心负责人", "Accounts payable", "应付账款", 0.75, 0.97, 4, 6],
    ["Confirm the carrier's delivery photo", "确认承运商的送达照片", "Logistics", "物流", 0.95, 0.40, 4, 3],
    ["Acknowledge a supplier contract renewal", "确认供应商合同续签", "Procurement", "采购管理", 0.97, 0.55, 10, 8],
    ["Review a travel booking request", "审核差旅预订申请", "Travel", "差旅", 0.92, 0.60, 7, 12],
    ["Check onboarding documents are complete", "检查入职文件是否齐全", "HR onboarding", "入职", 0.94, 0.50, 12, 20],
    ["Approve a small refund with a photo", "批准附照片的小额退款", "Customer service", "客服", 0.91, 0.65, 5, 4],
    ["Review a delivery delay claim", "审核货运延误索赔", "Logistics", "物流", 0.86, 0.50, 25, 36],
    ["Classify customs documents", "给海关文件分类", "Customs", "海关", 0.78, 0.30, 20, 30],
    ["Summarise a damage report", "总结损坏报告", "Claims", "理赔", 0.80, 0.45, 40, 48],
    ["Sort a customer complaint email", "给客户投诉邮件分类", "Customer service", "客服", 0.74, 0.35, 18, 26],
    ["Approve an unusual refund for a key account", "给大客户批一笔不寻常的退款", "Customer service", "客服", 0.55, 0.30, 30, 20],
    ["Decide on a fraud alert", "处理一条欺诈警报", "Payments", "支付", 0.60, 0.40, 25, 2],
    ["Negotiate a supplier penalty", "和供应商谈罚款", "Procurement", "采购管理", 0.50, 0.20, 60, 72],
    ["Sign off a response to the regulator", "签发给监管机构的回复", "Compliance", "合规", 0.65, 0.35, 90, 30],
    ["Handle an escalation for a vulnerable customer", "处理弱势客户的升级投诉", "Customer care", "客户关怀", 0.68, 0.30, 35, 10]
  ].map(([en, cn, pen, pcn, top, det, work, wait], i) => {
    const cls = classify({ type: "user_task", err: 0, det, top, work, wait });
    const answer = cls.startsWith("Rule") ? "rule" : cls.startsWith("Agent") ? "agent" : "human";
    return { i, step: T(en, cn), process: T(pen, pcn), top, det, work, wait, cls, answer };
  });

  const pct = (x) => Math.round(x * 100) + "%";
  const NAMES = { rule: T("Rule", "规则"), agent: T("Agent", "Agent"), human: T("Keep human", "留给人") };
  // Why the answer is what it is, in the order the Scan Lab checks
  function why(c) {
    if (c.answer === "rule") return T(`Same inputs give the same outcome ${pct(c.det)} of the time (80% or more): that is a rule nobody wrote down. Put it in a decision table.`,
      `相同输入 ${pct(c.det)} 的时候得到相同结果（≥ 80%）：这是一条没人写下来的规则。把它放进决策表。`);
    if (c.cls.includes("rubber")) return T(`One outcome ${pct(c.top)} of the time, in ${c.work} minutes of work, but the inputs don't predict it: an agent can prepare it and a person or rule confirms.`,
      `${pct(c.top)} 的时候都是同一个结果，处理只要 ${c.work} 分钟，但输入预测不了结果：可以让 agent 准备，再由人或规则确认。`);
    if (c.answer === "agent") return T(`It waits ${c.wait} hours and one outcome wins ${pct(c.top)} of the time: an agent can triage and draft, and a person approves.`,
      `要等 ${c.wait} 小时，同一结果占 ${pct(c.top)}：可以让 agent 分诊、起草，由人来批准。`);
    return T(`No clear pattern: one outcome only ${pct(c.top)} of the time and the inputs don't predict it. This needs a person's judgement.`,
      `没有明显规律：最常见的结果也只占 ${pct(c.top)}，输入也预测不了结果。这需要人的判断。`);
  }

  const KEY = "wm-academy-swipe-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } };
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ROUND = 60;
  let deck = [], pos = 0, right = 0, streak = 0, best = 0, left = ROUND, timer = 0, playing = false;

  root.innerHTML = `
    <div class="sw-bar"><span id="sw-time">⏱ ${ROUND}${T("s", " 秒")}</span><span id="sw-score">${T("Score: ", "得分：")}0</span><span id="sw-streak"></span></div>
    <div class="sw-stage" id="sw-stage"><div class="sw-intro"><p>${T("20 synthetic steps from process history. For each one, decide: should a <strong>rule</strong> do it, can an <strong>agent</strong> help, or should a person <strong>keep</strong> it?",
      "20 个来自流程历史的合成步骤。每一个都判断一下：该交给<strong>规则</strong>，可以让 <strong>agent</strong> 帮忙，还是<strong>留给人</strong>？")}</p>
      <p class="sw-keys">← ${NAMES.rule} · ↑ ${NAMES.human} · → ${NAMES.agent}</p>
      <button type="button" class="btn" id="sw-start">${T("Start a 60-second round", "开始 60 秒挑战")}</button>
      ${load().best ? `<p class="sources">${T("Your best", "你的最高分")}: ${load().best} / ${CARDS.length}</p>` : ""}</div></div>
    <div class="sw-btns" role="group" aria-label="${T("Your answer", "你的答案")}">
      <button type="button" class="btn secondary" data-a="rule" aria-label="${T("Rule (left arrow)", "规则（左方向键）")}">← ${NAMES.rule}</button>
      <button type="button" class="btn secondary" data-a="human" aria-label="${T("Keep human (up arrow)", "留给人（上方向键）")}">↑ ${NAMES.human}</button>
      <button type="button" class="btn secondary" data-a="agent" aria-label="${T("Agent (right arrow)", "Agent（右方向键）")}">${NAMES.agent} →</button>
    </div>
    <div class="sw-why" id="sw-why" aria-live="polite"></div>`;
  const btns = root.querySelectorAll(".sw-btns button");
  const enable = (on) => btns.forEach((b) => { b.disabled = !on; });
  enable(false);

  function cardHtml(c) {
    return `<div class="sw-card" id="sw-card" tabindex="0" data-i="${c.i}">
      <p class="sw-proc">${esc(c.process)} · <span class="pill">${T("synthetic data", "合成数据")}</span></p>
      <h3>${esc(c.step)}</h3>
      <ul class="sw-facts">
        <li><strong>${pct(c.top)}</strong> ${T("same outcome", "同一结果")}</li>
        <li><strong>${pct(c.det)}</strong> ${T("same inputs → same outcome", "相同输入 → 相同结果")}</li>
        <li><strong>${c.work}</strong> ${T("min of work", "分钟处理")}</li>
        <li><strong>${c.wait}</strong> ${T("h waiting", "小时等待")}</li>
      </ul><p class="sw-count">${pos + 1} / ${deck.length}</p></div>`;
  }
  function paint() {
    $("sw-score").textContent = `${T("Score: ", "得分：")}${right}`;
    $("sw-streak").textContent = streak >= 3 ? `🔥 ${streak}` : "";
    $("sw-time").textContent = `⏱ ${left}${T("s", " 秒")}`;
  }
  function next() {
    if (pos >= deck.length || left <= 0) return finish();
    $("sw-stage").innerHTML = cardHtml(deck[pos]);
    wire($("sw-card"));
    enable(true);
  }
  function start() {
    deck = CARDS.slice().sort(() => Math.random() - 0.5);
    pos = 0; right = 0; streak = 0; best = 0; left = ROUND; playing = true;
    $("sw-why").innerHTML = "";
    clearInterval(timer);
    timer = setInterval(() => { left--; paint(); if (left <= 0) finish(); }, 1000);
    paint(); next();
  }
  function answer(a) {
    if (!playing || pos >= deck.length) return;
    const c = deck[pos], ok = a === c.answer, card = $("sw-card");
    if (ok) { right++; streak++; best = Math.max(best, streak); } else { streak = 0; window.REVIEW && window.REVIEW.miss("swipe", c.i); }
    $("sw-why").innerHTML = `<p class="${ok ? "pz-ok" : "pz-bad"}">${ok ? "✅" : "❌"} <strong>${esc(c.step)}${T(": ", "：")}${NAMES[c.answer]}${T(".", "。")}</strong> ${esc(why(c))}</p>`;
    pos++; paint(); enable(false);
    if (card && !reduce) {
      card.classList.add("sw-out-" + a);
      setTimeout(next, 260);
    } else next();
  }
  function finish() {
    if (!playing) return;
    playing = false; clearInterval(timer); enable(false);
    const st = load(); st.best = Math.max(st.best || 0, right); save(st);
    const share = T(`I sorted ${right}/${CARDS.length} steps into rule, agent or human at the IBM webMethods BPMS Academy`, `我在 IBM webMethods BPMS 学院的刷卡分类里答对了 ${right}/${CARDS.length} 张`);
    $("sw-stage").innerHTML = `<div class="sw-intro sw-end"><h3>${right >= 16 ? "🏆" : right >= 10 ? "👍" : "🌱"} ${right} / ${CARDS.length}</h3>
      <p>${T(`Longest streak: ${best}. Seen ${pos} of ${deck.length} cards.`, `最长连对：${best}。看了 ${pos} / ${deck.length} 张。`)}</p>
      <p>${T("The rule behind every answer is the one the", "每个答案背后的规则，就是")} <a href="#scan">${T("Agent Scan Lab", "Agent 扫描实验室")}</a> ${T("uses. Agents propose; rules decide; people handle the edge cases:", "用的那一套。Agent 提议，规则决定，人处理边缘情况：")} <a href="#patterns">${T("see the pattern", "看看这个模式")}</a>.</p>
      <p class="sw-share" id="sw-share-text">${esc(share)}</p>
      <div class="row"><button type="button" class="btn" id="sw-again">${T("Play again", "再来一局")}</button><button type="button" class="btn secondary" id="sw-share">${T("Share", "分享")}</button></div></div>`;
    $("sw-again").addEventListener("click", start);
    $("sw-share").addEventListener("click", async () => {
      const url = "https://xudaniel.github.io/webmethods-bpms-academy/#swipe";
      try { if (navigator.share) { await navigator.share({ text: share, url }); return; } } catch (e) { return; }
      try { await navigator.clipboard.writeText(share + " " + url); $("sw-share").textContent = T("Copied", "已复制"); } catch (e) { /* the text is on screen to copy by hand */ }
    });
  }

  // Swipe gestures on the card (pointer events cover touch, pen and mouse)
  function wire(card) {
    let x0 = 0, y0 = 0, dragging = false;
    card.addEventListener("pointerdown", (e) => { dragging = true; x0 = e.clientX; y0 = e.clientY; card.setPointerCapture(e.pointerId); });
    card.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      card.style.transform = `translate(${dx}px, ${Math.min(0, dy)}px) rotate(${dx / 20}deg)`;
    });
    const end = (e) => {
      if (!dragging) return; dragging = false;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      if (dx < -70) answer("rule"); else if (dx > 70) answer("agent"); else if (dy < -70) answer("human"); else card.style.transform = "";
    };
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", () => { dragging = false; card.style.transform = ""; });
  }

  root.addEventListener("click", (e) => {
    if (e.target.closest("#sw-start")) return start();
    const b = e.target.closest(".sw-btns button"); if (b && !b.disabled) answer(b.dataset.a);
  });
  document.addEventListener("keydown", (e) => {
    if (!playing || location.hash !== "#swipe" || /input|textarea|select/i.test((e.target.tagName || ""))) return;
    const a = { ArrowLeft: "rule", ArrowRight: "agent", ArrowUp: "human" }[e.key];
    if (a) { e.preventDefault(); answer(a); }
  });
  window.addEventListener("hashchange", () => { if (location.hash !== "#swipe" && playing) { clearInterval(timer); playing = false; enable(false); $("sw-stage").innerHTML = `<div class="sw-intro"><button type="button" class="btn" id="sw-start">${T("Start a 60-second round", "开始 60 秒挑战")}</button></div>`; } });

  // For the smoke test: every card's answer must come from the shared classifier
  window.SWIPE_CARDS = CARDS;
  window.SWIPE_INFO = { names: NAMES, why }; // for the review book
})();
