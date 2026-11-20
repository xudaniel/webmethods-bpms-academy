// Mia's request: one fictional story that runs through the whole course (#48).
// Every person, company and number here is invented to illustrate the concepts; the product facts live in the cited sections.
window.STORY = {
  cast: [
    { id: "mia", name: "Mia", role: "Buyer", color: "#0f62fe", line: "Needs a $1,200 laptop for a new hire. Her request is the one we follow." },
    { id: "sam", name: "Sam", role: "Manager", color: "#24a148", line: "Approves purchases above the limit, from his inbox in My webMethods." },
    { id: "priya", name: "Priya", role: "Business analyst", color: "#8a3ffc", line: "Owns the purchase-limit rule and changes it without touching the process." },
    { id: "leo", name: "Leo", role: "Process developer", color: "#b28600", line: "Drew the process in Designer, built it and switched it on." },
    { id: "omar", name: "Omar", role: "Operations", color: "#da1e28", line: "Watches running requests in Monitor and resubmits the ones that fail." }
  ],
  stages: ["Submitted", "Rules check", "Manager approves", "Order created", "On record"],
  // The order to follow the story; each chapter links to the next one in this list
  route: ["start", "basics", "overview", "howto", "decisions", "architecture", "bpmn", "trouble", "patterns", "lifecycle", "scan", "quiz"],
  chapters: {
    start: { who: ["mia", "sam"], stage: 0, text: "Meet Mia. She needs a $1,200 laptop for a new hire. Without a process platform that means an email to Sam, a spreadsheet and hoping nobody forgets. Follow her request through the course: each section shows the next part of its journey." },
    basics: { who: ["mia"], stage: 0, text: "Mia's request is one instance of the “Approve a purchase” model. Ten colleagues submitted requests today: the same model, ten more instances, each at its own step." },
    overview: { who: ["mia", "leo"], stage: 0, text: "Behind Mia's click: Leo drew the process in Designer, Integration Server runs it, My webMethods shows Sam his inbox, and an audit database remembers every step." },
    knowledge: { who: ["omar"], stage: 1, text: "Why does Mia's request survive a server restart? Leo chose guaranteed quality of service for purchases, not volatile tracking. The Process Engine topic explains the trade-off." },
    howto: { who: ["sam", "leo", "priya", "omar"], stage: 2, text: "Sam opens My Inbox, accepts Mia's task and approves it. Leo built the process, Priya owns the limit rule, Omar keeps it running. Pick a role below to see their steps." },
    lab: { who: ["leo"], stage: 2, text: "In this lab you are Leo: you build the very process Mia's request runs through. A request arrives, an approver accepts or rejects it, and you follow it in Monitor." },
    decisions: { who: ["priya", "mia"], stage: 1, text: "Priya keeps the purchase limits in a decision table: up to $500 is approved automatically, anything above goes to a manager. So Mia's $1,200 goes to Sam. The loan table below works the same way." },
    trouble: { who: ["mia", "leo"], stage: 0, bad: true, text: "Monday, 9 a.m.: Mia submits and nothing happens. Leo uploaded a new version on Friday but never enabled it for execution. The won't-start flowchart finds it in two checks." },
    teach: { who: ["mia", "sam", "priya", "leo", "omar"], text: "Teaching a class? Tell Mia's story. Each part of the agenda maps to one moment of her request, so the room follows one thread instead of a list of features. No laptops? Play her request around a table with the unplugged classroom kit." },
    lifecycle: { who: ["priya", "leo"], stage: 4, text: "A quarter later the numbers show that requests like Mia's wait two days for a manager. Priya raises the auto-approve limit, Leo adds a 24-hour reminder: the loop starts again." },
    architecture: { who: ["mia", "sam", "omar"], stage: 3, text: "Mia's request in one trip: the Process Engine on Integration Server runs it, the Task Engine puts a task in Sam's inbox, and every step is written to the Process Audit database." },
    bpmn: { who: ["mia", "sam"], stage: 2, text: "The lanes diagram below is Mia's request: she submits in the Requester lane, Sam approves in the Manager lane, and the system creates the order." },
    patterns: { who: ["priya", "sam"], stage: 1, text: "Next year an AI agent reads the quote Mia attaches and proposes a cost centre. Priya's rules decide whether that is allowed, Sam approves anything above the limit, and everything is logged." },
    cases: { who: ["mia", "sam"], stage: 3, text: "The purchase-approval case below is Mia's process from start to finish, with the lesson Priya learned about where limits belong." },
    simulator: { who: ["omar"], stage: 4, text: "The same kind of engine that ran Mia's request also runs loan applications. Step through one and watch the audit rows that Omar would see in Monitor." },
    scan: { who: ["priya", "omar"], stage: 4, text: "A year later there are thousands of requests like Mia's. Suppose the history shows Sam approved almost all of those under $1,500 within minutes: the scan would flag that step as a rule candidate." },
    quiz: { who: ["mia", "sam"], stage: 4, done: true, text: "The end of the story: Mia's laptop arrived, the order is on record, and anyone can see who approved it and when. Can you name what happened at each step?" }
  },
  // Reading-version chapter ids for the same story moments
  read: { start: "r-why", overview: "r-overview", basics: "r-basics", knowledge: "r-knowledge", howto: "r-howto", lab: "r-lab", trouble: "r-trouble", teach: "r-teach",
    architecture: "r-arch", lifecycle: "r-lifecycle", bpmn: "r-bpmn", patterns: "r-patterns", cases: "r-cases", scan: "r-scan", quiz: "r-quiz" }
};

