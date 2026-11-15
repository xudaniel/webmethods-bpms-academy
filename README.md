# webMethods BPMS Academy

Interactive teaching site for IBM webMethods BPMS: architecture, BPMN, decision automation, agent-era patterns, and market context. Static HTML/CSS/JS, no build step, works on a phone.

> Independent learning resource. Not an official IBM site and not affiliated with or endorsed by IBM. Product names are trademarks of their owners. Content comes from public documentation and public reports only; no customer or internal data is used.

## What's inside

| Section | What you can do |
| --- | --- |
| Overview | The core idea: process orchestrates, rules judge, people handle exceptions, agents propose |
| Lifecycle | Click through model → govern; release dates (10.15 EOM Oct 2027, EOS Oct 2028) |
| Architecture | Click each component; Process Audit tables (`PRA_*`) and where task history lives |
| BPMN | Activities, gateways, events, swimlanes |
| Patterns | Classic and agent-era patterns, filterable |
| Cases | Purchase approval, loan decisioning, logistics exception |
| Simulator | Step a loan through a rule task and a human task; see audit-style log rows |
| Agent Scan Lab | Score process history in the browser and classify steps as ODM rule candidate, agent candidate, keep human, or integration fix |
| Market | BPM market estimates, Gartner BOAT, Camunda/Appian signals, EU AI Act dates, with sources |
| Glossary / Quiz | Searchable terms; 10-question check with explanations |

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

To publish: repository Settings → Pages → Deploy from branch → `main` / root.

## Agent Scan tools (Python)

`tools/agent_scan.py` is the same scoring as the in-browser lab.

```bash
cd tools
python3 make_synthetic.py           # writes synthetic_audit.csv
python3 agent_scan.py synthetic_audit.csv
```

Input: one row per completed step instance with `process, step, step_type, instance_id, start_ts, end_ts, wait_min, work_min, outcome, input_key, loop_count, error`. Typical sources are `PRA_PROCESS_STEP` and `PRA_STEP_LOGGED_FIELD` in the Process Audit database and the Task Engine audit trail. Thresholds and savings shares are placeholders to calibrate on real data. Use anonymised exports only.

## Project layout

```
index.html        page shell and sections
css/styles.css    styles
js/content.js     all course content and sources (edit here)
js/app.js         navigation, simulator, scan lab, quiz
tools/            Python version of the scan + synthetic data generator
```

## Sources

Listed in `js/content.js` and shown on the Market page. Key ones:

- [Process Audit Log database tables (Designer 10.15)](https://documentation.softwareag.com/webmethods/designer/sdf10-15/webhelp/sdf-webhelp/sdf-webhelp/proc.process.audit.log.database.component.tables.html)
- [Task audit logging into Process Audit disabled by default (IBM 10.15 docs)](https://www.ibm.com/docs/en/SSHZPA_10.15.0/te_users_guide/co-disable_enable_task_logging_in_processes.html)
- [webMethods support lifecycle (IBM)](https://www.ibm.com/support/pages/node/7180543)
- [Gartner BOAT Magic Quadrant 2026 abstract](https://www.gartner.com/en/documents/8381781)
- [Camunda ARR nearing $200M](https://www.businesswire.com/news/home/20260804044254/en/) · [Appian Q3 2026 results](https://www.sec.gov/Archives/edgar/data/0001441683/000144168326000056/appnex991earningsrelease-9.htm)
- [EU AI Act Digital Omnibus](https://www.orrick.com/fr-FR/Insights/2026/07/EU-AI-Act-Update-Digital-Omnibus-Finalizes-8-Compliance-Changes)
