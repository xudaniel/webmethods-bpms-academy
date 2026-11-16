// Hands-on lab: your first IBM webMethods BPMS process in about 30 minutes.
// Steps follow public Software AG / IBM documentation; menu labels can differ by version.
window.LAB = {
  title: "Your first process in 30 minutes",
  scenario: "Build a small purchase-approval process. A request arrives, an approver accepts it or rejects it in My webMethods, and you follow the instance in Monitor.",
  flow: ["Request received (message start event)", "Approve request (user task)", "Approved? (exclusive gateway)", "Approved / Rejected (end events)"],
  prereqs: [
    "Software AG Designer with webMethods BPM process development",
    "An Integration Server with the Process Engine, and My webMethods Server with the Task Engine (a development environment, never production)",
    "A publishable Integration Server document type for the request, for example PurchaseRequest with id, amount and requester",
    "A My webMethods user or role to act as the approver"
  ],
  stages: [
    { id: "create", t: "Create the project and the process", min: 3,
      steps: [
        ["Create a process project.", "Designer → File → New → Process Project"],
        ["Create a process named PurchaseApproval inside it. Avoid names that start with 'wm' and trailing spaces.", "Designer → File → New → Process"]
      ],
      check: "The new process opens on an empty canvas, and the project appears in the Solutions view (refresh the view if it is missing).",
      src: ["newproject", "newprocess"] },
    { id: "start", t: "Start the process with a document", min: 4,
      steps: [
        ["Add a message start event. Set Receive Protocol to Subscription (for publishable documents).", "Start event → Properties → Implementation"],
        ["Set Receive Document to your PurchaseRequest document type. Dragging the document type onto the step fills this in for you.", "Start event → Receive Document"]
      ],
      check: "The start event shows PurchaseRequest as its receive document.",
      src: ["startmsg", "subtrig"] },
    { id: "task", t: "Add the approval task", min: 6,
      steps: [
        ["Add an activity and change its label to 'Approve request'. The label becomes the task type name, so make it unique.", "Canvas → Activity → Properties → Label"],
        ["Implement it as a user task.", "Right-click the step → Create Implementation → New Task"],
        ["Assign the task to your approver user or role, and add a decision field (APPROVE or REJECT) to the task's business data.", "Task editor → assignments and business data"]
      ],
      check: "The step shows a user-task icon, and the task type appears in the Solutions view.",
      src: ["taskfromstep", "taskoverview"] },
    { id: "route", t: "Route on the decision", min: 4,
      steps: [
        ["Add an exclusive gateway after the task, then two end events: Approved and Rejected.", "Canvas → Gateway, End event"],
        ["Put a condition on each outgoing transition that tests the task's decision field.", "Transition → Properties → Condition"]
      ],
      check: "Every path from the start event reaches an end event.",
      src: ["build"] },
    { id: "build", t: "Build, upload and enable", min: 5,
      steps: [
        ["Switch to Process Developer mode, then build and upload the process for execution.", "Designer → Build and Upload"],
        ["Deploy the task type to the Task Engine when Designer prompts you. Prompt is the default preference.", "Window → Preferences → Software AG → Process Development → Build and Upload"],
        ["Enable the new version for execution. New uploads are not enabled by default.", "My webMethods → Administration → Business → Business Processes → Execution Enabled → Save"]
      ],
      check: "The Build Report shows no errors, and the version shows Execution Enabled.",
      src: ["buildmode", "build", "buildprefs10", "enable"] },
    { id: "run", t: "Start an instance", min: 3,
      steps: [
        ["Publish a PurchaseRequest document, for example from a small test flow service. Its subscription trigger starts a new process instance.", "Integration Server → publish the document"]
      ],
      check: "Within seconds, the approver's My Inbox shows an 'Approve request' task.",
      src: ["subtrig", "inbox"] },
    { id: "work", t: "Work the task as the approver", min: 3,
      steps: [
        ["Log in as the approver, open the task and Accept it.", "My webMethods → My Inbox → task → Accept"],
        ["Set the decision to APPROVE and click Complete. The process takes the task results and continues.", "Task → Complete"]
      ],
      check: "The task disappears from the open inbox and shows Completed.",
      src: ["accept", "actions", "tasktypes"] },
    { id: "watch", t: "Follow the instance in Monitor", min: 2,
      steps: [
        ["Find your instance and open its details. Check the status of each step.", "My webMethods → Monitoring → Business → Process Instances"]
      ],
      check: "The instance is Completed, and the path went through Approve request to Approved.",
      src: ["monitor"] }
  ],
  pitfalls: [
    ["The process never starts", "The version is not enabled for execution, or the published document is not the start event's receive document.", ["enable", "subtrig"]],
    ["No task in the approver's inbox", "The task type was not deployed, or it is assigned to a different user or role.", ["buildprefs10", "taskoverview"]],
    ["Two tasks with the same name", "Steps left with the default label create duplicate task type names; give each step a unique label.", ["tasknames"]],
    ["The instance is not visible in Monitor", "The logging level is too low or volatile tracking is on (see Knowledge base → Process Engine).", ["qos"]],
    ["A step failed", "Fix the cause, then resubmit from Monitor (see How to use → Operations).", ["resubmit"]]
  ],
  practice: [
    ["Simulator", "simulator", "Run the loan process: it follows the same pattern of start, rule, human task, gateway and end, and writes an audit log."],
    ["How to use", "howto", "Read the Business user and Process developer guides for the day-to-day version of each stage."]
  ],
  levelup: "Next, replace the approver's judgement for small amounts with a decision table: auto-approve under a limit and refer anything larger. Then change the limit with Hot Deploy (How to use → Business analyst) without rebuilding the process.",

  glossary: [
    ["Process project", "Designer container for one or more processes and their assets; a process must belong to one."],
    ["Message start event", "Start step that starts a new process instance when its receive document arrives."],
    ["Subscription trigger", "Generated trigger that starts a new process instance, or joins a running one, from a received document."]
  ],
  quiz: [
    { q: "You add an activity and implement it as a new task without renaming it. What is the problem?", a: ["Nothing", "The task type is named after the default label, so duplicate task names are easy to create", "The task cannot be deployed", "The process will not build"], c: 1,
      e: "Designer uses the step label as the task type name; give each user task step a unique label first." },
    { q: "Which step can start a new process instance when a published document arrives?", a: ["An intermediate message event", "A message start event with a receive document", "An exclusive gateway", "An end event"], c: 1,
      e: "Message start events (and receive tasks allowed to start instances) start new instances; intermediate events join running ones." }
  ],

  sources: {
    newproject: ["Creating process projects (Designer 10.15)", "https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.creating.process.projects.html"],
    newprocess: ["Creating a process (webMethods 10.2)", "https://documentation.softwareag.com/webmethods/wmsuites/wmsuite10-2/C_Dyn_Apps_Platform/dynapplat-compendium/proc.creating.a.process.html"],
    startmsg: ["Advanced message start event properties (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.advanced.start.message.event.properties.html"],
    subtrig: ["About subscription triggers (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.subscription.triggers.html"],
    taskfromstep: ["Creating a new task from a task step in a process (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/te_create_task_process.html"],
    taskoverview: ["Task overview: task types and assignment", "https://documentation.softwareag.com/webmethods/compendiums/v10-5/C_Run_BPs_and_CAs/runbpca-compendium/co-task_overview.html"],
    tasknames: ["About task names and task type IDs (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/te_about_task_names.html"],
    tasktypes: ["About tasks and task types", "https://documentation.softwareag.com/webmethods/compendiums/v10-5/C_Run_BPs_and_CAs/runbpca-compendium/co-about_tasks_and_task_types.html"],
    buildprefs10: ["Build and upload preferences, incl. deploy task to Task Engine (Designer 10.7)", "https://documentation.softwareag.com/webmethods/designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.configuring.build.and.upload.preferences.html"]
  }
};

