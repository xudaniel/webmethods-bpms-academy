// Basics 101: the ideas behind every process platform, for complete beginners.
// Seven short lessons: a story, three points, a picture, one check. Progress stays in this browser.
window.BASICS = {
  intro: "Seven short lessons for complete beginners. No product knowledge needed: first the ideas, then the IBM webMethods names. About 15 minutes.",
  lessons: [
    { id: "process", icon: "🔁", title: "A process is a recipe that runs again and again", mins: 2,
      story: "Every organisation repeats the same work: approve a purchase, open an account, handle a complaint. Write the steps down once and you have a process model, the recipe. Each time someone actually follows it, that is one instance, like one dinner cooked from the recipe. A BPMS keeps the recipe and runs every dinner for you.",
      points: [
        "Process model: the drawing of the steps. It changes rarely.",
        "Process instance: one run, with its own data (this order, this customer).",
        "A busy model can have thousands of instances running at once, each at a different step."
      ],
      dg: "b-model-instance",
      check: { q: "500 purchase requests arrive today, all following the same approval process. How many models and instances is that?",
        a: ["500 models, 1 instance", "1 model, 500 instances", "1 model, 1 instance"], c: 1,
        e: "One recipe, 500 dinners: the model is shared, and each request is its own instance with its own data." },
      deeper: [["Watch one instance run in the simulator", "simulator"]] },

    { id: "workers", icon: "🤝", title: "Every step is done by a system, a person or a rule", mins: 2,
      story: "Look at any step and ask: who does it? Some steps are done by software, like checking stock or sending an email. Some need a person, like a manager approving. Some are decisions that follow a policy, like “anything over $5,000 needs a director”. A good process uses each one for what it does best.",
      points: [
        "System step (service task): calls other software. Fast and repeatable.",
        "Person step (user task): lands in someone's inbox and waits for them.",
        "Decision step (rule task): asks the rules and gets an answer back. AI agents can help as well, inside the limits the rules set."
      ],
      dg: "b-three-workers",
      check: { q: "“Orders over $5,000 need a director's approval.” Where should the $5,000 limit live?",
        a: ["In a rule, so it can change without redrawing the process", "Written into the process drawing", "In the director's email signature"], c: 0,
        e: "Limits change every budget cycle. Kept in a rule, the business can change it safely, and the process just asks." },
      deeper: [["Sort real steps into process, rules and agents", "start"]] },

    { id: "shapes", icon: "🔷", title: "Five shapes are enough to read most process diagrams", mins: 2,
      story: "BPMN is the standard picture language for processes, so a business person and a developer can read the same drawing. You do not need all of it. Learn five shapes and you can read most diagrams you will meet.",
      points: [
        "Thin circle: a run starts here. Thick circle: it ends here.",
        "Rounded box: a task, done by a system, a person or a rule.",
        "Diamond: a gateway that picks one path (×) or runs paths side by side (+). Arrows show what happens next."
      ],
      dg: "b-bpmn-shapes",
      check: { q: "In a process diagram, what does a diamond mean?",
        a: ["A task someone must do", "A point where the process picks a path or splits", "The end of the process"], c: 1,
        e: "Diamonds are gateways. An × gateway picks one path, such as Approved? yes or no; a + gateway runs paths in parallel." },
      deeper: [["BPMN essentials", "bpmn"]] },

    { id: "rules", icon: "⚖️", title: "Keep decisions out of the drawing", mins: 2,
      story: "The process owns the order of work: what happens first, who does what, how long to wait. The rules own the decisions: limits, eligibility, prices. Kept apart, the business can change a decision in minutes without touching the process.",
      points: [
        "A rule task asks a question, like “approve or refer?”, and the process carries on with the answer.",
        "A decision table is the friendliest form: each row says IF these conditions, THEN this result.",
        "In IBM webMethods, Hot Deploy pushes changed rules to the live server without redeploying the process."
      ],
      dg: "process-vs-rules",
      check: { q: "The approval limit changes from $500 to $800. What needs to be redeployed?",
        a: ["The whole process", "Only the rules (for example with Hot Deploy)", "Nothing; just restart the server"], c: 1,
        e: "Only the decision changed, so only the rules change. Running processes simply get the new answer." },
      deeper: [["How a business analyst changes a rule", "howto"]] },

    { id: "people", icon: "🙋", title: "People get their work as tasks in an inbox", mins: 2,
      story: "When a process reaches a person step, it creates a task and waits. The task appears in the inbox of the right people. One of them accepts it, so the others know it is taken, then completes it with an answer. The process wakes up and moves on. If nobody acts in time, the process can remind someone or escalate.",
      points: [
        "Accept: “I'm on it”. Once one person accepts, the others cannot.",
        "Complete: done, with the answer the process needs, such as approve or reject.",
        "Delegate: hand it to someone else. Every action is recorded."
      ],
      dg: "task-lifecycle",
      check: { q: "A task is in five people's inboxes. Ana accepts it. What happens?",
        a: ["All five keep working on it", "It is Ana's now; the others cannot accept it", "The task is deleted"], c: 1,
        e: "Accepting claims the task so the work is not done twice. Ana can still delegate it if she cannot finish." },
      deeper: [["How a business user works tasks", "howto"]] },

    { id: "engine", icon: "📒", title: "The engine runs it; the audit trail remembers it", mins: 2,
      story: "Picture a token moving along the arrows: that is one instance making progress. The engine moves every token, calls systems, creates tasks and waits on timers. As it goes, it writes down what happened: which step, when, by whom, and any error. That record answers “where is my order?” and “who approved this?”.",
      points: [
        "The engine runs every instance step by step, around the clock.",
        "The audit trail is the history of every step of every instance.",
        "A monitor screen reads that history. When a step fails, you fix the cause and resubmit from that step."
      ],
      dg: "b-token-audit",
      check: { q: "A customer asks why order #123 is stuck. Where do you look first?",
        a: ["Redraw the process", "The monitor, which shows the instance and its step history", "Ask everyone on the team"], c: 1,
        e: "The monitor shows each instance, its status and the step where it stopped, using the audit trail. If a step failed, fix the cause and resubmit." },
      deeper: [["See audit rows in the simulator", "simulator"], ["How operations watch and resubmit", "howto"]] },

    { id: "life", icon: "🚀", title: "From drawing to running, in five moves", mins: 3,
      story: "Every process has the same life: draw it, send it to the server, switch it on, let it run, then watch it and improve it. Beginners usually stumble on one move: switching it on.",
      points: [
        "Design → build and upload → enable → run → monitor, then improve and repeat.",
        "In IBM webMethods, a new upload is not switched on by default: you enable it for execution in My webMethods.",
        "Only one version of a model is enabled at a time."
      ],
      dg: "build-pipeline",
      map: [
        ["Draw the process", "Designer"],
        ["Run every instance", "Process Engine, on Integration Server"],
        ["Give work to people", "Task Engine, with inboxes in My webMethods"],
        ["Make decisions", "webMethods Business Rules: rule tasks and decision tables"],
        ["Remember what happened", "Process Audit database"],
        ["Watch and fix", "Monitor, in My webMethods"]
      ],
      check: { q: "You uploaded a new process, but nothing starts. What is the most likely cause?",
        a: ["The model is too small", "It was not enabled for execution", "BPMN does not allow it"], c: 1,
        e: "New uploads are not enabled by default. Enable that version for execution in My webMethods, then try again." },
      deeper: [["Do it yourself in the hands-on lab", "lab"], ["When a process won't start", "trouble"]] }
  ]
};

