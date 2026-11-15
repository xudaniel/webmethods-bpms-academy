// "How to use IBM webMethods BPMS": step-by-step guides by role, a beginner path and a customer demo script.
// Menu paths and behaviour come from public Software AG / IBM documentation (see sources); exact labels can vary by version.
window.HOWTO = {
  roles: [
    {
      id: "user", role: "Business user", title: "Work your tasks in My webMethods",
      who: "Approvers, case workers, underwriters — anyone who receives human tasks from a process.",
      steps: [
        ["Open My Inbox", "Log in to My webMethods and open My Inbox. It lists every task assigned to you, directly or through a role or group you belong to.", "My webMethods → My Inbox", ["inbox"]],
        ["Find the task", "Use the Inbox Search panel to filter (for example by task type or date), then open the task to see its details and data.", "My Inbox → Inbox Search", ["inbox"]],
        ["Accept it", "Click Accept so the work is yours. A task sent to a group appears in every member's inbox; once someone accepts it, others cannot. Some task types accept automatically when you open them.", "Task → Accept", ["accept"]],
        ["Do the work", "Fill in the task's data fields. Submit saves your changes without finishing; Complete saves and marks the task Completed, which lets the process continue.", "Task → Submit / Complete", ["actions"]],
        ["Can't do it? Delegate", "Delegate the task to a colleague from your inbox. Every delegation is recorded in the audit log, and the colleague must accept it before working on it.", "My Inbox → Delegate", ["delegate"]]
      ],
      check: "The task shows Completed, and the process moves to its next step. The task's audit view shows who accepted, delegated and completed it.",
      tip: "Record the outcome in the task's data fields, not in a comment. That is what makes later reporting and automation possible."
    },
    {
      id: "dev", role: "Process developer", title: "Model, build and switch on a process",
      who: "Developers and architects who build processes in Software AG Designer.",
      steps: [
        ["Use Process Developer mode", "Building and uploading a process for execution is only possible in Designer's Process Developer mode.", "Designer → Process Development", ["buildmode"]],
        ["Draw the process", "Model the BPMN: start event, activities, gateways and lanes. For each activity choose how it runs: an Integration Server service, a user task, or a rule task that calls a webMethods Business Rules rule set or decision entity.", "Process editor → Properties → Implementation", ["ruletask"]],
        ["Set logging and quality of service", "Choose what the Process Engine records and how it moves work. Processes that use rule actions need the logging level '5 - Process and all steps'. See the Knowledge base for QoS settings.", "Process properties", ["ruleactions", "qos"]],
        ["Build and upload", "Build and upload for execution. Designer generates the runtime elements on Integration Server (steps, triggers, transition conditions) and updates the mapping services.", "Designer → Build and Upload", ["build"]],
        ["Enable for execution", "New uploads are not enabled automatically by default. Enable the version in My webMethods (tick Execution Enabled, then Save), or set Designer's preference to enable after build. Only one version of a model can be enabled at a time.", "My webMethods → Administration → Business → Business Processes", ["enable", "buildprefs"]],
        ["Run a test", "Start an instance (for example by sending its start document) and follow it in Monitor.", "My webMethods → Monitoring → Business → Process Instances", ["monitor"]]
      ],
      check: "The instance appears in Process Instances and reaches Completed, with each step's status recorded.",
      tip: "Keep thresholds in rules, not gateway conditions, so business users can change them without a rebuild."
    },
    {
      id: "analyst", role: "Business analyst", title: "Change a business rule safely",
      who: "Analysts and policy owners who maintain decision tables after go-live.",
      steps: [
        ["Get the rule project", "Rule projects are created in Designer and exported to the My webMethods Server repository. Users with the right permissions can then change them in the browser.", "Designer → Export to My webMethods Server", ["mwsrules"]],
        ["Open and lock", "Open the decision table in the Business Rules user interface and lock it so nobody else edits it at the same time.", "My webMethods → Business Rules → decision entity", ["editor"]],
        ["Edit the table", "Change operators and values, reorder rules, or set an 'in effect' date so a new policy starts on a chosen day.", "Decision Entity Editor", ["editdt", "editor"]],
        ["Save and verify", "Save. Before deployment the rule project is verified for gaps, overlaps, missing rules and redundancies; fix any errors it reports.", "Hot Deployment Confirmation → Verify rule project", ["hotdeploy"]],
        ["Hot deploy", "Click Hot Deploy to push the whole rule project to Integration Server. The button is disabled while there are unsaved changes or errors. The process model itself does not change.", "Decision Entity Editor → Hot Deploy", ["hotdeploy", "hotabout"]]
      ],
      check: "The Hot Deployment Results dialog reports success, and the next process instance makes its decision with the new rule.",
      tip: "Before deploying, set up an administrator connection to Integration Server: Administration → My webMethods → System Settings → webMethods Business Rules Settings → Add Integration Server."
    },
    {
      id: "ops", role: "Operations", title: "Watch, fix and resubmit",
      who: "Support and operations teams who keep processes healthy.",
      steps: [
        ["Find instances", "Open Process Instances to see instances and their steps, and search by process, status or time.", "My webMethods → Monitoring → Business → Process Instances", ["monitor"]],
        ["Open a problem instance", "On the Process Instance Detail page you can Stop, Suspend or Resume. Suspend pauses any instance except those that are Completed, Failed, Failed (Escalated) or Stopped.", "Process Instance Detail", ["suspend"]],
        ["Resubmit after a fix", "Resubmit repairs and re-runs failed instances. If the failed step is resubmit-enabled, the instance resumes there. Otherwise it resumes at the nearest earlier step that is resubmit-enabled and has already run. If needed, edit the pipeline data first, then Resubmit.", "Process Step Detail → Resubmit", ["resubmit", "editpipe"]],
        ["Unblock a stuck task", "Use Task List Management to delegate or reassign a task when someone is away.", "Monitoring → Business → Tasks → Task List Management", ["delegateops"]],
        ["Check permissions", "Stop, suspend and resume, resubmit, and modify-and-resubmit are separate functional privileges. A My webMethods administrator grants them.", "Administration → System-Wide → Permissions Management", ["privs"]]
      ],
      check: "The instance returns to Running or Completed, and the control action (suspend, resume, resubmit, stop) appears in the instance's history.",
      tip: "Design service steps to be safe to run twice (idempotent) so resubmitting never duplicates a payment or an order."
    }
  ],

  beginner: [
    ["Start here", "start", "Ten minutes of hands-on steps: what a BPMS does and why agents need one."],
    ["Overview → IBM webMethods at a glance", "overview", "The family components you will hear about."],
    ["How to use", "howto", "Pick your role and follow the steps."],
    ["Simulator", "simulator", "Run a loan process and watch the audit log."],
    ["Quiz", "quiz", "Check what stuck."]
  ],

  demo: [
    ["Open on the problem", "start", "Start here → step 1, switch between Without and With a BPMS.", "Requests get lost, and nobody can explain a decision afterwards. A BPMS puts every request on rails and keeps the record.", "Why do we need a process platform at all?"],
    ["Show who owns what", "start", "Start here → step 2, sort two or three jobs.", "Process moves the work, rules decide, people handle exceptions, and agents read and propose.", "Where does AI fit without losing control?"],
    ["Make an agent safe", "start", "Start here → step 3, move the auto-approve limit and show the log.", "Change the policy and the outcome changes, with the rule version logged. That is what auditors and regulators ask for.", "Can we let an AI act on money or customers?"],
    ["Run a real process", "simulator", "Simulator → Start, Next, approve the underwriter task.", "Each step writes audit history: the same tables your reports and agent analysis will use.", "What does it look like when it runs?"],
    ["Prove the depth", "knowledge", "Knowledge base → Process Engine QoS, then Business Rules.", "Every setting is documented and cited, including what each one trades off.", "Is this mature enough for our critical processes?"],
    ["Show day-to-day use", "howto", "How to use → Business analyst.", "A business analyst changes a rule and hot-deploys it without a developer rebuilding the process.", "How fast can the business change a policy?"]
  ],

  glossary: [
    ["Accept (task)", "Taking ownership of a task in My webMethods; once accepted by one user, others cannot accept it."],
    ["Delegate", "Forward a task to another user; recorded in the task audit log."],
    ["Execution Enabled", "Setting in My webMethods that lets the Process Engine start instances of a process model version."],
    ["Build and upload", "Designer action that generates a process's runtime elements on Integration Server."],
    ["Resubmit", "Monitor action that re-runs a failed or completed process instance from a resubmit-enabled step."]
  ],

  quiz: [
    { q: "You built and uploaded a new process version but no instances start. What is the most likely reason?", a: ["Designer was in Business Analyst mode", "The version is not enabled for execution", "Universal Messaging is not installed", "The task inbox is full"], c: 1,
      e: "New uploads are not enabled by default. Enable the version in My webMethods (Execution Enabled) or set Designer to enable it after build." },
    { q: "A task is assigned to a group of five people. What happens?", a: ["Only the group owner sees it", "It appears in every member's inbox; the first to accept owns it", "It is split into five tasks", "It waits until all five accept"], c: 1,
      e: "Group and role tasks appear in each member's inbox; once one user accepts, others cannot." },
    { q: "When is the Hot Deploy button disabled in the Business Rules user interface?", a: ["On weekends", "When the decision entity has unsaved changes or errors", "When a process is running", "Never"], c: 1,
      e: "Save and fix errors first; verification also checks for gaps, overlaps, missing rules and redundancies." },
    { q: "A failed step is not resubmit-enabled. Where does a resubmitted instance restart?", a: ["From the very beginning", "At the nearest earlier resubmit-enabled step that already ran", "It cannot be resubmitted", "At the end"], c: 1,
      e: "Monitor resumes at the closest previously executed step that is resubmit-enabled." }
  ],

  sources: {
    inbox: ["About My Inbox (Task Engine)", "https://documentation.softwareag.com/webmethods/compendiums/v10-5/C_Run_BPs_and_CAs/runbpca-compendium/co-about_my_inbox.html"],
    accept: ["Accepting a task", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Run_BPs_and_CAs/runbpca-compendium/co-accepting_a_task.html"],
    actions: ["About task actions (Accept, Submit, Complete)", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Run_BPs_and_CAs/runbpca-compendium/co-about_task_actions.html"],
    delegate: ["Delegating tasks", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Run_BPs_and_CAs/runbpca-compendium/co-delegating_tasks.html"],
    buildmode: ["About building and uploading a process (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.about.building.and.uploading.processes.html"],
    ruletask: ["Advanced rule task properties (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.advanced.rule.task.properties.html"],
    ruleactions: ["Rule actions and logging level", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-0/Dynamic_Business_Orchestrator/10-0_Dynamic_Business_Orchestrator_webhelp/dbo-onlinehelp/co-about_webm_business_rules_6.html"],
    qos: ["Quality of service settings", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-1/C_Run_BPs_and_CAs/runbpca-compendium/to-tuning_3.html"],
    build: ["About building and uploading processes (Designer 10.5)", "https://documentation.softwareag.com/webmethods/designer/sdf10-5/10-5_sdf-webhelp/sdf-webhelp/proc.about.building.and.uploading.processes.html"],
    enable: ["Enabling and disabling process model versions (Monitor)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-3/10-3_Monitor_webhelp/monitor-webhelp/to-process_models_24.html"],
    buildprefs: ["Build and upload preferences (Designer 10.5)", "https://documentation.softwareag.com/webmethods/designer/sdf10-5/10-5_sdf-webhelp/sdf-webhelp/proc.configuring.build.and.upload.preferences.html"],
    monitor: ["Monitoring tasks in My webMethods (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-concepts_13.html"],
    mwsrules: ["Working with Business Rules in My webMethods: about this guide", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-1/C_Design_and_Implement_BPMs/desimplbpm-compendium/to-about_this_guide_2.html"],
    editor: ["Decision Entity Editor buttons (lock, in effect, hot deploy)", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Digital_Event_Comm/intsagdes-compendium/co-metaphor_editor_pane.html"],
    editdt: ["Modifying a decision table in My webMethods", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Digital_Event_Comm/intsagdes-compendium/co-edit_dt.html"],
    hotdeploy: ["Hot deploying a rule project", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Digital_Event_Comm/intsagdes-compendium/ta-hot_deploy_decent.html"],
    hotabout: ["Hot deploying rule projects to Integration Server", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Digital_Event_Comm/intsagdes-compendium/co-about_hot_deployment.html"],
    suspend: ["Stopping, suspending or resuming a process instance (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-processes_23.html"],
    resubmit: ["About resubmitting process instances and steps (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-processes_25.html"],
    editpipe: ["Resubmitting from a step and editing pipeline data (Monitor 10.7)", "https://documentation.softwareag.com/webmethods/monitor/wmn10-7/10-7_Monitor_webhelp/wmn-webhelp/to-processes_29.html"],
    delegateops: ["Delegating a task from one user to another", "https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Run_BPs_and_CAs/runbpca-compendium/ta-delegating_a_task_from_one_user_to_another.html"],
    privs: ["Granting users the ability to perform Monitor actions", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-1/C_Monitoring_Services/monservice-compendium/to-setup_13.html"]
  }
};

// Merge glossary, quiz and sources into the main course.
(function () {
  const A = window.ACADEMY, H = window.HOWTO;
  if (!A || !H) return;
  const terms = new Set(A.glossary.map((g) => g[0].toLowerCase()));
  H.glossary.forEach((g) => { if (!terms.has(g[0].toLowerCase())) A.glossary.push(g); });
  A.glossary.sort((a, b) => a[0].localeCompare(b[0]));
  A.quiz.push(...H.quiz);
  const have = new Set(A.sources.map((s) => s[1]));
  Object.values(H.sources).forEach((s) => { if (!have.has(s[1])) { A.sources.push(s); have.add(s[1]); } });
})();
