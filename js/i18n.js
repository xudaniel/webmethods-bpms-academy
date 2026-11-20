// Language switch (#68): English (default) or 简体中文. Load first, before every other script.
// ?lang=zh or ?lang=en sets it; the choice is remembered on this device. With no choice yet,
// a browser whose first language is Chinese opens in Chinese.
// Translations live in js/zh/*.js and register on window.ZH. Modules pick their data with
// (window.LANG === "zh" && ZH.x) || window.X, and short UI strings with L("English", "中文").
(function () {
  const KEY = "wm-academy-lang-v1";
  const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const put = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode */ } };
  const param = new URLSearchParams(location.search).get("lang");
  const saved = get();
  const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "";
  const lang = param === "zh" || param === "en" ? param : saved === "zh" || saved === "en" ? saved : /^zh\b/i.test(nav) ? "zh" : "en";
  if (param === "zh" || param === "en") put(param);

  window.LANG = lang;
  window.ZH = window.ZH || {};
  window.L = (en, zh) => (lang === "zh" && zh != null ? zh : en);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  function switchTo(v) {
    put(v);
    const u = new URL(location.href);
    u.searchParams.set("lang", v);
    location.href = u.pathname + u.search + u.hash;
  }

  // Static page text: elements carry data-i18n="key"; ZH.page[key] holds the Chinese HTML.
  // Nav buttons are translated by section id from ZH.nav. Sections not yet translated get a short note.
  function page() {
    const btn = document.createElement("button");
    btn.type = "button"; btn.id = "lang-toggle"; btn.className = "mode-toggle lang-toggle";
    btn.setAttribute("lang", lang === "zh" ? "en" : "zh-CN");
    btn.innerHTML = lang === "zh" ? "🌐 <strong>English</strong>" : "🌐 <strong>中文</strong>";
    btn.title = lang === "zh" ? "Read this site in English" : "切换到中文";
    btn.addEventListener("click", () => switchTo(lang === "zh" ? "en" : "zh"));
    const head = document.querySelector("header") || document.querySelector(".brief-bar");
    if (head) head.appendChild(btn);
    if (lang !== "zh") return;

    const Z = window.ZH, P = Z.page || {};
    if (Z.title) document.title = Z.title;
    const md = document.querySelector('meta[name="description"]');
    if (md && Z.description) md.setAttribute("content", Z.description);
    document.querySelectorAll("[data-i18n]").forEach((el) => { const v = P[el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => { const [a, k] = pair.split(":"); if (P[k] != null) el.setAttribute(a, P[k]); });
    });
    // Plain text (reading version, briefs): ZH.text maps an English text node, trimmed, to its Chinese
    const TX = Z.text || {};
    if (Object.keys(TX).length) {
      const skip = (n) => n.parentElement && n.parentElement.closest("script, style, pre, code, noscript");
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const hits = [];
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const k = n.nodeValue.trim().replace(/\s+/g, " ");
        if (k && TX[k] != null && !skip(n)) hits.push([n, k]);
      }
      hits.forEach(([n, k]) => { const m = n.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/); n.nodeValue = m[1] + TX[k] + m[2]; });
    }
    const N = Z.nav || {};
    document.querySelectorAll("nav button[data-section]").forEach((b) => { if (N[b.dataset.section]) b.textContent = N[b.dataset.section]; });
    const done = new Set(Z.done || []);
    document.querySelectorAll("main > .section").forEach((s) => {
      if (done.has(s.id)) return;
      s.classList.add("zh-pending");
      s.insertAdjacentHTML("afterbegin", `<p class="zh-note" lang="zh-CN">🚧 本栏目的中文版正在翻译中，暂时显示英文原文。<a href="#crash">先看「10 分钟速成」→</a></p>`);
    });
  }

  // Answer order: move the right answer to a fixed, spread-out position for each question; the other options keep
  // their order. The position depends only on the key, so it is the same in English and 中文, on the page, in the
  // review book and in the printed answer key.
  function mix(q, key) {
    if (!q || !Array.isArray(q.a) || q.a.length < 2 || typeof q.c !== "number" || q.mixed) return q;
    let h = 2166136261;
    for (const ch of "order-v1:" + key) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
    const t = h % q.a.length, rest = q.a.filter((_, j) => j !== q.c);
    return Object.assign({}, q, { a: rest.slice(0, t).concat([q.a[q.c]], rest.slice(t)), c: t, mixed: true });
  }
  window.MIX = mix;

  window.I18N = { lang, switchTo, page };
})();
