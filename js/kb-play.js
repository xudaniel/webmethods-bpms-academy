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

  function init() {
    const pd = mount("process-design", joinLab() + guess("process-design", PD_GUESS));
    if (pd) { wireJoin(pd); wireGuess(pd, "process-design", PD_GUESS); }
    const tk = mount("tasks", statusMachine() + voteCalc() + guess("tasks", TK_GUESS));
    if (tk) { wireLife(tk); wireVote(tk); wireGuess(tk, "tasks", TK_GUESS); }
  }
  window.KB_PLAY = { ST, PD_GUESS, TK_GUESS };
  init();
})();
