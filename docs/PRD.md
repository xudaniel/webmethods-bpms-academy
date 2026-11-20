# IBM webMethods BPMS Academy — Product Requirements (v2.4)

**English** | [中文](PRD.zh-CN.md)

> ### ✍️ Author and product owner: **Daniel Yuanpeng Xu**
> Daniel created the IBM webMethods BPMS Academy. He conceived, designed, directed, reviewed and published the curriculum, the knowledge base, the guides, the diagrams, the lab, this PRD and every *Author's view*, and he maintains every release. [GitHub @Xudaniel](https://github.com/Xudaniel) · [LinkedIn](https://www.linkedin.com/in/danielxuvision/)

**Status:** live · **Current release:** [v2.4.0](https://github.com/Xudaniel/webmethods-bpms-academy/releases/tag/v2.4.0), 19 Nov 2026 · **First release:** v1.0.0, 15 Nov 2026
**Live site:** <https://xudaniel.github.io/webmethods-bpms-academy/> · **Changelog:** [CHANGELOG.md](../CHANGELOG.md)

> Independent learning resource. Not an official IBM site, and not affiliated with or endorsed by IBM. This document uses public information only.

## 1. Summary

- **What:** A free, phone-first website that teaches IBM webMethods BPMS: what it is, how it behaves, how to use it day to day, and why process platforms matter now that AI agents are arriving. Fully bilingual (English and Simplified Chinese), installable, works offline and prints cleanly.
- **For whom:** First for **beginners** and **customers**. Then for the **people who use the product every day** (business users, process developers, business analysts, operations) and the **trainers and presenters** who teach it.
- **What it includes today (v2.4.0):** 25 course sections; a cited knowledge base of 18 topics and 133 facts; role paths, how-to guides, cheat sheets and self-checks; a 10-minute course and Basics 101; a hands-on lab; simulators, puzzles, drills and games; controls for regulated industries with executive briefs; a reading version of 23 chapters; an optimization primer; and an unplugged classroom kit for teaching without laptops.

## 2. Problem

1. **Beginners have no friendly entry point.** Product documentation is thorough but organised by component and version. Someone new cannot easily see how Designer, the Process Engine, the Task Engine, Business Rules and My webMethods fit together.
2. **Customers struggle to see the value quickly.** A demo usually needs a live environment and a specialist. There is no short, repeatable story that answers the questions customers actually ask, such as "where does AI fit without losing control?"
3. **Users learn day-to-day tasks by word of mouth.** Accepting a task, enabling a process after upload, hot-deploying a rule and resubmitting a failed instance are all documented. But the steps are spread across several guides, and common traps get missed: new uploads are not enabled for execution by default.
4. **The agent era raises new questions.** Teams want to know how an AI agent can take part in a process while rules and people stay accountable. Answering that needs a clear, explainable pattern.
5. **Upgrades and regulation add pressure.** 10.15 reaches end of support on 31 Oct 2027, and banks and insurers must show how automated decisions are controlled. Teams need cited, dated facts, not slides.

## 3. Goals and non-goals

**Goals**

| Goal | How the product meets it today |
| --- | --- |
| G1. A beginner understands what a BPMS does and the IBM webMethods components in about 15 minutes | 10-minute course, Basics 101, the *New here* path, Beginner mode, tap-to-explain terms |
| G2. A presenter can run a convincing 10-minute customer demo with no product installation | Demo script, Professional mode, executive briefs, simulator |
| G3. Each user role can find and follow the steps for its most common tasks, with a link to the official documentation | Four role guides with menu paths and sources, cheat sheets, self-checks, troubleshooting, site search |
| G4. Every product fact can be traced to a public source | Each knowledge fact, guide step and control cites its source; each topic shows when it was last reviewed |
| G5. The site works well on a phone, offline once loaded, and on paper | Phone-first layout tested at 390 px, installable app with offline cache, reading version, printable briefs and kit |
| G6. Chinese readers get the same course | The whole site, the reading version, the briefs and the kit in Simplified Chinese; Chinese browsers open in Chinese |
| G7. A trainer can teach a class with or without laptops | 3-hour workshop plan, lab sheet, unplugged classroom kit |

**Non-goals**
- Replacing official IBM documentation, training or support.
- Product installation, licensing or pricing guidance.
- Any customer data, employer-internal information or non-public roadmap.
- Accounts, tracking or analytics.

## 4. Audiences and needs

| Audience | Main need | Where the product serves it |
| --- | --- | --- |
| Beginner | "What is this and why should I care?" | 10-minute course, Basics 101, *New here* path, Beginner mode, glossary, review book |
| Customer or prospect | "What does it do for my business, and is it mature?" | Demo script, knowledge base, controls, executive briefs, simulator |
| Business user | "How do I work my tasks?" | How to use → Business user, cheat sheet, self-check |
| Process developer | "How do I build, switch on and test a process?" | How to use → Process developer, hands-on lab, Fix the diagram, troubleshooting |
| Business analyst | "How do I change a rule safely?" | How to use → Business analyst, decision lab, ODM migration topic |
| Operations | "How do I fix and resubmit?" | How to use → Operations, on-call drills, instance time machine |
| Trainer or pre-sales | "How do I teach or present this?" | Teach a class, classroom kit, demo script, Professional mode |
| Architect or PM | "How do the parts and data fit, and where do agents belong?" | Architecture, knowledge base, patterns, Agent Scan Lab, Swipe sort, market, optimization primer |
| Bank or insurer | "Which controls does this give me, and for which regulation?" | Controls for regulated industries, executive briefs |
| Chinese-speaking reader | "Can I read all of it in Chinese?" | 中文 switch, `?lang=zh`, Chinese reading version, briefs and kit |

## 5. User stories

- As a **beginner**, I want a short ordered path so I know where to start and when I'm done.
- As a **presenter**, I want a script with what to click, what to say and which question it answers, so that every demo is consistent.
- As a **business user**, I want to know how to accept, complete and delegate a task, and how to check it worked.
- As a **developer**, I want to know why my newly uploaded process does not start, and how to enable it.
- As an **analyst**, I want to change a decision table and deploy it without a developer rebuilding the process.
- As **operations**, I want to resubmit a failed instance safely, and to know which permissions I need.
- As a **reader without time to click**, I want everything on one printable page with diagrams and an answer key.
- As a **Chinese-speaking reader**, I want the whole course in Chinese, as detailed as the English.
- As a **trainer without laptops in the room**, I want a printed game that teaches how the engine, rules and inbox work together.
- As a **compliance lead**, I want to see which controls the platform supports and which regulation asks for them, with sources.

## 6. Scope and acceptance criteria

### 6.1 What the product includes (v2.4.0)

Every item below is checked by the smoke test on each pull request, at phone width (390 × 844), with no JavaScript errors.

| Area | Capability | Acceptance check |
| --- | --- | --- |
| Start | Role picker with seven 3–5 step paths; one-picture map; Mia's story across 17 sections | Each role shows its path; the map links to guides; story cards render |
| Learn first | 10-minute course (5 steps, 3 checks); Basics 101 (7 lessons) | Steps advance; checks answer; progress saved |
| Knowledge | 18 cited topics, 133 facts, 9-component family table, interactive quality-of-service diagram, last-reviewed dates | Counter shows the numbers; every topic cites sources |
| Controls | 7 controls mapped to SR 11-7, OSFI E-23, EU AI Act, GDPR Art. 22, NAIC, DORA; executive briefs for banking and insurance | Rows and frameworks render; briefs print on one A4 page each |
| How to use | 4 role guides, cheat sheets, self-checks, beginner path, demo script | Each guide contains its key step (Accept, Execution Enabled, Hot Deploy, Resubmit) |
| Practise | Hands-on lab (8 stages), decision lab, Fix the diagram (5 levels), Swipe sort, on-call drills (3), simulator with time machine, Agent Scan Lab | Each tool runs end to end in the test |
| Fix | 16 troubleshooting entries, flowchart, site search in both languages | Search opens the right fact, symptom and term |
| Remember | Glossary (43 terms), quiz (34 questions), review book with spaced review | Wrong answers reappear |
| Teach | 3-hour workshop plan; unplugged classroom kit with board, 12 request cards, rule and control cards, 8 event cards, audit log sheet and answer key | Kit renders in both languages without sideways scrolling; Teach links to it |
| Read and print | Reading version (23 chapters, figures, answer keys); optimization primer page | Pages load in both languages |
| Languages | English and Simplified Chinese everywhere | Every section, page and diagram has Chinese text |
| Phone | Installable, offline, Sections menu, Previous / Next, no sideways scrolling at 360 px | No sideways scrolling at narrow widths; manifest and service worker present |

### 6.2 v1.0 baseline (met 15 Nov 2026)

v1.0.0 shipped: the Start-here explainer, IBM webMethods branding, a knowledge base of 7 topics and 42 facts, 4 role guides, the customer demo script, the simulator, the Agent Scan Lab, a 33-term glossary and 20-question quiz, a reading version, bilingual READMEs and a passing smoke test. Everything above has grown from that baseline.

## 7. Content and compliance principles

- **Public sources only.** Every product fact links to IBM or Software AG documentation, or to another public report. Market views are clearly labelled as *Author's view*.
- **No confidential material.** No customer names, revenue, usage data or internal plans.
- **Independence.** Every page states that the site is not affiliated with IBM. Product names are trademarks of their owners. No logos are used.
- **Fictional examples.** Mia, Sam, Priya, Leo, Omar and every request in the games and the kit are fictional; the Agent Scan Lab uses synthetic data.
- **Absolute dates.** For example, "Oct 2027", never "next year".
- **Version caveat.** Menu paths follow public documentation, and labels can differ by version. Facts taken from older guides (for example 10.4 or 10.5) say so.
- **Same content in both languages.** A change in English ships with its Chinese text in the same pull request.
- **Privacy by design.** No analytics, cookies or network calls. Uploaded CSVs and progress stay in the browser.
- **Authorship and attribution.** Daniel Yuanpeng Xu is credited as the author on every page, both READMEs, this PRD, every pull request and release, and in `CITATION.cff`. Anyone who reuses the material must credit him.

## 8. Success measures

Because the site collects no analytics by design, success is measured from outside the site:

| Measure | Signal | Target |
| --- | --- | --- |
| Reach | GitHub stars, forks and repository traffic (owner view) | Steady growth; no target set yet |
| Learnability | Three 15-minute user tests ([USER-TESTING.md](USER-TESTING.md)) | Two of three participants complete each task without help |
| Demo use | Customer demos run with the script (author's log) | Used in real customer conversations |
| Teaching use | Classes run with the workshop plan or the kit | One class run and debriefed |
| Usefulness | Issues or messages asking for a topic or correction | At least one external request handled |
| Accuracy | Corrections needed for wrong facts | Every correction fixed within one release |
| Quality | Smoke test on every change | 100% passing before merge |

## 9. Release criteria (every release)

- Every new capability is covered by the smoke test, in English and Chinese.
- Counts quoted in the READMEs and this PRD match the site.
- The version is the same in the footer, `sw.js`, `CITATION.cff`, both READMEs and this PRD.
- The live GitHub Pages site serves the release.
- `CHANGELOG.md`, this PRD and the GitHub Release notes are published.

## 10. Roadmap

**Done since v1.0:** knowledge topics on Monitor and Optimize, deployment and upgrades; a diagram for each worked case; the whole site in Chinese; moving webMethods Business Rules to IBM ODM; an unplugged classroom kit.

**Next (v2.5)**
- Run the three user tests and fix what they find.
- Simulator: timer escalation and parallel-gateway scenarios.
- Agent Scan Lab: adjustable thresholds and CSV export of the results.
- Recheck the cluster and correlation facts against the 12.1 documentation when it is published.

**Later**
- A downloadable PDF of the reading version for each release.
- More classroom kits (for example rule changes only, or incident response).

## 11. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Facts drift as new versions ship (for example 11.1 → 12.1) | Wrong steps for users | Cite the version for every source; show a last-reviewed date per topic; review on each major release |
| Documentation links break or need JavaScript to render | Facts become hard to verify | Prefer stable documentation URLs; keep a second source where possible |
| Readers mistake the site for official IBM material | Brand or legal concern | Disclaimer on every page; no logos; "independent" in the description |
| Author's views read as vendor positions in customer demos | Misunderstanding | *Author's view* labels; presenter guidance in the demo script |
| Confidential information slips in | Serious | Public-sources-only rule; content review before each merge |
| English and Chinese drift apart | Chinese readers get older or missing content | Both languages in the same pull request; the smoke test opens every page in both |
| Counts and versions go stale in the docs | Loss of trust | Release criteria check counts and versions; the smoke test checks the footer version |

## 12. Open questions

1. **Licence:** which open licence to publish under (for example CC BY 4.0 for content and MIT for code)? Until decided, all rights are reserved.
2. **Customer use:** is any internal review needed before the site is used in customer meetings? Run the three user tests first.
3. **Domain:** keep `github.io`, or use a custom domain?

## 13. Author

**Daniel Yuanpeng Xu** is the author and product owner. He is a product manager in business process and decision automation, based in Toronto. He set the product direction, defined the audiences and scope, chose and verified the public sources, wrote the *Author's view* frameworks, directed and reviewed every change, and decides each release. The academy is his independent work and is not affiliated with or endorsed by IBM.

- **Contact:** [GitHub @Xudaniel](https://github.com/Xudaniel) · [LinkedIn](https://www.linkedin.com/in/danielxuvision/)
- **Cite as:** Xu, Daniel Yuanpeng (2026). *IBM webMethods BPMS Academy* (v2.4.0). https://github.com/xudaniel/webmethods-bpms-academy

## 14. Release history

| Version | Date | What shipped |
| --- | --- | --- |
| 2.4.0 | 2026-11-19 | Unplugged classroom kit (kit.html): A3 board, 12 request cards, rule and control cards, 8 event cards, audit log sheet, facilitator notes and answer key, EN + 中文 (#54); knowledge base grown to 18 topics and 133 facts (#99, #100, #101); phone-friendly READMEs (#97, #98); 15-minute user test kit (#95); this PRD rewritten for the current product and published in Chinese; stale counts fixed; screenshots refreshed |
| 2.3.0 | 2026-11-18 | Release v2.3.0 published; version bumped everywhere (#93) |
| 2.3.0 | 2026-11-17 | optimization.html Demo 3: rules first (certificate decision table), then optimization (cheapest allowed plan); rule on/off shows its price, 375 → 380; Python version checked with OR-Tools and CPLEX; EN + 中文 (#91) |
| 2.3.0 | 2026-11-17 | optimization.html: optimization primer page, EN + 中文, eight algorithms with examples and two in-browser demos (branch and bound, constraint propagation); smoke-tested (#89) |
| 2.3.0 | 2026-11-17 | Examples: optimization primer in examples/optimization (algorithm steps, C, OR-Tools, docplex/CPLEX code) (#87) |
| 2.3.0 | 2026-11-17 | Knowledge base: IBM Integration rename, 12.1 upgrade tooling and licensing facts, new topic on agents and human tasks across IBM; EN + 中文; 11 topics, 72 facts (#85) |
| 2.3.0 | 2026-11-17 | Lifecycle wording follows IBM's current page: 10.15 end of support 31 Oct 2027, extended support to 2028 and 2030; EN + 中文 (#83) |
| 2.3.0 | 2026-11-17 | Knowledge base: webMethods and IBM webMethods Hybrid Integration (IWHI), cited, EN + 中文; 10 topics, 62 facts (#81) |
| 2.3.0 | 2026-11-16 | 中文版 batch 4: reading version and executive briefs in Chinese; Chinese browsers open in Chinese; the whole site is now bilingual (#68) |
| 2.3.0 | 2026-11-16 | Site search: 🔍 or "/" searches every section in the browser, English and Chinese, and opens the exact place (#77) |
| 2.3.0 | 2026-11-16 | Review book: spaced review of every wrong answer across seven question sources (1 → 3 days, 7 after a lapse); English and Chinese (#76) |
| 2.3.0 | 2026-11-16 | On-call drills: three branching incidents with a clock and cited debriefs; On-call hero badge; English and Chinese (#50) |
| 2.3.0 | 2026-11-16 | Instance time machine: replay a finished simulator instance from its audit rows, with a volatile-tracking toggle; English and Chinese (#51) |
| 2.3.0 | 2026-11-16 | Swipe sort: rule, agent or human? 20 cards in 60 seconds, answers from the scan lab's classifier, English and Chinese (#53) |
| 2.3.0 | 2026-11-16 | 中文版 batch 3b: controls for regulated industries, decision lab, Fix the diagram; all 22 course sections now in Chinese (#68) |
| 2.3.0 | 2026-11-16 | 中文版 batch 3a: overview, lifecycle, architecture, BPMN, patterns, cases, simulator, Agent Scan Lab, market, glossary, quiz and their diagrams (#68) |
| 2.3.0 | 2026-11-16 | 中文版 batch 2: knowledge base, how-to guides and cheat sheets, demo script, lab, troubleshooting, workshop plan and their diagrams (#68) |
| 2.3.0 | 2026-11-16 | 中文版 batch 1: language switch; Start here, 10-minute course, Basics 101, menus, terms, story and their diagrams in Simplified Chinese (#68) |
| 2.2.0 | 2026-11-16 | 10-minute course: five steps, five pictures, three checks; first step of the New-here path (#64) |
| 2.1.0 | 2026-11-16 | Professional mode (?mode=pro), one-page executive briefs for banking and insurance, last-reviewed dates (#59) |
| 2.1.0 | 2026-11-16 | Controls for regulated industries: seven controls mapped to SR 11-7, OSFI E-23, EU AI Act, GDPR Art. 22, NAIC, DORA, with BPMS evidence (#58) |
| 2.0.0 | 2026-11-16 | Learn by story and by play: Fix the diagram, five puzzle levels (#52). Mia's request: one fictional story through the course (#48). CI on every PR (branch protection ready for the owner to switch on); Monitor/Optimize and upgrade knowledge topics; cited rules pitfalls and a corrected remote-rules fact (#46). 11 more diagrams: architecture, lifecycle loop, BPMN gateways and lanes, agent pattern, three case flows, simulator loan process, decision table, scan method (#44) |
| 1.3.0 | 2026-11-15 | Basics 101: seven fundamental lessons for complete beginners, each with a story, a picture and a check, plus a reading-version chapter with an answer key and a new badge; Decision lab (interactive decision table, agility comparison, rules pitfalls); hotfix for the live site after direct commits overwrote index.html |
| 1.2.0 | 2026-11-15 | Plain words for beginners: tap any underlined term for a plain-English explanation; Beginner mode shows the 10 beginner sections with *In plain words* boxes; duplicate glossary entries removed (33 terms) |
| 1.1.0 | 2026-11-15 | Role paths and a clickable one-picture map; hands-on lab; troubleshooting, cheat sheets and self-checks; teach-a-class plan; phone app with offline mode; reading times; 14 diagrams; badges; author credit; README rewritten |
| 1.0.0 | 2026-11-15 | How-to guides by role, beginner path, customer demo, cited knowledge base, PRD, changelog |
| 0.3.0 | 2026-11-14 | Reading version |
| 0.2.0 | 2026-11-14 | Start-here explainer, author credit, Chinese README |
| 0.1.0 | 2026-11-14 | Interactive course, simulator, Agent Scan Lab, market |

---
© 2026 Daniel Yuanpeng Xu · Author and product owner · All rights reserved
