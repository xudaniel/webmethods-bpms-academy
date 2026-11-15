// Troubleshooting, role cheat sheets with self-checks, and the instructor kit.
// Facts follow public Software AG / IBM documentation; labels can differ by version.
window.SUPPORT = {
  areas: ["Start and deploy", "Tasks", "Rules", "Monitor and operations"],

  trouble: [
    { area: "Start and deploy", s: "The process was built and uploaded, but no instance ever starts.",
      check: ["Is the version enabled for execution? New uploads are not enabled by default, and only one version of a model can be enabled at a time.", "Is the published document the start event's receive document?"],
      fix: "Enable the version, or set Designer to enable it after every build. Then publish the correct start document.",
      where: "My webMethods → Administration → Business → Business Processes → Execution Enabled", src: ["enable", "buildprefs", "subtrig"] },
    { area: "Start and deploy", s: "I can't find Build and Upload in Designer.",
      check: ["Building and uploading for execution is only available in Process Developer mode."],
      fix: "Switch to Process Developer mode and try again.", where: "Designer → Process Development", src: ["buildmode"] },
    { area: "Start and deploy", s: "I uploaded a new version, but running instances still use the old one.",
      check: ["Enabling a new version disables the previously enabled one. New instances use the new version; running instances keep theirs unless you upgrade them."],
      fix: "When you enable the new version, choose to upgrade the running instances if that is safe for your process.", where: "Business Processes → Execution Enabled", src: ["enable", "upgrade"] },
    { area: "Start and deploy", s: "Strange naming errors or duplicate task names after implementing tasks.",
      check: ["Process names should not start with 'wm' and should not end in spaces.", "A user task step's label becomes its task type name, so default labels create duplicates."],
      fix: "Rename the process and give every user task step a unique label before implementing it.", where: "Designer → step → Properties → Label", src: ["newprocess", "tasknames"] },
    { area: "Tasks", s: "\"You cannot accept this task.\"",
      check: ["Someone else has probably accepted it already. By default only one user can accept a task."],
      fix: "Open the task's Details View to see who accepted it, and ask them to release it if it should be yours.", where: "Task → Details View", src: ["accept"] },
    { area: "Tasks", s: "I delegated a task, but my colleague can't work on it.",
      check: ["Delegation does not change acceptance: if you had accepted it, it is still yours.", "The colleague needs access and functional privileges for that task type."],
      fix: "Release the task so the colleague can accept it, and ask an administrator to check task access permissions.", where: "Task → Data View → Release", src: ["release", "delegateops"] },
    { area: "Tasks", s: "The task is not in the expected person's inbox.",
      check: ["Check whom it is assigned to: a user, a group or a role. Group and role tasks appear in every member's inbox.", "Was the task type deployed with the process?"],
      fix: "Correct the assignment, or deploy the task type and rebuild.", where: "Task editor → assignments; Build and Upload", src: ["accept", "taskoverview", "buildprefs10"] },
    { area: "Tasks", s: "Task history is missing from the Process Audit tables.",
      check: ["In 10.15, writing task status to Process Audit is disabled by default."],
      fix: "Read task history from the Task Engine audit (getTaskAudit) or the task archive, or switch task logging on.", where: "Task Engine audit / archive", src: ["tasklog", "taskaudit"] },
    { area: "Rules", s: "The Hot Deploy button is greyed out.",
      check: ["Hot Deploy is disabled while the decision entity has unsaved changes or errors."],
      fix: "Save, run verification, and fix the errors it lists, then deploy.", where: "Decision Entity Editor → Hot Deploy", src: ["hotdeploy"] },
    { area: "Rules", s: "Hot Deploy has no Integration Server to deploy to.",
      check: ["An administrator must first configure the Integration Server connection in My webMethods."],
      fix: "Add the Integration Server under webMethods Business Rules Settings (one server per cluster is enough).", where: "Administration → My webMethods → System Settings → webMethods Business Rules Settings", src: ["configis"] },
    { area: "Rules", s: "An event rule in a rule task never fires.",
      check: ["Event rules in a rule task need a JMS trigger on the corresponding Integration Server."],
      fix: "Create or enable the JMS trigger on that server.", where: "Integration Server → JMS triggers", src: ["ruletaskcfg"] },
    { area: "Rules", s: "A process that uses a rule action does not behave as designed.",
      check: ["Processes with rule actions need the logging level '5 - Process and all steps'.", "Decision tables with a manual decision must be process-aware."],
      fix: "Raise the logging level, and recreate the table as Process Aware if it starts a task.", where: "Process properties; decision table settings", src: ["ruleactions", "dtaware"] },
    { area: "Monitor and operations", s: "I can't see an instance, or its step details, in Monitor.",
      check: ["Volatile tracking keeps status in memory only, so the instance is not visible in Monitor.", "The logging level may be too low."],
      fix: "Turn volatile tracking off and raise the logging level for processes you need to watch, then rebuild.", where: "Process properties → quality of service and logging", src: ["qos"] },
    { area: "Monitor and operations", s: "The Suspend, Resubmit or Stop buttons are missing.",
      check: ["Stop/suspend/resume, resubmit, and modify-and-resubmit are separate functional privileges."],
      fix: "Ask a My webMethods administrator to grant them.", where: "Administration → System-Wide → Permissions Management", src: ["privs"] },
    { area: "Monitor and operations", s: "Suspend is not available for an instance.",
      check: ["Instances that are Completed, Failed, Failed (Escalated) or Stopped cannot be suspended."],
      fix: "For a failed instance, fix the cause and resubmit instead.", where: "Process Instance Detail", src: ["suspend", "resubmit"] },
    { area: "Monitor and operations", s: "Resubmit restarted at a different step than I expected.",
      check: ["If the failed step is not resubmit-enabled, the instance resumes at the closest earlier resubmit-enabled step that already ran.", "'Resubmit Earliest' does nothing if no step is resubmit-enabled."],
      fix: "Mark idempotent steps as resubmit-enabled at design time, and resubmit from the right step.", where: "Process Step Detail → Resubmit", src: ["resubmit"] }
  ],

  cheats: [
    { id: "user", role: "Business user",
      actions: [["See my work", "My webMethods → My Inbox"], ["Take a task", "Task → Accept"], ["Save without finishing", "Task → Submit"], ["Finish", "Task → Complete"], ["Hand over", "My Inbox → Delegate (release it first if you accepted it)"]],
      rules: ["Accept before you work, so nobody duplicates it.", "Record the outcome in the task's fields, not in comments.", "If you delegate an accepted task, release it."],
      check: [
        { q: "A task assigned to your group: who sees it?", a: ["Only the group owner", "Every member, until someone accepts it", "Nobody until it is assigned"], c: 1, e: "Group and role tasks appear in every member's inbox; once accepted by one user, others cannot accept it." },
        { q: "What does Submit do?", a: ["Completes the task", "Saves the data without completing", "Deletes the task"], c: 1, e: "Submit updates the task data but does not change its status; Complete marks it Completed." },
        { q: "You delegated a task you had accepted. Can your colleague accept it?", a: ["Yes, immediately", "Only after you release it", "Never"], c: 1, e: "Delegation does not change acceptance; release the task so the delegate can accept it." }
      ] },
    { id: "dev", role: "Process developer",
      actions: [["New process", "Designer → File → New → Process"], ["Make a user task", "Step → Create Implementation → New Task"], ["Start from a document", "Message start event → Receive Document"], ["Build", "Process Developer mode → Build and Upload"], ["Switch it on", "My webMethods → Administration → Business → Business Processes → Execution Enabled"]],
      rules: ["Label each user task step uniquely before implementing it.", "Thresholds go in rules, not gateway conditions.", "Enable the version after every upload."],
      check: [
        { q: "Where is Build and Upload available?", a: ["In any Designer mode", "Only in Process Developer mode", "Only in My webMethods"], c: 1, e: "Building and uploading for execution needs Process Developer mode." },
        { q: "How many versions of a process model can be enabled at once?", a: ["One", "Two", "Unlimited"], c: 0, e: "Enabling a new version disables the previously enabled one." },
        { q: "What becomes the task type name when you implement a new task from a step?", a: ["A random ID", "The step's label", "The process name"], c: 1, e: "Designer uses the step label, so give each step a unique label first." }
      ] },
    { id: "analyst", role: "Business analyst",
      actions: [["Find the rule", "My webMethods → Business Rules → decision entity"], ["Stop others editing", "Decision Entity Editor → Lock"], ["Schedule a policy", "Decision Entity Editor → In effect"], ["Check quality", "Verify rule project"], ["Go live", "Decision Entity Editor → Hot Deploy"]],
      rules: ["Lock before you edit, and unlock when you are done.", "Fix every verification error before deploying.", "Use an 'in effect' date for policy changes with a start date."],
      check: [
        { q: "Why is Hot Deploy greyed out?", a: ["It's a weekend", "Unsaved changes or errors", "A process is running"], c: 1, e: "Hot Deploy is disabled while the decision entity has unsaved changes or errors." },
        { q: "What does verification look for?", a: ["Spelling", "Gaps, overlaps, missing rules and redundancies", "Performance"], c: 1, e: "Verification checks the rule project for gaps, overlaps, missing rules and redundancies." },
        { q: "Does a rule change need the process to be rebuilt?", a: ["Yes, always", "No — hot deploy the rule project", "Only on Mondays"], c: 1, e: "Hot Deploy pushes the rule project to Integration Server; the process model stays the same." }
      ] },
    { id: "ops", role: "Operations",
      actions: [["Find instances", "My webMethods → Monitoring → Business → Process Instances"], ["Pause or stop", "Process Instance Detail → Suspend / Resume / Stop"], ["Re-run after a fix", "Process Step Detail → Resubmit"], ["Unblock a task", "Monitoring → Business → Tasks → Task List Management"], ["Get rights", "Administration → System-Wide → Permissions Management"]],
      rules: ["Fix the cause before you resubmit.", "Only resubmit steps that are safe to run twice.", "Every control action is recorded, so note why you did it."],
      check: [
        { q: "Which instance cannot be suspended?", a: ["Running", "Completed", "Waiting on a task"], c: 1, e: "Completed, Failed, Failed (Escalated) and Stopped instances cannot be suspended." },
        { q: "The failed step is not resubmit-enabled. Where does resubmit restart?", a: ["At the start", "At the closest earlier resubmit-enabled step that already ran", "Nowhere"], c: 1, e: "Monitor resumes at the closest previously executed resubmit-enabled step." },
        { q: "The Resubmit button is missing. Why?", a: ["Browser cache", "You lack the Resubmit functional privilege", "The process is too old"], c: 1, e: "Resubmit is a separate functional privilege granted by a My webMethods administrator." }
      ] }
  ],

  klass: {
    title: "Half-day workshop: from zero to your first running process",
    audience: "6–20 participants: new users, developers or a customer team. Each participant needs a laptop; lab participants also need a development environment.",
    agenda: [
      ["0:00", 20, "Why process platforms, and why now", "start", "Steps 1–3 together; vote in the 'who owns what' game."],
      ["0:20", 25, "IBM webMethods at a glance", "overview", "Walk through the family table, then the architecture."],
      ["0:45", 25, "How it really behaves", "knowledge", "Process Engine quality of service and Business Rules; ask 'what would you choose for your process?'"],
      ["1:10", 15, "Run a process together", "simulator", "Run the loan simulator on the projector; read the audit log aloud."],
      ["1:25", 10, "Break", "", ""],
      ["1:35", 60, "Hands-on lab", "lab", "Pairs follow the 8 stages; the trainer walks the room using the pitfalls table."],
      ["2:35", 15, "Everyday use by role", "howto", "Each pair picks a role guide and shares one tip."],
      ["2:50", 10, "Check and close", "quiz", "Role self-checks or the quiz; hand out cheat sheets."]
    ],
    print: ["Reading version → section 5 lab sheet (one per pair)", "One role cheat sheet per participant (How to use → cheat sheet → Print)", "Troubleshooting table for the trainer"],
    tips: [
      "Ask each team which process it actually runs, and use it as the example all morning.",
      "For customers, use the 10-minute demo script as the opening, and spend longer on the knowledge base than on the lab.",
      "No environment? Replace the lab with the simulator, plus a paper walk-through of the lab sheet.",
      "Say clearly that this is an independent course, not official IBM training."
    ]
  },

  sources: {
    release: ["Releasing a task", "https://documentation.softwareag.com/webmethods/compendiums/v10-4/C_Run_BPs_and_CAs/runbpca-compendium/ta-releasing_a_task.html"],
    configis: ["Configuring an Integration Server connection for Business Rules (10.7)", "https://documentation.softwareag.com/webmethods/compendiums/v10-7/C_Digital_Event_Comm/intsagdes-compendium/ta-configure_master_is.html"],
    ruletaskcfg: ["Configuring rule tasks (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.configuring.rule.tasks.html"],
    dtaware: ["About decision tables: process-aware for manual decisions (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.about.decision.tables.html"],
    tasklog: ["Task audit logging into Process Audit disabled by default (IBM 10.15 docs)", "https://www.ibm.com/docs/en/SSHZPA_10.15.0/te_users_guide/co-disable_enable_task_logging_in_processes.html"],
    taskaudit: ["Task Engine getTaskAudit", "https://documentation.softwareag.com/webmethods/task_engine/wtn10-7/10-7_Task_Engine_webhelp/task-engine-webhelp/te_web_taskaudit.html"],
    upgrade: ["Upgrading process model versions", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-1/C_Run_BPs_and_CAs/runbpca-compendium/to-runtime_items_13.html"]
  }
};

// Shared source lookup across how-to, lab and support content.
window.SUPPORT.src = function (k) {
  const S = window.SUPPORT, L = window.LAB || { sources: {} }, H = window.HOWTO || { sources: {} };
  return S.sources[k] || L.sources[k] || H.sources[k];
};

(function () {
  const A = window.ACADEMY, S = window.SUPPORT;
  if (!A || !S) return;
  const have = new Set(A.sources.map((s) => s[1]));
  Object.values(S.sources).forEach((s) => { if (!have.has(s[1])) { A.sources.push(s); have.add(s[1]); } });
})();
