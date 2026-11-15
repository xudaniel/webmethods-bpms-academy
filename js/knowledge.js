// IBM webMethods BPMS knowledge base. Every topic lists facts with a public source.
window.KNOWLEDGE = {
  family: [
    ["Integration Server", "Runtime for services, adapters and APIs. Hosts the Process Engine (package WmPRT) and executes rule projects."],
    ["Designer", "Eclipse-based development tool for BPMN processes, IS services, tasks and business rules."],
    ["My webMethods Server (MWS)", "Portal for task inboxes, Monitor, administration and the rules repository for business analysts."],
    ["Process Engine", "Executes process models inside Integration Server; writes history to the Process Audit database."],
    ["Task Engine", "Runs human tasks on My webMethods Server: inboxes, assignment, escalation, audit, archive."],
    ["Business Rules", "Decision tables, decision trees and event rules authored in Designer and deployed to Integration Server."],
    ["Universal Messaging", "Messaging layer the Process Engine can use as its JMS provider for process transitions; Broker is deprecated."],
    ["Monitor / Optimize", "Instance monitoring and resubmission; KPIs and business activity monitoring."],
    ["webMethods Hybrid Integration", "IBM's hybrid control plane and licence that brings the webMethods runtimes together with other IBM integration products; BPMS stays a self-managed runtime within the estate."]
  ],

  topics: [
    {
      id: "releases", title: "Releases and lifecycle",
      summary: "Three releases matter for most estates today: 10.15 (the long-term on-premises release), 11.1 and 12.1.",
      facts: [
        "webMethods 10.15 became generally available on 18 Oct 2022.",
        "10.15 end of maintenance is Oct 2027 and end of support Oct 2028; 10.15 is the last release supported on AIX and z/Linux.",
        "IBM webMethods 11.1 release notes were published in September 2024 and include an IBM webMethods BPM section.",
        "IBM webMethods Integration 12.1 moves to a newer runtime based on Java 21 and Jakarta EE 10, adds FIPS 140-3 support and is easier to run in containers.",
        "12.1 is aimed mainly at self-managed, on-premises, container and hybrid deployments; SaaS follows IBM's continuous-delivery model instead."
      ],
      practice: "Plan upgrades well before Oct 2027: inventory custom Java services, packages and OS platforms (AIX/z-Linux estates must move platform as well as version).",
      sources: [3, 4, 20, 5, 6]
    },
    {
      id: "engine", title: "Process Engine runtime and quality of service",
      summary: "The Process Engine runs inside Integration Server and passes work between steps using transition documents, either locally or through a messaging layer.",
      facts: [
        "Quality of service is a trade-off: persisting data as a process runs gives reliability, visibility and control; volatile in-memory storage gives speed.",
        "At maximum quality of service, processes are guaranteed: they recover at the right step after a failure and run to completion.",
        "At maximum performance, processes may not recover after a server failure and are not visible or controllable in Monitor.",
        "Settings are made per process model, so each process can sit anywhere between the two extremes.",
        "Optimize Locally (default: on) runs adjacent steps on the same Integration Server without publishing transition documents.",
        "Volatile Transition Documents (default: on) keeps transition documents in memory; faster, especially for documents of 2 MB or more, but a messaging failure mid-step means no automatic recovery.",
        "Volatile Tracking (default: off) keeps process status in memory only; faster, but status is lost if a server fails mid-step.",
        "The Process Engine can use Universal Messaging as its JMS provider (default URL nsp://localhost:9000); webMethods Broker is deprecated."
      ],
      practice: "Use guaranteed settings for long-running, auditable processes (approvals, claims); reserve volatile settings for short, high-volume, replayable flows — and remember volatile tracking removes Monitor visibility.",
      sources: [7, 8, 9]
    },
    {
      id: "history", title: "Execution history and audit",
      summary: "Three stores hold execution data; only two are meant for analysis.",
      facts: [
        "The Process Engine database holds private, real-time instance state for the engine.",
        "The Process Audit database holds process and step status, transitions, logged fields and errors in PRA_ tables (WM* before 9.6); Monitor reads it.",
        "What is written depends on the logging level set per process (process status, step status, transitions, logged fields).",
        "In 10.15, task status logging into Process Audit is disabled by default; task history comes from the Task Engine audit (getTaskAudit) or the task archive."
      ],
      practice: "Decide logging levels and retention up front: they determine what you can audit, mine for agent candidates, or prove to a regulator years later.",
      sources: [10, 11, 12, 13]
    },
    {
      id: "tasks", title: "Task Engine and human work",
      summary: "User tasks in a process become task instances in the Task Engine on My webMethods Server.",
      facts: [
        "Tasks appear in inboxes in My webMethods; the audit view shows every operation performed on a task.",
        "The Task Engine web service getTaskAudit returns the audit history of a task instance.",
        "Task instances can be archived to a separate data source for long-term audit."
      ],
      practice: "Design tasks with the decision context on the form, a clear owner role, a timer escalation and a recorded outcome field — that outcome is what later analysis needs.",
      sources: [12, 14]
    },
    {
      id: "rules", title: "webMethods Business Rules",
      summary: "Business Rules keep decision logic out of the process diagram so it can change without redeploying the process.",
      facts: [
        "A rule project is the container for data models, rule sets, decision entities and actions.",
        "Decision entities are decision tables, decision trees and event rules; a rule set groups related decision entities.",
        "In a decision table, columns are conditions (IF) or results (THEN), and each row is one rule.",
        "Rule actions are Data, Service or Process actions; a decision table with a manual decision point must be process-aware.",
        "Rule projects are tested locally in Designer, exported and deployed to Integration Server as the runtime, and can be shared through the My webMethods Server repository for business analysts."
      ],
      practice: "Put thresholds, eligibility and routing in decision tables owned by the business; for enterprise-wide governance, versioning and testing at scale, consider IBM ODM decision services.",
      sources: [16, 17, 18]
    },
    {
      id: "rules-config", title: "Rule Engine configuration & Rule Tasks",
      summary: "How to wire webMethods Business Rules into a process and deploy them so changes stay agile.",
      facts: [
        "Rules Engine runs on Integration Server (WmBusinessRules package). By default it is co-located with Process Engine; a remote IS can be configured in MWS under Rules Engine Configuration.",
        "In Designer, place a Rule Task on the process canvas (or drag a rule from the Rules Explorer). In Properties → Implementation set Rule Type to Rule Set or Decision Entity and browse to the asset.",
        "Map process variables to the rule inputs and the rule outputs back to process variables. Outputs are typically used by a subsequent Exclusive Gateway.",
        "A decision table that contains a manual decision (Task Action) must be marked Process Aware; map TaskData and ProcessData (ProcessData is outbound only).",
        "Event rules require a corresponding JMS trigger on the target Integration Server.",
        "Hot Deploy pushes a rule project to one or more Integration Servers from the MWS Business Rules UI or via Deployer. Process models do not need to be rebuilt when only rules change.",
        "Advanced Rule Task properties (Process Developer mode) include Integration Server Name, Allow Parallel Execution, and Compensating marker."
      ],
      practice: "Design rule outputs as clear enumerations (APPROVE / REFER / REJECT). Keep Rules Engine on a dedicated or horizontally scalable IS node in production. Combine process audit (path & timing) with rule decision logs (inputs & outcome) for full explainability.",
      sources: [21, 22, 23, 24, 25, 26]
    },
    {
      id: "checklist", title: "Practitioner design checklist",
      summary: "Ten checks that come from how the product actually behaves.",
      facts: [
        "Model the happy path first; send only exceptions to people.",
        "Keep every changeable threshold in a rule, never in a gateway condition.",
        "Choose quality of service per process: guaranteed for auditable work, volatile only for replayable flows.",
        "Turn on step logging and log the decision fields you will need to explain outcomes.",
        "Record task outcomes as data, not just as completed tasks.",
        "Add timers and escalation to every user task with an SLA.",
        "Plan audit retention and archiving before go-live.",
        "Keep service steps idempotent so failed steps can be resubmitted safely.",
        "Version processes and rule projects together and test them together.",
        "For agents: let them propose, let rules decide, route referrals to a person, and log the rule version."
      ],
      practice: "Use the checklist in design reviews and before upgrades.",
      sources: []
    }
  ],

  glossary: [
    ["Quality of service (Process Engine)", "Per-process trade-off between guaranteed, persisted execution and faster volatile execution."],
    ["Volatile tracking", "Process status kept in memory only; faster, but lost on server failure and invisible in Monitor."],
    ["Transition document", "Message the Process Engine uses to pass control between steps."],
    ["Universal Messaging", "webMethods messaging server; can be the Process Engine's JMS provider."],
    ["Rule project", "Container for data models, rule sets, decision entities and actions."],
    ["Decision table", "Decision entity where each row is a rule, with IF (condition) and THEN (result) columns."],
    ["Decision tree / event rule", "Other decision entities in webMethods Business Rules."],
    ["Rule Task", "BPMN activity that invokes a webMethods Business Rule or Rule Set at runtime."],
    ["Hot Deploy", "Push an updated rule project to Integration Server without redeploying the process model."],
    ["Process Aware", "Decision table setting required when the rule contains a manual decision / task action."]
  ],

  quiz: [
    { q: "Which Process Engine setting keeps process status in memory only?", a: ["Optimize Locally", "Volatile Tracking", "Guaranteed Transition", "Process Aware"], c: 1,
      e: "Volatile Tracking (off by default) stores status in memory; it is faster but status is lost on failure and Monitor loses visibility." },
    { q: "What does 'Optimize Locally' do?", a: ["Caches rule results", "Runs adjacent steps on the same Integration Server without publishing transition documents", "Compresses audit tables", "Moves tasks to a local inbox"], c: 1,
      e: "It is on by default and avoids messaging round-trips between adjacent steps." },
    { q: "In a webMethods decision table, what does each row represent?", a: ["A rule set", "One individual rule", "A data model", "An event"], c: 1,
      e: "Columns are conditions (IF) or results (THEN); each row is one rule." },
    { q: "Which runtime platform change arrives with IBM webMethods 12.1?", a: ["Java 8 only", "Java 21 and Jakarta EE 10", "A move to .NET", "No runtime change"], c: 1,
      e: "12.1 moves to a newer runtime based on Java 21 and Jakarta EE 10." },
    { q: "What is required for a decision table that contains a manual decision (Task Action)?", a: ["It must be marked Process Aware and map TaskData / ProcessData", "It must run only on MWS", "It cannot be called from a Rule Task", "It requires an ODM licence"], c: 0,
      e: "Process Aware is mandatory for tables with task actions; ProcessData mappings are outbound only." },
    { q: "How do you update rules without redeploying the process?", a: ["Edit the BPMN gateway condition", "Hot Deploy the rule project to Integration Server", "Rebuild the entire process model", "Restart Designer"], c: 1,
      e: "Hot Deploy pushes the updated rule project; the process model stays unchanged." }
  ],

  // Numbered sources referenced by topic.sources
  familySources: [19],
  sources: {
    20: ["IBM webMethods Integration 12.1 lifecycle (IBM)", "https://www.ibm.com/support/pages/ibm-webmethods-integration121"],
    19: ["Introducing IBM webMethods Hybrid Integration (IBM)", "https://www.ibm.com/new/announcements/introducing-webmethods-hybrid-integration"],
    3: ["webMethods support lifecycle (IBM)", "https://www.ibm.com/support/pages/node/7180543"],
    4: ["Longer support for webMethods 10.15 (Software AG forum)", "https://tech.forums.softwareag.com/t/longer-support-for-webmethods-10-15/276574"],
    5: ["IBM webMethods 11.1 release notes (copy)", "https://www.scribd.com/document/818628366/webmethods-release-notes"],
    6: ["From legacy integration to AI-ready architecture with IBM webMethods 12.1 (IBM community)", "https://community.ibm.com/community/user/blogs/noboru-tanaka/2026/07/23/ibm-webmethods12-ai-led-integration-arc"],
    7: ["Tuning Process Engine performance and quality of service", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Run_BPs_and_CAs/runbpca-compendium/to-concepts_2.html"],
    8: ["Quality of service settings", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-1/C_Run_BPs_and_CAs/runbpca-compendium/to-tuning_3.html"],
    9: ["Configuring Process Engine settings (IBM 11.1 docs)", "https://www.ibm.com/docs/en/SSLMF12_11.1/ta-configuring_monitoring_configuring_settings.html"],
    10: ["Process Audit Log database component tables (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.process.audit.log.database.component.tables.html"],
    11: ["Process Engine vs Process Audit databases (IBM community)", "https://community.ibm.com/community/user/discussion/differences-between-process-engine-db-and-process-audit-log-db"],
    12: ["Task Engine getTaskAudit", "https://documentation.softwareag.com/webmethods/task_engine/wtn10-7/10-7_Task_Engine_webhelp/task-engine-webhelp/te_web_taskaudit.html"],
    13: ["Task audit logging into Process Audit disabled by default (IBM 10.15 docs)", "https://www.ibm.com/docs/en/SSHZPA_10.15.0/te_users_guide/co-disable_enable_task_logging_in_processes.html"],
    14: ["Task archiving", "https://documentation.softwareag.com/webmethods/compendiums/v10-7/C_Digital_Event_Comm/intsagdes-compendium/co-about-task-archiving.html"],
    16: ["Rules Development terminology (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/co-rules_terminology.html"],
    17: ["About webMethods Business Rules (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.about.webmethods.business.rules.html"],
    18: ["Rules Development overview (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/co-intro_business_rules.html"],
    21: ["Using IBM webMethods BPM Business Rules in Processes (Process Engine 12.1)", "https://www.ibm.com/docs/en/webmethods-bpm/wmpe/12.1.0?topic=rules-using-webmethods-bpm-business-in-processes"],
    22: ["Configuring Rule Tasks (Process Engine 12.1)", "https://www.ibm.com/docs/en/webmethods-bpm/wmpe/12.1.0?topic=steps-configuring-rule-tasks"],
    24: ["Configuring rule tasks: event rules need a JMS trigger (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.configuring.rule.tasks.html"],
    25: ["About decision tables: process-aware for manual decisions (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.about.decision.tables.html"],
    26: ["Hot deploying rule projects to Integration Server (WmBusinessRules)", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Digital_Event_Comm/intsagdes-compendium/co-about_hot_deployment.html"],
    23: ["Hot Deploying Rule Projects to Integration Server", "https://www.ibm.com/docs/en/webmethods-bpm/wbr/10.7.0?topic=webmethods-hot-deploying-rule-projects-integration-server"]
  }
};

// Merge new glossary terms and quiz questions into the main course so every view uses them.
(function () {
  const A = window.ACADEMY, K = window.KNOWLEDGE;
  if (!A || !K) return;
  A.glossary.push(...K.glossary);
  A.glossary.sort((a, b) => a[0].localeCompare(b[0]));
  A.quiz.push(...K.quiz);
  const have = new Set(A.sources.map((s) => s[1]));
  Object.values(K.sources).forEach((s) => { if (!have.has(s[1])) { A.sources.push(s); have.add(s[1]); } });
})();