// 中文 (#68): lab text; the "where" menu paths stay in English to match the product
(function () {
  const Z = window.LANG === "zh" && window.ZH && window.ZH.lab, L = window.LAB;
  if (!Z) return;
  ["title", "scenario", "flow", "prereqs", "practice", "levelup"].forEach((k) => { L[k] = Z[k]; });
  L.stages.forEach((st) => {
    const z = Z.stages[st.id]; if (!z) return;
    st.t = z.t; st.check = z.check; st.steps.forEach((s, i) => { if (z.steps[i]) s[0] = z.steps[i]; });
  });
  L.pitfalls.forEach((p, i) => { const z = Z.pitfalls[i]; if (z) { p[0] = z[0]; p[1] = z[1]; } });
})();

// Merge glossary, quiz and sources into the main course.
(function () {
  const A = window.ACADEMY, L = window.LAB;
  if (!A || !L) return;
  const terms = new Set(A.glossary.map((g) => g[0].toLowerCase()));
  L.glossary.forEach((g) => { if (!terms.has(g[0].toLowerCase())) A.glossary.push(g); });
  A.glossary.sort((a, b) => a[0].localeCompare(b[0]));
  A.quiz.push(...L.quiz);
  const have = new Set(A.sources.map((s) => s[1]));
  Object.values(L.sources).forEach((s) => { if (!have.has(s[1])) { A.sources.push(s); have.add(s[1]); } });
})();
