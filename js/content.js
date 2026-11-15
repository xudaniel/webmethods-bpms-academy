// Course content. Public sources only; see SOURCES at the bottom and README.
window.ACADEMY = {
  architecture: [
    { id: "designer", name: "Designer", role: "Design time",
      text: "Eclipse-based tool where you model BPMN processes, build Integration Server services, define human tasks and business rules, then build and upload the process model to the runtime.",
      tip: "Models are 'built and uploaded'; the Process Audit database then holds the process metadata." },
    { id: "is", name: "Integration Server + Process Engine (WmPRT)", role: "Runtime",
      text: "The Process Engine runs inside Integration Server (package WmPRT). It executes process steps, calls IS services, and keeps live instance state in the Process Engine database.",
      tip: "Service steps are IS services, so BPMS lives inside the webMethods integration estate." },
    { id: "task", name: "Task Engine (on My webMethods Server)", role: "Human work",
      text: "Runs user tasks: inboxes, assignment, delegation, escalation, task business data and a per-task audit trail (getTaskAudit). Tasks can be archived to a separate data source.",
      tip: "In 10.15, writing task status into the Process Audit tables is off by default, so task history usually comes from the Task Engine." },
    { id: "pe-db", name: "Process Engine database", role: "State",
      text: "Private, real-time store of process instance state used by the engine itself. Not intended for reporting.",
      tip: "Audit data can lag this 'true' state slightly when audit logging is asynchronous." },
    { id: "audit", name: "Process Audit database", role: "History",
      text: "Public history store: process and step statuses, transitions, logged business fields, errors. Monitor reads it. Tables use the PRA_ prefix from 9.6 (WM* before).",
      tip: "Key tables: PRA_PROCESS, PRA_PROCESS_STEP, PRA_STEP_TRANSITION, PRA_STEP_LOGGED_FIELD, PRA_ERROR." },
    { id: "rules", name: "Business Rules / ODM", role: "Decisions",
      text: "Decision tables and rules evaluated from a process (rule task or service call). Many estates move decision logic to IBM Operational Decision Manager (ODM) for versioning, testing and governance.",
      tip: "Pattern: the process owns orchestration; the rules engine owns the judgment." },
    { id: "monitor", name: "Monitor / Optimize", role: "Observe & improve",
      text: "Monitor shows instances, logged values and allows resubmission; Optimize adds KPIs, dashboards and business activity monitoring.",
      tip: "Optimize users already have KPI history that an agent-opportunity scan can reuse." }
  ],

  auditTables: [
    ["PRA_PROCESS", "One row per process status (when process status logging is on)."],
    ["PRA_PROCESS_STEP", "One row per step status (when step logging is on)."],
    ["PRA_PROCESS_STEP_LOOP", "Step status with process, step and loop iteration."],
    ["PRA_STEP_TRANSITION", "Begin/end step of each transition (when transition logging is on)."],
    ["PRA_STEP_LOGGED_FIELD(S)", "Run-time values of input/output fields marked for logging."],
    ["PRA_ERROR", "A row for each failed step."]
  ],

  lifecycle: [
    ["Model", "Draw the BPMN process in Designer: lanes, tasks, gateways, events. Agree the process with the business owner."],
    ["Implement", "Attach IS services to service steps, build user tasks (forms, assignment), add rule tasks or ODM calls."],
    ["Build & upload", "Generate the runtime artefacts and upload the model; versions are tracked."],
    ["Execute", "Process Engine runs instances; Task Engine puts human work in inboxes."],
    ["Monitor", "Track instances, errors and logged values; resubmit failed steps."],
    ["Optimize", "Measure KPIs and cycle times, find bottlenecks, change rules or the model."],
    ["Govern", "Version control, audit history, retention and archiving, change approval."]
  ],

  bpmn: [
    { group: "Activities", items: [
      ["Service task", "Calls an Integration Server service or external system automatically."],
      ["User task", "Work for a person, delivered to a Task Engine inbox."],
      ["Rule (business rule) task", "Evaluates a decision table or ODM decision service."],
      ["Subprocess / call activity", "Reuses a process inside another; keeps models small."]]},
    { group: "Gateways", items: [
      ["Exclusive (XOR)", "Exactly one path, chosen by a condition."],
      ["Parallel (AND)", "All paths run; a join waits for all of them."],
      ["Inclusive (OR)", "One or more paths, depending on conditions."],
      ["Event-based", "Wait for whichever event arrives first."]]},
    { group: "Events", items: [
      ["Start / end", "Where an instance begins and finishes."],
      ["Timer", "Deadlines and escalations, e.g. 'escalate after 24 h'."],
      ["Message", "Wait for or send a message from another process or system."],
      ["Error", "Catch a failure and route to a recovery path."]]},
    { group: "Swimlanes", items: [
      ["Pool", "A participant, e.g. the company or a partner."],
      ["Lane", "A role or system inside the pool; shows who does what."]]}
  ],

  patterns: [
    { name: "Rule task for decision agility", tag: "classic",
      problem: "Decision logic changes faster than the process.",
      solution: "Keep thresholds and eligibility in a rule task or ODM decision service; the process only routes on the result. Configure the Rule Task in Designer (Properties → Implementation), map inputs/outputs, and Hot Deploy rule changes without rebuilding the process.",
      when: "Pricing, eligibility, routing, limits." },
    { name: "Process-Aware decision table with task action", tag: "classic",
      problem: "A rule needs to create or influence a human task.",
      solution: "Mark the decision table Process Aware, map TaskData and ProcessData (outbound only), and ensure the Rule Task inputs/outputs match the table exactly.",
      when: "Manual decision points inside otherwise automated rules." },
    { name: "Human exception path", tag: "classic",
      problem: "Most cases are routine, a few need judgment.",
      solution: "Automate the straight-through path; send only exceptions to a user task with full context.",
      when: "Claims, approvals, order exceptions." },
    { name: "Timer escalation", tag: "classic",
      problem: "Tasks sit in inboxes too long.",
      solution: "Attach a timer to the user task; on expiry reassign, notify a manager or take a default action.",
      when: "SLAs, regulatory deadlines." },
    { name: "Parallel work with join", tag: "classic",
      problem: "Independent checks run one after another.",
      solution: "Use a parallel gateway for independent checks and a join before the decision.",
      when: "Onboarding checks, document collection." },
    { name: "Agent proposes, rules decide, process executes", tag: "agent era",
      problem: "AI agents are good at reading documents and proposing actions, but regulated decisions must be explainable and repeatable.",
      solution: "The agent extracts facts and proposes; an ODM decision service applies policy (allow / deny / refer); the BPMS process executes or escalates to a person. Every step is logged.",
      when: "Claims, lending, KYC, logistics exceptions." },
    { name: "Human-approval inbox for agents", tag: "agent era",
      problem: "Agents from several platforms need a person to approve some actions, with SLAs and audit.",
      solution: "Route the agent's 'needs a human' step into a BPMS user task: assignment, delegation, escalation and audit come for free.",
      when: "High-impact actions; EU AI Act human-oversight requirements for high-risk systems." },
    { name: "Decision log (flight recorder)", tag: "agent era",
      problem: "After an incident you must show which rule version, inputs and approver produced an outcome.",
      solution: "Log decision inputs, rule version, outcome and approver for every agent-relevant decision; keep it with the process audit trail.",
      when: "Any regulated or customer-impacting automated decision." }
  ],

  cases: [
    { name: "Purchase approval",
      flow: ["Request submitted", "Rule: approval limit by amount and cost centre", "Manager approval (user task, 48 h timer)", "Create PO (service)", "Notify requester"],
      lesson: "Limits change every budget cycle, so keep them in rules, not in gateway conditions." },
    { name: "Loan decisioning",
      flow: ["Application received", "Fetch credit data (service)", "Rule: eligibility, pricing, refer reasons", "Underwriter review only if 'refer'", "Offer or decline letter"],
      lesson: "Credit scoring is an EU AI Act Annex III use case; keep decision logs and a human review path." },
    { name: "Logistics exception (agent era)",
      flow: ["Delay or damage event from TMS", "Agent reads documents and proposes credit or reroute", "Rule: policy and cost limits", "Human approval above limit", "Update TMS and notify customer"],
      lesson: "Agents handle reading and drafting; rules hold the money limits; people handle the edge cases." }
  ],

  glossary: [
    ["BPMN", "Business Process Model and Notation, the standard graphical language for processes."],
    ["BPMS", "Business Process Management Suite: modelling, execution, human tasks, monitoring and rules in one product family."],
    ["Process Engine", "Runtime inside Integration Server (WmPRT) that executes process models."],
    ["Task Engine", "Runtime on My webMethods Server that manages human tasks and inboxes."],
    ["Integration Server (IS)", "webMethods runtime for services, adapters and APIs; hosts the Process Engine."],
    ["My webMethods Server (MWS)", "Portal server hosting task inboxes, Monitor and administration UIs."],
    ["Process Audit database", "History store of process/step statuses, logged fields and errors (PRA_ tables)."],
    ["Rule task", "BPMN task that evaluates business rules and returns a result to the process."],
    ["ODM", "IBM Operational Decision Manager: authoring, testing, versioning and execution of business rules."],
    ["ODMoC", "ODM on Cloud, the managed SaaS offering of ODM."],
    ["Decision agility", "Ability to change business decisions without redeploying the process."],
    ["Optimize", "webMethods KPI and business activity monitoring component."],
    ["BOAT", "Business Orchestration and Automation Technologies, Gartner's category for platforms that combine process orchestration, connectivity and agentic features."],
    ["MCP", "Model Context Protocol, an open protocol for exposing tools and data to AI agents."],
    ["Human-in-the-loop", "Design where a person reviews or approves an automated or agent action."],
    ["EOM / EOS", "End of Maintenance / End of Support dates in a product lifecycle."],
    ["Hot Deploy", "Push an updated rule project to Integration Server without redeploying the process."],
    ["Process Aware", "Decision table flag required when the rule contains a manual decision / task action."]
  ],

  lifecycleDates: [
    ["webMethods 10.15 GA", "18 Oct 2022"],
    ["10.15 End of Maintenance", "Oct 2027"],
    ["10.15 End of Support", "Oct 2028"],
    ["Last release with AIX and z/Linux support", "10.15"]
  ],

  market: {
    sizing: [
      ["Mordor Intelligence", "$16.7B (2025)", "11.6% CAGR to 2031"],
      ["IMARC", "$17.5B (2025)", "to $38.1B by 2034"],
      ["Fortune Business Insights", "$21.5B (2025)", "17.2% CAGR to 2034; North America 43%"],
      ["360iResearch", "$26.5B (2025)", "23.2% CAGR to 2032"]
    ],
    signals: [
      "Gartner's 2026 Magic Quadrant for Business Orchestration and Automation Technologies (BOAT) evaluated 20 vendors; the category requires native AI-agent orchestration and governance.",
      "Gartner expects 70% of enterprises to move to a consolidated automation platform that orchestrates processes, agents, bots, APIs and people by 2030, up from 10% today.",
      "Camunda reported ARR nearing $200M in August 2026, with growth led by insurance (+53%), public sector (+48%) and banking (+40%).",
      "Appian reported Q3 2026 revenue of $234.6M (+25%) and says about 80% of its ARR comes from financial services, life sciences and public sector.",
      "EU AI Act (Digital Omnibus): obligations for Annex III high-risk systems such as credit scoring apply from 2 Dec 2027; product-embedded systems from 2 Aug 2028."
    ],
    takeaways: [
      "Analyst 'BPM market' sizes disagree by more than 50%; use them for direction, not for sizing a product line.",
      "New spending goes to regulated, long-running, human-supervised processes bought as consolidated orchestration platforms with agent governance.",
      "For an established on-premises BPMS, the realistic market is its installed base and the integration estates around it; upgrade deadlines are when customers re-evaluate."
    ]
  },

  quiz: [
    { q: "Where does the webMethods Process Engine run?", a: ["Inside Integration Server (WmPRT)", "Inside My webMethods Server only", "In the browser", "In ODM"], c: 0,
      e: "The Process Engine is the WmPRT package in Integration Server." },
    { q: "Which store should you query for historical process and step statuses?", a: ["Process Engine database", "Process Audit database (PRA_ tables)", "IS repository", "Task Engine cache"], c: 1,
      e: "The Process Audit database is the public history store; the Process Engine database is private runtime state." },
    { q: "In 10.15, where is human-task history usually found?", a: ["PRA_PROCESS only", "Task Engine audit (getTaskAudit / archive)", "IS server log", "It is not stored"], c: 1,
      e: "Task status logging into Process Audit is off by default in 10.15; use the Task Engine audit trail." },
    { q: "A discount threshold changes every quarter. Where should it live?", a: ["In a gateway condition", "Hard-coded in an IS service", "In a rule task or ODM decision", "In the BPMN diagram label"], c: 2,
      e: "Rules give decision agility without redeploying the process." },
    { q: "Which gateway runs all outgoing paths?", a: ["Exclusive", "Parallel", "Event-based", "Inclusive with one true condition"], c: 1,
      e: "A parallel (AND) gateway activates every outgoing path." },
    { q: "In the 'agent proposes, rules decide' pattern, who makes the final policy decision?", a: ["The agent", "The rules engine (e.g. ODM), with escalation to a person", "The BPMN diagram", "Nobody"], c: 1,
      e: "The agent proposes; deterministic rules decide; the process executes or escalates." },
    { q: "When does webMethods 10.15 reach End of Maintenance?", a: ["Oct 2025", "Oct 2027", "Oct 2030", "It has no end date"], c: 1,
      e: "EOM is Oct 2027 and EOS Oct 2028." },
    { q: "From when do EU AI Act obligations apply to Annex III high-risk systems such as credit scoring?", a: ["2 Aug 2025", "2 Dec 2026", "2 Dec 2027", "2 Aug 2030"], c: 2,
      e: "The Digital Omnibus moved Annex III obligations to 2 Dec 2027." },
    { q: "In the Agent Scan Lab, a user task whose outcome is the same for the same inputs 95% of the time is best treated as…", a: ["An agent candidate", "A rule candidate", "Keep human", "An integration fix"], c: 1,
      e: "Highly deterministic outcomes are rules nobody wrote down; encode them in ODM." },
    { q: "What does BOAT stand for?", a: ["Business Orchestration and Automation Technologies", "Business Object Audit Trail", "BPM Online Analytics Tool", "Batch Orchestration And Transfer"], c: 0,
      e: "Gartner's category for consolidated orchestration and automation platforms." }
  ],

  sources: [
    ["Process Audit Log database component tables (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.process.audit.log.database.component.tables.html"],
    ["Process Engine vs Process Audit databases (IBM community)", "https://community.ibm.com/community/user/discussion/differences-between-process-engine-db-and-process-audit-log-db"],
    ["Task Engine getTaskAudit", "https://documentation.softwareag.com/webmethods/task_engine/wtn10-7/10-7_Task_Engine_webhelp/task-engine-webhelp/te_web_taskaudit.html"],
    ["Task audit logging into Process Audit disabled by default (IBM 10.15 docs)", "https://www.ibm.com/docs/en/SSHZPA_10.15.0/te_users_guide/co-disable_enable_task_logging_in_processes.html"],
    ["Task archiving", "https://documentation.softwareag.com/webmethods/compendiums/v10-7/C_Digital_Event_Comm/intsagdes-compendium/co-about-task-archiving.html"],
    ["webMethods support lifecycle (IBM)", "https://www.ibm.com/support/pages/node/7180543"],
    ["Longer support for webMethods 10.15 (Software AG forum)", "https://tech.forums.softwareag.com/t/longer-support-for-webmethods-10-15/276574"],
    ["Gartner BOAT Magic Quadrant 2026 abstract", "https://www.gartner.com/en/documents/8381781"],
    ["Appian on Gartner BOAT 2026", "https://itwire.com/guest-articles/company-news/2026-gartner-critical-capabilities-for-business-orchestration-and-automation-technologies-report-ranks-appian-1-for-the-deterministic-workflow-automation-use-case-and-platform-cons"],
    ["Camunda ARR nearing $200M (Business Wire)", "https://www.businesswire.com/news/home/20260804044254/en/"],
    ["Camunda regulated-industry growth", "https://techintelpro.com/news/ai/agentic-ai/camunda-accelerates-agentic-orchestration-adoption"],
    ["Appian Q3 2026 results (SEC 8-K)", "https://www.sec.gov/Archives/edgar/data/0001441683/000144168326000056/appnex991earningsrelease-9.htm"],
    ["Appian industry mix", "https://www.webull.com/news/15872292364510209"],
    ["EU AI Act Digital Omnibus (Orrick)", "https://www.orrick.com/fr-FR/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes"],
    ["BPM market sizes: Mordor", "https://www.scotts-international.com/business-process-management-market-share-analysis-industry-trends-statistics-growth-forecasts-2026-2031,t2166895/58022"],
    ["BPM market sizes: IMARC", "https://www.imarcgroup.com/global-business-process-management-market"],
    ["BPM market sizes: Fortune Business Insights", "https://www.fortunebusinessinsights.com/business-process-management-bpm-market-102639"],
    ["BPM market sizes: 360iResearch", "https://cn.gii.tw/report/ires2011888-business-process-management-market-by-organization.html"]
  ]
};
