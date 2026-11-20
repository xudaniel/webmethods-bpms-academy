// Capstone: clothing-store markdown approval. One request through all three layers:
// the agent proposes, the rules decide, a person approves exceptions, the process changes the price and records every step.
// A fictional teaching example: the store, styles and numbers are made up (CAD) and hand-checked. Money is handled in cents.
(function () {
  const $ = (id) => document.getElementById(id);
  const root = $("capstone-app");
  if (!root) return;
  const zh = window.LANG === "zh";
  const T = (en, cn) => (zh ? cn : en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (cents) => "$" + (cents % 100 ? (cents / 100).toFixed(2) : String(cents / 100));
  const C = zh ? "：" : ": ", SEP = zh ? "；" : "; ", END = zh ? "。" : ".";
  const pct1 = (x) => (Math.round(x * 1000) / 10).toFixed(1) + "%";

  // Three wool dresses, all $120 with a $50 cost (made up)
  const STYLES = [
    { id: "W-031", weeks: 6, disc: 15 },
    { id: "W-204", weeks: 12, disc: 35, stock: 150, perWeek: 10 },
    { id: "W-117", weeks: 20, disc: 50 }
  ];
  // R2: the longer a style has been on the shelf, the deeper the markdown it may take
  const capFor = (weeks) => (weeks <= 8 ? 20 : weeks <= 16 ? 40 : 60);

  // Pure rule evaluation; also exposed for the smoke test
  function evaluate(req) {
    const P = Math.round(req.price * 100), C = Math.round(req.cost * 100);
    const floor = Math.round(C * req.mult);
    const after = Math.round((P * (100 - req.disc)) / 100);
    const r1 = P * (100 - req.disc) >= floor * 100;
    const cap = capFor(req.weeks);
    const r2 = req.disc <= cap;
    let max = -1;
    for (let d = cap; d >= 0; d--) if (P * (100 - d) >= floor * 100) { max = d; break; }
    const route = r1 && r2 ? (req.disc <= req.auto ? "auto" : "manager") : "return";
    return { P, C, floor, after, r1, r2, cap, max, route, margin: (after - C) / after };
  }
  window.CAPSTONE_EVAL = evaluate;

  const NODES = [
    ["submit", T("Store manager submits a markdown request", "店长提交降价申请")],
    ["agent", T("Agent reads sales and stock, proposes a discount", "agent 读销量和库存，提议折扣")],
    ["rules", T("Rules decide: R1 margin floor, R2 age cap, R3 who approves", "规则判定：R1 毛利底线、R2 库龄上限、R3 谁来批")],
    ["auto", T("Within the auto line: approved automatically", "在自动线以内：自动通过")],
    ["manager", T("Above the auto line: regional manager approves", "超过自动线：区域经理审批")],
    ["return", T("Breaks a rule: returned with the reason and the allowed range", "违反规则：退回，附原因和可行范围")],
    ["escalate", T("No decision in 24 hours: escalated to the buying director", "24 小时没批：升级到采购总监")],
    ["price", T("Process changes the price and records every step", "流程改价，每一步都留记录")],
    ["review", T("Two weeks later: review sell-through", "两周后：复核清货率")]
  ];

  root.innerHTML = `
    <div class="card">
      <h2>${T("Capstone: clothing-store markdown approval", "综合练习：女装店换季打折审批")}</h2>
      <p class="lead">${T("One markdown request passes three gates. The <strong>agent</strong> proposes, the <strong>rules</strong> decide, a <strong>person</strong> approves the exceptions, and only then does the <strong>process</strong> change the price. The hard part is not the discount the agent thinks of; it is who may say yes, and what happens after a no.",
        "一条降价申请要过三关：<strong>agent</strong> 提议，<strong>规则</strong>判定，<strong>人</strong>批例外，最后才由<strong>流程</strong>改价。难点不在 agent 想出几折，而在谁有权说「行」，以及说了「不行」之后怎么办。")}</p>
      <p class="callout">${T("A fictional teaching example: the store, the styles and every number are made up (Canadian dollars) and checked by hand. The IBM product mapping at the end is the author's sketch, not an IBM reference architecture, and has not been run on a real system.",
        "这是虚构的教学例子：店、款号和所有数字都是自编的（加元），逐个手算核对过。最后的 IBM 产品对应是作者的拼法，不是 IBM 的参考架构，也没有在真实系统里跑过。")}</p>
    </div>

    <div class="card">
      <h3>${T("1. The business problem", "1. 业务问题")}</h3>
      <p>${T("The season is changing and the store has too many wool dresses. The store manager wants to mark them down, but too deep a discount loses margin. The company wants requests that are quick to make, approved for a reason, and traceable afterwards.",
        "换季到了，店里积了不少羊毛连衣裙。店长想打折清货，但折扣打多了会亏毛利。公司要的是：店长提得快，批得有依据，每一笔降价事后查得清。")}</p>
    </div>

    <div class="card">
      <h3>${T("2. The rules table (the buyer can change it)", "2. 规则表（采购自己能改）")}</h3>
      <ul class="cap-rules">
        <li><strong>R1 ${T("Margin floor", "毛利底线")}</strong>: ${T("the marked-down price must be at least", "折后价不低于成本的")} <input type="number" id="cap-mult" value="1.3" min="1" max="3" step="0.1" inputmode="decimal" aria-label="${T("Margin floor multiple", "毛利底线倍数")}"> ${T("× the cost", "倍")}</li>
        <li><strong>R2 ${T("Age cap", "库龄上限")}</strong>: ${T("up to 8 weeks on the shelf 20%; 9 to 16 weeks 40%; 17 weeks or more 60%", "上架 8 周内最多 20%；9 到 16 周 40%；17 周起 60%")}</li>
        <li><strong>R3 ${T("Who approves", "谁来批")}</strong>: ${T("if R1 and R2 pass, up to", "R1、R2 都过时，")} <input type="number" id="cap-auto" value="30" min="0" max="90" inputmode="numeric" aria-label="${T("Auto-approval line", "自动通过线")}">% ${T("is approved automatically, anything above goes to the regional manager; if either fails, the request goes back.", "以内自动通过，超过的交区域经理；任一条没过就退回。")}</li>
      </ul>
      <p class="sources">${T("The limits live in the table, not in the agent's prompt or the process diagram, so the buyer can change one without a new process release.", "这些阈值放在规则表里，不写进 agent 的提示词，也不写死在流程图里，所以采购改一个数不用重新发布流程。")}</p>
    </div>

    <div class="card" id="cap-run">
      <h3>${T("3. Run a request", "3. 跑一条申请")}</h3>
      <p>${T("Pick a style, or change the numbers, then submit. All three styles sell for $120 and cost $50.", "选一个款号，或者改数字，然后提交。三款都是原价 $120、成本 $50。")}</p>
      <div class="row" id="cap-styles" role="group" aria-label="${T("Styles", "款号")}">
        ${STYLES.map((s, i) => `<button type="button" class="btn secondary" data-i="${i}">${s.id} · ${s.weeks} ${T("wk", "周")} · ${s.disc}%</button>`).join("")}
      </div>
      <div class="row cap-inputs">
        <label>${T("Price $", "原价 $")} <input type="number" id="cap-price" value="120" min="1" step="1" inputmode="decimal"></label>
        <label>${T("Cost $", "成本 $")} <input type="number" id="cap-cost" value="50" min="1" step="1" inputmode="decimal"></label>
        <label>${T("Weeks on shelf", "上架周数")} <input type="number" id="cap-weeks" value="12" min="0" max="104" inputmode="numeric"></label>
        <label>${T("Agent's discount %", "agent 提议折扣 %")} <input type="number" id="cap-disc" value="35" min="1" max="90" inputmode="numeric"></label>
      </div>
      <div class="row"><button type="button" class="btn" id="cap-submit">${T("Submit the request", "提交申请")}</button> <button type="button" class="link" id="cap-reset">${T("Start again", "重来")}</button></div>
      <ol class="cap-flow" id="cap-flow">${NODES.map(([k, t]) => `<li data-k="${k}">${t}</li>`).join("")}</ol>
      <div id="cap-verdict" class="detail" hidden></div>
      <div class="row" id="cap-actions"></div>
      <h4>${T("Audit trail", "审计记录")}</h4>
      <ol class="cap-log" id="cap-log"><li class="muted">${T("Nothing yet. Submit a request.", "还没有记录。先提交一条申请。")}</li></ol>
    </div>

    <div class="card">
      <h3>${T("4. Who does what", "4. 谁做什么")}</h3>
      <ul>
        <li><strong>${T("Agent", "agent")}</strong>: ${T("reads sales and stock, writes the proposal and its reason. It cannot change a price.", "读销量和库存，写提案和理由。它不能改价。")}</li>
        <li><strong>${T("Rules", "规则")}</strong>: ${T("judge R1 to R3 and return one of three outcomes (auto-approve, send to the manager, return) with the reason.", "判 R1 到 R3，给出「自动通过、交经理、退回」三种结果和原因。")}</li>
        <li><strong>${T("Process", "流程")}</strong>: ${T("chains the steps, gives the manager a task with a 24-hour timer, escalates when it runs out, calls the store's price service once approved, and records everything.", "把几步串起来；给经理派任务并计时 24 小时，超时升级；批准后调门店的价格接口改价；全程留记录。")}</li>
        <li><strong>${T("People", "人")}</strong>: ${T("the regional manager approves exceptions; the buying director takes requests that time out.", "区域经理批例外；采购总监接手超时的单。")}</li>
      </ul>
    </div>

    <div class="card">
      <h3>${T("5. Design decisions and common mistakes", "5. 关键设计和常见错误")}</h3>
      <h4>${T("Six design decisions", "六条设计决定")}</h4>
      <ol>
        <li>${T("Hard limits live in the rules table, not in the agent's prompt. A prompt can be skipped; a rules table has versions and an audit trail.", "硬规则放规则表，不写进 agent 提示词。提示词可能被漏掉，规则表有版本、可审计。")}</li>
        <li>${T("Thresholds live in a decision table the business can change, not hard-coded in the process diagram.", "阈值放决策表，业务自己能改，不写死在流程图里。")}</li>
        <li>${T("A return always carries the reason and the allowed range, so the agent can re-propose instead of repeating itself.", "退回必须带原因和可行范围，agent 才能改提，不会重复同一个提案。")}</li>
        <li>${T("The agent only proposes; the process changes the price only after the rules (or a manager) say yes.", "agent 只提议；规则通过（或经理批准）之后才由流程改价。")}</li>
        <li>${T("The manager's task has a 24-hour timer and an escalation path, so a holiday does not block the request.", "经理任务设 24 小时计时和升级路径，休假也不卡单。")}</li>
        <li>${T("Every step is recorded: the proposal and its reason, the rules that fired, the approver and when the price changed.", "每一步留记录：提案和理由、命中的规则、审批人、生效时间。")}</li>
      </ol>
      <h4>${T("Common mistakes", "常见错误")}</h4>
      <ul>
        <li>${T("The discount limit exists only in the agent's prompt.", "折扣上限只写在 agent 提示词里。")}</li>
        <li>${T("The 30% line is hard-coded in the process, so every change needs a new release.", "30% 这条线写死在流程里，改一次要重新发版。")}</li>
        <li>${T("A return just says no, so the agent keeps proposing the same discount.", "退回只说「不行」，agent 反复提同样的折扣。")}</li>
        <li>${T("The agent's proposal is not recorded, so nobody can say later why a price dropped.", "没记录 agent 的提案，事后查不出为什么降价。")}</li>
        <li>${T("The approver is on holiday and the request sits there.", "审批人休假，单子停在那儿没人管。")}</li>
        <li>${T("This example leaves out loyalty discounts and category exceptions; a real store needs rules for them.", "本例没做会员折扣叠加和品类例外；真实门店要加规则。")}</li>
      </ul>
    </div>

    <div class="card">
      <h3>${T("6. How to tell it works: one season, 40 requests (made up)", "6. 做对了看四个数：一季 40 单（自编）")}</h3>
      <div class="cap-bar" role="img" aria-label="${T("26 automatic, 10 manager, 4 returned", "自动 26，经理 10，退回 4")}"><span class="a" style="width:65%">26</span><span class="m" style="width:25%">10</span><span class="r" style="width:10%">4</span></div>
      <ul>
        <li><strong>${T("Automatic approvals", "自动通过率")}</strong>: 26 ÷ 40 = 65%; ${T("10 to the manager (25%); 4 returned (10%); 26 + 10 + 4 = 40.", "交经理 10 单（25%）；退回 4 单（10%）；26 + 10 + 4 = 40。")}</li>
        <li><strong>${T("Manager turnaround", "经理审批周期")}</strong>: ${T("target within 24 hours.", "目标 24 小时内。")}</li>
        <li><strong>${T("Margin-floor breaches", "毛利底线违规")}</strong>: ${T("0, because R1 stops them before the price changes.", "0，因为 R1 在改价前就拦住了。")}</li>
        <li><strong>${T("Sell-through", "清货率")}</strong>: ${T("units sold in two weeks ÷ stock at markdown, against 33.3% on a six-week path (2 ÷ 6).", "两周后已售 ÷ 降价时库存，对照 6 周清完路径上的 33.3%（2 ÷ 6）。")}</li>
      </ul>
    </div>

    <div class="card">
      <h3>${T("7. Mapping to IBM products (the author's sketch, to be verified)", "7. IBM 产品怎么对应（作者的拼法，待核）")}</h3>
      <ul>
        <li><strong>${T("Process layer", "流程层")}</strong>: ${T("webMethods BPMS runs the steps, the manager's task and the timer (see the <a href=\"#lab\">hands-on lab</a> and <a href=\"#bpmn\">BPMN</a>).", "webMethods BPMS 跑流程步骤、经理的人工任务和计时（见<a href=\"#lab\">动手实验</a>和 <a href=\"#bpmn\">BPMN</a>）。")}</li>
        <li><strong>${T("Rules layer", "规则层")}</strong>: ${T("a decision table, in webMethods Business Rules or in IBM ODM. Play with one in the <a href=\"#decisions\">decision lab</a>.", "一张决策表，可以放在 webMethods Business Rules 里，也可以放在 IBM ODM 里。可以去<a href=\"#decisions\">决策实验室</a>玩一张。")}</li>
        <li><strong>${T("Process calling ODM", "流程调 ODM")}</strong>: ${T("through a service step that calls the decision service over REST, not a rule task pointed at ODM.", "通过服务步骤调用决策服务的 REST 接口，不是让规则任务直接指向 ODM。")}</li>
        <li><strong>${T("Agents", "agent")}</strong>: ${T("which IBM products expose workflows and tasks to agents through MCP today is in the <a href=\"#knowledge\">knowledge base</a>; it lists no announced MCP interface for webMethods BPM processes or tasks.", "哪些 IBM 产品现在通过 MCP 把流程和任务开放给 agent，见<a href=\"#knowledge\">知识库</a>；那里写明 webMethods BPM 的流程和任务还没有公开的 MCP 接口。")}</li>
        <li><strong>${T("Price change", "改价")}</strong>: ${T("the process calls the store system's price service. That service is assumed; no real product is implied.", "流程调用门店系统的价格接口。这个接口是假设的，本例没有对应的真实产品。")}</li>
      </ul>
    </div>

    <div class="card">
      <h3>${T("8. Say it in 30 seconds", "8. 30 秒讲给经理或客户听")}</h3>
      <p>${T("At the end of the season the store manager asks for a markdown. An agent looks at sales and stock and proposes a discount, but it can only propose. Whether it happens is up to the rules: the price must stay at least 1.3 times the cost, and the discount must stay within the cap for how long the style has been on the shelf. Up to 30% goes through automatically; above that the regional manager decides, and if nobody decides in 24 hours it escalates. A request that breaks a rule goes back with the most the agent may propose. Every step is recorded. The process ties the steps together; the rules sit in a table the buyer can change.",
        "换季打折，店长提申请，agent 看销量和库存提一个折扣，但它只能提议。能不能执行，由规则判：折后价不低于成本的 1.3 倍，折扣不超过库龄对应的上限。30% 以内自动通过，超过的交区域经理，24 小时没批自动升级；违规的退回，并告诉 agent 最高能到多少。每一步都有记录。流程把这些步骤串起来，规则放在规则表里，采购自己能改。")}</p>
    </div>

    <div class="card">
      <h3>${T("9. Check yourself", "9. 自测")}</h3>
      ${[
        [T("Why does W-204 need the manager?", "W-204 为什么要经理批？"), T("It passes the margin floor and the age cap, but 35% is above the 30% auto line.", "它过了毛利底线和库龄上限，但 35% 超过 30% 的自动线。")],
        [T("Why is W-117's 50% returned?", "W-117 提 50% 为什么被退回？"), T("The price would be $60, below the $65 floor (1.3 × the $50 cost).", "折后 $60，低于底线 $65（成本 $50 的 1.3 倍）。")],
        [T("After the return, what is the most the agent may propose?", "退回后 agent 最高能提几折？"), T("45%, which is $66. At 46% the price is $64.80, below the floor.", "45%，价格 $66；46% 是 $64.80，低于底线。")],
        [T("Why keep the thresholds in the rules table, not the agent's prompt?", "为什么阈值放规则表，不放 agent 提示词？"), T("Rules need versions and an audit trail, and the business must be able to change them; a prompt can be skipped.", "规则要可审计、有版本，业务能自己改；提示词可能被漏掉。")],
        [T("The manager has not decided after 24 hours. What happens?", "经理 24 小时没批怎么办？"), T("The process timer fires and escalates the request to the buying director.", "流程里的计时触发，升级到采购总监。")],
        [T("150 in stock, selling 10 a week: how many weeks to clear? How many a week to clear in 6 weeks?", "库存 150 件、周均卖 10 件，要几周卖完？6 周卖完周均要几件？"), T("15 weeks; 25 a week.", "15 周；25 件。")]
      ].map(([q, a], i) => `<details class="cap-q"><summary>${i + 1}. ${q}</summary><p>${a}</p></details>`).join("")}
    </div>`;

  // ---------- the interactive run ----------
  const flow = $("cap-flow"), verdict = $("cap-verdict"), actions = $("cap-actions"), log = $("cap-log");
  let entries = [], current = null;

  function mark(keys, cls) { keys.forEach((k) => { const li = flow.querySelector(`[data-k="${k}"]`); if (li) li.classList.add(cls); }); }
  function clearFlow() { flow.querySelectorAll("li").forEach((li) => li.classList.remove("on", "no")); }
  function add(who, text) {
    entries.push([who, text]);
    log.innerHTML = entries.map(([w, t], i) => `<li><strong>${i + 1}. ${esc(w)}</strong> ${t}</li>`).join("");
  }
  function buttons(list) {
    actions.innerHTML = list.map(([id, label, cls]) => `<button type="button" class="btn ${cls || ""}" data-act="${id}">${label}</button>`).join("");
  }
  const WHO = { store: T("Store manager", "店长"), agent: T("Agent", "agent"), rules: T("Rules", "规则"), proc: T("Process", "流程"), mgr: T("Regional manager", "区域经理"), dir: T("Buying director", "采购总监") };

  function read() {
    return {
      price: +$("cap-price").value, cost: +$("cap-cost").value, weeks: Math.max(0, Math.floor(+$("cap-weeks").value)),
      disc: Math.floor(+$("cap-disc").value), mult: +$("cap-mult").value, auto: Math.floor(+$("cap-auto").value)
    };
  }
  function valid(r) {
    if (!(r.price > 0 && r.cost > 0 && r.disc >= 1 && r.disc <= 90 && r.mult >= 1 && r.auto >= 0)) return T("Check the numbers: price and cost above 0, a discount from 1% to 90%, a floor multiple of at least 1.", "请检查数字：原价和成本大于 0，折扣在 1% 到 90% 之间，底线倍数至少为 1。");
    return "";
  }

  function judge(r, style) {
    const e = evaluate(r);
    current = { r, e, style: style || null };
    mark(["submit", "agent", "rules"], "on");
    const ok = (b) => (b ? "✅" : "❌");
    const lines = [
      `${ok(e.r1)} R1 ${T("margin floor", "毛利底线")}${C}${money(e.after)} ${e.r1 ? "≥" : "<"} ${money(e.floor)} (${r.mult} × ${money(e.C)})`,
      `${ok(e.r2)} R2 ${T("age cap", "库龄上限")}${C}${r.disc}% ${e.r2 ? "≤" : ">"} ${e.cap}% (${r.weeks} ${T("weeks on the shelf", "周库龄")})`
    ];
    let head, color;
    if (e.route === "auto") {
      lines.push(`✅ R3${C}${r.disc}% ≤ ${r.auto}% → ${T("approved automatically", "自动通过")}`);
      head = T("Approved automatically", "自动通过"); color = "#24a148";
    } else if (e.route === "manager") {
      lines.push(`➡️ R3${C}${r.disc}% > ${r.auto}% → ${T("regional manager", "交区域经理")}`);
      head = T("Needs the regional manager", "要区域经理批"); color = "#f1c21b";
    } else {
      head = T("Returned to the agent", "退回给 agent"); color = "#da1e28";
      lines.push(e.max > 0
        ? `↩️ R3${C}${T("returned with the allowed range: at most", "退回，附可行范围：最高")} ${e.max}% (${money(Math.round((e.P * (100 - e.max)) / 100))})`
        : `↩️ R3${C}${T("returned: no markdown keeps this price above the floor", "退回：这件怎么降价都会低于底线")}`);
    }
    verdict.hidden = false;
    verdict.style.borderLeftColor = color;
    verdict.innerHTML = `<strong>${head}</strong><br>${lines.join("<br>")}<br><small>${T("Margin at this price", "这个价的毛利")}${C}(${money(e.after)} − ${money(e.C)}) ÷ ${money(e.after)} = ${pct1(e.margin)}</small>`;
    add(WHO.rules, esc(lines.map((l) => l.replace(/^\S+\s/, "")).join(SEP)) + END);

    if (e.route === "auto") finish(r, e, WHO.proc);
    else if (e.route === "manager") {
      mark(["manager"], "on");
      add(WHO.proc, T("creates a task for the regional manager and starts a 24-hour timer.", "给区域经理派任务，开始 24 小时计时。"));
      buttons([["approve", T("Manager approves", "经理批准")], ["reject", T("Manager rejects", "经理驳回"), "secondary"], ["timeout", T("No answer in 24 hours", "24 小时没人批"), "secondary"]]);
    } else {
      mark(["return"], "no");
      buttons(e.max > 0 && e.max < r.disc ? [["repropose", T(`Agent re-proposes ${e.max}%`, `agent 改提 ${e.max}%`)]] : []);
      if (!(e.max > 0)) add(WHO.proc, T("closes the request without a price change.", "结束申请，不改价。"));
    }
  }

  function finish(r, e, who) {
    mark(["price", "review"], "on");
    add(who, `${T("price changed", "改价")} ${money(e.P)} → ${money(e.after)}${T(` (${r.disc}%), `, `（${r.disc}%），`)}${T("recorded with the proposal, the rules that fired and the approver.", "并记录提案、命中的规则和审批人。")}`);
    const s = current.style;
    const review = s && s.stock
      ? T(`Two weeks later (assumed): 50 of ${s.stock} sold = ${pct1(50 / s.stock)}, on track for six weeks (2 ÷ 6 = 33.3%).`, `两周后（假设）：${s.stock} 件卖出 50 件，清货率 ${pct1(50 / s.stock)}，正好在 6 周清完的路径上（2 ÷ 6 = 33.3%）。`)
      : T("Two weeks later: compare units sold ÷ stock at markdown with 33.3% on a six-week path.", "两周后：用已售 ÷ 降价时库存，对照 6 周路径上的 33.3%。");
    add(WHO.proc, review);
    buttons([]);
  }

  function submit(style) {
    const r = read();
    const bad = valid(r);
    if (bad) { verdict.hidden = false; verdict.style.borderLeftColor = "#da1e28"; verdict.textContent = bad; return; }
    entries = []; clearFlow(); actions.innerHTML = "";
    add(WHO.store, T("submits a markdown request", "提交降价申请") + (style ? ` (${style.id}, ${r.weeks} ${T("weeks on the shelf", "周库龄")})` : ""));
    const reason = style && style.stock
      ? T(` Reason: ${style.stock} in stock selling ${style.perWeek} a week takes ${style.stock / style.perWeek} weeks to clear; clearing in 6 weeks needs ${Math.ceil(style.stock / 6)} a week.`, `理由：库存 ${style.stock} 件，周均卖 ${style.perWeek} 件，要 ${style.stock / style.perWeek} 周才清完；想 6 周清完，周均要卖 ${Math.ceil(style.stock / 6)} 件。`)
      : "";
    add(WHO.agent, `${T("proposes", "提议")} ${r.disc}%${C}${money(Math.round(r.price * 100))} → ${money(Math.round((Math.round(r.price * 100) * (100 - r.disc)) / 100))}${END}${reason}`);
    judge(r, style);
  }

  let picked = null;
  $("cap-styles").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-i]");
    if (!b) return;
    picked = STYLES[+b.dataset.i];
    $("cap-price").value = 120; $("cap-cost").value = 50; $("cap-weeks").value = picked.weeks; $("cap-disc").value = picked.disc;
    $("cap-styles").querySelectorAll("button").forEach((x) => x.classList.toggle("secondary", x !== b));
    submit(picked);
  });
  ["cap-price", "cap-cost", "cap-weeks", "cap-disc"].forEach((id) => $(id).addEventListener("input", () => { picked = null; $("cap-styles").querySelectorAll("button").forEach((x) => x.classList.add("secondary")); }));
  $("cap-submit").addEventListener("click", () => submit(picked));
  $("cap-reset").addEventListener("click", () => {
    entries = []; current = null; picked = null; clearFlow(); actions.innerHTML = ""; verdict.hidden = true;
    $("cap-styles").querySelectorAll("button").forEach((x) => x.classList.add("secondary"));
    log.innerHTML = `<li class="muted">${T("Nothing yet. Submit a request.", "还没有记录。先提交一条申请。")}</li>`;
  });

  actions.addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-act]");
    if (!b || !current) return;
    const { r, e } = current;
    const act = b.dataset.act;
    if (act === "repropose") {
      const style = current.style;
      const r2 = Object.assign({}, r, { disc: e.max });
      $("cap-disc").value = e.max;
      add(WHO.agent, `${T("re-proposes", "改提")} ${e.max}%${C}${money(e.P)} → ${money(Math.round((e.P * (100 - e.max)) / 100))}${END}`);
      flow.querySelector('[data-k="return"]').classList.replace("no", "on");
      judge(r2, style);
    } else if (act === "approve") {
      add(WHO.mgr, T("approves the exception.", "批准这个例外。"));
      finish(r, e, WHO.proc);
    } else if (act === "reject") {
      mark(["return"], "no");
      add(WHO.mgr, T("rejects it; the request goes back to the agent with the reason. Nothing changes.", "驳回；申请带着原因退回给 agent，不改价。"));
      buttons([]);
    } else if (act === "timeout") {
      mark(["escalate"], "on");
      add(WHO.proc, T("24 hours pass with no decision; the timer escalates the task to the buying director.", "24 小时没人批，计时触发，任务升级到采购总监。"));
      add(WHO.dir, T("approves.", "批准。"));
      finish(r, e, WHO.proc);
    }
  });
})();