(function () {
  const S = window.STORY;
  const ZS = window.LANG === "zh" && window.ZH && window.ZH.story;
  if (ZS) {
    S.cast.forEach((c) => { const z = ZS.cast[c.id]; if (z) { c.role = z[0]; c.line = z[1]; } });
    S.stages = ZS.stages;
    Object.entries(S.chapters).forEach(([k, ch]) => { if (ZS.chapters[k]) ch.text = ZS.chapters[k]; });
  }
  const U = ZS ? ZS.ui : { where: "Where Mia's request is", tag: "📦 Mia's request", part: (n, m) => `part ${n} of ${m}`, next: "Next in Mia's story: ",
    done: "🎉 Story complete. Back to Start here →", follow: "Follow Mia's story from the start →", cast: "Meet the cast",
    castLead: "One fictional purchase request, followed from click to audit trail. Everyone here is invented.", go: "Follow Mia's request →" };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const person = (id) => S.cast.find((c) => c.id === id);
  const avatar = (id, big) => {
    const p = person(id), r = big ? 22 : 15;
    return `<svg class="avatar${big ? " big" : ""}" viewBox="0 0 ${2 * r} ${2 * r}" width="${2 * r}" height="${2 * r}" role="img" aria-label="${esc(p.name + ", " + p.role)}"><circle cx="${r}" cy="${r}" r="${r}" fill="${p.color}"/><text x="${r}" y="${r + (big ? 7 : 5)}" text-anchor="middle" font-size="${big ? 19 : 14}" font-weight="700" fill="#fff" font-family="system-ui,sans-serif">${esc(p.name[0])}</text></svg>`;
  };
  const strip = (ch) => ch.stage === undefined ? "" : `<ol class="story-strip" aria-label="${U.where}">${S.stages.map((t, i) =>
    `<li class="${i < ch.stage || ch.done ? "past" : i === ch.stage ? (ch.bad ? "now bad" : "now") : ""}">${esc(t)}</li>`).join("")}</ol>`;
  const isRead = !!document.querySelector("nav.toc");
  const titles = {};
  (window.PHONE ? window.PHONE.groups : []).forEach(([, items]) => items.forEach(([id, t]) => { titles[id] = t; }));

  function card(key, ch) {
    const n = S.route.indexOf(key), next = n >= 0 ? S.route[n + 1] : null;
    const head = `<div class="story-head">${ch.who.map((w) => avatar(w)).join("")}<span class="story-tag">${U.tag}${n >= 0 ? ` · ${U.part(n + 1, S.route.length)}` : ""}</span></div>`;
    const body = `<p>${esc(ch.text)}</p>${strip(ch)}`;
    const link = isRead ? "" : next ? `<a class="story-next" href="#${next}">${U.next}${esc(titles[next] || next)} →</a>` :
      n === S.route.length - 1 ? `<a class="story-next" href="#start">${U.done}</a>` : `<a class="story-next" href="#${S.route[0]}">${U.follow}</a>`;
    return `<aside class="story-card${ch.bad ? " bad" : ""}" data-story="${key}">${head}${body}${link}</aside>`;
  }

  Object.entries(S.chapters).forEach(([key, ch]) => {
    if (isRead) {
      const sec = $(S.read[key]); if (!sec) return;
      const h = sec.querySelector("h2"); if (!h) return;
      const after = h.nextElementSibling && h.nextElementSibling.classList.contains("readtime") ? h.nextElementSibling : h;
      after.insertAdjacentHTML("afterend", card(key, ch));
    } else {
      const sec = $(key); if (!sec) return;
      const rt = sec.querySelector(":scope > .readtime");
      if (rt) rt.insertAdjacentHTML("afterend", card(key, ch)); else sec.insertAdjacentHTML("afterbegin", card(key, ch));
    }
  });

  // Meet the cast (Start here / chapter 1)
  const castHtml = `<div class="card story-cast" id="story-cast"><h3>${U.cast}</h3><p class="lead">${U.castLead}</p>
    <ul>${S.cast.map((c) => `<li>${avatar(c.id, true)}<div><strong>${esc(c.name)}</strong> <small>${esc(c.role)}</small><br>${esc(c.line)}</div></li>`).join("")}</ul>
    ${isRead ? "" : `<a class="btn story-go" href="#${S.route[1]}">${U.go}</a>`}</div>`;
  const startCard = document.querySelector(isRead ? '#r-why .story-card' : '#start .story-card');
  if (startCard) startCard.insertAdjacentHTML("afterend", castHtml);
})();
