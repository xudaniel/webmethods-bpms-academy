// Knowledge base, hands-on: small experiments inside two topics, built only from the cited facts of that topic.
// Process design: a join lab and two "guess first" questions. Task Engine: a vote calculator, a task status
// machine and two "guess first" questions. Each answer lights up the fact it comes from.
(function () {
  const zh = window.LANG === "zh";
  const T = (en, z) => (zh ? z : en);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const topic = (id) => document.getElementById("kb-" + id);
  const facts = (id) => topic(id) && topic(id).querySelectorAll(".kb-facts > li");
  function hit(id, i) {
    const li = facts(id); if (!li || !li[i]) return "";
    li.forEach((x) => x.classList.remove("kb-hit")); li[i].classList.add("kb-hit");
    return T(`From fact ${i + 1} below.`, `出自下面第 ${i + 1} 条事实。`);
  }
  function mount(id, html) {
    const t = topic(id); if (!t) return null;
    const box = document.createElement("div"); box.className = "kbp"; box.innerHTML = html;
    t.querySelector(".kb-facts").before(box); return box;
  }

  // ---------- guess first ----------
  function guess(id, items) {
    return `<div class="kbp-block"><h4>🎯 ${T("Guess first, then read", "先猜再看")}</h4>${items.map((q, n) =>
      `<div class="kbp-guess" data-n="${n}"><p><strong>${n + 1}. ${esc(q.q)}</strong></p>${q.a.map((a, j) =>
        `<button type="button" class="kbp-btn" data-j="${j}">${esc(a)}</button>`).join("")}<p class="kbp-why" aria-live="polite"></p></div>`).join("")}</div>`;
  }
  function wireGuess(box, id, items) {
    box.addEventListener("click", (e) => {
      const b = e.target.closest(".kbp-guess .kbp-btn"); if (!b) return;
      const g = b.closest(".kbp-guess"), q = items[+g.dataset.n], j = +b.dataset.j;
      g.querySelectorAll(".kbp-btn").forEach((x, k) => { x.classList.toggle("ok", k === q.c); x.classList.toggle("no", k === j && j !== q.c); });
      g.querySelector(".kbp-why").innerHTML = `${j === q.c ? "✅ " + T("Right.", "答对了。") : "❌ " + T("Not quite.", "不对。")} ${esc(q.e)} <em>${hit(id, q.f)}</em>`;
    });
  }

  // ---------- process design: join lab ----------
  const PD_GUESS = [
    { q: T("A process times out. It has no timeout handler step, but it does have a process error handler task. What runs?",
           "流程超时了。它没有超时处理步骤，但有流程错误处理任务。接下来跑什么？"),
      a: [T("Nothing: the instance fails", "什么都不跑，实例直接失败"), T("The step that was running, again", "把正在跑的步骤再跑一次"), T("The process error handler task", "流程错误处理任务")], c: 2, f: 3,
      e: T("The order is: timeout handler step, then the process error handler task, and only if neither exists does the instance fail.",
           "顺序是：先找超时处理步骤，再找流程错误处理任务，两者都没有，实例才失败。") },
    { q: T("A step has run more times than its Maximum Iterations, and its If Condition transition is also true. Which transition is taken?",
           "一个步骤的执行次数已经超过它的 Maximum Iterations，它的 If Condition 转移也成立。走哪条？"),
      a: [T("Step Iterations Exceeded", "Step Iterations Exceeded"), T("The If Condition transition", "If Condition 转移"), T("The Default transition", "Default 转移")], c: 0, f: 5,
      e: T("Step Iterations Exceeded overrides every other transition, whatever their conditions; it is how a loop drawn with transitions ends.",
           "Step Iterations Exceeded 压过其他所有转移，不管它们的条件是否成立；用转移画出来的循环就靠它结束。") }
  ];
  function joinLab() {
    return `<div class="kbp-block kbp-join"><h4>🧪 ${T("Try it: the join lab", "动手试试：合流小实验")}</h4>
      <p class="kbp-hint">${T("Two paths lead into one step. Choose the join, then make a path fail.", "两条路径汇进同一个步骤。选一种合流，再让某条路径失败。")}</p>
      <div class="kbp-row" role="radiogroup" aria-label="${T("Join type", "合流类型")}">
        <label class="kbp-opt"><input type="radio" name="kbp-jt" value="AND" checked> AND</label>
        <label class="kbp-opt"><input type="radio" name="kbp-jt" value="OR"> OR</label></div>
      <div class="kbp-row">
        <label class="kbp-opt"><input type="checkbox" data-p="a" checked> ${T("Path A finishes", "路径 A 走完")}</label>
        <label class="kbp-opt"><input type="checkbox" data-p="b" checked> ${T("Path B finishes", "路径 B 走完")}</label></div>
      <div class="kbp-row"><label class="kbp-opt"><input type="checkbox" data-p="t"> ${T("Join timeout set", "设了合流超时")}</label></div>
      <svg class="kbp-svg" viewBox="0 0 330 150" role="img" aria-label="${T("Join diagram", "合流示意图")}"></svg>
      <p class="kbp-out" aria-live="polite"></p></div>`;
  }
  function wireJoin(box) {
    const el = box.querySelector(".kbp-join"), svg = el.querySelector(".kbp-svg"), out = el.querySelector(".kbp-out");
    const node = (x, y, w, label, cls) => `<rect x="${x}" y="${y}" width="${w}" height="34" rx="7" class="${cls}"/><text x="${x + w / 2}" y="${y + 21}" text-anchor="middle">${esc(label)}</text>`;
    const line = (x1, y1, x2, y2, ok) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${ok ? "kl-ok" : "kl-dead"}"/>`;
    function draw() {
      const type = el.querySelector("input[name=kbp-jt]:checked").value;
      const a = el.querySelector("[data-p=a]").checked, b = el.querySelector("[data-p=b]").checked, t = el.querySelector("[data-p=t]").checked;
      const done = type === "AND" ? a && b : a || b;
      const result = done ? "ok" : "stuck";
      svg.innerHTML = node(6, 14, 92, T("Path A", "路径 A"), a ? "kn-ok" : "kn-dead") + node(6, 102, 92, T("Path B", "路径 B"), b ? "kn-ok" : "kn-dead") +
        line(98, 31, 160, 70, a) + line(98, 119, 160, 80, b) +
        `<polygon points="182,52 208,75 182,98 156,75" class="${done ? "kn-ok" : "kn-stuck"}"/><text x="182" y="80" text-anchor="middle" class="kd">${type}</text>` +
        line(208, 75, 232, 75, done) + node(232, 58, 92, T("Next step", "下一步"), done ? "kn-ok" : "kn-wait");
      let msg;
      if (done) msg = type === "AND"
        ? T("Both paths finished, so the AND join is satisfied and the next step runs.", "两条路径都走完了，AND 合流满足，下一步执行。")
        : (a && b ? T("The OR join is satisfied as soon as one path finishes.", "只要有一条路径走完，OR 合流就满足。")
                  : T("One path failed, but the OR join only needs one finished input, so the next step still runs.", "有一条路径失败了，但 OR 合流只要一个输入完成，下一步照样执行。"));
      else if (type === "OR") msg = T("Both inputs are incomplete, the only case in which an OR join stays unsatisfied. An Unsatisfied Join transition with a handler step is how the model deals with it.",
                                      "两个输入都没完成，这是 OR 合流不满足的唯一情况。模型里要靠 Unsatisfied Join 转移加处理步骤来接住。");
      else msg = T(`A failed path leaves an incomplete transition, which the Process Engine counts as false, so this AND join can never be satisfied. ${t ? "Because a join timeout is set, the Join Timeout transition is taken when the wait runs out." : "Plan for it: set a join timeout, or give the step an Unsatisfied Join transition and a handler (from 9.7 it is not escalated without one)."}`,
                   `失败的路径留下未完成的转移，Process Engine 把它当作 false，所以这个 AND 合流永远满足不了。${t ? "因为设了合流超时，等待时间一到就走 Join Timeout 转移。" : "要提前设计：设合流超时，或者给这个步骤配 Unsatisfied Join 转移和处理步骤（9.7 起没有处理步骤就不会升级）。"}`);
      out.className = "kbp-out " + result; out.textContent = msg;
      if (!done) hit("process-design", type === "OR" ? 5 : t ? 4 : 1);
    }
    el.addEventListener("change", draw); draw();
    // the first draw should not light up a fact
    const li = facts("process-design"); if (li) li.forEach((x) => x.classList.remove("kb-hit"));
  }

  // ---------- Task Engine: vote calculator and status machine ----------
  const TK_GUESS = [
    { q: T("A task is Suspended. Does it still show in the assignee's inbox?", "一个任务被暂停（Suspended）了。它还在被分配人的收件箱里吗？"),
      a: [T("Yes, marked as paused", "在，标成已暂停"), T("Only in an administrator's inbox", "只在管理员的收件箱里"), T("No, only on the Task List Management page", "不在，只在 Task List Management 页面")], c: 2, f: 3,
      e: T("Only Active tasks appear in inboxes. A Suspended task is hidden from users and no events or assignments are evaluated for it until it is resumed.",
           "只有 Active 的任务进收件箱。暂停的任务对用户隐藏，恢复之前也不评估任何事件和分配。") },
    { q: T("A task was created without an expireDate. When does it expire?", "一个任务创建时没有设 expireDate。它什么时候过期？"),
      a: [T("Never", "永不过期"), T("After seven days", "七天后"), T("When its process ends", "流程结束时")], c: 0, f: 6,
      e: T("Without an expire date a task never expires. The seven days belong to the Delete Task rule, which removes tasks that are already finished.",
           "不设到期时间的任务永不过期。七天说的是 Delete Task 规则，它删除的是已经结束的任务。") }
  ];
  function voteCalc() {
    return `<div class="kbp-block kbp-vote"><h4>🗳️ ${T("Try it: how many votes does it take?", "动手试试：要几票？")}</h4>
      <p class="kbp-hint">${T("A votable task changes status only when enough assignees vote for the same status.", "投票任务要等足够多的被分配人投同一个状态，状态才会变。")}</p>
      <label class="kbp-range">${T("Assignees", "被分配人数")} <strong data-o="n">30</strong><input type="range" min="1" max="300" value="30" data-v="n"></label>
      <div class="kbp-row" role="radiogroup" aria-label="${T("Strategy", "投票策略")}">
        <label class="kbp-opt"><input type="radio" name="kbp-vs" value="pct" checked> ${T("Percentage", "百分比")}</label>
        <label class="kbp-opt"><input type="radio" name="kbp-vs" value="fix"> ${T("Fixed number", "固定人数")}</label></div>
      <label class="kbp-range">${T("Threshold", "阈值")} <strong data-o="p">51%</strong><input type="range" min="1" max="100" value="51" data-v="p"></label>
      <p class="kbp-big" aria-live="polite"></p><p class="kbp-out"></p></div>`;
  }
  function wireVote(box) {
    const el = box.querySelector(".kbp-vote"), big = el.querySelector(".kbp-big"), out = el.querySelector(".kbp-out");
    const rP = el.querySelector("[data-v=p]");
    function calc(e) {
      const n = +el.querySelector("[data-v=n]").value, pct = el.querySelector("input[name=kbp-vs]:checked").value === "pct";
      if (e && e.target.name === "kbp-vs") { rP.max = pct ? 100 : 300; rP.value = pct ? 51 : Math.min(51, 300); }
      const p = +rP.value;
      el.querySelector("[data-o=n]").textContent = n; el.querySelector("[data-o=p]").textContent = pct ? p + "%" : p;
      if (pct) {
        const need = Math.floor((n * p + 99) / 100), exact = n * p / 100;
        big.textContent = T(`${need} matching votes`, `${need} 张相同的票`);
        out.textContent = Number.isInteger(exact)
          ? T(`${n} × ${p}% = ${exact} exactly.`, `${n} × ${p}% 正好是 ${exact}。`)
          : T(`${n} × ${p}% = ${+exact.toFixed(2)}, and the Task Engine rounds up, so ${need}. Until then the status does not change.`,
              `${n} × ${p}% = ${+exact.toFixed(2)}，Task Engine 向上取整，所以是 ${need}。在那之前状态不变。`);
      } else {
        big.textContent = T(`${p} matching votes`, `${p} 张相同的票`);
        out.textContent = p > n
          ? T(`Only ${n} people can vote, so ${p} matching votes can never be reached.`, `只有 ${n} 个人能投票，${p} 张相同的票永远凑不齐。`)
          : T("A fixed threshold ignores how many assignees there are. Groups and roles count each member.", "固定人数不看总人数多少。组和角色按其中每个人计数。");
      }
      hit("tasks", 7);
    }
    el.addEventListener("input", calc); el.addEventListener("change", calc); calc();
    const li = facts("tasks"); if (li) li.forEach((x) => x.classList.remove("kb-hit"));
  }

  const ST = {
    New: { inbox: false, note: T("The task has not started yet; task events can use this status to spot new tasks.", "任务还没开始；任务事件可以用这个状态发现新任务。"),
           go: [["Active", T("Start now", "马上开始")], ["Scheduled", T("Schedule for later", "定时开始")]], f: 3 },
    Scheduled: { inbox: false, note: T("Set to start at a given time. Only Business Console or Task Engine services can create or change it.", "定好时间开始。只能在 Business Console 里或用 Task Engine 服务创建和修改。"),
           go: [["Active", T("Start time reached", "开始时间到了")]], f: 4 },
    Active: { inbox: true, note: T("Running normally. Only Active tasks appear in user inboxes.", "正常运行。只有 Active 的任务出现在用户收件箱里。"),
           go: [["Suspended", T("Suspend", "暂停")], ["Completed", T("Complete", "完成")], ["Canceled", T("Cancel", "取消")], ["Expired", T("expireDate reached", "到了 expireDate")], ["Error", T("Error", "出错")]], f: 3 },
    Suspended: { inbox: false, note: T("Hidden from users, visible only on the Task List Management page. No events or assignments are evaluated.", "对用户隐藏，只在 Task List Management 页面可见。不评估任何事件和分配。"),
           go: [["Active", T("Resume", "恢复")]], f: 3 },
    Completed: { inbox: false, note: T("Terminal: the only thing left is deletion.", "终止状态：只剩删除。"), go: [["Deleted", T("Seven days pass", "过了七天")]], f: 4 },
    Canceled: { inbox: false, note: T("Terminal: the only thing left is deletion.", "终止状态：只剩删除。"), go: [["Deleted", T("Seven days pass", "过了七天")]], f: 4 },
    Error: { inbox: false, note: T("Terminal: the only thing left is deletion.", "终止状态：只剩删除。"), go: [["Deleted", T("Seven days pass", "过了七天")]], f: 4 },
    Expired: { inbox: false, note: T("The Task Engine set it to expired when its expireDate was reached.", "到了 expireDate，Task Engine 把它设成了 expired。"), go: [["Deleted", T("Seven days pass", "过了七天")]], f: 6 },
    Deleted: { inbox: false, note: T("Removed by My webMethods' global Delete Task rule (default seven days, runs once a day). If auditors need it, archive tasks and write the outcome back to the process.", "被 My webMethods 的全局 Delete Task 规则删掉了（默认七天，每天跑一次）。审计要用的话，要归档任务，并把结果写回流程。"),
           go: [], f: 5 }
  };
  function statusMachine() {
    return `<div class="kbp-block kbp-life"><h4>🔄 ${T("Try it: walk a task through its life", "动手试试：带一个任务走完一生")}</h4>
      <p class="kbp-state" aria-live="polite"></p><p class="kbp-out"></p><div class="kbp-acts"></div>
      <button type="button" class="link kbp-reset">${T("Start again", "重新开始")}</button></div>`;
  }
  function wireLife(box) {
    const el = box.querySelector(".kbp-life"), state = el.querySelector(".kbp-state"), out = el.querySelector(".kbp-out"), acts = el.querySelector(".kbp-acts");
    const path = [];
    function show(s, light) {
      const S = ST[s]; path.push(s);
      state.innerHTML = `<span class="kbp-chip s-${s.toLowerCase()}">${esc(s)}</span> ${S.inbox ? "📥 " + T("in the inbox", "在收件箱里") : "🙈 " + T("not in any inbox", "不在任何收件箱里")}`;
      out.innerHTML = `${esc(S.note)} <em>${light ? hit("tasks", S.f) : ""}</em><br><small>${esc(path.join(" → "))}</small>`;
      acts.innerHTML = S.go.map(([to, label]) => `<button type="button" class="kbp-btn" data-to="${to}">${esc(label)}</button>`).join("");
    }
    acts.addEventListener("click", (e) => { const b = e.target.closest("[data-to]"); if (b) show(b.dataset.to, true); });
    el.querySelector(".kbp-reset").addEventListener("click", () => { path.length = 0; show("New", true); });
    show("New", false);
  }

  const clearHits = (id) => { const li = facts(id); if (li) li.forEach((x) => x.classList.remove("kb-hit")); };
  const n0 = (x) => Number(x).toLocaleString(zh ? "zh-CN" : "en-GB");

  // ---------- Deploying on IBM Cloud: which Code Engine workload fits, and does the Community Edition? ----------
  const CE_PRESETS = [[2, "s", T("Price check per order", "每单价格检查")], [5, "min", T("What-if for a planner", "给排班员算 what-if")],
    [40, "min", T("Nightly roster", "每晚排班")], [30, "h", T("Quarterly network plan", "季度网络规划")]];
  function ceFit() {
    return `<div class="kbp-block kbp-ce"><h4>☁️ ${T("Try it: which Code Engine workload fits?", "动手试试：用哪种 Code Engine 形态？")}</h4>
      <p class="kbp-hint">${T("How long does one run take? Pick an example or type your own.", "跑一次要多久？挑一个例子，或者自己填。")}</p>
      <div class="kbp-acts">${CE_PRESETS.map(([v, u, l]) => `<button type="button" class="kbp-btn" data-ce="${v}|${u}">${esc(l)}</button>`).join("")}</div>
      <div class="kbp-row"><label class="kbp-num">${T("Run time", "运行时长")} <input type="number" min="1" value="40" data-c="t" inputmode="numeric"></label>
        <select data-c="u" aria-label="${T("Unit", "单位")}"><option value="s">${T("seconds", "秒")}</option><option value="min" selected>${T("minutes", "分钟")}</option><option value="h">${T("hours", "小时")}</option></select></div>
      <label class="kbp-opt"><input type="checkbox" data-c="big"> ${T("Request or response bigger than 5 MB", "请求或响应超过 5 MB")}</label>
      <ul class="kbp-fit" aria-live="polite"></ul>
      <p class="kbp-out kbp-pick"></p>
      <h4 class="kbp-sub">🧮 ${T("And the solver: does the free Community Edition do?", "再看求解器：免费的社区版够不够？")}</h4>
      <div class="kbp-row"><label class="kbp-num">${T("Variables", "变量")} <input type="number" min="1" value="630" data-c="v" inputmode="numeric"></label>
        <label class="kbp-num">${T("Constraints", "约束")} <input type="number" min="1" value="400" data-c="k" inputmode="numeric"></label></div>
      <p class="kbp-out kbp-cplex" aria-live="polite"></p></div>`;
  }
  function wireCe(box) {
    const el = box.querySelector(".kbp-ce"), fit = el.querySelector(".kbp-fit"), pick = el.querySelector(".kbp-pick"), cpl = el.querySelector(".kbp-cplex");
    const get = (k) => el.querySelector(`[data-c=${k}]`);
    function calc(light) {
      const v = Math.max(1, +get("t").value || 1), u = get("u").value, sec = v * (u === "h" ? 3600 : u === "min" ? 60 : 1), big = get("big").checked;
      const fn = sec <= 120 && !big, app = sec <= 600, job = sec <= 86400;
      const row = (ok, warn, name, why) => `<li class="${ok ? (warn ? "q-warn" : "q-ok") : "q-bad"}"><strong>${name}</strong> ${why}</li>`;
      fit.innerHTML =
        row(fn, false, T("Function", "函数"), big ? T("bodies are limited to 5 MB.", "请求和响应体最大 5 MB。") : fn ? T("fits: at most 120 seconds.", "装得下：最长 120 秒。") : T("too long: at most 120 seconds.", "太长：最长 120 秒。")) +
        row(app, sec > 300, T("Application", "应用"), !app ? T("too long: 600 seconds at most.", "太长：最长 600 秒。") : sec > 300 ? T(`fits, but raise the timeout from its default of 300 seconds to at least ${n0(sec)} (600 at most).`, `装得下，但要把超时从默认的 300 秒调到至少 ${n0(sec)} 秒（最多 600）。`) : T("fits within the default timeout of 300 seconds.", "在默认 300 秒的超时以内。")) +
        row(job, sec > 7200, T("Job", "作业"), !job ? T("too long: 86,400 seconds (24 hours) at most.", "太长：最长 86,400 秒（24 小时）。") : (sec > 7200 ? T(`fits, but raise the time limit from its default of 7,200 seconds to at least ${n0(sec)}.`, `装得下，但要把时长上限从默认的 7,200 秒调到至少 ${n0(sec)} 秒。`) : T("fits within the default of 7,200 seconds (2 hours).", "在默认 7,200 秒（2 小时）以内。")) + " " + T("A failed run is retried 3 times by default, 5 at most.", "失败的运行默认重试 3 次，最多 5 次。"));
      pick.innerHTML = `${T("Suggestion: ", "建议：")}${fn ? T("the smallest that fits is a function.", "装得下的最小形态是函数。") : app ? T("the smallest that fits is an application.", "装得下的最小形态是应用。") : job ? T("only a job fits.", "只有作业装得下。") : T("none of the three fits; split the work into smaller runs.", "三种都装不下；把工作拆成几次小的运行。")} <em>${light ? hit("cloud-deploy", 0) : ""}</em>`;
    }
    function cplex(light) {
      const v = Math.max(1, +get("v").value || 1), k = Math.max(1, +get("k").value || 1), ok = v <= 1000 && k <= 1000;
      cpl.className = "kbp-out kbp-cplex " + (ok ? "" : "stuck");
      cpl.innerHTML = (ok ? T(`${n0(v)} variables and ${n0(k)} constraints: within the Community Edition limit of 1,000 each.`, `${n0(v)} 个变量、${n0(k)} 个约束：在社区版各 1,000 的上限以内。`)
        : T(`${n0(v)} variables and ${n0(k)} constraints: over the Community Edition limit of 1,000 each, so it needs a runtime or licence with the full commercial edition.`, `${n0(v)} 个变量、${n0(k)} 个约束：超过社区版各 1,000 的上限，要用带完整商用版的运行时或许可证。`))
        + ` <em>${light ? hit("cloud-deploy", 7) : ""}</em>`;
    }
    el.addEventListener("click", (e) => { const b = e.target.closest("[data-ce]"); if (!b) return; const [v, u] = b.dataset.ce.split("|"); get("t").value = v; get("u").value = u; calc(true); });
    el.addEventListener("input", (e) => { if (["v", "k"].includes(e.target.dataset.c)) cplex(true); else calc(true); });
    el.addEventListener("change", (e) => { if (["v", "k"].includes(e.target.dataset.c)) cplex(true); else calc(true); });
    calc(false); cplex(false);
  }

  // ---------- Business Rules in practice: CSV import ----------
  const TABLE = [[T("Gold", "金卡"), "≥ 10,000", "12%"], [T("Gold", "金卡"), "< 10,000", "8%"], [T("Silver", "银卡"), T("any", "任意"), "3%"], [T("New", "新客户"), T("any", "任意"), "0%"]];
  function csvLab() {
    return `<div class="kbp-block kbp-csv"><h4>📥 ${T("Try it: import rules from a CSV file", "动手试试：用 CSV 文件导入规则")}</h4>
      <p class="kbp-hint">${T("A discount table already has 4 rules (example numbers). What happens when the business imports more?", "一张折扣表已经有 4 条规则（示例数字）。业务再导入一批，会怎样？")}</p>
      <label class="kbp-range">${T("Rows in the CSV file", "CSV 文件里的行数")} <strong data-o="r">3</strong><input type="range" min="1" max="20" value="3" data-v="r"></label>
      <label class="kbp-opt"><input type="checkbox" data-x="order"> ${T("Columns in a different order from the table", "列的顺序和表不一样")}</label>
      <label class="kbp-opt"><input type="checkbox" data-x="missing"> ${T("One column missing", "少了一列")}</label>
      <label class="kbp-opt"><input type="checkbox" data-x="off"> ${T("One row marked “not in effect”", "有一行标成「不生效」")}</label>
      <label class="kbp-opt"><input type="checkbox" data-x="action"> ${T("Includes an action result column", "带了一个动作结果列")}</label>
      <div class="kbp-table" aria-live="polite"></div><ul class="kbp-fit"></ul></div>`;
  }
  function wireCsv(box) {
    const el = box.querySelector(".kbp-csv"), tbl = el.querySelector(".kbp-table"), notes = el.querySelector(".kbp-fit");
    function draw(light) {
      const r = +el.querySelector("[data-v=r]").value, x = (k) => el.querySelector(`[data-x=${k}]`).checked;
      el.querySelector("[data-o=r]").textContent = r;
      const fails = x("missing");
      const head = `<tr><th>#</th><th>${T("Tier", "客户等级")}</th><th>${T("Order", "订单金额")}</th><th>${T("Discount", "折扣")}</th></tr>`;
      const old = TABLE.map((row, i) => `<tr><td>${i + 1}</td>${row.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("");
      const shown = Math.min(r, 3);
      const add = fails ? "" : Array.from({ length: shown }, (_, i) => {
        const cells = x("order") ? ["5,000", T("Bronze", "铜卡"), "2%"] : [T("Bronze", "铜卡"), "5,000", "2%"];
        return `<tr class="kbp-new${x("order") ? " kbp-wrong" : ""}"><td>${5 + i}</td>${cells.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`;
      }).join("") + (r > shown ? `<tr class="kbp-new"><td colspan="4">… ${T(`${r - shown} more`, `还有 ${r - shown} 行`)}</td></tr>` : "");
      tbl.innerHTML = `<p class="kbp-big">${fails ? T("Column count does not match", "列数对不上") : T(`4 + ${r} = ${4 + r} rules`, `4 + ${r} = ${4 + r} 条规则`)}</p><table class="kbp-t">${head}${old}${add}</table>`;
      const li = [];
      if (fails) li.push(["q-bad", T("The column count must match the table (apart from In Effect), so this file does not fit.", "列数必须和表一致（In Effect 列除外），这个文件对不上。")]);
      else li.push(["q-ok", T("New rows are appended after the last rule; the 4 existing rules are never overwritten.", "新行追加在最后一条规则之后；原来的 4 条不会被覆盖。")]);
      if (x("order") && !fails) li.push(["q-bad", T("Columns map by position, not by header name, so values land in the wrong columns (highlighted).", "列按位置对应，不看表头名字，所以值落进了错的列（标红的行）。")]);
      if (x("off") && !fails) li.push(["q-warn", T("Imported rules are always in effect, so the row marked “not in effect” will be live.", "导入的规则一律生效，那一行标的「不生效」不算数。")]);
      if (x("action")) li.push(["q-bad", T("Action result columns cannot be imported; set those in the table itself.", "动作结果列导入不了，要在表里自己设。")]);
      notes.innerHTML = li.map(([c, t]) => `<li class="${c}">${esc(t)}</li>`).join("") + (light ? `<li class="q-tip"><em>${hit("rules-in-practice", 6)}</em></li>` : "");
    }
    el.addEventListener("input", () => draw(true)); el.addEventListener("change", () => draw(true)); draw(false);
  }

  // ---------- Monitor: where does a resubmit start? ----------
  const STEPS = [T("Receive", "收单"), T("Check", "检查"), T("Approve", "审批"), T("Book", "记账"), T("Notify", "通知")];
  function resubmitLab() {
    return `<div class="kbp-block kbp-rs"><h4>🔁 ${T("Try it: where does a resubmit start?", "动手试试：重新提交从哪一步开始？")}</h4>
      <p class="kbp-hint">${T("Tick the steps that were enabled for resubmission, then choose where the instance failed.", "勾选哪些步骤启用了重新提交，再选实例在哪一步失败。")}</p>
      <div class="kbp-row">${STEPS.map((s, i) => `<label class="kbp-opt"><input type="checkbox" data-en="${i}"${i === 1 ? " checked" : ""}> ${esc(s)}</label>`).join("")}</div>
      <label class="kbp-num">${T("Instance", "实例")} <select data-r="at">${STEPS.map((s, i) => `<option value="${i}"${i === 3 ? " selected" : ""}>${T("failed at " + esc(s), "失败在「" + esc(s) + "」")}</option>`).join("")}<option value="done">${T("completed", "已完成")}</option></select></label>
      <div class="kbp-strip" aria-hidden="true"></div><ul class="kbp-fit" aria-live="polite"></ul></div>`;
  }
  function wireRs(box) {
    const el = box.querySelector(".kbp-rs"), strip = el.querySelector(".kbp-strip"), out = el.querySelector(".kbp-fit");
    function draw(light) {
      const en = STEPS.map((_, i) => el.querySelector(`[data-en="${i}"]`).checked), at = el.querySelector("[data-r=at]").value;
      const li = [];
      let closest = -1, earliest = -1;
      if (at === "done") {
        const list = STEPS.filter((_, i) => en[i]);
        li.push([list.length ? "q-ok" : "q-bad", list.length
          ? T(`A completed instance can be resubmitted from any step enabled for resubmission before it began: ${list.join(", ")}.`, `已完成的实例，可以从它开始之前就启用了重新提交的任何一步重跑：${list.join("、")}。`)
          : T("No step was enabled for resubmission before the instance began, so a completed instance cannot be resubmitted.", "没有哪一步在实例开始前启用了重新提交，所以已完成的实例不能重跑。")]);
      } else {
        const f = +at;
        closest = en[f] ? f : [...Array(f).keys()].reverse().find((i) => en[i]) ?? -1;
        earliest = [...Array(f + 1).keys()].find((i) => en[i]) ?? -1;
        li.push(["q-ok", T(`A failed instance can be resubmitted from the step that failed (${STEPS[f]}).`, `失败的实例可以从失败的那一步「${STEPS[f]}」重新提交。`)]);
        li.push([closest < 0 ? "q-bad" : "q-ok", closest < 0 ? T("Resubmit Closest: no resubmit-enabled step at or before the failure.", "Resubmit Closest：失败那步及之前都没有启用重新提交的步骤。")
          : closest === f ? T(`Resubmit Closest re-runs from ${STEPS[f]}, the failed step, because it is resubmit-enabled.`, `Resubmit Closest 从失败的「${STEPS[f]}」重跑，因为它启用了重新提交。`)
          : T(`Resubmit Closest: ${STEPS[f]} is not resubmit-enabled, so it re-runs from ${STEPS[closest]}, the closest enabled step that ran before it.`, `Resubmit Closest：「${STEPS[f]}」没有启用重新提交，所以从它之前最近的、启用了的「${STEPS[closest]}」重跑。`)]);
        li.push([earliest < 0 ? "q-bad" : "q-ok", earliest < 0 ? T("Resubmit Earliest: no resubmit-enabled step has run yet.", "Resubmit Earliest：还没有跑过的、启用了重新提交的步骤。")
          : T(`Resubmit Earliest re-runs the rest of the instance from ${STEPS[earliest]}, the first resubmit-enabled step.`, `Resubmit Earliest 从第一个启用了重新提交的「${STEPS[earliest]}」起，重跑实例剩下的部分。`)]);
      }
      li.push(["q-tip", T("Bad data? Edit the step's pipeline before resubmitting; that needs the Modify and Resubmit privilege.", "数据错了？重新提交前可以改这一步的 pipeline；这要有 Modify and Resubmit 权限。")]);
      strip.innerHTML = STEPS.map((s, i) => {
        const tags = (i === closest ? "C" : "") + (i === earliest ? "E" : "");
        const cls = at !== "done" && i === +at ? "fail" : at !== "done" && i > +at ? "todo" : "ran";
        return `<span class="kbp-step ${cls}${en[i] ? " en" : ""}">${en[i] ? "🔁 " : ""}${esc(s)}${tags ? `<b>${tags.split("").join(" ")}</b>` : ""}</span>`;
      }).join("<span class='kbp-arrow'>→</span>");
      out.innerHTML = li.map(([c, t]) => `<li class="${c}">${esc(t)}</li>`).join("") + (light ? `<li class="q-tip"><em>${hit("monitor", at === "done" ? 1 : 3)}</em></li>` : "");
    }
    el.addEventListener("change", () => draw(true)); draw(false);
  }

  function init() {
    const pd = mount("process-design", joinLab() + guess("process-design", PD_GUESS));
    if (pd) { wireJoin(pd); wireGuess(pd, "process-design", PD_GUESS); }
    const tk = mount("tasks", statusMachine() + voteCalc() + guess("tasks", TK_GUESS));
    if (tk) { wireLife(tk); wireVote(tk); wireGuess(tk, "tasks", TK_GUESS); }
    const ce = mount("cloud-deploy", ceFit()); if (ce) wireCe(ce);
    const csv = mount("rules-in-practice", csvLab()); if (csv) wireCsv(csv);
    const rs = mount("monitor", resubmitLab()); if (rs) wireRs(rs);
    ["cloud-deploy", "rules-in-practice", "monitor"].forEach(clearHits);
  }
  window.KB_PLAY = { ST, PD_GUESS, TK_GUESS };
  init();
})();
