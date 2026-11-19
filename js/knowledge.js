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
    ["IBM Integration (formerly webMethods Hybrid Integration)", "IBM's hybrid control plane and licence that brings the webMethods runtimes together with other IBM integration products; BPMS stays a self-managed runtime within the estate."]
  ],

  topics: [
    {
      id: "releases", reviewed: "2026-11-17", title: "Releases and lifecycle",
      summary: "Three releases matter for most estates today: 10.15 (the long-term on-premises release), 11.1 and 12.1.",
      facts: [
        "webMethods 10.15 became generally available on 18 Oct 2022.",
        "10.15 reaches end of support on 31 Oct 2027. Paid extended support runs to 31 Oct 2028 (initial) and 31 Oct 2030 (ongoing, usage and known defects only). 10.15 is the last release supported on AIX and z/Linux.",
        "IBM webMethods 11.1 release notes were published in September 2024 and include an IBM webMethods BPM section.",
        "IBM webMethods Integration 12.1 moves to a newer runtime based on Java 21 and Jakarta EE 10, adds FIPS 140-3 support and is easier to run in containers.",
        "12.1 is aimed mainly at self-managed, on-premises, container and hybrid deployments; SaaS follows IBM's continuous-delivery model instead."
      ],
      practice: "Plan upgrades well before Oct 2027: inventory custom Java services, packages and OS platforms (AIX/z-Linux estates must move platform as well as version).",
      sources: [3, 4, 20, 5, 6]
    },
    {
      id: "engine", reviewed: "2026-11-15", title: "Process Engine runtime and quality of service",
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
      id: "history", reviewed: "2026-11-15", title: "Execution history and audit",
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
      id: "tasks", reviewed: "2026-11-15", title: "Task Engine and human work",
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
      id: "rules", reviewed: "2026-11-15", title: "webMethods Business Rules",
      summary: "Business Rules keep decision logic out of the process diagram so it can change without redeploying the process.",
      image: "assets/diagrams/process-vs-rules.svg",
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
      id: "rules-config", reviewed: "2026-11-16", title: "Rule Engine configuration & Rule Tasks",
      summary: "How to wire webMethods Business Rules into a process and deploy them so changes stay agile.",
      image: "assets/diagrams/rule-task-hot-deploy.svg",
      facts: [
        "Rules Engine runs on Integration Server (WmBusinessRules package). By default, rules run on the Integration Server where the Process Engine is installed; to run them on a remote Integration Server, create a remote server alias named businessrulesruntime in Integration Server Administrator (or use configuration variables on Microservices Runtime).",
        "In Designer, place a Rule Task on the process canvas (or drag a rule from the Rules Explorer). In Properties → Implementation set Rule Type to Rule Set or Decision Entity and browse to the asset.",
        "Map process variables to the rule inputs and the rule outputs back to process variables. Outputs are typically used by a subsequent Exclusive Gateway.",
        "A decision table that contains a manual decision (Task Action) must be marked Process Aware; map TaskData, make the task's inputs and outputs match the table's, and map ProcessData outbound only (never overwrite or drop it).",
        "To use a rule action in a process, set the process's Minimum Logging Level to 5 (Process and all steps).",
        "Event rules require a corresponding JMS trigger on the target Integration Server.",
        "Hot Deploy pushes a rule project to one or more Integration Servers from the Business Rules UI in My webMethods or via Deployer; first configure each Integration Server connection (host, port, user, password) under Administration > My webMethods > System Settings > webMethods Business Rules Settings. Process models do not need to be rebuilt when only rules change.",
        "Advanced Rule Task properties (Process Developer mode) include Integration Server Name, Allow Parallel Execution, and Compensating marker."
      ],
      practice: "Design rule outputs as clear enumerations (APPROVE / REFER / REJECT). Keep Rules Engine on a dedicated or horizontally scalable IS node in production. Combine process audit (path & timing) with rule decision logs (inputs & outcome) for full explainability.",
      sources: [21, 22, 23, 24, 25, 26, 27, 28, 29]
    },
    {
      id: "rules-to-odm", reviewed: "2026-11-19", title: "Moving webMethods Business Rules to IBM ODM",
      summary: "The concepts map closely, but the two engines order and stop rules differently, so a move is a rebuild with side-by-side testing, not an export.",
      facts: [
        "A webMethods rule project holds data models, rule sets, decision entities and actions. In ODM, rules are written against a business object model (BOM) mapped to an execution object model (XOM), packaged as rulesets and deployed to Rule Execution Server as a RuleApp.",
        "Both products use decision tables in which each row is one rule. In ODM, a decision table runs from the first row to the last, and each row whose conditions are met performs its actions.",
        "A webMethods rule set is Inferential (the default) or Sequential, and its mode overrides the modes of the decision tables inside it. A decision table can be Inferential, Sequential All, or Sequential First, which stops after the first rule that fires.",
        "In ODM, order and stopping are set on each rule task of a ruleflow: the execution mode (Fastpath, the default for new rule tasks since V8.6; Sequential; or RetePlus, the only one of the three with inference) and the exit criteria (None runs every applicable rule; Rule runs only the first applicable rule; RuleInstance runs only its first instance).",
        "webMethods rules can call an Integration Server service, or start or join a process instance, from inside a rule through Service and Process actions.",
        "My webMethods Server has REST services that list rule projects and return a decision table as JSON. ODM's Business console can import an Excel file into an existing decision table, but the import cannot change the table's structure.",
        "Integration Server has a REST service that executes a rule set or decision entity and returns the results. ODM's REST execution service runs a deployed ruleset with JSON; execution with XML has been deprecated since V8.11.1.",
        "Rule Execution Server can generate an OpenAPI description (YAML or JSON) of a deployed ruleset. Integration Server can create a consumer REST API descriptor from a Swagger 2.0 or OpenAPI 3.0.x document, which generates a connector service that a process step can call.",
        "The public IBM and Software AG documentation reviewed for this site describes no tool that converts a webMethods rule project into an ODM project (checked 19 Nov 2026)."
      ],
      practice: "Move one decision table at a time, starting with the one that changes most and is shared by the most processes. Rebuild its structure in ODM, load the rows from Excel, then run the same historical inputs through both REST services and switch only when every outcome matches; keep the old rules for rollback. Keep Service and Process actions in the process and let the ODM rule return only a decision. Leave event rules and inferential rule sets for last: they need RetePlus or a redesign.",
      sources: [16, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70]
    },
    {
      id: "monitor", reviewed: "2026-11-16", title: "Monitor, resubmit and Optimize",
      summary: "Monitor is where operations find, fix and re-run process instances; Optimize for Process adds KPIs and analytics on top.",
      facts: [
        "Monitor runs in My webMethods: Navigate > Applications > Monitoring. Process instances are under Monitoring > Business > Process Instances.",
        "A failed instance can be resubmitted from any step that failed. A completed instance can be resubmitted from any step that was enabled for resubmission before the instance began executing.",
        "Before resubmitting, you can edit the pipeline data of a step, which helps when bad data caused the failure. Only webMethods-executed processes can be resubmitted.",
        "Resubmit Closest re-runs from the failed step if it is resubmit-enabled, otherwise from the closest resubmit-enabled step that ran before it; Resubmit Earliest re-runs the rest of the instance from the first resubmit-enabled step.",
        "Monitor actions need functional privileges granted by a My webMethods Server administrator, for example Business Monitoring > Resubmit and Business Monitoring > Modify and Resubmit.",
        "Optimize for Process comes with KPIs, and developers can add custom ones; KPIs can combine business data with process and step metrics, such as Process Cycle Time by Customer.",
        "The Process Analytics page (Monitoring > Business > Process Analytics) analyses process activity over the current or previous day."
      ],
      practice: "Decide which steps must be re-runnable before go-live and enable them for resubmission: you cannot add it to instances already running. Grant Modify and Resubmit sparingly, because it changes live data.",
      sources: [30, 31, 32, 33, 34, 35, 36]
    },
    {
      id: "upgrade", reviewed: "2026-11-17", title: "Upgrading from 10.15",
      summary: "10.15 reaches end of support on 31 Oct 2027. An upgrade installs the new release side by side, then migrates databases, configuration and process models.",
      facts: [
        "The webMethods upgrade guide for 10.15 states that it applies to the 10.15 Migration Framework and all later releases; check the guide for your target release for any changes.",
        "You install the new release, migrate database components with Database Component Configurator, then migrate product configuration, data and assets with the migration utilities or Command Central.",
        "Migrate the ProcessEngine and ProcessAudit database components if you want to finish in-progress instances, or resubmit completed or failed ones, in the new installation.",
        "For a process model with running instances, raise its version number before regenerating it in the new Designer; when you enable the new version in My webMethods and are asked whether to upgrade running processes, answer No.",
        "After migrating, connect the ProcessEngine and ProcessAudit functions to their database components (Integration Server Administrator > Settings > JDBC Pools), reload the WmMonitor package, and make sure document retrieval is enabled for all webMethods Messaging triggers.",
        "The Integration Server Pre-Upgrade Analyzer for 12.1 (July 2026) reports on custom packages, custom Java services and dependencies on changed or deprecated built-in services. It is provided as is, without support, and does not cover Process Engine, Task Engine, My webMethods Server or CAF assets.",
        "From 11.1 and 12.1, IBM removed license keys from most webMethods products; the installer and Update Manager check your entitlement with your IBMid and an entitlement key.",
        "For metered (transaction-based) contracts, 10.x keeps the transaction time defined in the last Software AG contract (3 seconds if none was defined) until you upgrade; 11.x and later always count 60 seconds as one transaction."
      ],
      practice: "Rehearse on a copy of production first. Inventory in-flight instances and decide which must finish on the old release; plan rule projects, task applications and Monitor privileges together with the process models. The public analyzer only sizes the Integration Server part, so estimate the BPM part (process models, running instances, task applications, My webMethods pages) yourself, and confirm with IBM what your contract type means after the move.",
      sources: [37, 38, 39, 40, 3, 46, 47, 48]
    },
    {
      id: "bpm-1015-to-121", reviewed: "2026-11-19", title: "What changes for BPM from 10.15 to 12.1",
      summary: "Moving from 10.15 to 12.1 is two Java platform jumps as well as a product upgrade: 11.1 brings Java 17 and a refreshed My webMethods Server, 12.1 brings Java 21 and Jakarta EE 10.",
      facts: [
        "IBM webMethods BPM 12.1 became generally available on 4 May 2026.",
        "Java runtime by release: BPMS components support Java 11 at runtime from 10.11 and all compile with Java 11 in 10.15; in 11.1 all webMethods BPM runtimes support Java 17; 12.1 moves to a runtime based on Java 21 and Jakarta EE 10.",
        "In 11.1, My webMethods Server moves to Jetty 9.4.x and JavaServer Faces 2.3.9, replaces the Netscape SDK with UnboundID LDAP for user directories, supports IPv6, and supports OAuth for e-mail with Exchange Online and Microsoft 365.",
        "In 11.1, the Task Engine on Integration Server adds lightweight user task management for automated processes, can run in pure integration scenarios, and offers a REST layer for all its core functions.",
        "Business Rules 10.15 deprecates rule audit events (auditing to database tables remains) and has removed external event rules, because the Event-Driven Architecture behind them has been deprecated since April 2018. Existing rule projects are upgraded automatically, or manually in Designer or My webMethods.",
        "Since 10.11, Business Rules runs on Java 11 and accepts only ISO 8601 and predefined Java date/time patterns, so rules with other date patterns need changing.",
        "webMethods Broker has been deprecated since 10.2 in favour of Universal Messaging, and webMethods subprocesses (used by models from 8.2.2 and earlier) are deprecated in favour of BPMN subprocesses.",
        "An IBM security bulletin for CVE-2025-53689 (jackrabbit-spi-commons) lists My webMethods Server 10.15 up to Fix 6 and 11.1 up to Fix 2 as affected.",
        "The public 12.1 material reviewed for this site describes platform changes (Java 21, Jakarta EE 10, FIPS 140-3, containers) but no BPM-specific list of added or removed features (checked 19 Nov 2026)."
      ],
      practice: "Plan the jump as a platform change as well as an upgrade: Java 11 to 17 to 21, and javax to jakarta for any custom Java or CAF code under Jakarta EE 10. Before you migrate, find rules with custom date patterns or external event rules, convert old webMethods subprocesses, move off Broker, and bring My webMethods Server to its latest fix. Run the 12.1 Pre-Upgrade Analyzer for the Integration Server part, and test My webMethods pages, task applications and LDAP login separately, since the analyzer does not cover them.",
      sources: [71, 72, 73, 74, 6, 75, 76, 77, 78]
    },
    {
      id: "iwhi", reviewed: "2026-11-17", title: "IBM Integration (formerly webMethods Hybrid Integration, IWHI)",
      summary: "IWHI, now sold as IBM Integration, is IBM's integration offering with one hybrid control plane. It brings runtimes together under central management; BPMS keeps running in the webMethods estate it manages.",
      facts: [
        "IBM announced webMethods Hybrid Integration at IBM Think on 6 May 2025, with general availability in June 2025.",
        "IBM positions it as one integration offering across on-premises and multicloud landscapes, with a hybrid control plane for centralized management, troubleshooting, governance and authentication.",
        "The hybrid control plane covers IBM, third-party and hybrid runtimes, naming App Connect, API Connect, webMethods and IBM MQ, on premises, multicloud or at the edge, SaaS or self-managed.",
        "It monitors APIs, events, messaging and integrations end to end; MQ transactions can be traced on the control plane.",
        "Self-managed webMethods Integration Server runtimes can be registered with the hybrid control plane and managed remotely from it.",
        "IBM now sells it as IBM Integration, described as formerly IBM webMethods Hybrid Integration and IBM Cloud Pak for Integration: IBM Integration SaaS with usage-based credits, or IBM Integration Software, self-managed, with entitlement-based licensing (a capacity offering, 16.2.1 since August 2026, and a consumption offering).",
        "The IBM Integration product page groups its capabilities in six areas: AI gateway, application integration, B2B integration, events and messaging, file and data transfer, and API management. BPM is not one of them; webMethods BPM 12.1 remains a separate product.",
        "IBM's July 2026 announcement adds that existing REST APIs can be exposed as Model Context Protocol (MCP) tools without rewriting business logic, with IBM DataPower Interact Gateway as a control point between agents, models and tools.",
        "The announcement also adds an AI Gateway and lays foundations for the Model Context Protocol (MCP); neither the announcement nor the control-plane page mentions BPM, process instances or human tasks."
      ],
      practice: "Use the new name, IBM Integration, with IBM teams. Treat it as a layer around the existing webMethods estate, not a replacement for BPMS: the Process Engine still runs inside Integration Server and human tasks on My webMethods Server. Keep long-running, human-centric processes in BPMS, send integration-centric work to IWHI, and never present IWHI as a forced migration. Before promising one view of everything, ask IBM whether BPMS process and task status shows in the control plane.",
      sources: [19, 41, 42, 43, 44, 45]
    },
    {
      id: "agents", reviewed: "2026-11-17", title: "Agents and human tasks across IBM's process products",
      summary: "Several IBM products now let AI agents start work and keep a person in the loop. webMethods BPM offers a task API today but no announced MCP interface.",
      facts: [
        "watsonx Orchestrate's March 2026 release added user pickers to forms in flows, so a task can be assigned to named colleagues, plus date fields and validation rules; IBM names document review and cross-functional approvals as uses.",
        "IBM Business Automation Workflow 26.0.0.0 (July 2026) lets AI agents discover, start and manage workflows, cases and tasks through standardized MCP interfaces.",
        "Cloud Pak for Business Automation 25.0.1 (December 2025) runs MCP-compliant local servers for its capabilities, including workflow, content and decisions, and lets workflows invoke watsonx Orchestrate agents natively.",
        "webMethods Integration (SaaS, June 2026) exposes workflows and flow services as MCP tools over Streamable HTTP; a service exposed as a tool can be disabled and re-enabled.",
        "In webMethods BPM 12.1, the Task Engine web-service API lets a client program add, delete, locate and update tasks. The IBM 12.1 documentation and announcements reviewed for this site describe no MCP interface for BPM processes or tasks (checked 17 Nov 2026)."
      ],
      practice: "To let an agent work with an existing BPMS process today, expose process start and the Task Engine operations as services, publish them as tools through the integration layer, and keep the person in the existing inbox. Let rules decide, route referrals to a person, and log the rule version, as in the checklist below.",
      sources: [49, 50, 51, 52, 53]
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
    ["Process Aware", "Decision table setting required when the rule contains a manual decision / task action."],
    ["Processing mode (webMethods rules)", "How a rule set or decision table runs: Inferential (the default for rule sets) or Sequential; a decision table can also be Sequential All or Sequential First."],
    ["BOM / XOM (ODM)", "The business object model is the vocabulary ODM rules are written in; it maps to the execution object model, the Java or XML classes the rules run against."],
    ["RuleApp", "ODM deployment unit that carries one or more rulesets to Rule Execution Server."],
    ["Exit criteria (ODM rule task)", "How much a rule task runs before it stops: None (every applicable rule), Rule (the first applicable rule) or RuleInstance (only its first instance)."],
    ["Jakarta EE 10", "The successor to Java EE that 12.1 is based on; its APIs use jakarta.* package names instead of javax.*, so custom Java code may need updating."]
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
      e: "Hot Deploy pushes the updated rule project; the process model stays unchanged." },
    { q: "A completed instance must be re-run from step 3, but the button does nothing. Most likely?", a: ["Monitor is offline", "Step 3 was not enabled for resubmission before the instance began", "The process is volatile", "Hot Deploy failed"], c: 1,
      e: "Completed instances can only be resubmitted from steps that were enabled for resubmission before the instance started executing." },
    { q: "When upgrading, you enable the new version of a model that has running instances and are asked to upgrade running processes. What does the upgrade guide say?", a: ["Answer Yes", "Answer No", "Delete the old version first", "Disable Monitor"], c: 1,
      e: "Raise the model version before regenerating it, enable the new version, and answer No to upgrading running processes." },
    { q: "A webMethods rule set left at its default processing mode is moved to ODM. Which ODM execution mode supports the same kind of inference?", a: ["Fastpath", "Sequential", "RetePlus", "Literal"], c: 2,
      e: "webMethods rule sets default to Inferential. In ODM only RetePlus supports inference; Fastpath, the default for new rule tasks, does not." },
    { q: "How can you load the rows of an existing webMethods decision table into ODM without retyping them?", a: ["Hot Deploy the rule project to Rule Execution Server", "Get the table as JSON from My webMethods Server, turn it into an Excel file, and import it into an ODM decision table that already has the same columns", "Import the rule project into Decision Center", "ODM reads webMethods rule projects directly"], c: 1,
      e: "My webMethods Server returns decision tables as JSON, and ODM's Business console imports Excel into an existing table; the import cannot change the table's structure, so build the columns first." },
    { q: "Which Java version do all webMethods BPM runtimes support in release 11.1?", a: ["Java 8", "Java 11", "Java 17", "Java 21"], c: 2,
      e: "BPMS moved to Java 11 around 10.11 and 10.15, to Java 17 in 11.1, and 12.1 is based on Java 21 and Jakarta EE 10." },
    { q: "A 10.15 rule project still uses external event rules. What happens?", a: ["They run unchanged", "They were removed; the Event-Driven Architecture behind them has been deprecated since April 2018", "They move to ODM automatically", "They become decision trees"], c: 1,
      e: "Business Rules 10.15 removed creating, displaying and using external event rules; plan a replacement before upgrading." }
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
    23: ["Hot Deploying Rule Projects to Integration Server", "https://www.ibm.com/docs/en/webmethods-bpm/wbr/10.7.0?topic=webmethods-hot-deploying-rule-projects-integration-server"],
    27: ["Configuring a remote Integration Server for business rules (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/to-proc-rules_2.html"],
    28: ["Configuring an Integration Server connection for hot deployment (10.7)", "https://documentation.softwareag.com/webmethods/compendiums/v10-7/C_Design_and_Implement_BPMs/design_implement_bpm_compendium/ta-configure_master_is.html"],
    29: ["About rule actions: Minimum Logging Level 5 (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.about.rule.actions.html"],
    30: ["Monitor: monitoring tasks in My webMethods (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-concepts_13.html"],
    31: ["About resubmitting process instances and steps (Monitor 10.5)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-5/10-5_Monitor_webhelp/monitor-webhelp/to-processes_25.html"],
    32: ["Resubmit Closest and Resubmit Earliest (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-processes_25.html"],
    33: ["Granting users the ability to perform Monitor actions (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-setup_13.html"],
    34: ["Optimize for Process KPIs (9.10)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite9-10/Comp/desimplca-compendium/to-analytics_decisions_13.html"],
    35: ["Configuring KPIs (Optimize 10.7)", "https://documentation.softwareag.com/webmethods/optimize/opt10-7/10-7_Optimize_webhelp/obe-webhelp/co-config_kpi_placeholder.html"],
    36: ["Overview of the Process Analytics page (Optimize 10.7)", "https://documentation.softwareag.com/webmethods/optimize/opt10-7/10-7_Optimize_webhelp/obe-webhelp/co-bizviz_overview.html"],
    37: ["Upgrading Software AG Products On Premises 10.15 (PDF)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-15/related/SysReqs_Installation_and_Upgrade/upgrading-sag-products.pdf"],
    38: ["Migrate database components with Database Component Configurator (10.15)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-15/webhelp/mig-webhelp/mig-webhelp/to-migrate_db_components_4.html"],
    39: ["Complete the business process upgrade (10.15)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-15/webhelp/mig-webhelp/mig-webhelp/to-migrate_designer_busprocruntime_13.html"],
    40: ["Upgrade using Command Central (10.15)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-15/webhelp/mig-webhelp/mig-webhelp/to-command_central_8.html"],
    41: ["A single control plane for every runtime, everywhere (IBM)", "https://www.ibm.com/products/webmethods-hybrid-integration/webmethods-hybrid-control-plane"],
    42: ["IBM webMethods Hybrid Integration documentation: managing Integration Server runtimes (IBM Docs)", "https://www.ibm.com/docs/en/hybrid-integration/saas"],
    43: ["IBM Integration (formerly IBM webMethods Hybrid Integration and Cloud Pak for Integration), product page (IBM)", "https://www.ibm.com/products/webmethods-hybrid-integration"],
    44: ["IBM webMethods Hybrid Integration: from connectivity to control in the AI era (IBM, Jul 2026)", "https://www.ibm.com/new/announcements/ibm-webmethods-hybrid-integration-from-connectivity-to-control-in-the-ai-era"],
    45: ["Announcing IBM Integration Software Capacity 16.2.1 (IBM product manager blog, Aug 2026)", "https://leifdavidsen.wordpress.com/2026/08/25/announcing-ibm-integration-software-capacity-16-2-1-a-simple-and-non-disruptive-next-step-and-new-release-for-cloud-pak-for-integration-customers/"],
    46: ["Integration Server Pre-Upgrade Analyzer 12.1 (IBM community)", "https://community.ibm.com/community/user/question/integration-server-pre-upgrade-analyzer-121"],
    47: ["License files for IS, TN and Terracotta for 12.1 (IBM Support)", "https://www.ibm.com/support/pages/node/7284828"],
    48: ["Product offering details for existing webMethods customers (IBM community)", "https://community.ibm.com/community/user/blogs/marianne-fuller/2024/11/20/webmethods-product-offering-details"],
    49: ["What's new in IBM watsonx Orchestrate, March 2026 (IBM community)", "https://community.ibm.com/community/user/blogs/alan-francis-cheeramvelil/2026/04/12/orchestrate-more-worry-less-whats-new-in-ibm-watso"],
    50: ["Product release: IBM Business Automation Workflow 26.0.0.0 (IBM community)", "https://community.ibm.com/community/user/blogs/aliannah-muzaffar/2026/07/29/product-release-ibm-business-automation-workflow"],
    51: ["Cloud Pak for Business Automation 25.0.1 (IBM community)", "https://community.ibm.com/community/user/blogs/shipra-shaw/2025/12/11/cloud-pak-for-business-automation-2501"],
    52: ["webMethods Integration: what's new (IBM Docs)", "https://www.ibm.com/docs/en/SSGOVO/pembroke_cumulative_whats_new.html"],
    53: ["Using the Task Engine Web Service API (webMethods BPM 12.1, IBM Docs)", "https://www.ibm.com/docs/en/webmethods-bpm/wte/12.1.0?topic=reference-using-task-engine-web-service-api"],
    54: ["Overview: Decision Server Rules (ODM 8.11)", "https://www.ibm.com/docs/en/SSQP76_8.11.0/com.ibm.odm.dserver.rules.overview/topics/odm_dserver_rules_overview.html"],
    55: ["Overview: BOM and execution object model (ODM 8.8.1)", "https://www.ibm.com/support/knowledgecenter/SSQP76_8.8.1/com.ibm.odm.dserver.rules.designer.author/designing_bom_topics/con_bom_overview.html"],
    56: ["Decision tables (ODM 8.10)", "https://www.ibm.com/docs/SSQP76_8.10.x/com.ibm.odm.dserver.rules.designer.author/shared_dtables_topics/tpc_dtables_overview.html"],
    57: ["About rule set processing modes (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/co-about_processing_modes.html"],
    58: ["Creating a rule set: Inferential is the default (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/ta-create_rule_set.html"],
    59: ["About decision table processing modes (webMethods 9.10)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite9-10/Compendium_Building_Your_Event-Driven_Architecture/buildeda-compendium/co-about_processing_modes_2.html"],
    60: ["Deciding on an execution mode (ODM 8.8.1)", "https://www.ibm.com/support/knowledgecenter/SSQP76_8.8.1/com.ibm.odm.dserver.rules.designer.run/optimizing_topics/tpc_opt_choose_execmode_criteria.html"],
    61: ["Fastpath mode (ODM on Cloud)", "https://www.ibm.com/docs/SS7J8H/com.ibm.odm.dserver.rules.designer.run/optimizing_topics/con_opt_execmodes_fastpath.html"],
    62: ["Execution properties for rule tasks: exit criteria (ODM 8.8)", "https://www.ibm.com/docs/en/SSQP76_8.8.0/com.ibm.odm.dserver.rules.designer.dev/orchestrating_topics/tpc_orch_rule_task_execprop.html"],
    63: ["Sequential algorithm (ODM 8.11.1)", "https://www.ibm.com/docs/en/SSQP76_8.11.1/com.ibm.odm.dserver.rules.designer.run/optimizing_topics/tpc_opt_sequentialalgo.html"],
    64: ["Business Rules REST services on My webMethods Server (9.12)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite9-12/Compendium_Designing_and_Implementing_BPMs/desimplbpm-compendium/re-summary_rest.html"],
    65: ["GET a decision table in JSON (Business Rules 10.3)", "https://documentation.softwareag.com/webmethods/business_rules/wok10-3/10-3_Business_Rules_webhelp/business-rules-webhelp/re-get_dt_json.html"],
    66: ["Transferring decision table data to and from Excel (ODM 8.10)", "https://www.ibm.com/support/knowledgecenter/en/SSQP76_8.10.x/com.ibm.odm.dcenter.bu.bconsole/dtables/con_bc_dteditor_excel.dita"],
    67: ["Business Rules REST services on Integration Server (10.7)", "https://documentation.softwareag.com/webmethods/business_rules/wok10-7/10-7_Business_Rules_webhelp/business-rules-webhelp/co-summary_rest_is.html"],
    68: ["Executing rules by using the REST service (ODM 9.0)", "https://www.ibm.com/docs/SSQP76_9.0.0/com.ibm.odm.dserver.rules.res.developing/topics/con_res_restapi_rlset_exec_intro.html"],
    69: ["Generating an OpenAPI representation of a ruleset (ODM 8.9.2)", "https://www.ibm.com/docs/SSQP76_8.9.2/com.ibm.odm.dserver.rules.res.developing/topics/tsk_res_restapi_rlset_exec_opnapi.html"],
    70: ["Working with REST API descriptors: Swagger 2.0 and OpenAPI 3.0.x (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/help_working_with_RAD.html"],
    71: ["IBM webMethods BPM 12.1 lifecycle: GA 4 May 2026 (IBM Support)", "https://www.ibm.com/support/pages/ibm-webmethods-bpm121"],
    72: ["webMethods Product Suite 10.11 Release Notes (IBM)", "https://www.ibm.com/docs/en/SSE9VGQ_10.11.0/webmethods-release-notes.pdf"],
    73: ["webMethods Product Suite 10.15 Release Notes (IBM)", "https://www.ibm.com/docs/en/SSE9VGQ_10.15.0/webmethods_release_notes.pdf"],
    74: ["IBM webMethods Release Notes 11.1 (IBM)", "https://www.ibm.com/docs/en/SSE9VGQ_11.1.0/webmethods_release_notes.pdf"],
    75: ["Business Rules 10.15 readme: usage notes", "https://documentation.softwareag.com/webmethods/business_rules/wok10-15/readme/readme/usage-notes_2.html"],
    76: ["webMethods BPM Process Development 12.1: deprecation of webMethods Broker (IBM Docs)", "https://www.ibm.com/docs/en/webmethods-bpm/wmpe/12.1.0?topic=help-about-this-guide"],
    77: ["Changing webMethods subprocesses to BPMN subprocesses (Process Development 11.1, IBM Docs)", "https://www.ibm.com/docs/en/webmethods-bpm/wmpe/11.1.0?topic=steps-about-changing-webmethods-subprocesses-bpmn-subprocesses"],
    78: ["Security bulletin: jackrabbit-spi-commons in IBM webMethods BPM, CVE-2025-53689 (IBM Support)", "https://www.ibm.com/support/pages/node/7250240"]
  }
};

// 中文 (#68): swap in the translated family table and topic text; ids, sources, images and review dates stay shared
(function () {
  const Z = window.LANG === "zh" && window.ZH && window.ZH.knowledge, K = window.KNOWLEDGE;
  if (!Z) return;
  K.family = Z.family;
  K.topics.forEach((t) => Object.assign(t, Z.topics[t.id] || {}));
})();

// Merge new glossary terms and quiz questions into the main course so every view uses them.
(function () {
  const A = window.ACADEMY, K = window.KNOWLEDGE;
  if (!A || !K) return;
  const terms = new Set(A.glossary.map((g) => g[0].toLowerCase()));
  K.glossary.forEach((g) => { if (!terms.has(g[0].toLowerCase())) { A.glossary.push(g); terms.add(g[0].toLowerCase()); } });
  A.glossary.sort((a, b) => a[0].localeCompare(b[0]));
  A.quiz.push(...K.quiz);
  const have = new Set(A.sources.map((s) => s[1]));
  Object.values(K.sources).forEach((s) => { if (!have.has(s[1])) { A.sources.push(s); have.add(s[1]); } });
})();
