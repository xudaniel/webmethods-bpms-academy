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
      id: "cluster", reviewed: "2026-11-19", title: "Running the Process Engine on several servers",
      summary: "One Process Engine on one Integration Server is enough for development; production usually runs several. The public guides describe three layouts, and what the servers share decides how they behave.",
      facts: [
        "In its simplest form the Process Engine is the WmPRT package on one Integration Server with its own Process Engine database. The guide calls this adequate for model development, testing or very small solutions; most process solutions run two or more Integration Servers.",
        "Process Engines on clustered Integration Servers share one Process Engine database, which must be an external RDBMS. Software AG does not support a Process Engine reaching or sharing more than one database.",
        "In an Integration Server cluster every node holds all the steps of a generated and uploaded process model, and the messaging layer delivers each process message to exactly one server, so a step runs once. The page describes webMethods Broker (now deprecated) doing this; how Universal Messaging does it is to be confirmed.",
        "An external cluster spreads processes over Integration Servers that are not formally clustered. You enable the External Cluster setting on each Process Engine so it follows cluster rules such as locking the step context; the nodes still share one Process Engine database and one messaging client prefix.",
        "In distributed (non-clustered) mode each server has its own messaging client prefix, and you design the process model so that specific parts of the process run on specific servers; together the servers' steps make up the whole process, and all of them still use one external Process Engine database.",
        "Task Engine on My webMethods Server can connect to any Process Engine in an Integration Server cluster and communicates with all of them. In a clustered My webMethods Server, apply the Task Engine server role to every node where people work on tasks or where tasks queued by the Process Engine are handled.",
        "Task Engine on Integration Server needs a separate My webMethods Server or Business Console node to administer tasks and provide task screens, registers as a My webMethods Server cluster node, and needs Universal Messaging for JMS and event synchronization. A cluster cannot mix Task Engines on Integration Server and on My webMethods Server.",
        "The Process Engine pages reviewed for this topic are from the 10.4 and 10.5 guides, written when Broker was the usual messaging layer; they have not been rechecked against 12.1 (19 Nov 2026)."
      ],
      practice: "Choose the layout before you design the models: in distributed mode the model itself is split across servers, while in the other two layouts every node can run every step. Plan for Universal Messaging rather than Broker, give every node the same configuration, enable External Cluster on each node if you use that layout, and apply the Task Engine role on each My webMethods Server node that handles tasks. Test the loss of one node with a running instance in a test environment, and confirm with IBM how these pages apply to 12.1.",
      sources: [96, 97, 98, 99, 100]
    },
    {
      id: "correlation", reviewed: "2026-11-19", title: "Correlation: how a message finds its running process",
      summary: "Many instances of many models run at once. Correlation matches an incoming document to the one instance waiting for it, or starts a new one.",
      facts: [
        "Instances of many process models run at the same time, so when a document arrives the Process Engine has to decide which running instance it is meant for; correlation does that.",
        "Any step that receives input can use correlation, set on its Correlation page in Designer's Properties view. Catching message and signal intermediate events, and receive tasks that are not set to start new instances, use it to join a running instance.",
        "Message start events, signal start events and receive tasks set to Allow this receive task to start new process instance can start a new instance, and the Designer help says they should initiate a correlation.",
        "You can correlate in two ways: name a field in the incoming document as the correlation key, with no code, or write a correlation service, a flow service built on the pub.prt:CorrelationService specification that returns a ProcessCorrelationID. A step can also use no correlation.",
        "The Process Engine ties each correlation ID to a process instance ID. With Volatile Tracking off, the pairs are stored in the WMPRTXREF table of the Process Engine database; with it on, they are held in server memory.",
        "When a document's ID matches a running instance, its content is loaded and the step runs as part of that instance. When it matches none, the tracking pages say the engine creates a new process instance ID, stores it with the correlation ID and starts a new process.",
        "The Process Engine sets up correlations itself when Trading Networks or Integration Server documents start processes. The services pub.prt.correlate:establishCorrelation, lookupCorrelation and deleteCorrelation let you manage them yourself, for example when a process starts with an Integration Server document and then waits for a Trading Networks document.",
        "For intermediate receive steps, retry behaviour for correlation is set in the subscription trigger, not in the process model.",
        "You cannot change a model's subscription filter or its Integration Server document type between versions. Changing the filter stops correlation with running instances and can raise a 'No trigger available for incoming document' error."
      ],
      practice: "Use a business key that is unique and stable, such as an order number, as the correlation field, and write a correlation service only when you need logic, for example a key built from two fields. Test the no-match case on purpose: a stray or late message can start a new instance instead of failing. Treat the subscription filter and document type as fixed for any version that still has running instances.",
      sources: [79, 104, 80, 81, 82, 83, 84, 85]
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
      id: "audit-retention", reviewed: "2026-11-19", title: "Archiving and deleting audit data",
      summary: "Monitor reads from audit tables that only grow. Software AG recommends removing data regularly; the choices are an Archive database, partitions or deletion.",
      facts: [
        "Software AG recommends removing audit data from the IS Core Audit Log and Process Audit Log databases regularly so that logging stays fast. The pages give no schedule or retention period; you choose them.",
        "Archive moves audit data to the Archive database and then removes it from the source. Delete removes it from the source and keeps no copy. After either, the data no longer shows in My webMethods, but archived data can still be queried with SQL in the Archive database.",
        "Monitor's pages sort audit data into two schemas: the IS Core Audit Log tables (documents, processes, services and the server) and the Process Audit Log tables, which hold process and step data such as PRA_PROCESS, PRA_PROCESS_STEP and PRA_STEP_TRANSITION, plus control data such as resubmit actions.",
        "IS Core Audit Log data can only be archived into an Archive database. Process Audit Log data can go to an Archive database or into database partitions; partitions suit high-volume systems and manage only Process Audit Log data, so you still need an Archive database for everything else.",
        "You can archive or delete from the Archive Audit Data page in My webMethods (Applications > Administration > Business > Data Management), with the pub.monitor.archive built-in services (which you can schedule on Integration Server), or by running stored procedures from a database client. You set how long to keep data, then choose Archive and Delete or Delete only.",
        "Four stored procedures do the work: DOCUMENT_ARCHIVE, PROCESS_ARCHIVE, SERVER_ARCHIVE and SERVICE_ARCHIVE. PROCESS_ARCHIVE covers the Process Audit Log process tables listed above plus WMSERVICEACTIVITYLOG and WMERROR in the IS Core Audit Log.",
        "Each procedure takes p_retaindays or p_retaindate (not both), p_action (ARCHIVE by default, or DELETE) and p_batchsize. PROCESS_ARCHIVE and SERVICE_ARCHIVE also take p_status, where 2 means Completed, 4 Failed, 1024 Stopped (processes only) and 32768 Resubmitted; data in other statuses stays in the source. PROCESS_ARCHIVE also takes p_modelid to limit a run to named process models.",
        "Integration Server's Service Monitoring guidance for IS Core Audit data is to pick the longest retention period you can for each run so that each run moves less data. Archiving or deleting too much at once makes the operation slower, raises the risk of locking problems and makes the database, transaction log and temp tables grow."
      ],
      practice: "Decide before go-live how long people need to see instances in Monitor and how long a regulator needs the history, and archive for the second, not the first. Schedule small, regular runs rather than one yearly purge, use the status filter if support needs failed instances for longer than completed ones, and consider Process Audit partitions for high-volume processes. Test a query against the Archive database and write down who may run it, because archived data no longer appears in My webMethods.",
      sources: [86, 87, 88, 89, 90]
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
      id: "task-rules", reviewed: "2026-11-19", title: "Task rules, events and timers",
      summary: "A task type carries rules that decide who gets a task, what the inbox shows and what happens as time passes. They are set in Designer, and timed events need upkeep.",
      facts: [
        "Rules inside a task type control how a task is assigned and which task events are detected. They appear as rules in My webMethods but are defined and configured in Designer.",
        "Assignments (routing rules) assign a task to a user, group or role when a condition occurs, for example to a manager when the task is marked for escalation, or to a role when it is activated.",
        "Events trigger an action at a set point in a task's life cycle, such as when it is accepted, assigned, canceled or suspended. Filters decide which tasks appear in a user's inbox, for example hiding tasks another member of the role has already accepted.",
        "Change rules act when a task's status or business data changes, for example deleting a task when its status becomes Expired, and can send an e-mail notification to an assigned user or role.",
        "Schedules act on time or date: for example sending an e-mail if a loan application is not accepted within a set period, or reassigning, escalating or changing the priority of a task after a date or time interval.",
        "Date/time events use a fixed date or a time interval, and an interval can be calculated from a business calendar or from the output of an Integration Server service.",
        "When a task type is published to My webMethods Server, the Task Engine stores precalculated trigger times for its date/time events. They can become outdated, so an administrator recalculates them: manually for one task type or for all, when republishing a task type, or on a schedule.",
        "In My webMethods you cannot edit a task type's rules, but you can view them on the Task Engine Administration page and change the order in which they are evaluated."
      ],
      practice: "Give every task with an SLA a schedule rule that first reminds and then escalates, and send it to a role rather than a person. Keep date logic in one place, such as a business calendar, and put recalculating date/time events into your release checklist and your regular operations schedule so that reminders do not fire on stale dates. Store who the task was escalated to and the outcome as task data.",
      sources: [101, 102, 103]
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
      id: "rules-in-practice", reviewed: "2026-11-20", title: "Business Rules in practice: data models, tests, guardrails and REST",
      summary: "Most problems after go-live sit around the tables, not in them: document types that change, untested edge cases, business edits without checks, and two ways to call the same rule with different defaults.",
      facts: [
        "Rules are written against Integration Server document types. Each document type is mapped to a data model that is stored in the rule project, and the Rules Engine uses instances of that data model at run time.",
        "When the document type changes, right-click the data model in Rules Explorer and choose Sync Data Model. The documentation warns that changes to the document type's fields may make decision entities invalid.",
        "An event rule is an event plus one or more results. For internal events it reads WHENEVER an event source CHANGED THEN a result, where the change comes from another event rule or a decision table; a result assigns a value or runs an action. Event rules work properly only inside a rule set.",
        "Rules can be tested locally in Designer before they are exported: Run As runs a decision table, decision tree, event rule or rule set and shows the outcome in the Results view. Test input values can be saved and loaded again, and a launch configuration can prompt for data at launch.",
        "A data provider service is an external REST service assigned to one decision table column. It supplies the values and descriptions for the cell's drop-down list; in STRICT mode only the listed values can be entered.",
        "A verification service receives a decision table column as JSON over POST and returns messages, each with a description, a row number and a severity of ERROR or WARNING.",
        "CSV import in My webMethods adds rules to an existing decision table. Imported rows are appended after the last rule and never overwrite it; columns map by position, the column count must match the table apart from In Effect, imported rules are always in effect, and action result columns cannot be imported.",
        "Integration Server's REST service POST …/businessrules/projects/invoke takes projectName, invocationTarget (RS/, DT/ or D3/), inputs, desiredOutputs and createMissingInputs, which defaults to false; an unknown project returns a 404 in the error field. The pub.businessrules.client:invoke service used in flows creates missing inputs by default.",
        "To write Business Rules auditing to database tables, add the Java system property RulesAuditingDBOnOff=On to the servers, for example in Command Central; the procedure does not apply to Microservices Runtime. A Project Deployed record holds the event time, correlation ID, Integration Server host and port, and project name."
      ],
      practice: "Treat the document types behind rules as contracts: before renaming a field, find which rule projects use it, then sync, fix invalid tables and rerun the tests. Keep a small set of saved test inputs with each project (every boundary, every customer type, one missing input) and run them before every hot deploy. When the business edits tables, give enumerated columns a STRICT drop-down, put cross-row checks such as overlapping ranges in a verification service, and use CSV only to append. Expose rules to other systems through the REST service with createMissingInputs left at false, validate inputs before calling the flow service, and switch on database auditing before go-live.",
      sources: [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118]
    },
    {
      id: "cloud-deploy", reviewed: "2026-11-20", title: "Deploying decision services on IBM Cloud: Code Engine, ODM and Decision Optimization",
      summary: "Where the rules and optimisation around a process can run on IBM Cloud: Code Engine's three workload types have hard time limits, ODM containers are supported on certified Kubernetes (with full support on OpenShift), and optimisation models can run as managed Decision Optimization jobs.",
      facts: [
        "IBM Cloud Code Engine runs functions, applications and jobs with different limits. A function runs for at most 120 seconds, with request and response bodies of up to 5 MB. An application's timeout is 300 seconds by default and 600 seconds at most. A job runs for 7,200 seconds (2 hours) by default and 86,400 seconds (24 hours) at most.",
        "A Code Engine job retries a failed run 3 times by default, and at most 5 times.",
        "Each update of an application configuration property creates a new revision of the application. Code Engine keeps only the latest inactive revision in addition to the active one, so older revisions are not available to go back to.",
        "By default a Code Engine application can receive requests from the public internet, from a private network and from components in the same project. Its visibility can be narrowed, for example to other Code Engine resources in the same project plus the private network through Virtual Private Endpoints.",
        "IBM Operational Decision Manager containers are supported only on CNCF Certified Kubernetes platforms, using the commercially available Kubernetes engine. IBM runs compatibility tests only on Red Hat OpenShift Container Platform and supports its platform configuration, such as networking, load balancing and security; on other platforms IBM cannot assist with environment setup (support note last modified in October 2020).",
        "In watsonx.ai Runtime, a Decision Optimization model is packaged as a .tar.gz, .zip or .jar archive and uploaded to a deployment space. You choose a hardware specification and a runtime (do_22.1 is based on CPLEX 22.1.1.0), then submit jobs to the deployment and monitor their states.",
        "Decision Optimization deployments use the S (2 vCPU, 8 GB), M (4 vCPU, 16 GB), L (8 vCPU, 32 GB) or XL (16 vCPU, 64 GB) hardware specifications.",
        "The Community Edition of CPLEX solves problems with up to 1,000 variables and 1,000 constraints (or a 1000 × 1000 search space for constraint programming). Larger problems need a runtime or licence with the full commercial edition."
      ],
      practice: "Pick the Code Engine workload by the worst-case solve time, not the average: up to 120 seconds a function, up to 600 seconds an application, longer a job or a Decision Optimization deployment. Lower the retries on long jobs, because with the default of 3 a run that keeps timing out costs up to four times as much. Keep policy values such as limits and shares in the rules, so a policy change does not rebuild the solver image; tag images with versions rather than latest and rerun a set of golden test cases after every update, since only one earlier revision is kept. Narrow the solver's visibility to the project, keep credentials in Code Engine secrets, and count variables before production so the Community Edition limit does not surprise you. No IBM statement was found that supports running ODM itself on Code Engine; for production ODM use ODM on Cloud or OpenShift.",
      sources: [119, 120, 121, 122, 123, 124, 125]
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
      id: "deploy", reviewed: "2026-11-19", title: "Building, versioning and deploying process models",
      summary: "A process model reaches a running server as a numbered version, and moves between environments as a composite built by the Asset Build Environment and deployed with Deployer.",
      facts: [
        "A new process starts at version 1 and you can create a new version in Designer; the Version value can be up to 50 characters. A version can be uploaded for analysis only, or built and uploaded for execution.",
        "Both kinds of upload write process information to the Process Audit metadata tables, which you can view in My webMethods Server: WMPROCESSDEFINITION (name, ID, version, quality-of-service settings, BPM or BAM type, enabled status), WMSTEPDEFINITION, WMPROCESSIMAGE, WMSTEPTRANSITIONDEFINITION and WMCUSTOMFIELDDEFINITION.",
        "For a process built for execution, Designer also records what was last built in a generation receipt (WMGENERATIONRECEIPT). Deployer copies the receipt to the target environment so that regeneration there can remove old assets, such as triggers and services, from the previous logical server; without a receipt that cleanup cannot happen.",
        "After you build, upload and enable a new version, you can update any or all running instances of the model to use it.",
        "You cannot change a model's subscription filter or Integration Server document type between versions, and you cannot delete a process model in My webMethods Server once an instance of it has run.",
        "If one deployment set holds several versions of a model and enables more than one on the target, the version deployed last is the one that ends up enabled; confirm in Monitor that the right version is enabled.",
        "In repository-based deployment, the Asset Build Environment builds assets from your development environment or version control system into composites stored in a repository, and Deployer deploys them to target servers or groups. Runtime-based deployment has been deprecated since 10.5, and Software AG recommends the repository-based way.",
        "A composite is a compressed file of asset definitions and dependencies for one runtime component, and every build also writes an ACDL descriptor, an XML manifest that Deployer reads. Deployable components include the Process Engine (BPM Process Development), Task Engine, My webMethods Server, Optimize, Integration Server, Business Rules and Universal Messaging.",
        "For daily or continuous builds, install the Asset Build Environment on a separate build machine; its build-number.xml numbers assets incrementally and can use a version-control revision number. A BPM build can be limited by process ID, process version or both.",
        "Deployer cannot work out dependencies for processes that are referenced dynamically, so you deploy those yourself. It also cannot show more than 2,500 assets at once, so Software AG recommends smaller deployment sets, and only models built for execution on Integration Server can be selected."
      ],
      practice: "Run one pipeline: commit the process project to version control, build composites with the Asset Build Environment on a build machine, deploy through Deployer to test and then production, and check in Monitor which version is enabled. Raise the version number for every change that reaches a running instance, keep subscription filters and document types stable, and list dynamically referenced processes in your deployment checklist.",
      sources: [85, 91, 92, 93, 94, 95]
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
    ["Data model (Business Rules)", "The copy of an Integration Server document type stored in a rule project; rules are written against it, and it must be synced when the document type changes."],
    ["Data provider service", "External REST service that fills the drop-down list of one decision table column; in STRICT mode only its values can be entered."],
    ["Verification service", "External REST service that checks a decision table column and returns ERROR or WARNING messages by row."],
    ["IBM Cloud Code Engine", "Serverless IBM Cloud platform that runs containers as functions (up to 120 seconds), applications (up to 600 seconds per request) or jobs (up to 24 hours)."],
    ["CPLEX Community Edition", "Free edition of the CPLEX optimisers, limited to 1,000 variables and 1,000 constraints; larger problems need the full commercial edition."],
    ["Jakarta EE 10", "The successor to Java EE that 12.1 is based on; its APIs use jakarta.* package names instead of javax.*, so custom Java code may need updating."],
    ["Correlation ID", "Value that ties an incoming document to one running process instance; it comes from a field in the document or from a correlation service."],
    ["External cluster (Process Engine)", "Several Integration Servers that are not formally clustered but run Process Engines with the External Cluster setting, one shared Process Engine database and one messaging client prefix."],
    ["Archive database (Monitor)", "Separate database that audit data moves to before it is removed from the IS Core Audit Log and Process Audit Log tables; Process Audit Log data can use partitions instead."],
    ["Composite (Deployer)", "Compressed file of asset definitions and dependencies for one runtime component, built by the Asset Build Environment and deployed by Deployer."],
    ["Generation receipt", "Record Designer keeps of what was last built for a process; Deployer copies it to the target so regeneration can remove the old assets."]
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
      e: "Business Rules 10.15 removed creating, displaying and using external event rules; plan a replacement before upgrading." },
    { q: "A document arrives for a process, but its correlation ID matches no running instance. What do the Process Engine tracking pages say happens?", a: ["It is discarded", "The engine creates a new process instance ID and starts a new process", "It waits in the task inbox", "It is sent to every node"], c: 1,
      e: "The engine stores a new process instance ID with the correlation ID and starts a new process. With Volatile Tracking off the pair is kept in the WMPRTXREF table; with it on, in server memory." },
    { q: "Between two versions of a model that has running instances, someone changes the subscription filter. What is the risk?", a: ["None, filters are read only at start", "Correlation with the running instances stops and documents may find no trigger", "The model is deleted", "Monitor switches to volatile tracking"], c: 1,
      e: "You cannot change the subscription filter or the Integration Server document type between versions; changing the filter stops correlation with running instances." },
    { q: "Which audit data can use database partitions instead of an Archive database?", a: ["IS Core Audit Log data", "Process Audit Log data", "Task Engine audit data", "Rule project versions"], c: 1,
      e: "Partitions manage Process Audit Log data only, for high-volume systems. IS Core Audit Log data always needs an Archive database, and you still need one for everything else." },
    { q: "Which Process Engine setting makes a node that is not in an Integration Server cluster follow cluster rules, such as locking the step context?", a: ["Optimize Locally", "External Cluster", "Volatile Tracking", "Process Aware"], c: 1,
      e: "Enabling External Cluster on each Process Engine makes it behave as if it were in an Integration Server cluster; the nodes still share one Process Engine database." },
    { q: "Why does Deployer copy the generation receipt to the target environment?", a: ["To license the process", "So regeneration can remove the old process assets, such as triggers and services, from the previous logical server", "To archive the audit data", "To enable the new version automatically"], c: 1,
      e: "The receipt holds the logical-to-physical server mapping. Without it the cleanup of old assets cannot happen. Confirm the right version is enabled in Monitor afterwards." },
    { q: "A task type with date/time events was published months ago. What should an administrator do so reminders fire on the right dates?", a: ["Nothing, the dates are live", "Recalculate the date/time events", "Delete and recreate the inbox", "Restart Designer"], c: 1,
      e: "The Task Engine stores precalculated trigger times when the task type is published, and they can become outdated; recalculate them manually, on republishing or on a schedule." },
    { q: "A flow calls a rule set with pub.businessrules.client:invoke and another system calls it through the Integration Server REST invoke service. Both leave out one input. What happens by default?", a: ["Both return an error", "The flow service creates the missing input and runs; the REST call returns an error", "Both run with an empty input", "The REST call runs; the flow service fails"], c: 1,
      e: "The flow service's Create Missing Inputs defaults to true, while the REST service's createMissingInputs defaults to false." },
    { q: "A business user imports a CSV file of 20 rules into a decision table that has 4 rules. How many rules does the table have afterwards?", a: ["20", "24", "4", "It depends on the header names"], c: 1,
      e: "CSV import appends rows after the last rule and never overwrites; columns map by position, not by header name." },
    { q: "An optimisation solve takes about 40 minutes. Which IBM Cloud Code Engine workload can run it?", a: ["A function", "An application", "A job", "None of them"], c: 2,
      e: "40 minutes is 2,400 seconds: more than a function's 120 seconds and an application's 600-second maximum. A job runs for 2 hours by default and up to 24 hours." },
    { q: "A weekly roster has 60 nurses × 7 days × 3 shifts, one yes/no variable each. Can the CPLEX Community Edition solve it?", a: ["Yes", "No: 1,260 variables is over the 1,000 limit", "Only as a Code Engine function", "Only with fewer constraints"], c: 1,
      e: "60 × 7 × 3 = 1,260 variables, above the Community Edition limit of 1,000 variables and 1,000 constraints. Use a runtime or licence with the full commercial edition." }
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
    78: ["Security bulletin: jackrabbit-spi-commons in IBM webMethods BPM, CVE-2025-53689 (IBM Support)", "https://www.ibm.com/support/pages/node/7250240"],
    79: ["About Document Correlation (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.about.correlation.html"],
    80: ["About Correlation Fields (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.about.correlation.fields.html"],
    81: ["About Correlation Services (Designer 10.5)", "https://documentation.softwareag.com/webmethods/designer/sdf10-5/10-5_sdf-webhelp/sdf-webhelp/proc.about.correlation.services.html"],
    82: ["pub.prt.correlate:establishCorrelation (Designer 10.5)", "https://documentation.softwareag.com/webmethods/designer/sdf10-5/10-5_sdf-webhelp/sdf-webhelp/pub_prt_correlate_establishCorrelation.html"],
    83: ["Tracking correlation IDs with Volatile Tracking (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.tracking.correlation.IDs.with.volatile.tracking.html"],
    84: ["Tracking correlation IDs with the Process Engine database, Volatile Tracking disabled (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.tracking.correlation.IDs.with.volatile.tracking.disabled.html"],
    85: ["Working with Process Versions (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.ww.process.versions..html"],
    86: ["Archiving or Deleting Data in an Archive Database: overview (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-archive_data_2.html"],
    87: ["Audit Data Archiving and Deletion in Monitor (Monitor 10.3)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-3/10-3_Monitor_webhelp/monitor-webhelp/to-setup_18.html"],
    88: ["Archive database stored procedures (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-archive_data_5.html"],
    89: ["Archiving or deleting data in My webMethods (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-archive_data_3.html"],
    90: ["Archiving Data (Service Monitoring in Integration Server 10.7)", "https://documentation.softwareag.com/webmethods/integration_server/pie10-7/10-7_Service_Monitoring_in_IS_webhelp/sm-webhelp/ta-archiving_data.html"],
    91: ["Upgrading Process Model Versions (Running Business Processes 10.3)", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Run_BPs_and_CAs/runbpca-compendium/to-runtime_items_13.html"],
    92: ["About Repository-Based Deployment (Deployer 10.15)", "https://documentation.softwareag.com/webmethods/deployer/wdy10-15/webhelp/wdy-webhelp/wdy-webhelp/co-repository-based_deployment.html"],
    93: ["About Runtime-Based Deployment: deprecated from 10.5 (Deployer 10.5)", "https://documentation.softwareag.com/webmethods/deployer/wdy10-5/10-5_Deployer_webhelp/deployer-webhelp/co-runtime-based_deployment.html"],
    94: ["BPM Process Development assets (Deployer 10.3)", "https://documentation.softwareag.com/webmethods/deployer/wdy10-3/10-3_Deployer_webhelp/deployer-webhelp/re-bpm_process_development.html"],
    95: ["Adding assets to ProcessModel deployment sets (Deployer 10.15)", "https://documentation.softwareag.com/webmethods/deployer/wdy10-15/webhelp/wdy-webhelp/wdy-webhelp/ta-adding_assets_to_broker_processmodel_mws_or_optimize_deployment_sets.html"],
    96: ["About the Process Engine and Clustered Operation (Running Business Processes 10.5)", "https://documentation.softwareag.com/webmethods/compendiums/v10-5/C_Run_BPs_and_CAs/runbpca-compendium/to-runtime_items_9.html"],
    97: ["Operating Process Engine in an Integration Server cluster (10.5)", "https://documentation.softwareag.com/webmethods/compendiums/v10-5/C_Run_BPs_and_CAs/runbpca-compendium/to-runtime_items_10.html"],
    98: ["Operating Process Engine in an external cluster (10.5)", "https://documentation.softwareag.com/webmethods/compendiums/v10-5/C_Run_BPs_and_CAs/runbpca-compendium/to-runtime_items_12.html"],
    99: ["Operating Process Engine in distributed cluster mode (10.4)", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Run_BPs_and_CAs/runbpca-compendium/to-runtime_items_11.html"],
    100: ["Running Task Engine in a clustered environment (10.4)", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Run_BPs_and_CAs/runbpca-compendium/co-te_clustering.html"],
    101: ["Task Assignments, Events, and Rules (Task Engine 10.4)", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Run_BPs_and_CAs/runbpca-compendium/co-task_assignments_events_and_rules.html"],
    102: ["Administering Task Types with Date/Time Events (10.3)", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Run_BPs_and_CAs/runbpca-compendium/co-administering_task_types_with_date_time_events.html"],
    103: ["About Task Type Rules and Events (10.3)", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Run_BPs_and_CAs/runbpca-compendium/co-about_task_type_rules_and_events.html"],
    104: ["Specifying Correlations (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.specifying.correlations.html"],
    105: ["Working with Data Models and Parameters (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/co-about_data_models.html"],
    106: ["Synchronizing a Data Model with the Underlying IS Document Type (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/ta-synchronize_data_model.html"],
    107: ["Working with Event Rules (Business Rules in My webMethods, 10.7)", "https://documentation.softwareag.com/webmethods/compendiums/v10-7/C_Digital_Event_Comm/intsagdes-compendium/co-about_event_rules.html"],
    108: ["Working with Event Rules (Business Rules 10.11)", "https://documentation.softwareag.com/webmethods/business_rules/wok10-11/10-11_Business_Rules_webhelp/business-rules-webhelp/co-about_event_rules_2.html"],
    109: ["Local Rule Testing Overview (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/co-about_testing.html"],
    110: ["Testing a Decision Table Locally (Designer 10.5)", "https://documentation.softwareag.com/webmethods/designer/sdf10-5/10-5_sdf-webhelp/sdf-webhelp/ta-test_dt.html"],
    111: ["Creating a Launch Configuration for Local Testing (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/ta-launch_configuration.html"],
    112: ["Technical Details for Preconfigured Data Provider Services (10.4)", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Design_and_Implement_BPMs/desimplbpm-compendium/co-about_data_provider_service.html"],
    113: ["Technical Details for Preconfigured Verification Services (10.4)", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Design_and_Implement_BPMs/desimplbpm-compendium/co-about_business_verification.html"],
    114: ["Using CSV Import (Business Rules in My webMethods, 10.7)", "https://documentation.softwareag.com/webmethods/compendiums/v10-7/C_Digital_Event_Comm/intsagdes-compendium/co-about_csv_import.html"],
    115: ["POST …/businessrules/projects/invoke (Business Rules 10.11)", "https://documentation.softwareag.com/webmethods/business_rules/wok10-11/10-11_Business_Rules_webhelp/business-rules-webhelp/re-post_clientinvoke.html"],
    116: ["pub.businessrules.client:invoke (10.4)", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Design_and_Implement_BPMs/desimplbpm-compendium/re-clientinvoke.html"],
    117: ["Writing Business Rules Auditing Information to the Database (Business Rules 10.7)", "https://documentation.softwareag.com/webmethods/business_rules/wok10-7/10-7_Business_Rules_webhelp/business-rules-webhelp/ta-writing_audit_information_to_db.html"],
    118: ["Summary of Business Rules Auditing Information (10.5)", "https://documentation.softwareag.com/webmethods/compendiums/v10-5/C_Design_and_Implement_BPMs/desimplbpm-compendium/co-summary_audit_information.html"],
    119: ["Code Engine limits and quotas (IBM Cloud docs)", "https://cloud.ibm.com/docs/codeengine?topic=codeengine-limits"],
    120: ["Updating your app (Code Engine documentation source)", "https://github.com/ibm-cloud-docs/codeengine/blob/master/appdeploy-update.md"],
    121: ["IBM ODM containers: supported Kubernetes platforms (IBM support)", "https://www.ibm.com/support/pages/node/5691956"],
    122: ["Deploying a Decision Optimization model (watsonx.ai)", "https://dataplatform.cloud.ibm.com/docs/content/DO/WML_Deployment/ModelDeploymentTaskCloud.html?context=wx"],
    123: ["Managing hardware specifications for deployments (watsonx.ai)", "https://www.ibm.com/docs/en/DSXDOC/wsj/analyze-data/ml-hardware-configs.html"],
    124: ["Decision Optimization notebooks: Community Edition limits", "https://www.ibm.com/docs/en/DSXDOC/DO/DODS_Introduction/DONotebooks.html"],
    125: ["IBM ILOG CPLEX Optimization Studio editions", "https://www.ibm.com/products/ilog-cplex-optimization-studio"]
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
