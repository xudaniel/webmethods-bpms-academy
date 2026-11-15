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
      <p class="sources">This mirrors a simple decision table. In production the same logic lives in a Rule Project and is Hot Deployed without touching the process.</p>
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
    const pitfalls = [
      ["Process Aware not checked", "Decision table with a Task Action fails or ignores the task. Mark Process Aware and map TaskData / ProcessData (outbound only)."],
      ["Hot Deploy partial failure", "Some Integration Server nodes succeed, others fail. Check Rules Engine logs and engine pool; redeploy to the failed nodes."],
      ["Input/output mismatch", "Rule Task Inputs/Outputs do not match the decision table. Designer or runtime reports mapping errors. Align names and types exactly."],
      ["Event rule missing JMS trigger", "Event rule does not fire. Create the corresponding JMS trigger on the target Integration Server."],
      ["Rules and process version drift", "Process expects an old rule signature. Version rule projects with processes and test together."],
      ["Remote Rules Engine misconfigured", "Rule Task times out. In MWS → Rules Engine Configuration set the correct host, port, and credentials."],
    ];
    container.innerHTML = `
      <h3>Rules Configuration Pitfalls</h3>
      <div class="table-wrap"><table>
        <tr><th>Symptom</th><th>Likely cause & fix</th></tr>
        ${pitfalls.map(([s, f]) => `<tr><td><strong>${esc(s)}</strong></td><td>${esc(f)}</td></tr>`).join("")}
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
          <p id="ag-hard" class="lead">Change requires editing BPMN, rebuild, and redeploy of the process model.</p>
          <p><span class="pill red">Days to weeks</span></p>
        </div>
        <div class="card" style="margin:0">
          <strong>Decision table + Hot Deploy</strong>
          <p id="ag-rules" class="lead">Edit the rule, Hot Deploy the rule project. Process model unchanged.</p>
          <p><span class="pill green">Minutes</span></p>
        </div>
      </div>
      <div id="ag-log" class="log" style="margin-top:.8rem;min-height:60px">Click Apply to simulate.</div>
    `;
    $("ag-run").addEventListener("click", () => {
      const t = $("ag-threshold").value;
      const log = $("ag-log");
      log.textContent = `Threshold changed to $${t}\n`;
      log.textContent += `Hard-coded: open Designer → edit gateway condition → rebuild process → upload → restart instances (days)\n`;
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
