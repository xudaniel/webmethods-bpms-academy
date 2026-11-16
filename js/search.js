// Site search (#77): 🔍 in the tab bar, or press "/". Searches knowledge facts, troubleshooting, the glossary, how-to steps,
// cheat sheets, the lab, Basics 101, controls, patterns, cases, BPMN and section names, in the language on screen.
// Everything happens in the browser: nothing is sent anywhere, and it works offline.
(function () {
  const $ = (id) => document.getElementById(id);
  const nav = document.querySelector("nav");
  if (!nav || !document.querySelector("nav button[data-section]")) return;
  const zh = window.LANG === "zh";
  const T = (en, cn) => (zh ? cn : en);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); };
  const typeName = {
    section: T("Section", "栏目"), fact: T("Knowledge", "知识库"), trouble: T("Troubleshooting", "故障排查"), term: T("Glossary", "术语"),
    howto: T("How to", "使用指南"), cheat: T("Cheat sheet", "速查卡"), lab: T("Lab", "动手实验"), basics: T("Basics 101", "基础 101"),
    control: T("Controls", "合规控制"), pattern: T("Pattern", "设计模式"), case: T("Case", "案例"), bpmn: T("BPMN", "BPMN")
  };

  // ---------- the index, built from the live data on first use ----------
  let INDEX = null;
  function build() {
    const out = [], add = (type, title, text, go, after) => out.push({ type, title: String(title), text: String(text || ""), go, after });
    const P = window.PHONE, K = window.KNOWLEDGE, S = window.SUPPORT, A = window.ACADEMY || {}, H = window.HOWTO, L = window.LAB, B = window.BASICS_LIVE, C = window.CONTROLS;
    if (P) P.groups.forEach(([, items]) => items.forEach(([id, t, d]) => add("section", t, d, id)));
    if (K) K.topics.forEach((t) => {
      t.facts.forEach((f) => add("fact", t.title, f, "knowledge", () => scrollTo("kb-" + t.id)));
      add("fact", t.title, t.practice, "knowledge", () => scrollTo("kb-" + t.id));
    });
    if (S) {
      S.trouble.forEach((t) => add("trouble", t.s, t.check.join(" ") + " " + t.fix + " " + t.where, "trouble", () => {
        const all = document.querySelector('#tr-areas [data-area="All"]'); if (all) all.click();
        const i = $("tr-search"); if (i) { i.value = t.s; i.dispatchEvent(new Event("input", { bubbles: true })); }
        const d = document.querySelector("#tr-list details"); if (d) { d.open = true; d.scrollIntoView({ block: "start" }); }
      }));
      S.cheats.forEach((c) => c.actions.forEach(([a, w]) => add("cheat", `${c.role}: ${a}`, w, "howto", () => { const b = document.querySelector(`#howto-tabs [data-role="${c.id}"]`); if (b) b.click(); })));
    }
    (A.glossary || []).forEach(([t, d]) => add("term", t, d, "glossary", () => { const i = $("glossary-search"); if (i) { i.value = t; i.dispatchEvent(new Event("input", { bubbles: true })); } }));
    if (H) H.roles.forEach((r) => r.steps.forEach(([t, d, where]) => add("howto", `${r.role}: ${t}`, d + " " + where, "howto", () => { const b = document.querySelector(`#howto-tabs [data-role="${r.id}"]`); if (b) b.click(); })));
    if (L) L.stages.forEach((st) => add("lab", st.t, st.steps.map((s) => s.join(" ")).join(" ") + " " + st.check, "lab", () => scrollTo("lab-" + st.id)));
    if (B) B.lessons.forEach((l) => add("basics", l.title, l.story + " " + l.points.join(" "), "basics", () => { const d = $("b-" + l.id); if (d) { d.open = true; d.scrollIntoView({ block: "start" }); } }));
    if (C) C.rows.forEach((r) => add("control", r.control, r.need + " " + r.how + " " + r.evidence, "controls", () => scrollTo("ctl-" + r.id)));
    (A.patterns || []).forEach((p) => add("pattern", p.name, p.problem + " " + p.solution + " " + p.when, "patterns"));
    (A.cases || []).forEach((c) => add("case", c.name, c.flow.join(" → ") + " " + c.lesson, "cases"));
    (A.bpmn || []).forEach((g) => g.items.forEach(([n, d]) => add("bpmn", n, d, "bpmn")));
    out.forEach((e) => { e.lt = e.title.toLowerCase(); e.lx = e.text.toLowerCase(); });
    return out;
  }

  function find(q) {
    const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!toks.length) return [];
    INDEX = INDEX || build();
    return INDEX.map((e) => {
      let score = 0;
      for (const t of toks) {
        const inT = e.lt.includes(t), inX = e.lx.includes(t);
        if (!inT && !inX) return null;
        score += (inT ? 5 : 0) + (inX ? 1 : 0) + (e.lt.startsWith(t) ? 2 : 0);
      }
      return { e, score: score + (e.type === "section" ? 1 : 0) };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 30).map((r) => r.e);
  }
  const mark = (s, toks) => {
    let h = esc(s);
    toks.forEach((t) => { if (t) h = h.replace(new RegExp(esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), (m) => `<mark>${m}</mark>`); });
    return h;
  };
  function snippet(text, toks) {
    const low = text.toLowerCase(); let at = -1;
    for (const t of toks) { at = low.indexOf(t); if (at >= 0) break; }
    const from = Math.max(0, at - (zh ? 18 : 40)), to = Math.min(text.length, (at < 0 ? 0 : at) + (zh ? 42 : 100));
    return (from > 0 ? "…" : "") + mark(text.slice(from, to), toks) + (to < text.length ? "…" : "");
  }

  // ---------- UI ----------
  const btn = document.createElement("button");
  btn.type = "button"; btn.id = "search-btn"; btn.className = "menu-btn search-btn";
  btn.setAttribute("aria-label", T("Search the site (/)", "搜索全站（/）")); btn.setAttribute("aria-haspopup", "dialog");
  btn.innerHTML = "🔍";
  const menu = $("menu-btn");
  if (menu) menu.insertAdjacentElement("afterend", btn); else nav.insertBefore(btn, nav.firstChild);
  // Stay pinned next to ☰ while the tab bar scrolls sideways
  const pin = () => { btn.style.left = (menu ? menu.offsetWidth : 0) + "px"; };
  pin(); window.addEventListener("resize", pin);

  const sheet = document.createElement("div");
  sheet.id = "search-sheet"; sheet.className = "menu-sheet"; sheet.hidden = true;
  sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-label", T("Search the site", "搜索全站"));
  sheet.innerHTML = `<div class="menu-panel search-panel">
    <div class="menu-head"><input type="search" id="search-q" autocomplete="off" placeholder="${T("Search: Hot Deploy, resubmit, inbox…", "搜索：Hot Deploy、重新提交、收件箱……")}" aria-label="${T("Search the site", "搜索全站")}">
      <button type="button" id="search-close" aria-label="${T("Close", "关闭")}">✕</button></div>
    <p class="search-hint" id="search-hint">${T("Searches every section in your browser. ↑ ↓ to move, Enter to open, Esc to close.", "在你的浏览器里搜索所有栏目。↑ ↓ 选择，回车打开，Esc 关闭。")}</p>
    <ol class="search-results" id="search-results" role="listbox"></ol></div>`;
  document.body.appendChild(sheet);

  let results = [], sel = 0;
  function render() {
    const q = $("search-q").value.trim(), toks = q.toLowerCase().split(/\s+/).filter(Boolean);
    results = find(q); sel = 0;
    $("search-hint").hidden = !!q;
    $("search-results").innerHTML = q && !results.length
      ? `<li class="search-none">${T("No match. Try another word, or browse with ☰.", "没有找到。换个词试试，或者用 ☰ 浏览。")}</li>`
      : results.map((r, i) => `<li role="option" class="search-hit${i === sel ? " sel" : ""}" data-i="${i}" aria-selected="${i === sel}">
          <span class="pill">${esc(typeName[r.type])}</span> <strong>${mark(r.title, toks)}</strong>${r.text ? `<small>${snippet(r.text, toks)}</small>` : ""}</li>`).join("");
  }
  function move(d) {
    if (!results.length) return;
    sel = (sel + d + results.length) % results.length;
    $("search-results").querySelectorAll(".search-hit").forEach((li, i) => { li.classList.toggle("sel", i === sel); li.setAttribute("aria-selected", String(i === sel)); });
    const cur = $("search-results").querySelector(".sel"); if (cur) cur.scrollIntoView({ block: "nearest" });
  }
  function open(v) {
    sheet.hidden = !v; document.body.classList.toggle("menu-open", v);
    if (v) { INDEX = INDEX || build(); $("search-q").focus(); $("search-q").select(); } else btn.focus({ preventScroll: true });
  }
  function go(r) {
    open(false);
    if (location.hash === "#" + r.go) window.dispatchEvent(new HashChangeEvent("hashchange")); else location.hash = r.go;
    if (r.after) setTimeout(r.after, 80);
  }

  btn.addEventListener("click", () => open(true));
  $("search-close").addEventListener("click", () => open(false));
  $("search-q").addEventListener("input", render);
  $("search-q").addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Enter" && results[sel]) { e.preventDefault(); go(results[sel]); }
  });
  sheet.addEventListener("click", (e) => {
    if (e.target === sheet) return open(false);
    const li = e.target.closest(".search-hit"); if (li) go(results[+li.dataset.i]);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !sheet.hidden) return open(false);
    if (e.key === "/" && sheet.hidden && !/input|textarea|select/i.test(e.target.tagName || "") && !e.target.isContentEditable) { e.preventDefault(); open(true); }
  });
  window.SITE_SEARCH = { find, open };
})();
