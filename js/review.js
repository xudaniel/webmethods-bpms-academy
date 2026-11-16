// Review book (#76): every question answered wrong anywhere on the site comes back on a schedule.
// Missed → 1 day → (right) 3 days → (right) leaves the book. Missed again on review → back to 1 day, and it needs
// one more check after 7 days before it leaves. Items are stored by reference (source + key), not text, so they show
// in the language you are reading. Everything stays in this browser.
(function () {
  const $ = (id) => document.getElementById(id);
  const zh = window.LANG === "zh";
  const T = (en, cn) => (zh ? cn : en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const KEY = "wm-academy-review-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* private mode */ } };
  const st = Object.assign({ items: {} }, load());
  const DAY = 864e5;
  const todayStr = () => new Date().toISOString().slice(0, 10);
  const plus = (n) => new Date(Date.now() + n * DAY).toISOString().slice(0, 10);
  const isDue = (it) => it.due <= todayStr();

  // ---------- where each question lives (looked up when shown, in the current language) ----------
  const SRC = {
    quiz: { name: T("Quiz", "测验"), go: "quiz", get: (k) => { const q = (window.ACADEMY || {}).quiz[+k]; return q && { q: q.q, a: q.a, c: q.c, e: q.e }; } },
    basics: { name: T("Basics 101", "基础 101"), go: "basics", get: (k) => { const l = ((window.BASICS_LIVE || {}).lessons || []).find((x) => x.id === k); return l && l.check; } },
    crash: { name: T("10-minute course", "10 分钟速成"), go: "crash", get: (k) => ((window.CRASH_LIVE || {}).checks || [])[+k] },
    cheat: { name: T("Role self-check", "身份自测"), go: "howto", get: (k) => {
      const [id, i] = k.split(":"); const c = ((window.SUPPORT || {}).cheats || []).find((x) => x.id === id); return c && c.check[+i]; } },
    sort: { name: T("Who should own each job?", "每件事该交给谁？"), go: "start", get: (k) => {
      const X = window.EXPLAINER_LIVE; const s = X && X.sort[+k]; if (!s) return null;
      const keys = Object.keys(X.owners);
      return { q: T(`Who should own this job? “${s.item}”`, `这件事该交给谁？「${s.item}」`), a: keys.map((o) => X.owners[o]), c: keys.indexOf(s.owner), e: s.why }; } },
    swipe: { name: T("Swipe sort", "刷卡分类"), go: "swipe", get: (k) => {
      const c = (window.SWIPE_CARDS || [])[+k], S = window.SWIPE_INFO; if (!c || !S) return null;
      const opts = ["rule", "agent", "human"];
      return { q: T(`${c.step} (${c.process}): ${Math.round(c.top * 100)}% same outcome, ${Math.round(c.det * 100)}% same inputs → same outcome, ${c.work} min of work, ${c.wait} h waiting. Rule, agent or keep human?`,
        `${c.step}（${c.process}）：同一结果 ${Math.round(c.top * 100)}%，相同输入 → 相同结果 ${Math.round(c.det * 100)}%，处理 ${c.work} 分钟，等待 ${c.wait} 小时。交给规则、agent 还是留给人？`),
        a: opts.map((o) => S.names[o]), c: opts.indexOf(c.answer), e: S.why(c) }; } },
    drill: { name: T("On-call drills", "值班演练"), go: "drills", get: (k) => {
      const [id, i] = k.split(":"); const d = (window.DRILLS || []).find((x) => x.id === id), s = d && d.steps[+i]; if (!s) return null;
      const good = s.choices.findIndex((c) => c[2]);
      return { q: `${d.icon} ${d.title}${T(": ", "：")}${s.text}`, a: s.choices.map((c) => c[0]), c: good, e: `${s.choices[good][3]} ${s.learn[0]}` }; } }
  };
  const resolve = (id) => { const [src, ...rest] = id.split("|"); const S = SRC[src]; const q = S && S.get(rest.join("|")); return q && q.a && q.a.length ? Object.assign({ from: S.name, go: S.go }, q) : null; };

  // ---------- API used by every quiz on the site ----------
  function miss(src, key) {
    const id = `${src}|${key}`, it = st.items[id];
    if (it) { it.box = 0; it.lapses = (it.lapses || 0) + 1; it.due = plus(1); } else st.items[id] = { box: 0, lapses: 0, due: plus(1), added: todayStr() };
    save(); paint();
  }
  function answer(id, ok) {
    const it = st.items[id]; if (!it) return "gone";
    if (!ok) { it.box = 0; it.lapses = (it.lapses || 0) + 1; it.due = plus(1); save(); return "again"; }
    if (it.box === 0) { it.box = 1; it.due = plus(3); save(); return "3"; }
    if (it.box === 1 && it.lapses > 0) { it.box = 2; it.due = plus(7); save(); return "7"; }
    delete st.items[id]; save(); return "done";
  }
  const ids = () => Object.keys(st.items).filter((id) => resolve(id));
  const dueIds = () => ids().filter((id) => isDue(st.items[id]));
  window.REVIEW = { miss, answer, ids, dueIds, state: st };

  // ---------- Start here card ----------
  function home() {
    const box = $("review-home"); if (!box) return;
    const n = ids().length, d = dueIds().length;
    box.hidden = n === 0;
    if (!n) return;
    box.innerHTML = `<h3>📒 ${d ? T(`${d} to review today`, `今天要复习 ${d} 题`) : T("Nothing due today", "今天没有要复习的题")}</h3>
      <p>${T(`Your review book holds ${n} question${n > 1 ? "s" : ""} you got wrong. Each comes back after 1 day and then 3 days; two right answers and it leaves the book.`,
        `你的复习本里有 ${n} 道答错过的题。每道题 1 天后、3 天后会再出现一次；答对两次就移出复习本。`)}</p>
      <a class="btn" href="#review">${d ? T("Review now →", "开始复习 →") : T("Open the review book →", "打开复习本 →")}</a>`;
  }

  // ---------- Review book section ----------
  let all = false;
  function section() {
    const root = $("review-body"); if (!root) return;
    const list = all ? ids() : dueIds(), n = ids().length;
    const head = `<p class="lead" id="rv-stats">${T(`${dueIds().length} due today · ${n} saved`, `今天到期 ${dueIds().length} 题 · 共 ${n} 题`)}</p>
      <div class="row"><button type="button" class="btn secondary" id="rv-all" aria-pressed="${all}">${all ? T("Only what's due today", "只看今天到期的") : T("Review everything now", "现在全部复习一遍")}</button>
      <button type="button" class="link" id="rv-reset">${T("Empty the book", "清空复习本")}</button></div>`;
    if (!n) {
      root.innerHTML = head + `<p>${T("Nothing here yet. Every question you get wrong in the quiz, Basics 101, the 10-minute course, the role self-checks, Swipe sort or the on-call drills lands here automatically.",
        "这里还是空的。你在测验、基础 101、10 分钟速成、身份自测、刷卡分类或值班演练里答错的题，都会自动收进来。")}</p>`;
      return;
    }
    if (!list.length) { root.innerHTML = head + `<p>✅ ${T("Done for today. Come back tomorrow, or review everything now.", "今天的复习完成了。明天再来，或者现在全部复习一遍。")}</p>`; return; }
    root.innerHTML = head + list.map((id, i) => {
      const q = resolve(id);
      return `<div class="quiz-q rv-q" data-id="${esc(id)}"><p class="rv-from">${T("From", "来自")} <a href="#${q.go}">${esc(q.from)}</a></p>
        <strong>${i + 1}. ${esc(q.q)}</strong>${q.a.map((a, j) => `<button type="button" data-j="${j}">${esc(a)}</button>`).join("")}<div class="explain"></div></div>`;
    }).join("");
  }
  function paint() { home(); section(); }

  document.addEventListener("click", (e) => {
    const b = e.target.closest(".rv-q button[data-j]");
    if (b) {
      const box = b.closest(".rv-q"); if (box.dataset.done) return;
      const id = box.dataset.id, q = resolve(id), j = +b.dataset.j, ok = j === q.c;
      box.dataset.done = "1";
      box.querySelectorAll("button[data-j]")[q.c].classList.add("correct"); if (!ok) b.classList.add("wrong");
      const r = answer(id, ok);
      const next = { again: T("It comes back tomorrow.", "明天会再出现。"), 3: T("Next check in 3 days.", "3 天后再考一次。"), 7: T("One last check in 7 days.", "7 天后最后再考一次。"), done: T("Learned: it leaves the review book. 🎉", "学会了：它已移出复习本。🎉") }[r] || "";
      box.querySelector(".explain").innerHTML = `${ok ? "✅ " + T("Right.", "答对了。") : T("Not quite.", "还差一点。")} ${esc(q.e)} <strong>${next}</strong>`;
      $("rv-stats").textContent = T(`${dueIds().length} due today · ${ids().length} saved`, `今天到期 ${dueIds().length} 题 · 共 ${ids().length} 题`);
      home();
      return;
    }
    if (e.target.closest("#rv-all")) { all = !all; section(); }
    if (e.target.closest("#rv-reset")) { st.items = {}; save(); paint(); }
  });
  window.addEventListener("hashchange", () => { if (location.hash === "#review") section(); if (location.hash === "#start") home(); });
  paint();
})();
