// Professional mode (#59): a calmer presentation for client meetings with banks and insurers.
// Hides badges, progress, confetti, toasts, "Did you know?" and Mia's story; keeps diagrams, sources and facts.
// Turn it on with the header switch or a ?mode=pro link (?mode=standard turns it off). Remembered on this device.
(function () {
  const KEY = "wm-academy-pro-v1";
  const load = () => { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } };
  const save = (on) => { try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) { /* private mode */ } };
  const param = new URLSearchParams(location.search).get("mode");
  let on = param === "pro" ? true : param === "standard" ? false : load();
  if (param) save(on);

  const head = document.querySelector("header");
  const btn = document.createElement("button");
  btn.type = "button"; btn.id = "pro-toggle"; btn.className = "mode-toggle pro-toggle";
  const bar = document.createElement("div");
  bar.className = "pro-bar"; bar.setAttribute("role", "note");
  bar.innerHTML = `<strong>Professional mode</strong> · Executive briefs: <a href="brief.html#banking">Banking</a> · <a href="brief.html#insurance">Insurance</a> · <a href="index.html#controls">Controls</a>`;
  if (head) { head.appendChild(btn); head.insertAdjacentElement("afterend", bar); }

  function set(v, persist) {
    on = v;
    document.body.classList.toggle("pro", v);
    btn.setAttribute("aria-pressed", String(v));
    btn.innerHTML = v ? "💼 Professional mode: <strong>on</strong>" : "💼 <strong>Professional mode</strong>";
    if (persist) save(v);
  }
  btn.addEventListener("click", () => set(!on, true));
  set(on, false);
})();
