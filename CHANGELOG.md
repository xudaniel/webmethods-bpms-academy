# Changelog

All notable changes to the IBM webMethods BPMS Academy. Author: **Daniel Yuanpeng Xu**.
Versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- 🧪 **15-minute user test kit** (#95): `docs/USER-TESTING.md` gives a session script with three tasks (beginner, practitioner, customer question) and five questions, in English and 中文, plus a GitHub feedback form that collects results without names or customer data.

## [2.3.0] — 2026-11-18

The whole site in Chinese, plus search, a review book and on-call drills. **Author: Daniel Yuanpeng Xu.**

### Added
- ⚖️ **Optimization page, Demo 3: rules first, then optimization** (#91): a certificate rule decides who may do which work order, then the optimizer picks the cheapest allowed plan; switching the rule off shows its price (375 → 380). Same model in `examples/optimization/rules_plus_optimization.py`, checked with OR-Tools and CPLEX. English and 中文.
- 🧮 **Optimization primer page** (#89): `optimization.html` turns the examples into a mobile-first page in English and 中文 with the eight algorithms step by step, a branch-and-bound snack demo and a constraint-propagation duty demo that run in the browser. Teaching material; not linked from the course navigation.
- 🧮 **Examples: optimization primer** (#87): `examples/optimization` explains the algorithms behind MIP and CP solvers (simplex, branch and bound, cutting planes, propagation, backtracking, clause learning, routing local search, graph algorithms) with a small checked example each, plus runnable C, OR-Tools and IBM docplex/CPLEX code. Teaching material; the site itself is unchanged.
- 🤖 **Knowledge base: IBM Integration, upgrade tooling, agents and human tasks** (#85): the IWHI topic now covers the rename to IBM Integration, how it is sold, its six capability areas (BPM is not one) and REST APIs as MCP tools; *Upgrading from 10.15* adds what the 12.1 Pre-Upgrade Analyzer covers, license keys and metering after the upgrade; a new topic compares how Orchestrate, BAW 26.0, Cloud Pak for Business Automation, webMethods Integration and BPM 12.1 let agents work with human tasks. Public sources only, English and 中文 (11 topics, 72 facts).
- 🔗 **Knowledge base: webMethods and IWHI** (#81): a new cited topic on how the webMethods estate, where BPMS runs, relates to IBM webMethods Hybrid Integration: what it is, which runtimes its hybrid control plane manages, consumption pricing, and what IBM's public pages do not say about process and task monitoring. English and 中文, reading version included (10 topics, 62 facts).
- 🌐 **中文版, batch 4: the whole site is in Chinese** (#68): the reading version (all 23 chapters, the five drawn figures, the map table, the answer keys) and both executive briefs. A browser whose first language is Chinese now opens in Chinese until you pick a language with the 🌐 switch.
- 🔍 **Site search** (#77): 🔍 next to ☰, or press `/`. Searches knowledge facts, troubleshooting, glossary, how-to steps, cheat sheets, the lab, Basics 101, controls, patterns, cases, BPMN and section names in the language on screen, with highlighted snippets; a result opens the exact place (role tab, troubleshooting entry, knowledge topic, lab stage). In the browser, offline, nothing sent anywhere.
- 📒 **Review book** (#76): every question answered wrong anywhere on the site comes back after 1 day and 3 days (plus 7 days after a repeat miss) until you get it right twice. A card on Start here shows what is due today. Stored by reference, so items appear in the language you are reading; browser only. English and Chinese.
- 🚨 **On-call drills** (#50): three branching incidents (the process never starts, a manual decision is ignored, Monitor shows nothing) with a running clock. Wrong checks cost minutes and explain why; each drill ends with your path, the ideal time and a debrief citing IBM / Software AG documentation. New 🚨 *On-call hero* badge for three clean runs. English and Chinese.
- ⏪ **Instance time machine** (#51): after the loan simulator completes, replay the instance from its audit rows. Slider, ⏮ ◀ ▶ ▶▶ and arrow keys move a token on the loan diagram while the matching `PRA_*` row lights up; a *Volatile Tracking* toggle shows which rows Monitor would not have. English and Chinese.
- 👆 **Swipe sort** (#53): a phone-first card game. Judge 20 synthetic steps in 60 seconds: swipe left for a rule, right for an agent, up to keep a person (buttons and arrow keys too). Answers come from the Agent Scan Lab's own classifier, now shared as `SCAN_CLASSIFY`. In English and Chinese.
- 🌐 **中文版, batch 1** (#68): a 中文 / English switch in the header (`?lang=zh`, remembered on the device). Start here (six steps, role paths, the one-picture map, Mia's story), the 10-minute course, Basics 101, menus, tap-to-explain terms, Beginner and Professional mode, badges, reading times and the diagrams used there are in Simplified Chinese. Untranslated sections say so and show the English text. Product and screen names stay in English.
- 🌐 **中文版, batch 3b** (#68): the controls for regulated industries (seven controls and six frameworks), the decision lab and Fix the diagram (all five levels, drawings included) are in Simplified Chinese. Every section of the interactive course is now translated.
- 🌐 **中文版, batch 3a** (#68): overview, lifecycle, architecture, BPMN, patterns, worked cases (with their flow diagrams), the loan simulator, the Agent Scan Lab, market, the glossary (33 terms) and the quiz (24 questions) are in Simplified Chinese. Tap-to-explain terms now show the Chinese technical definition too.
- 🌐 **中文版, batch 2** (#68): the knowledge base (9 topics, quality-of-service widget), the four role guides, cheat sheets and self-checks, the customer demo script, the hands-on lab, all 16 troubleshooting entries and the workshop plan are in Simplified Chinese, with their diagrams. Menu paths stay in English to match the product.

### Fixed
- Lifecycle wording (#83): IBM's webMethods 10.x lifecycle page (updated 4 Nov 2026) gives 10.15 end of support on 31 Oct 2027, with paid extended support to 31 Oct 2028 and 31 Oct 2030. The knowledge base, lifecycle table, timeline, quiz, glossary, executive briefs, reading-version figure and READMEs now say this instead of "end of maintenance Oct 2027, end of support Oct 2028" (English and 中文).
- Reading version: the how-to guides, lab stages and cheat sheets were numbered 4.x, 5.x and 7.x; they now take their chapter number (6, 7 and 9) from the heading.
- The Chinese text now credits the author as Daniel Yuanpeng Xu, like the English.
- The workshop print list pointed to "section 5" of the reading version for the lab sheet; the lab is chapter 7.

## [2.2.0] — 2026-11-16

From zero in ten minutes. **Author: Daniel Yuanpeng Xu.**

### Added
- ⚡ **10-minute course** for people who know nothing yet (#64): five 2-minute steps, one at a time, each with a picture and a *Remember* line, then three checks and a finish card. Linked from Start, the nav, the phone menu and the first step of the *New here* path. The reading version keeps Basics 101 as its first stop.

## [2.1.0] — 2026-11-16

Ready for banks and insurers. **Author: Daniel Yuanpeng Xu.**

### Highlights
- 🏦 **Controls for regulated industries:** seven controls mapped to SR 11-7, OSFI E-23, the EU AI Act, GDPR Art. 22, the NAIC AI Model Bulletin and DORA, with the evidence IBM webMethods BPMS produces.
- 💼 **Professional mode** for client meetings, and **one-page executive briefs** for banking and insurance.
- 🗓️ **Last-reviewed dates** on every cited knowledge topic.

### Added
- **Professional mode** (#59): a 💼 header switch, or a `?mode=pro` link, hides badges, progress, confetti, toasts, *Did you know?* and Mia's story for client meetings.
- **Executive briefs** (`brief.html`, #59): one printable A4 page each for banking and insurance, built from the cited control map, with numbered sources.
- **Last reviewed** dates on every cited knowledge topic (#59).
- **Controls for regulated industries** (#58): seven controls mapped to the frameworks that ask for them (SR 11-7, OSFI E-23, EU AI Act, GDPR Art. 22, NAIC AI Model Bulletin, DORA), with how BPMS and rules provide each one and the evidence an auditor sees. Framework entries cite the regulator; product entries cite IBM / Software AG documentation. Also a new reading-version chapter (23 chapters).

### Fixed
- Reading-version knowledge sub-headings are numbered from the real chapter number (they still said 3.x).

## [2.0.0] — 2026-11-16

Learn by story and by play. **Author: Daniel Yuanpeng Xu.**

### Highlights
- 🧩 **Fix the diagram:** five broken processes to repair by tapping, with a token that runs through.
- 📦 **Mia's request:** one story through the whole course, with a cast of five and a 12-part route.
- 🎨 **26 diagrams** in both the course and the reading version.
- 📚 **Knowledge base:** 9 cited topics and 55 facts, including Monitor/Optimize and upgrading from 10.15.
- ✅ **Trust:** an automatic smoke test on every PR; every rules pitfall cited; a wrong fact corrected.

### Added
- **Fix the diagram** (#52): five tap-to-place puzzle levels (end event, parallel gateway, limit in a rule task, timer escalation, human exception path). ▶ Run animates a token, and each wrong piece explains itself and links the lesson. A new 🧩 *Process fixer* badge.
- **Mia's request** (#48): one fictional story through the whole course. A *Meet the cast* card (Mia, Sam, Priya, Leo, Omar, with initials avatars). A story card on 17 sections showing the next moment of her $1,200 laptop request, a five-stage tracker and a *Next in Mia's story* link along a 12-part route. The reading version has 15 story boxes.
- **11 more diagrams** (#44), original and sized for phones:
  - **Architecture:** where each part runs.
  - **Lifecycle:** a 7-stage loop.
  - **BPMN:** exclusive, parallel and inclusive gateways; a pool with lanes.
  - **Patterns:** agent proposes, rules decide, process executes, with a decision log.
  - **Cases:** one flow per worked case, coloured by who does each step.
  - **Simulator:** the loan process with its thresholds.
  - **Decision lab:** the anatomy of a decision table.
  - **Agent Scan Lab:** how steps are sorted.

  The course and the reading version now have 26 diagrams each.
- **Knowledge base:** two new cited topics, **Monitor, resubmit and Optimize** and **Upgrading from 10.15** (9 topics, 55 facts), plus 2 quiz questions (24) (#46).
- **Continuous integration:** GitHub Actions runs the smoke test and a JavaScript syntax check on every pull request and push to `main` (#46).

### Fixed
- **Rules facts:** a remote Rules Engine is configured with a remote server alias named `businessrulesruntime` in Integration Server Administrator, not under "Rules Engine Configuration" in My webMethods. Fixed in the knowledge base and the Decision lab (#46).
- **Decision lab pitfalls:** every factual pitfall now cites public IBM / Software AG documentation; unsupported claims were replaced, and opinions are labelled *Author's view* (#46).

## [1.3.0] — 2026-11-15

More fundamental: learn the ideas before the product. **Author: Daniel Yuanpeng Xu.**

### Added
- **Basics 101**, a new section right after Start here (#40). Seven 2-minute lessons for complete beginners:
  1. a process is a recipe (model vs instance);
  2. who does each step (a system, a person or a rule);
  3. five BPMN shapes;
  4. keep decisions out of the drawing;
  5. people get tasks in an inbox;
  6. the engine runs it, and the audit trail remembers it;
  7. from drawing to running, with a table mapping each idea to its IBM webMethods name.

  Each lesson has a plain story, three points, a picture, one check question with an explanation and *Try again*, and links to go deeper. Four new original diagrams. Progress is saved in the browser, and a new 🧱 **Basics done** badge rewards passing all seven checks. The reading version gets chapter 3 with an answer key (22 chapters, 18 diagrams). The "New here" path now starts with Basics 101.
- **Decision lab** (#41): move a decision table's limits and test an application, compare changing a rule with changing the process, and review rules-configuration pitfalls.

### Fixed
- **Live site restored** (#41, PR #42). Direct commits to `main` had overwritten `index.html` with `$(cat /tmp/index.html)` and left a syntax error in `js/decision-lab.js`. The smoke test now fails if `index.html` is truncated. The v1.2.0 tag points at that broken commit; use v1.3.0.

## [1.2.0] — 2026-11-15

Plain words for beginners. **Author: Daniel Yuanpeng Xu.**

### Added
- **Tap any term to understand it:** 36 key terms (BPMN, Integration Server, My webMethods, Hot Deploy, quality of service…) are underlined across the course and the reading version, once per card. Tapping one gives a one-line plain-English explanation, the technical definition from the glossary and a link to the full glossary; on a phone it opens as a bottom sheet. Quizzes, buttons, links, headings and diagrams are left alone (#38).
- **🌱 Beginner mode:** a switch in the header, remembered on the device. The tab bar and ☰ menu show the 10 beginner sections; each opens with an *In plain words* box; the 7 advanced sections say they can wait and link back to Start here; Previous / Next skip them (#38).

### Fixed
- Three duplicate glossary entries (Hot Deploy, Process Aware, Rule task); the glossary now has 33 terms.

## [1.1.0] — 2026-11-15

Learn by role, by picture and by doing, on any phone. **Author: Daniel Yuanpeng Xu.**

### Highlights
- **Who are you?** 7 roles with personal paths, and **IBM webMethods BPMS in one picture**, a clickable map.
- **Hands-on lab:** your first process in 30 minutes.
- **Troubleshooting** with 16 problems, **role cheat sheets** and **self-checks**, and a **Teach a class** plan.
- **Phone app with offline mode**, a Sections menu, Previous / Next, and reading times everywhere.
- **14 diagrams**, including an interactive quality-of-service diagram, plus **badges** and **Did you know?**
- **Author credit** in both READMEs, the PRD and `CITATION.cff`.

### Changed
- **README (EN + 中文) rewritten around today's site:** what you can do in five minutes, who it's for, what's inside (grouped by purpose), the curriculum in site order, a refreshed roadmap and design principles, and current screenshots (#36).

### Added
- **Hands-on lab: your first process in 30 minutes.** 8 stages to build, enable, run and monitor a purchase-approval process, with checkpoints, cited steps, a pitfalls table, a practice path without an environment, and a level-up exercise. Progress is saved in the learner's browser. A printable lab sheet is in the reading version (#16).
- 3 glossary terms and 2 quiz questions (glossary 36, quiz 22).
- **Troubleshooting:** 16 searchable problems in 4 areas. Each gives what to check first, the fix, where to apply it, and a source (#18).
- **Role cheat sheets** that print on their own, and **self-checks** with 12 questions across the four roles (#19).
- **Teach a class:** a 3-hour workshop agenda, a print list and facilitator tips (#20).

- **Phone guide** on Start here and in both READMEs: save to the Home Screen on iPhone (iOS 26) and Android, finding your way, offline, text size, PDF. A QR code is shown on large screens (#24).
- **Mobile experience:** a ☰ Sections menu, Previous/Next on every section, a back-to-top button (plus Contents in the reading version), collapsible troubleshooting entries, larger tap targets, a compact header, iPhone safe areas, a scroll shadow on the tab bar, and pages that open at the top. Install as an app (manifest, icons, theme colour) and work offline (network-first service worker) (#25).

- **Authorship:** a "Created by Daniel Yuanpeng Xu" block at the top of both READMEs, plus About the author, How to cite, and `CITATION.cff` (GitHub's *Cite this repository*). The PRD gets an author callout, an attribution principle and an Author section (#34).
- **Who are you?** A role picker on Start here with 7 personal paths of 3–5 deep-linked steps. Steps tick themselves off, a "Your path: Next →" link appears at the end of each section, and the reading version gets a "Which chapters should I read?" table (#31).
- **IBM webMethods BPMS in one picture:** a clickable, numbered map from model to audit history, with *Enable for execution* highlighted as the step beginners miss (#32).
- **Reading time** on every section, in the Sections menu and on every chapter of the reading version, with a course total (#27).
- **Nine original diagrams:** interactive quality of service; process vs rules; Hot Deploy path; task lifecycle; build pipeline; instance states; the lab BPMN with an animated token; a "process won't start" flowchart; the workshop timeline. They also supply the two knowledge-base images that were missing (now SVG) (#28).
- **Fun:** explorer progress, 8 badges with a small celebration, and Did you know? facts. Stored locally only (#29).

### Fixed
- Restored `js/app.js`, which commit 5620be7 had overwritten and which broke the live site. Knowledge topics can now show diagrams, and a missing image hides itself (#21, PR #22).

## [1.0.0] — 2026-11-15

First stable release, for beginners, customers and the people who use IBM webMethods BPMS every day.
See the [product requirements](docs/PRD.md).

### Highlights
- **How to use IBM webMethods BPMS:** step-by-step guides for business users, process developers, business analysts and operations, each with official documentation links (#10, #11, PR #12).
- **New here? 15-minute path** and a **10-minute customer demo script** (#11, PR #12).
- **Cited IBM webMethods knowledge base:** 7 topics and 42 facts covering releases, Process Engine quality of service, execution history, the Task Engine, Business Rules, Rule Engine configuration and a design checklist (#7, #8, PR #9; direct commits ebbb0fe and f8ae12d).
- **IBM webMethods at a glance:** a table of the 9 family components.
- **Reading version:** one printable page with 17 sections, 5 diagrams, and the quiz with an answer key (#5, PR #6).
- **Start here:** a plain-language explainer with an interactive agent decision guard (PR #2).
- **Chinese README** with a language toggle (#4, PR #2).
- Glossary with 33 terms; quiz with 20 questions.
- Product requirements document and this changelog (#13, #14).

### Fixed
- The reading version's sticky table of contents no longer covers the text on phones (PR #9).
- Removed two knowledge-base claims that could not be traced to a public source (PR #9).

## [0.3.0] — 2026-11-14
- Reading version (#5, PR #6).

## [0.2.0] — 2026-11-14
- Start-here public explainer, author credit throughout, Chinese README (#3, #4, PR #2).

## [0.1.0] — 2026-11-14
- Initial interactive course: architecture, lifecycle, BPMN, patterns, cases, simulator, Agent Scan Lab, market, glossary and quiz (PR #1).

[2.1.0]: https://github.com/Xudaniel/webmethods-bpms-academy/releases/tag/v2.1.0
[2.0.0]: https://github.com/Xudaniel/webmethods-bpms-academy/releases/tag/v2.0.0
[1.3.0]: https://github.com/Xudaniel/webmethods-bpms-academy/releases/tag/v1.3.0
[1.2.0]: https://github.com/Xudaniel/webmethods-bpms-academy/releases/tag/v1.2.0
[1.1.0]: https://github.com/Xudaniel/webmethods-bpms-academy/releases/tag/v1.1.0
[1.0.0]: https://github.com/xudaniel/webmethods-bpms-academy/releases/tag/v1.0.0
