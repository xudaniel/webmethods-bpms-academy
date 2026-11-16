// Interactive decision lab: decision table, pitfalls, agility comparison
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- 1. Interactive Decision Table ----------
  function initDecisionTable() {
    const container = $("decision-table-lab");
    if (!container) return;
    container.innerHTML = `
      <h3>Interactive Decision Table</h3>
      <p>Change the thresholds and test an application. This is what a Rule Task evaluates.</p>
      <div class="row">
        <label>Approve if score ≥ <input type="number" id="dt-score-min" value="720" min="300" max="850" style="width:70px"></label>
        <label>and loan/income ≤ <input type="number" id="dt-dti-max" value="35" min="10" max="80" style="width:60px">%</label>
        <label>Decline if score < <input type="number" id="dt-score-decline" value="580" min="300" max="850" style="width:70px"></label>
      </div>
      <div class="row">
        <label>Test score <input type="number" id="dt-test-score" value="690" min="300" max="850" style="width:70px"></label>
        <label>Loan <input type="number" id="dt-test-loan" value="40000" step="1000" style="width:90px"></label>
        <label>Income <input type="number" id="dt-test-income" value="90000" step="1000" style="width:90px"></label>
        <button class="btn" id="dt-run">Evaluate</button>
      </div>
      <div id="dt-result" class="detail" style="display:none"></div>
      <p class="sources">This mirrors a simple decision table. In production the same logic lives in a rule project that is hot deployed to Integration Server without touching the process. Source: <a href="https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Digital_Event_Comm/intsagdes-compendium/co-about_hot_deployment.html" target="_blank" rel="noopener">About hot deployment</a>.</p>
    `;
    $("dt-run").addEventListener("click", () => {
      const scoreMin = +$("dt-score-min").value;
      const dtiMax = +$("dt-dti-max").value / 100;
      const scoreDecline = +$("dt-score-decline").value;
      const score = +$("dt-test-score").value;
      const loan = +$("dt-test-loan").value;
      const income = +$("dt-test-income").value;
      const dti = loan / Math.max(income, 1);
      let outcome, reason;
      if (score < scoreDecline) { outcome = "DECLINE"; reason = `Score ${score} < ${scoreDecline}`; }
      else if (score >= scoreMin && dti <= dtiMax) { outcome = "APPROVE"; reason = `Score ${score} ≥ ${scoreMin} and DTI ${(dti*100).toFixed(0)}% ≤ ${dtiMax*100}%`; }
      else { outcome = "REFER"; reason = `Score ${score}, DTI ${(dti*100).toFixed(0)}% — needs underwriter`; }
      const el = $("dt-result");
      el.style.display = "block";
      el.innerHTML = `<strong>${outcome}</strong><br>${esc(reason)}`;
      el.style.borderLeftColor = outcome === "APPROVE" ? "#24a148" : outcome === "DECLINE" ? "#da1e28" : "#f1c21b";
    });
  }

  // ---------- 2. Rules Configuration Pitfalls ----------
  function initPitfalls() {
    const container = $("rules-pitfalls");
    if (!container) return;
    // Each pitfall cites a public IBM / Software AG source; the last one is labelled as the author's view.
    const D = "https://documentation.softwareag.com/webmethods/";
    const pitfalls = [
      ["A manual decision (task action) is ignored or fails", "The decision table must be Process Aware, TaskData must be mapped, and the task's inputs and outputs must match the table's.",
        "About decision tables (Designer 10.7)", D + "designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.about.decision.tables.html"],
      ["Odd runtime errors after editing the mapping", "ProcessData holds runtime data: never overwrite or drop it, and map it outbound only.",
        "About decision tables (Designer 10.15)", D + "designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.about.decision.tables.html"],
      ["An event rule never fires", "A rule task that uses an event rule needs a JMS trigger on the corresponding Integration Server.",
        "Advanced rule task properties (Designer 10.7)", D + "designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.advanced.rule.task.properties.html"],
      ["A rule action does nothing in the process", "Set the process's Minimum Logging Level to 5 (Process and all steps); Designer needs it to work out what the rule action requires.",
        "About rule actions (Designer 10.7)", D + "designer/sdf10-7/10-7_sdf-webhelp/sdf-webhelp/proc.about.rule.actions.html"],
      ["Rules run on the wrong server", "By default rules run on the Integration Server where the Process Engine is installed. For a remote one, create a remote server alias named businessrulesruntime in Integration Server Administrator.",
        "Configuring a remote Integration Server (Designer 10.15)", D + "designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/to-proc-rules_2.html"],
      ["Hot Deploy cannot reach a server", "Configure each Integration Server connection first: Administration > My webMethods > System Settings > webMethods Business Rules Settings (host, port, user, password). For SSL, every target must use SSL on its primary port.",
        "Configuring an Integration Server connection (10.5)", D + "compendiums/v10-5/C_Digital_Event_Comm/intsagdes-compendium/ta-configure_master_is.html"],
      ["The process expects an older rule signature", "Author's view: version rule projects together with the processes that call them, and test them together.", "", ""]
    ];
    container.innerHTML = `
      <h3>Rules configuration pitfalls</h3>
      <div class="table-wrap"><table>
        <tr><th>Symptom</th><th>Cause and fix</th><th>Source</th></tr>
        ${pitfalls.map(([s, f, t, u]) => `<tr><td><strong>${esc(s)}</strong></td><td>${esc(f)}</td><td>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>` : `<span class="pill">Author's view</span>`}</td></tr>`).join("")}
      </table></div>
    `;
  }

  // ---------- 3. Decision Agility Comparison ----------
  function initAgility() {
    const container = $("agility-compare");
    if (!container) return;
    container.innerHTML = `
      <h3>Decision Agility: Rules vs Hard-coded</h3>
      <p>Change a discount threshold. See how long each approach takes.</p>
      <div class="row">
        <label>New threshold: $<input type="number" id="ag-threshold" value="500" step="50" style="width:80px"></label>
        <button class="btn" id="ag-run">Apply change</button>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:1rem;margin-top:.8rem">
        <div class="card" style="margin:0">
          <strong>Hard-coded in process / gateway</strong>
          <p id="ag-hard" class="lead">Edit the gateway condition in Designer, build and upload a new version, then enable it for execution.</p>
          <p><span class="pill red">Days to weeks</span> <span class="pill">Author's view</span></p>
        </div>
        <div class="card" style="margin:0">
          <strong>Decision table + Hot Deploy</strong>
          <p id="ag-rules" class="lead">Edit the rule, Hot Deploy the rule project. Process model unchanged.</p>
          <p><span class="pill green">Minutes</span> <span class="pill">Author's view</span></p>
        </div>
      </div>
      <div id="ag-log" class="log" style="margin-top:.8rem;min-height:60px">Click Apply to simulate.</div>
    `;
    $("ag-run").addEventListener("click", () => {
      const t = $("ag-threshold").value;
      const log = $("ag-log");
      log.textContent = `Threshold changed to $${t}\n`;
      log.textContent += `Hard-coded: open Designer → edit gateway condition → build and upload a new version → enable it for execution (days to weeks with testing and approval)\n`;
      log.textContent += `Rules: edit decision table row → Hot Deploy rule project → live (minutes)\n`;
      log.textContent += `Process model version: unchanged`;
    });
  }

  // Init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { initDecisionTable(); initPitfalls(); initAgility(); });
  } else {
    initDecisionTable(); initPitfalls(); initAgility();
  }
})();