(function () {
  const ZB = window.LANG === "zh" && window.ZH && window.ZH.basics;
  const B = ZB || window.BASICS;
  window.BASICS_LIVE = B; // the lessons in the language on screen (used by the review book)
  if (window.MIX) B.lessons.forEach((l) => { if (l.check) l.check = window.MIX(l.check, "basics:" + l.id); });
  const U = ZB ? ZB.ui : { mapH: "The same ideas, with IBM webMethods names", idea: "The idea", inWm: "In IBM webMethods", min: "min", check: "Check yourself: ",
    deeper: "Go deeper:", nextLesson: "Next lesson: ", right: "Right.", notQuite: "Not quite.", retry: "Try again",
    count: (n, m) => `${n} / ${m} checks passed`, all: (n, m) => `${n} / ${m} checks passed: you know the basics! 🎉`, checkR: "Check:", key: "Answer key" };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const KEY = "wm-academy-basics-v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode */ } };
  const L = B.lessons;
  const mapTable = (l) => l.map ? `<h4>${U.mapH}</h4><div class="table-wrap"><table class="basics-map"><tr><th>${U.idea}</th><th>${U.inWm}</th></tr>` +
    l.map.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("") + `</table></div>` : "";
  // Diagram placeholder; js/diagrams.js draws it
  const fig = (l) => `<div data-mount-dg="${l.dg}"></div>`;

  // ---------- Reading version: chapter with an answer key ----------
  const rb = $("r-basics-body");
  if (rb) {
    rb.innerHTML = `<p class="lead">${esc(B.intro)}</p>` + L.map((l, i) => `<h3>${i + 1}. ${l.icon} ${esc(l.title)}</h3><p>${esc(l.story)}</p>` +
      `<ul>${l.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>${fig(l)}${mapTable(l)}` +
      `<p><strong>${U.checkR}</strong> ${esc(l.check.q)}</p><ol type="a">${l.check.a.map((a) => `<li>${esc(a)}</li>`).join("")}</ol>`).join("") +
      `<h3>${U.key}</h3><ol>${L.map((l) => `<li><strong>${"abc"[l.check.c]}.</strong> ${esc(l.check.e)}</li>`).join("")}</ol>`;
    return;
  }

  // ---------- Course: one lesson open at a time ----------
  const root = $("basics-lessons"); if (!root) return;
  $("basics-intro").textContent = B.intro;
  const st = Object.assign({ done: {} }, load());
  root.innerHTML = L.map((l, i) => `<details class="card basics-lesson" id="b-${l.id}" data-i="${i}">
    <summary><span class="b-num">${i + 1}</span><span class="b-title">${l.icon} ${esc(l.title)}</span><span class="b-meta">${l.mins} ${U.min}</span></summary>
    <p class="lead">${esc(l.story)}</p>
    <ul class="b-points">${l.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
    ${fig(l)}${mapTable(l)}
    <div class="quiz-q basics-check" data-i="${i}"><strong>${U.check}${esc(l.check.q)}</strong>${l.check.a.map((a, j) => `<button type="button" data-j="${j}">${esc(a)}</button>`).join("")}<div class="explain"></div></div>
    <p class="b-deeper"><strong>${U.deeper}</strong> ${l.deeper.map(([t, go]) => `<a href="#${go}">${esc(t)} →</a>`).join(" · ")}</p>
    ${i < L.length - 1 ? `<button type="button" class="b-next" data-next="${i + 1}">${U.nextLesson}${esc(L[i + 1].title)} →</button>` : ""}
  </details>`).join("");

  function paint() {
    const n = L.filter((l) => st.done[l.id]).length;
    $("basics-bar").style.width = (100 * n / L.length) + "%";
    $("basics-count").textContent = n === L.length ? U.all(n, L.length) : U.count(n, L.length);
    root.querySelectorAll(".basics-lesson").forEach((d) => d.classList.toggle("passed", !!st.done[L[d.dataset.i].id]));
    $("basics-done").hidden = n !== L.length;
  }
  root.addEventListener("click", (e) => {
    const nx = e.target.closest(".b-next");
    if (nx) {
      const d = root.querySelector(`.basics-lesson[data-i="${nx.dataset.next}"]`);
      root.querySelectorAll(".basics-lesson[open]").forEach((o) => { o.open = false; });
      d.open = true; d.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (e.target.closest(".b-retry")) return;
    const b = e.target.closest(".basics-check button"); if (!b) return;
    const box = b.closest(".basics-check"); if (box.dataset.done) return;
    const l = L[box.dataset.i], j = +b.dataset.j, ok = j === l.check.c;
    box.querySelectorAll("button")[l.check.c].classList.add("correct");
    if (ok) {
      box.dataset.done = "1";
      box.querySelector(".explain").innerHTML = `✅ <strong>${U.right}</strong> ${esc(l.check.e)}`;
      st.done[l.id] = new Date().toISOString().slice(0, 10); save(st); paint();
      if (L.every((x) => st.done[x.id])) document.dispatchEvent(new CustomEvent("basics:done"));
    } else {
      b.classList.add("wrong"); window.REVIEW && window.REVIEW.miss("basics", l.id);
      box.querySelector(".explain").innerHTML = `${U.notQuite} ${esc(l.check.e)} <button type="button" class="link b-retry">${U.retry}</button>`;
    }
  });
  root.addEventListener("click", (e) => {
    const r = e.target.closest(".b-retry"); if (!r) return;
    const box = r.closest(".basics-check");
    box.querySelectorAll("button").forEach((x) => x.classList.remove("correct", "wrong"));
    box.querySelector(".explain").textContent = "";
  });
  $("basics-reset").addEventListener("click", () => {
    st.done = {}; save(st);
    root.querySelectorAll(".basics-check").forEach((box) => { delete box.dataset.done; box.querySelectorAll("button").forEach((x) => x.classList.remove("correct", "wrong")); box.querySelector(".explain").textContent = ""; });
    paint();
  });
  // Open the first lesson not yet passed
  const first = L.findIndex((l) => !st.done[l.id]);
  root.querySelector(`.basics-lesson[data-i="${first < 0 ? 0 : first}"]`).open = true;
  paint();
})();
