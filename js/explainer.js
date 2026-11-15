// "Start here" explainer: interactive story built from public facts plus the
// author's own frameworks. Opinions are labelled; no employer data is used.
window.EXPLAINER = {
  sort: [
    { item: "Route a purchase request to the right approver", owner: "process", why: "Moving work between systems and people in order is orchestration." },
    { item: "Decide whether a $4,800 request needs director approval", owner: "rules", why: "A threshold that changes every budget cycle belongs in a rule, not in the diagram." },
    { item: "Read a 12-page damage report and summarise the claim", owner: "agent", why: "Reading unstructured documents and drafting is where agents shine." },
    { item: "Approve an unusual refund for a long-standing customer", owner: "people", why: "Rare, high-judgment cases stay with a person." },
    { item: "Escalate a task that has waited more than 48 hours", owner: "process", why: "Timers and escalation are built into the process engine." },
    { item: "Apply credit-score cut-offs to a loan application", owner: "rules", why: "Regulated decisions must be repeatable and explainable." },
    { item: "Propose which carrier credit to offer after a delay", owner: "agent", why: "An agent can propose; a rule or person still decides." },
    { item: "Sign off a decision the rules referred", owner: "people", why: "Referrals are designed to reach a human." }
  ],
  owners: { process: "Process", rules: "Rules", agent: "Agent", people: "People" },

  guardCases: [
    { id: "A", desc: "Delay 6 h · standard customer", delay: 6, amount: 120, tier: "standard" },
    { id: "B", desc: "Delay 30 h · standard customer", delay: 30, amount: 450, tier: "standard" },
    { id: "C", desc: "Delay 72 h · key account", delay: 72, amount: 1800, tier: "key" },
    { id: "D", desc: "Delay 2 h · key account", delay: 2, amount: 90, tier: "key" },
    { id: "E", desc: "Delay 50 h · standard customer", delay: 50, amount: 2600, tier: "standard" }
  ],

  timeline: [
    ["Oct 2022", "webMethods 10.15 released", "The long-term release many on-premises estates still run."],
    ["2024", "IBM acquires webMethods from Software AG", "webMethods BPMS becomes part of IBM's automation portfolio next to ODM and Business Automation Workflow."],
    ["2026", "webMethods 12.1 available", "The upgrade target for 10.15 customers."],
    ["Sep 2026", "Gartner publishes the 2026 BOAT Magic Quadrant", "Process orchestration, connectivity and AI agents are evaluated as one category."],
    ["Oct 2027", "10.15 end of maintenance", "Customers must upgrade or re-evaluate — the moment competitors target."],
    ["2 Dec 2027", "EU AI Act Annex III obligations apply", "High-risk uses such as credit scoring need logging and human oversight."],
    ["Oct 2028", "10.15 end of support", "Last date for standard support."]
  ],

  ideas: [
    { name: "Mine the process history", text: "Years of execution logs show where people rubber-stamp, wait or repeat the same decision. Turn that into a ranked list of rule and agent candidates — evidence instead of interviews. Try it in the Agent Scan Lab." },
    { name: "BPMS as the human-approval inbox for agents", text: "Agents from any platform send 'needs a human' steps to BPMS task lists, reusing assignment, escalation and audit. The oldest BPMS feature becomes the scarcest thing in the agent era." },
    { name: "A flight recorder for decisions", text: "Log rule version, inputs, outcome and approver for every agent-relevant decision. As insurers and regulators ask for evidence of control, the log itself becomes a reason to buy." },
    { name: "Build where the installed base already is", text: "Growth headlines point to insurance and banking, but a mature BPMS may be strongest elsewhere — logistics exceptions, public-sector casework. Package patterns for the industries you already serve." },
    { name: "Turn maintenance into AI credits", text: "Customers who upgrade and renew earn credits toward agents and decision services. The renewal funds adoption, and adoption makes the platform harder to replace." }
  ],

  marketView: [
    ["What analysts measure", "A broad 'BPM market' of roughly $17–26B (2025), mixing suites, low-code, services and document tools."],
    ["Where new money goes", "Consolidated orchestration platforms that govern AI agents, bought by regulated, process-heavy organisations."],
    ["Where a mature on-prem BPMS actually competes", "Inside its own installed base and the integration estates around it. Upgrade deadlines — not market reports — decide whether customers stay."],
    ["What follows", "Defend the base at the upgrade moment, add agent governance as the reason to stay, and grow into integration customers who don't yet use BPMS."]
  ]
};
