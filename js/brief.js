// Executive briefs (#59): one printable page each for banking and insurance, built from the cited control map.
(function () {
  const C = window.CONTROLS, G = window.DIAGRAMS;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fw = (id) => C.frameworks.find((f) => f.id === id);
  const row = (id) => C.rows.find((r) => r.id === id);
  // 中文 (#68): the control rows are translated in place by controls.js; brief text comes from ZH.briefs
  const ZB = window.LANG === "zh" && window.ZH && window.ZH.briefs;
  const checked = new Date(C.checked + "T12:00:00").toLocaleDateString(ZB ? "zh-CN" : "en-GB", { day: "numeric", month: ZB ? "long" : "short", year: "numeric" });
  const U = ZB ? ZB.ui : { sub: (d) => `One-page brief · IBM webMethods BPMS and Business Rules · public sources only · prepared by Daniel Yuanpeng Xu · sources checked ${d}`,
    problem: "The problem", view: "Author's view", helps: "Where process plus rules help", controls: "Controls that matter", control: "Control",
    askedBy: "Asked for by", evidence: "Evidence the platform produces", dates: "Dates on the horizon", sources: "Sources", practice: "common practice",
    fig: "Where each part runs: Designer, Integration Server (Process Engine, Business Rules), the two databases, and My webMethods Server (Task Engine, Monitor).",
    foot: "Educational material, not legal, compliance or investment advice. Independent learning resource; not affiliated with or endorsed by IBM. Product names are trademarks of their owners.\n        Full detail: xudaniel.github.io/webmethods-bpms-academy (Controls section)." };
  const LIFECYCLE = ["webMethods support lifecycle (IBM)", "https://www.ibm.com/support/pages/node/7180543"];

  const BRIEFS = {
    banking: {
      title: "Process and decision automation for banks",
      problem: "Credit, onboarding and payment operations combine systems, policies and people. Supervisors expect each decision to be explainable, overseen and recoverable, which e-mail threads and spreadsheets cannot show.",
      helps: [
        ["Loan origination", "rules apply credit policy and route each application; only referrals reach an underwriter; inputs and outcome are logged with the application."],
        ["Client onboarding", "clean cases go straight through; exceptions reach an analyst with the full context; a second approver signs off above risk thresholds."],
        ["Payment exceptions", "failed steps are repaired and resubmitted from Monitor by people with named privileges, and every re-run stays in the history."]
      ],
      controls: ["four-eyes", "trace", "oversight", "change", "resilience"],
      dates: [
        ["1 May 2027", "OSFI Guideline E-23 (Model Risk Management) takes effect for all federally regulated financial institutions in Canada.", "e23"],
        ["17 Jan 2025", "DORA has applied to EU financial entities since this date: ICT risk, incident management, testing and third-party risk.", "dora"],
        ["Ongoing", "EU AI Act: creditworthiness assessment and credit scoring of natural persons are listed as high-risk (Annex III 5(b)). Check current application dates on the official site.", "aiact"],
        ["Oct 2027", "webMethods 10.15 reaches end of maintenance (end of support Oct 2028): the natural moment to modernise.", "life"]
      ]
    },
    insurance: {
      title: "Process and decision automation for insurers",
      problem: "Claims, underwriting and policy servicing mix documents, authority limits and people. Regulators expect AI-assisted decisions to be governed, overseen by people and recorded.",
      helps: [
        ["Claims triage", "rules send simple claims straight through and complex or suspicious ones to an adjuster or investigator, with the full context."],
        ["Underwriting referrals", "cases above an underwriter's authority limit go to a senior underwriter, with the limit kept in a rule that the business can change."],
        ["AI-assisted intake", "an agent reads documents and proposes; rules decide what it may do; a person approves the rest; every decision is logged."]
      ],
      controls: ["four-eyes", "trace", "oversight", "retention", "resilience"],
      dates: [
        ["4 Dec 2023", "NAIC adopted its Model Bulletin on the Use of AI Systems by Insurers; it applies as each state adopts it.", "naic"],
        ["1 May 2027", "OSFI Guideline E-23 takes effect for all federally regulated financial institutions in Canada, including insurers.", "e23"],
        ["Ongoing", "EU AI Act: risk assessment and pricing for natural persons in life and health insurance are listed as high-risk (Annex III 5(c)). Check current application dates on the official site.", "aiact"],
        ["Oct 2027", "webMethods 10.15 reaches end of maintenance (end of support Oct 2028).", "life"]
      ]
    }
  };

  // Chinese text keeps the English ids (controls, framework refs), so only the words change
  if (ZB) Object.keys(BRIEFS).forEach((k) => {
    const b = BRIEFS[k], z = ZB[k];
    Object.assign(b, { title: z.title, problem: z.problem, helps: z.helps, dates: b.dates.map((d, i) => [z.dates[i][0], z.dates[i][1], d[2]]) });
  });

  Object.entries(BRIEFS).forEach(([key, b]) => {
    const refs = [], ref = (t, u) => { let i = refs.findIndex((r) => r[1] === u); if (i < 0) { refs.push([t, u]); i = refs.length - 1; } return `<sup>[${i + 1}]</sup>`; };
    const fwRef = (id) => id === "life" ? ref(LIFECYCLE[0], LIFECYCLE[1]) : ref(fw(id).src, fw(id).url);
    const ctlRows = b.controls.map((id) => {
      const r = row(id);
      const asks = r.ask.map((a) => a === "practice" ? U.practice : fw(a).name + fwRef(a)).join(", ");
      return `<tr><td><strong>${esc(r.control)}</strong></td><td>${asks}</td><td>${esc(r.evidence)}${ref(r.src[0][0], r.src[0][1])}</td></tr>`;
    }).join("");
    const fig = G && G.D["arch-map"] ? `<figure>${G.tr(G.D["arch-map"].draw(false))}<figcaption>${U.fig}</figcaption></figure>` : "";
    document.getElementById(key).innerHTML = `
      <h1>${esc(b.title)}</h1>
      <p class="sub">${U.sub(checked)}</p>
      <div class="brief-grid"><div>
        <h2>${U.problem} <span class="tag">${U.view}</span></h2><p>${esc(b.problem)}</p>
        <h2>${U.helps} <span class="tag">${U.view}</span></h2>
        <ul>${b.helps.map(([t, d]) => `<li><strong>${esc(t)}${ZB ? "：" : ":"}</strong> ${esc(d)}</li>`).join("")}</ul>
      </div>${fig}</div>
      <h2>${U.controls}</h2>
      <div class="table-wrap"><table><tr><th>${U.control}</th><th>${U.askedBy}</th><th>${U.evidence}</th></tr>${ctlRows}</table></div>
      <h2>${U.dates}</h2>
      <ul>${b.dates.map(([d, t, id]) => `<li><strong>${esc(d)}${ZB ? "：" : ":"}</strong> ${esc(t)}${fwRef(id)}</li>`).join("")}</ul>
      <div class="foot"><strong>${U.sources}</strong><ol>${refs.map(([t, u]) => `<li><a href="${esc(u)}">${esc(t)}</a> <span class="host">(${esc(new URL(u).hostname.replace(/^www\./, ""))})</span></li>`).join("")}</ol>
        ${U.foot}</div>`;
  });

  document.querySelectorAll("[data-print]").forEach((btn) => btn.addEventListener("click", () => {
    document.body.dataset.print = btn.dataset.print;
    window.print();
    setTimeout(() => { delete document.body.dataset.print; }, 500);
  }));
  if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
})();
