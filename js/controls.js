// Controls for regulated industries (#58): common controls → frameworks that ask for them → how IBM webMethods BPMS and
// Business Rules implement them → the evidence an auditor would see. Educational mapping, not legal or compliance advice.
// Framework entries cite the regulator's own pages; product entries cite IBM / Software AG documentation.
window.CONTROLS = {
  checked: "2026-11-16",
  frameworks: [
    { id: "sr117", name: "SR 11-7", full: "Supervisory Guidance on Model Risk Management", who: "US Federal Reserve and OCC · banking",
      what: "Issued 4 April 2011. Expects robust model development, implementation and use, effective validation, and sound governance, policies and controls.",
      url: "https://www.federalreserve.gov/supervisionreg/srletters/sr1107.htm", src: "Federal Reserve: SR 11-7" },
    { id: "e23", name: "OSFI E-23", full: "Guideline E-23: Model Risk Management (2027)", who: "Canada (OSFI) · banks and insurers",
      what: "Final guideline published 11 September 2025, effective 1 May 2027, for all federally regulated financial institutions. Principles-based and covers all model types, including AI.",
      url: "https://www.osfi-bsif.gc.ca/en/news/backgrounder-guideline-e-23-model-risk-management", src: "OSFI: Backgrounder, Guideline E-23" },
    { id: "aiact", name: "EU AI Act", full: "Regulation (EU) 2024/1689", who: "EU · lenders and life/health insurers",
      what: "Annex III point 5 lists creditworthiness assessment and credit scoring of natural persons, and risk assessment and pricing in life and health insurance, as high-risk. Article 12 requires automatic logging; Article 14 requires effective human oversight. Check the current application dates on the official site.",
      url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3", src: "European Commission: AI Act Service Desk, Annex III" },
    { id: "gdpr", name: "GDPR Art. 22", full: "Automated individual decision-making", who: "EU · anyone deciding about people",
      what: "People have the right not to be subject to a decision based solely on automated processing that has legal or similarly significant effects. Where it is allowed, safeguards include at least the right to obtain human intervention, to express a point of view and to contest the decision.",
      url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj", src: "EUR-Lex: Regulation (EU) 2016/679" },
    { id: "naic", name: "NAIC AI Bulletin", full: "Model Bulletin: Use of AI Systems by Insurers", who: "US states · insurers",
      what: "Adopted by the NAIC on 4 December 2023. A guidance model that applies as each state adopts it; it expects insurers to keep a written program for the responsible use of AI systems.",
      url: "https://content.naic.org/sites/default/files/legal-adoption-map-ai-model-bulletin.pdf", src: "NAIC: Model Bulletin adoption map" },
    { id: "dora", name: "DORA", full: "Regulation (EU) 2022/2554, digital operational resilience", who: "EU · banks, insurers and other financial entities",
      what: "Applies from 17 January 2025. Covers ICT risk management, ICT-related incident management and reporting, resilience testing, and ICT third-party risk.",
      url: "https://eur-lex.europa.eu/eli/reg/2022/2554/oj", src: "EUR-Lex: Regulation (EU) 2022/2554" }
  ],
  // ask: framework ids, or "practice" when it is common control practice rather than a cited requirement
  rows: [
    { id: "four-eyes", control: "Four-eyes approval (maker-checker)", ask: ["practice"],
      need: "A second person approves anything above an authority limit, and the same person cannot both request and approve.",
      how: "A rule task decides whether the request needs approval; a user task routes it to the approver role. Accepting a task claims it, so only one approver acts on it, and delegation is recorded.",
      evidence: "The task's audit history (who accepted, delegated and completed, and when), from the Task Engine's getTaskAudit service or the task archive.",
      src: [["Task Engine getTaskAudit", "https://documentation.softwareag.com/webmethods/task_engine/wtn10-7/10-7_Task_Engine_webhelp/task-engine-webhelp/te_web_taskaudit.html"]] },
    { id: "sod", control: "Segregation of duties", ask: ["practice", "sr117", "e23"],
      need: "The people who build a decision, change it, approve it and repair failures are not the same people.",
      how: "Developers build processes in Designer; analysts own rule projects in My webMethods; operations act in Monitor only with the functional privileges an administrator grants, such as Resubmit or Modify and Resubmit.",
      evidence: "Role and functional-privilege assignments in My webMethods; who resubmitted what, from Monitor.",
      src: [["Granting users the ability to perform Monitor actions", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-setup_13.html"]] },
    { id: "trace", control: "Decision traceability", ask: ["aiact", "sr117", "e23", "naic"],
      need: "For any individual outcome you can show the inputs, the decision logic and version, the result and who confirmed it.",
      how: "Mark the rule task's inputs and outputs as logged fields: inputs are logged before the step runs and outputs after. They land in the Process Audit database with the instance. Log the rule version as a field too (Author's view).",
      evidence: "Logged-field rows (PRA_STEP_LOGGED_FIELD) and step history (PRA_PROCESS_STEP) for the instance.",
      src: [["Advanced rule task properties: logged fields (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.advanced.rule.task.properties.html"],
        ["Process Audit Log database tables (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.process.audit.log.database.component.tables.html"]] },
    { id: "oversight", control: "Human oversight and the right to contest", ask: ["aiact", "gdpr", "naic"],
      need: "A person can review, override or stop an automated or AI-assisted decision, and a customer can ask for a human to look again.",
      how: "Route referrals, adverse outcomes and AI-proposed actions to a user task: the agent proposes, the rules decide, a person approves. A contest request can start a review task in the same process (Author's view).",
      evidence: "User-task records with reviewer, outcome and time; the logged decision fields beside them.",
      src: [["Task Engine getTaskAudit", "https://documentation.softwareag.com/webmethods/task_engine/wtn10-7/10-7_Task_Engine_webhelp/task-engine-webhelp/te_web_taskaudit.html"]] },
    { id: "change", control: "Change control for decision logic", ask: ["sr117", "e23"],
      need: "Changes to decision logic are tested, approved and versioned. Where your policy treats scorecards or rules as models, they sit in the model inventory.",
      how: "Rule projects are tested locally in Designer, then hot deployed to Integration Server through configured server connections. A new process version runs only after someone enables it for execution, and only one version is enabled at a time.",
      evidence: "Rule project versions and deployment history; process model versions and which one is enabled, in My webMethods.",
      src: [["Rules development overview (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/co-intro_business_rules.html"],
        ["Configuring an Integration Server connection for hot deployment (10.7)", "https://documentation.softwareag.com/webmethods/compendiums/v10-7/C_Design_and_Implement_BPMs/design_implement_bpm_compendium/ta-configure_master_is.html"]] },
    { id: "retention", control: "Record retention and archiving", ask: ["aiact", "dora"],
      need: "Decision and process records are kept for the period your records policy and regulators require, and can be retrieved.",
      how: "Process history lives in the Process Audit database; an Archive database component archives ProcessAudit data, and completed tasks can be archived to a separate store.",
      evidence: "Archive tables and the task archive, retrievable per instance.",
      src: [["Migrate database components: Archive component (10.15)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-15/webhelp/mig-webhelp/mig-webhelp/to-migrate_db_components_4.html"],
        ["Task archiving", "https://documentation.softwareag.com/webmethods/compendiums/v10-7/C_Digital_Event_Comm/intsagdes-compendium/co-about-task-archiving.html"]] },
    { id: "resilience", control: "Resilience and recovery", ask: ["dora"],
      need: "In-flight work survives failures, and failed steps can be repaired and re-run in a controlled way.",
      how: "Use guaranteed (non-volatile) quality of service for auditable processes. In Monitor, failed instances can be resubmitted from the failed step, with the pipeline edited if bad data caused the failure.",
      evidence: "Instance and step status history in the Process Audit database; Monitor's view of the resubmitted instance.",
      src: [["Tuning Process Engine performance and quality of service", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Run_BPs_and_CAs/runbpca-compendium/to-concepts_2.html"],
        ["About resubmitting process instances (Monitor 10.5)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-5/10-5_Monitor_webhelp/monitor-webhelp/to-processes_25.html"]] }
  ]
};

(function () {
  const C = window.CONTROLS;
  const ZC = window.LANG === "zh" && window.ZH && window.ZH.controls;
  if (ZC) {
    C.frameworks.forEach((f) => Object.assign(f, ZC.frameworks[f.id] || {}));
    C.rows.forEach((r) => Object.assign(r, ZC.rows[r.id] || {}));
  }
  const U = ZC ? ZC.ui : { practice: "Common practice", askedBy: "Asked for by: ", need: "What is expected", how: "How BPMS and rules do it", evidence: "Evidence an auditor sees",
    productSrc: "Product sources: ", disclaimer: (d) => `<strong>Educational mapping, not legal or compliance advice.</strong> Whether a framework applies depends on your institution, jurisdiction and use case. Regulatory references were last checked on ${d}.`,
    glance: "At a glance", control: "Control", frameworks: "The frameworks", source: "Source: ", checked: "checked" };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fw = (id) => C.frameworks.find((f) => f.id === id);
  const link = (t, u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`;
  const date = new Date(C.checked + "T12:00:00").toLocaleDateString(ZC ? "zh-CN" : "en-GB", { day: "numeric", month: ZC ? "long" : "short", year: "numeric" });
  // In the course, hash links would switch sections, so in-page jumps use buttons; the reading version uses anchors.
  const isRead = !!document.querySelector("nav.toc");
  const jump = (id, text, cls) => isRead ? `<a class="${cls}" href="#${id}">${text}</a>` : `<button type="button" class="${cls}" data-jump="${id}">${text}</button>`;
  const asks = (r) => r.ask.map((a) => a === "practice" ? `<span class="pill">${U.practice}</span>` : jump("fw-" + a, esc(fw(a).name), "pill fw-pill")).join(" ");

  const disclaimer = `<p class="callout ctl-note">${U.disclaimer(date)}</p>`;
  const rowsHtml = C.rows.map((r) => `<div class="ctl-row" id="ctl-${r.id}">
      <h3>${esc(r.control)}</h3><p class="ctl-ask">${U.askedBy}${asks(r)}</p>
      <dl><dt>${U.need}</dt><dd>${esc(r.need)}</dd><dt>${U.how}</dt><dd>${esc(r.how)}</dd><dt>${U.evidence}</dt><dd>${esc(r.evidence)}</dd></dl>
      <p class="sources">${U.productSrc}${r.src.map(([t, u]) => link(t, u)).join(" · ")}</p></div>`).join("");
  const fwHtml = `<div class="fw-grid">${C.frameworks.map((f) => `<div class="fw" id="fw-${f.id}"><strong>${esc(f.name)}</strong> <small>${esc(f.who)}</small>
      <p><em>${esc(f.full)}${ZC ? "。" : "."}</em> ${esc(f.what)}</p><p class="sources">${U.source}${link(f.src, f.url)} · ${U.checked} ${date}</p></div>`).join("")}</div>`;
  const cols = [{ id: "practice", name: U.practice }].concat(C.frameworks);
  const matrix = `<div class="table-wrap"><table class="ctl-matrix"><tr><th>${U.control}</th>${cols.map((f) => `<th>${esc(f.name)}</th>`).join("")}</tr>${C.rows.map((r) =>
    `<tr><td>${jump("ctl-" + r.id, esc(r.control), "ctl-link")}</td>${cols.map((f) => `<td class="${r.ask.includes(f.id) ? "yes" : ""}">${r.ask.includes(f.id) ? "●" : ""}</td>`).join("")}</tr>`).join("")}</table></div>`;

  const course = document.getElementById("ctl-body");
  if (course) {
    course.innerHTML = disclaimer + `<h3>${U.glance}</h3>` + matrix + rowsHtml + `<h3 id="ctl-frameworks">${U.frameworks}</h3>` + fwHtml;
    course.addEventListener("click", (e) => {
      const b = e.target.closest("[data-jump]"); if (!b) return;
      const t = document.getElementById(b.dataset.jump);
      if (t) { t.scrollIntoView({ behavior: "smooth", block: "start" }); t.classList.add("ctl-flash"); setTimeout(() => t.classList.remove("ctl-flash"), 1600); }
    });
  }
  const read = document.getElementById("r-ctl-body");
  if (read) read.innerHTML = disclaimer + matrix + rowsHtml.replace(/<h3>/g, "<h4>").replace(/<\/h3>/g, "</h4>") + `<h4>${U.frameworks}</h4>` + fwHtml;
})();
