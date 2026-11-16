// Interactive decision lab: decision table, pitfalls, agility comparison
(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // 中文 (#68): Z holds the Chinese text; U(en, key) picks it when the page is in Chinese
  const Z = window.LANG === "zh" && window.ZH && window.ZH.decisions;
  const U = (en, k) => (Z && Z[k] != null ? Z[k] : en);

  // ---------- 1. Interactive Decision Table ----------
  function initDecisionTable() {
    const container = $("decision-table-lab");
    if (!container) return;
    container.innerHTML = `
      <h3>${U("Interactive Decision Table", "dtH")}</h3>
      <p>${U("Change the thresholds and test an application. This is what a Rule Task evaluates.", "dtP")}</p>
      <div class="row">
        <label>${U("Approve if score ≥", "approveIf")} <input type="number" id="dt-score-min" value="720" min="300" max="850" style="width:70px"></label>
        <label>${U("and loan/income ≤", "andDti")} <input type="number" id="dt-dti-max" value="35" min="10" max="80" style="width:60px">%</label>
        <label>${U("Decline if score <", "declineIf")} <input type="number" id="dt-score-decline" value="580" min="300" max="850" style="width:70px"></label>
      </div>
      <div class="row">
        <label>${U("Test score", "testScore")} <input type="number" id="dt-test-score" value="690" min="300" max="850" style="width:70px"></label>
        <label>${U("Loan", "loan")} <input type="number" id="dt-test-loan" value="40000" step="1000" style="width:90px"></label>
        <label>${U("Income", "income")} <input type="number" id="dt-test-income" value="90000" step="1000" style="width:90px"></label>
        <button class="btn" id="dt-run">${U("Evaluate", "run")}</button>
      </div>
      <div id="dt-result" class="detail" style="display:none"></div>
      <p class="sources">${U(`This mirrors a simple decision table. In production the same logic lives in a rule project that is hot deployed to Integration Server without touching the process. Source: <a href="https://documentation.softwareag.com/webmethods/compendiums/v10-3/C_Digital_Event_Comm/intsagdes-compendium/co-about_hot_deployment.html" target="_blank" rel="noopener">About hot deployment</a>.`, "dtSrc")}</p>
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
      const pctDti = (dti * 100).toFixed(0);
      if (score < scoreDecline) { outcome = "DECLINE"; reason = Z ? Z.rDecline(score, scoreDecline) : `Score ${score} < ${scoreDecline}`; }
      else if (score >= scoreMin && dti <= dtiMax) { outcome = "APPROVE"; reason = Z ? Z.rApprove(score, scoreMin, pctDti, dtiMax * 100) : `Score ${score} ≥ ${scoreMin} and DTI ${pctDti}% ≤ ${dtiMax*100}%`; }
      else { outcome = "REFER"; reason = Z ? Z.rRefer(score, pctDti) : `Score ${score}, DTI ${pctDti}% — needs underwriter`; }
      const el = $("dt-result");
      el.style.display = "block";
      el.innerHTML = `<strong>${Z ? Z.out[outcome] : outcome}</strong><br>${esc(reason)}`;
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
    if (Z) pitfalls.forEach((p, i) => { p[0] = Z.pitfalls[i][0]; p[1] = Z.pitfalls[i][1]; });
    container.innerHTML = `
      <h3>${U("Rules configuration pitfalls", "pitH")}</h3>
      <div class="table-wrap"><table>
        <tr><th>${U("Symptom", "sym")}</th><th>${U("Cause and fix", "cause")}</th><th>${U("Source", "src")}</th></tr>
        ${pitfalls.map(([s, f, t, u]) => `<tr><td><strong>${esc(s)}</strong></td><td>${esc(f)}</td><td>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>` : `<span class="pill">${U("Author's view", "author")}</span>`}</td></tr>`).join("")}
      </table></div>
    `;
  }

  // ---------- 3. Decision Agility Comparison ----------
  function initAgility() {
    const container = $("agility-compare");
    if (!container) return;
    container.innerHTML = `
      <h3>${U("Decision Agility: Rules vs Hard-coded", "agH")}</h3>
      <p>${U("Change a discount threshold. See how long each approach takes.", "agP")}</p>
      <div class="row">
        <label>${U("New threshold: $", "newT")}<input type="number" id="ag-threshold" value="500" step="50" style="width:80px"></label>
        <button class="btn" id="ag-run">${U("Apply change", "apply")}</button>
      </div>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:1rem;margin-top:.8rem">
        <div class="card" style="margin:0">
          <strong>${U("Hard-coded in process / gateway", "hard")}</strong>
          <p id="ag-hard" class="lead">${U("Edit the gateway condition in Designer, build and upload a new version, then enable it for execution.", "hardP")}</p>
          <p><span class="pill red">${U("Days to weeks", "days")}</span> <span class="pill">${U("Author's view", "author")}</span></p>
        </div>
        <div class="card" style="margin:0">
          <strong>${U("Decision table + Hot Deploy", "rules")}</strong>
          <p id="ag-rules" class="lead">${U("Edit the rule, Hot Deploy the rule project. Process model unchanged.", "rulesP")}</p>
          <p><span class="pill green">${U("Minutes", "mins")}</span> <span class="pill">${U("Author's view", "author")}</span></p>
        </div>
      </div>
      <div id="ag-log" class="log" style="margin-top:.8rem;min-height:60px">${U("Click Apply to simulate.", "click")}</div>
    `;
    $("ag-run").addEventListener("click", () => {
      const t = $("ag-threshold").value;
      const log = $("ag-log");
      if (Z) { log.textContent = Z.log(t); return; }
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
