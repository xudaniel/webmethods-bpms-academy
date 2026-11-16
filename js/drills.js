// On-call drills (#50): short branching incidents with a clock. A good check moves you on; a wrong one costs minutes
// and explains why. Each drill ends with a debrief citing the documentation behind every step. Progress stays in this browser.
(function () {
  const $ = (id) => document.getElementById(id);
  const root = $("drills-body");
  const S = window.SUPPORT;
  if (!root || !S) return;
  const zh = window.LANG === "zh";
  const T = (en, cn) => (zh ? cn : en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const src = (k) => { const x = S.src(k); return x ? `<a href="${esc(x[1])}" target="_blank" rel="noopener">${esc(x[0])}</a>` : ""; };

  // Each step: the situation, then choices [label, minutes, ok, feedback]. ok: true moves on; false costs time and stays.
  // learn: what the step teaches (shown in the debrief) and the source keys behind it.
  const DRILLS = [
    { id: "start", icon: "🛑", who: "Mia · Leo",
      title: T("The process never starts", "流程一直不启动"),
      steps: [
        { text: T("Monday, 9:00. Mia says nobody's purchase requests are moving, and Monitor shows no new instances since Friday's release. Leo uploaded a new version on Friday. What do you check first?",
            "周一 9:00。Mia 说大家的采购申请都没动静，周五发版后 Monitor 里就没有新实例了。Leo 周五上传了一个新版本。你先查什么？"),
          choices: [
            [T("Is the new version enabled for execution?", "新版本启用执行了吗？"), 5, true, T("Right first check: new uploads are not enabled by default.", "第一步查对了：新上传的版本默认不启用。")],
            [T("Restart Integration Server", "重启 Integration Server"), 30, false, T("Thirty minutes later nothing has changed. A restart doesn't switch a process version on.", "三十分钟过去了，什么都没变。重启不会把流程版本打开。")],
            [T("Rebuild and upload the process again", "重新构建并上传流程"), 20, false, T("That creates yet another version, and it isn't enabled either.", "这样又多了一个新版本，而它同样没有启用。")]
          ],
          learn: [T("New uploads are not enabled by default, and only one version of a model is enabled at a time.", "新上传的版本默认不启用，同一个模型一次只能启用一个版本。"), ["enable"]] },
        { text: T("In My webMethods → Administration → Business → Business Processes, Friday's version shows Execution Enabled: off. What now?",
            "在 My webMethods → Administration → Business → Business Processes 里，周五那个版本显示 Execution Enabled：关。现在怎么办？"),
          choices: [
            [T("Tick Execution Enabled, Save, then publish one test request", "勾选 Execution Enabled，保存，再发布一个测试申请"), 5, true, T("The test request starts an instance and lands in Sam's inbox.", "测试申请启动了一个实例，并出现在 Sam 的收件箱里。")],
            [T("Enable the old version instead", "改为启用旧版本"), 10, false, T("The old version doesn't have Friday's changes, and enabling it disables the new one.", "旧版本没有周五的改动，而且启用它就会停用新版本。")],
            [T("Change Designer to enable after every build, then wait", "把 Designer 设成每次构建后自动启用，然后等着"), 15, false, T("A good habit for next time, but today's version is still switched off.", "下次可以这样做，但今天这个版本仍然是关着的。")]
          ],
          learn: [T("Enable the version in My webMethods, or set Designer to enable it after build; then send the correct start document.", "在 My webMethods 里启用这个版本，或者把 Designer 设成构建后自动启用；然后发送正确的启动文档。"), ["buildprefs", "subtrig"]] }
      ] },
    { id: "rule", icon: "⚖️", who: "Priya · Sam",
      title: T("A manual decision is ignored", "人工决定被忽略了"),
      steps: [
        { text: T("Priya's decision table should send purchases over $5,000 to a manager task, but every request goes straight through. What do you check first?",
            "Priya 的决策表本该把超过 5,000 美元的采购交给经理任务，可每个申请都直接通过了。你先查什么？"),
          choices: [
            [T("Is the decision table Process Aware, with TaskData mapped?", "决策表是 Process Aware 吗？TaskData 映射了吗？"), 5, true, T("It isn't. A table with a manual decision must be Process Aware.", "不是。包含人工决定的决策表必须是 Process Aware。")],
            [T("Hot deploy the rule project again", "再 Hot Deploy 一次规则项目"), 15, false, T("Same table, same result: deploying wasn't the problem.", "同一张表，同样的结果：问题不在部署。")],
            [T("Give the server more memory", "给服务器加内存"), 20, false, T("Memory isn't why a task action is skipped.", "任务动作被跳过，和内存没有关系。")]
          ],
          learn: [T("A decision table that contains a manual decision (task action) must be Process Aware, with TaskData mapped.", "包含人工决定（任务动作）的决策表必须是 Process Aware，并且要映射 TaskData。"), ["dtaware"]] },
        { text: T("Priya recreates the table as Process Aware. What else has to be right in the mapping?", "Priya 把表重新建成 Process Aware。映射里还有什么必须做对？"),
          choices: [
            [T("The task's inputs and outputs match the table's; ProcessData is mapped outbound only", "任务的输入输出和表的一致；ProcessData 只向外映射"), 10, true, T("Correct: never overwrite or drop ProcessData.", "对：ProcessData 绝不能覆盖或丢弃。")],
            [T("Map ProcessData both ways so the rule can update it", "ProcessData 双向映射，让规则可以更新它"), 15, false, T("ProcessData holds runtime data. Overwriting it causes odd runtime errors; map it outbound only.", "ProcessData 装的是运行时数据。覆盖它会引起奇怪的运行时错误；只能向外映射。")]
          ],
          learn: [T("Make the task's inputs and outputs match the table's, and map ProcessData outbound only.", "让任务的输入输出和表的一致，ProcessData 只向外映射。"), ["dtaware"]] },
        { text: T("The manager task now appears, but a rule action elsewhere in the process still does nothing. One more setting?", "经理任务出现了，可流程里另一个规则动作还是什么都不做。还差哪个设置？"),
          choices: [
            [T("Set the process's Minimum Logging Level to 5 (Process and all steps)", "把流程的 Minimum Logging Level 设为 5（流程及所有步骤）"), 5, true, T("Processes that use rule actions need logging level 5.", "用到规则动作的流程，日志级别必须是 5。")],
            [T("Turn on Volatile Tracking for speed", "为了速度打开 Volatile Tracking"), 10, false, T("That hides the process from Monitor and does nothing for rule actions.", "那只会让 Monitor 看不到流程，对规则动作毫无帮助。")]
          ],
          learn: [T("Processes with rule actions need the logging level '5 - Process and all steps'.", "用到规则动作的流程，日志级别必须是「5 - Process and all steps」。"), ["ruleactions"]] }
      ] },
    { id: "monitor", icon: "🔭", who: "Omar",
      title: T("Monitor shows nothing", "Monitor 里什么都看不到"),
      steps: [
        { text: T("A customer asks where order #4711 is. The process clearly ran (the confirmation email went out), but Omar can't find the instance in Monitor. What do you check first?",
            "一位客户问 #4711 号订单到哪了。流程显然跑过（确认邮件已经发出），可 Omar 在 Monitor 里找不到这个实例。你先查什么？"),
          choices: [
            [T("The process's quality of service: is Volatile Tracking on?", "流程的服务质量：是不是打开了 Volatile Tracking？"), 5, true, T("It is. Status lives only in memory, so Monitor has nothing to show.", "确实打开了。状态只放在内存里，所以 Monitor 什么也显示不了。")],
            [T("Ask for more Monitor privileges", "申请更多的 Monitor 权限"), 15, false, T("Privileges decide which actions you get, not whether an instance was recorded.", "权限决定你能做哪些操作，而不是这个实例有没有被记录。")],
            [T("Read the server log line by line", "一行一行地翻服务器日志"), 30, false, T("Half an hour gone. The answer is in the process's settings.", "半个小时过去了。答案其实在流程的设置里。")]
          ],
          learn: [T("Volatile Tracking keeps status in memory only: faster, but lost if a server fails mid-step and not visible in Monitor.", "Volatile Tracking 只把状态放在内存里：更快，但步骤进行中服务器出故障就会丢失，而且 Monitor 看不到。"), ["qos"]] },
        { text: T("Volatile Tracking is on and the logging level is low; the team chose them for speed. This process handles customer orders. What do you do?", "Volatile Tracking 是开的，日志级别也很低；团队是为了速度这么选的。这个流程处理的是客户订单。你怎么办？"),
          choices: [
            [T("Turn Volatile Tracking off, raise the logging level, rebuild", "关掉 Volatile Tracking，调高日志级别，重新构建"), 10, true, T("From now on every order is visible and recoverable in Monitor.", "从现在起，每张订单在 Monitor 里都看得到、出了问题也能恢复。")],
            [T("Keep the settings and build a dashboard", "设置不变，另外做一个仪表盘"), 10, false, T("A dashboard can't show what was never recorded.", "仪表盘显示不了从来没被记录下来的东西。")]
          ],
          learn: [T("Use guaranteed settings for auditable work; keep volatile settings for short, replayable flows.", "需要审计的工作用有保证的设置；易失设置只留给短小、可以重放的流程。"), ["qos"]] }
      ] }
  ];

  const KEY = "wm-academy-drills-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } };
  const st = Object.assign({ best: {} }, load());
  const clock = (m) => { const t = 9 * 60 + m; return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
  const ideal = (d) => d.steps.reduce((n, s) => n + s.choices.find((c) => c[2])[1], 0);
  let run = null, tick = 0;

  function menu() {
    clearInterval(tick); run = null;
    root.innerHTML = `<div class="dr-list">${DRILLS.map((d) => {
      const b = st.best[d.id];
      return `<button type="button" class="tile dr-pick" data-d="${d.id}"><strong>${d.icon} ${esc(d.title)}</strong>
        <small>${esc(d.who)} · ${d.steps.length} ${T("decisions", "个决定")}${b ? ` · ${b.clean ? "🏅 " + T("ideal path", "理想路径") : T("best", "最好成绩")} ${b.min} ${T("min", "分钟")}` : ""}</small></button>`;
    }).join("")}</div>`;
  }
  function start(id) {
    const d = DRILLS.find((x) => x.id === id);
    run = { d, step: 0, min: 0, path: [], wrong: 0 };
    clearInterval(tick);
    // The clock keeps running while you think: one simulated minute every 10 seconds
    tick = setInterval(() => { if (run && location.hash === "#drills") { run.min++; const c = $("dr-clock"); if (c) c.textContent = "🕘 " + clock(run.min); } }, 10000);
    paint();
  }
  function paint(feedback) {
    const { d, step } = run, s = d.steps[step];
    root.innerHTML = `<div class="dr-run" id="dr-run">
      <div class="dr-head"><strong>${d.icon} ${esc(d.title)}</strong><span class="dr-clock" id="dr-clock">🕘 ${clock(run.min)}</span></div>
      <p class="dr-step">${T("Decision", "决定")} ${step + 1} / ${d.steps.length}</p>
      <p class="lead">${esc(s.text)}</p>
      ${feedback || ""}
      <div class="dr-choices">${s.choices.map((c, i) => `<button type="button" class="dr-choice" data-c="${i}">${esc(c[0])}</button>`).join("")}</div>
      <button type="button" class="link dr-quit">${T("← All drills", "← 全部演练")}</button></div>`;
  }
  function choose(i) {
    const { d } = run, s = d.steps[run.step], c = s.choices[i];
    run.min += c[1]; run.path.push({ step: run.step, choice: c[0], ok: c[2], cost: c[1] });
    if (!c[2]) { run.wrong++; return paint(`<p class="pz-bad">❌ <strong>+${c[1]} ${T("min.", "分钟。")}</strong> ${esc(c[3])}</p>`); }
    if (run.step < d.steps.length - 1) { run.step++; return paint(`<p class="pz-ok">✅ ${esc(c[3])}</p>`); }
    finish(c);
  }
  function finish(last) {
    clearInterval(tick);
    const { d, min, path, wrong } = run, best = ideal(d), clean = wrong === 0;
    const prev = st.best[d.id];
    if (!prev || min < prev.min || (clean && !prev.clean)) st.best[d.id] = { min, clean: clean || !!(prev && prev.clean) };
    save(st);
    root.innerHTML = `<div class="dr-run dr-done">
      <div class="dr-head"><strong>${d.icon} ${esc(d.title)}</strong><span class="dr-clock">🕘 ${clock(min)}</span></div>
      <p class="pz-ok">✅ ${esc(last[3])}</p>
      <h3>${clean ? "🏅 " + T("Solved on the ideal path", "走的是理想路径") : "✅ " + T("Solved", "解决了")}</h3>
      <p>${T(`You took ${min} minutes; the ideal path takes ${best}.`, `你用了 ${min} 分钟；理想路径要 ${best} 分钟。`)} ${wrong ? T(`${wrong} wrong turn${wrong > 1 ? "s" : ""} cost ${path.filter((p) => !p.ok).reduce((n, p) => n + p.cost, 0)} minutes.`, `${wrong} 次走错，多花了 ${path.filter((p) => !p.ok).reduce((n, p) => n + p.cost, 0)} 分钟。`) : ""}</p>
      <h4>${T("Your path", "你的路径")}</h4>
      <ol class="dr-path">${path.map((p) => `<li class="${p.ok ? "ok" : "bad"}">${p.ok ? "✅" : "❌"} ${esc(p.choice)} <small>+${p.cost} ${T("min", "分钟")}</small></li>`).join("")}</ol>
      <h4>${T("Debrief", "复盘")}</h4>
      <ol class="dr-debrief">${d.steps.map((s) => `<li>${esc(s.learn[0])} <span class="sources">${s.learn[1].map(src).filter(Boolean).join(" · ")}</span></li>`).join("")}</ol>
      <div class="row"><button type="button" class="btn dr-again" data-d="${d.id}">${T("Try again", "再来一次")}</button><button type="button" class="btn secondary dr-quit">${T("All drills", "全部演练")}</button></div>
      <p class="sources">${T("More symptoms and fixes:", "更多症状和解决办法：")} <a href="#trouble">${T("Troubleshooting", "故障排查")} →</a></p></div>`;
    if (DRILLS.every((x) => st.best[x.id] && st.best[x.id].clean)) document.dispatchEvent(new CustomEvent("drills:hero"));
  }

  root.addEventListener("click", (e) => {
    const p = e.target.closest(".dr-pick, .dr-again"); if (p) return start(p.dataset.d);
    if (e.target.closest(".dr-quit")) return menu();
    const c = e.target.closest(".dr-choice"); if (c && run) choose(+c.dataset.c);
  });
  menu();
  window.DRILLS = DRILLS; // for the smoke test
})();
