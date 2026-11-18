# IBM webMethods BPMS Academy — Product Requirements (v1.0)

> ### ✍️ Author and product owner: **Daniel Yuanpeng Xu**
> Daniel created the IBM webMethods BPMS Academy. He conceived, designed, directed, reviewed and published the curriculum, the knowledge base, the guides, the diagrams, the lab, this PRD and every *Author's view*, and he maintains every release. [GitHub @Xudaniel](https://github.com/Xudaniel) · [LinkedIn](https://www.linkedin.com/in/danielxuvision/)

**Status:** v1.0.0 scope released 15 Nov 2026 · **Current release:** [v2.2.0](https://github.com/Xudaniel/webmethods-bpms-academy/releases/tag/v2.2.0) (see §14)
**Live site:** <https://xudaniel.github.io/webmethods-bpms-academy/> · **Changelog:** [CHANGELOG.md](../CHANGELOG.md)

> Independent learning resource. Not an official IBM site, and not affiliated with or endorsed by IBM. This document uses public information only.

## 1. Summary

- **What:** A free, mobile-first website that teaches IBM webMethods BPMS. It explains what the product is, how it works and how to use it, and why process platforms matter now that AI agents are arriving.
- **For whom:** First for **beginners** and **customers**. Then for the **people who use the product every day**: business users, process developers, business analysts and operations staff.
- **v1.0 delivers:** An interactive course and a reading version. A cited knowledge base. Step-by-step how-to guides by role. A 15-minute beginner path. A 10-minute customer demo script. A simulator, an agent-candidate scan, a glossary and a quiz.

## 2. Problem

1. **Beginners have no friendly entry point.** Product documentation is thorough but organised by component and version. Someone new cannot easily see how Designer, the Process Engine, the Task Engine, Business Rules and My webMethods fit together.
2. **Customers struggle to see the value quickly.** A demo usually needs a live environment and a specialist. There is no short, repeatable story that answers the questions customers actually ask, such as "where does AI fit without losing control?"
3. **Users learn day-to-day tasks by word of mouth.** Accepting a task, enabling a process after upload, hot-deploying a rule and resubmitting a failed instance are all documented. But the steps are spread across several guides, and common traps get missed: new uploads are not enabled for execution by default.
4. **The agent era raises new questions.** Teams want to know how an AI agent can take part in a process while rules and people stay accountable. Answering that needs a clear, explainable pattern.

## 3. Goals and non-goals

**Goals**
- G1. A beginner understands what a BPMS does and the IBM webMethods components in about 15 minutes.
- G2. A presenter can run a convincing 10-minute customer demo with no product installation.
- G3. Each user role can find and follow the steps for its most common tasks, with a link to the official documentation.
- G4. Every product fact can be traced to a public source.
- G5. The site works well on a phone, offline once loaded, and on paper.

**Non-goals**
- Replacing official IBM documentation, training or support.
- Product installation, licensing or pricing guidance.
- Any customer data, employer-internal information or non-public roadmap.
- Accounts, tracking or analytics.

## 4. Audiences and needs

| Audience | Main need | Where v1.0 serves it |
| --- | --- | --- |
| Beginner | "What is this and why should I care?" | Start here, 15-minute path, glossary, quiz |
| Customer or prospect | "What does it do for my business, and is it mature?" | Customer demo script, knowledge base, simulator |
| Business user | "How do I work my tasks?" | How to use → Business user |
| Process developer | "How do I build, switch on and test a process?" | How to use → Process developer; knowledge base |
| Business analyst | "How do I change a rule safely?" | How to use → Business analyst |
| Operations | "How do I fix and resubmit?" | How to use → Operations |
| Architect or PM | "How do the parts and data fit, and where do agents belong?" | Architecture, knowledge base, patterns, Agent Scan Lab, market |

## 5. User stories

- As a **beginner**, I want a short ordered path so I know where to start and when I'm done.
- As a **presenter**, I want a script with what to click, what to say and which question it answers, so that every demo is consistent.
- As a **business user**, I want to know how to accept, complete and delegate a task, and how to check it worked.
- As a **developer**, I want to know why my newly uploaded process does not start, and how to enable it.
- As an **analyst**, I want to change a decision table and deploy it without a developer rebuilding the process.
- As **operations**, I want to resubmit a failed instance safely, and to know which permissions I need.
- As a **reader without time to click**, I want everything on one printable page with diagrams and an answer key.
- As a **Chinese-speaking reader**, I want the project explained in Chinese.

## 6. v1.0 scope and acceptance criteria

| # | Capability | Acceptance criteria (all met in v1.0.0) |
| --- | --- | --- |
| 1 | **Start here** explainer | Six hands-on steps, plus a beginner path (5 stops) and a knowledge-at-a-glance counter |
| 2 | **IBM webMethods branding** | The product name leads in the title, header, metadata and READMEs; disclaimer kept; no logos |
| 3 | **Knowledge base** | 7 topics and 42 facts, each with a public source and a practitioner note; family table with 9 components |
| 4 | **How to use** | 4 role guides; each step gives a menu path and a source; each guide has a "you'll know it worked" check and a tip |
| 5 | **Customer demo script** | 6 beats in about 10 minutes, each with what to click, what to say and the question it answers; labelled *Author's view* |
| 6 | **Simulator** | Runs a loan instance through a rule task and a human task, and writes audit-style log rows |
| 7 | **Agent Scan Lab** | Classifies steps from process history; synthetic sample or a CSV the user uploads, processed in the browser only |
| 8 | **Glossary and quiz** | 33 searchable terms; 20 questions with explanations |
| 9 | **Reading version** | One printable page with 17 sections, 5 static diagrams, and the quiz with an answer key |
| 10 | **READMEs** | English and Chinese, with a language toggle and an author credit |
| 11 | **Quality** | The smoke test passes at 390 × 844 with no JavaScript errors |

## 7. Content and compliance principles

- **Public sources only.** Every product fact links to IBM or Software AG documentation, or to another public report. Market views are clearly labelled as *Author's view*.
- **No confidential material.** No customer names, revenue, usage data or internal plans.
- **Independence.** Every page states that the site is not affiliated with IBM. Product names are trademarks of their owners. No logos are used.
- **Absolute dates.** For example, "Oct 2027", never "next year".
- **Version caveat.** Menu paths follow public documentation, and labels can differ by version.
- **Privacy by design.** No analytics, cookies or network calls. Uploaded CSVs stay in the browser.
- **Authorship and attribution.** Daniel Yuanpeng Xu is credited as the author on every page, both READMEs, this PRD, every pull request and release, and in `CITATION.cff`. Anyone who reuses the material must credit him.

## 8. Success measures

Because the site collects no analytics by design, success is measured from outside the site:

| Measure | Signal | Target for the first 90 days |
| --- | --- | --- |
| Reach | GitHub stars, forks and repository traffic (owner view) | Steady growth; no target set yet |
| Demo use | Customer demos run with the script (author's log) | Used in real customer conversations |
| Usefulness | Issues or messages asking for a topic or correction | At least one external request handled |
| Accuracy | Corrections needed for wrong facts | Every correction fixed within one release |
| Quality | Smoke test on every change | 100% passing before merge |

## 9. Release criteria for v1.0.0

- Every scope item in section 6 is shipped and covered by the smoke test.
- The live GitHub Pages site serves the release.
- The disclaimer, author credit and sources are present in both versions.
- `CHANGELOG.md`, this PRD and the GitHub Release notes are published.

## 10. Roadmap

**v1.1 (next)**
- Knowledge base: Monitor/Optimize, deployment and upgrade topics.
- Simulator: timer escalation and parallel-gateway scenarios.
- Agent Scan Lab: adjustable thresholds and CSV export.
- Visual BPMN diagram for each worked case.

**v1.2+**
- ~~Chinese user interface.~~ Done (#68): the whole site is in English and Simplified Chinese.
- A module on moving webMethods Business Rules to IBM ODM decision services.
- A downloadable PDF of the reading version for each release.

## 11. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Facts drift as new versions ship (for example 11.1 → 12.1) | Wrong steps for users | Cite the version for every source; add a version caveat to every guide; review on each major release |
| Documentation links break or need JavaScript to render | Facts become hard to verify | Prefer stable Software AG documentation URLs; keep a second source where possible |
| Readers mistake the site for official IBM material | Brand or legal concern | Disclaimer on every page; no logos; "independent" in the description |
| Author's views read as vendor positions in customer demos | Misunderstanding | *Author's view* labels; presenter guidance in the demo script |
| Confidential information slips in | Serious | Insights-only rule; content review before each merge |

## 12. Open questions

1. **License:** which open licence to publish under (for example CC BY 4.0 for content and MIT for code)?
2. **Customer use:** is any internal review needed before the site is used in customer meetings?
3. **Domain:** keep `github.io`, or use a custom domain?
4. **Chinese interface:** is it needed for v1.2, or are the Chinese READMEs enough for now?

## 13. Author

**Daniel Yuanpeng Xu** is the author and product owner. He is a product manager in business process and decision automation, based in Toronto. He set the product direction, defined the audiences and scope, chose and verified the public sources, wrote the *Author's view* frameworks, directed and reviewed every change, and decides each release. The academy is his independent work and is not affiliated with or endorsed by IBM.

- **Contact:** [GitHub @Xudaniel](https://github.com/Xudaniel) · [LinkedIn](https://www.linkedin.com/in/danielxuvision/)
- **Cite as:** Xu, Daniel Yuanpeng (2026). *IBM webMethods BPMS Academy* (v2.2.0). https://github.com/xudaniel/webmethods-bpms-academy

## 14. Release history

| Version | Date | What shipped |
| --- | --- | --- |
| Unreleased | 2026-11-17 | Examples: optimization primer in examples/optimization (algorithm steps, C, OR-Tools, docplex/CPLEX code) (#87) |
| Unreleased | 2026-11-17 | Knowledge base: IBM Integration rename, 12.1 upgrade tooling and licensing facts, new topic on agents and human tasks across IBM; EN + 中文; 11 topics, 72 facts (#85) |
| Unreleased | 2026-11-17 | Lifecycle wording follows IBM's current page: 10.15 end of support 31 Oct 2027, extended support to 2028 and 2030; EN + 中文 (#83) |
| Unreleased | 2026-11-17 | Knowledge base: webMethods and IBM webMethods Hybrid Integration (IWHI), cited, EN + 中文; 10 topics, 62 facts (#81) |
| Unreleased | 2026-11-16 | 中文版 batch 4: reading version and executive briefs in Chinese; Chinese browsers open in Chinese; the whole site is now bilingual (#68) |
| Unreleased | 2026-11-16 | Site search: 🔍 or "/" searches every section in the browser, English and Chinese, and opens the exact place (#77) |
| Unreleased | 2026-11-16 | Review book: spaced review of every wrong answer across seven question sources (1 → 3 days, 7 after a lapse); English and Chinese (#76) |
| Unreleased | 2026-11-16 | On-call drills: three branching incidents with a clock and cited debriefs; On-call hero badge; English and Chinese (#50) |
| Unreleased | 2026-11-16 | Instance time machine: replay a finished simulator instance from its audit rows, with a volatile-tracking toggle; English and Chinese (#51) |
| Unreleased | 2026-11-16 | Swipe sort: rule, agent or human? 20 cards in 60 seconds, answers from the scan lab's classifier, English and Chinese (#53) |
| Unreleased | 2026-11-16 | 中文版 batch 3b: controls for regulated industries, decision lab, Fix the diagram; all 22 course sections now in Chinese (#68) |
| Unreleased | 2026-11-16 | 中文版 batch 3a: overview, lifecycle, architecture, BPMN, patterns, cases, simulator, Agent Scan Lab, market, glossary, quiz and their diagrams (#68) |
| Unreleased | 2026-11-16 | 中文版 batch 2: knowledge base, how-to guides and cheat sheets, demo script, lab, troubleshooting, workshop plan and their diagrams (#68) |
| Unreleased | 2026-11-16 | 中文版 batch 1: language switch; Start here, 10-minute course, Basics 101, menus, terms, story and their diagrams in Simplified Chinese (#68) |
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
