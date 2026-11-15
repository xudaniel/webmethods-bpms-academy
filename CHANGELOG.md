# Changelog

All notable changes to the IBM webMethods BPMS Academy. Author: **Daniel Yuanpeng Xu**.
Versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- **Hands-on lab: your first process in 30 minutes.** 8 stages to build, enable, run and monitor a purchase-approval process, with checkpoints, cited steps, a pitfalls table, a practice path without an environment, and a level-up exercise. Progress is saved in the learner's browser. A printable lab sheet is in the reading version (#16).
- 3 glossary terms and 2 quiz questions (glossary 36, quiz 22).
- **Troubleshooting:** 16 searchable problems in 4 areas. Each gives what to check first, the fix, where to apply it, and a source (#18).
- **Role cheat sheets** that print on their own, and **self-checks** with 12 questions across the four roles (#19).
- **Teach a class:** a 3-hour workshop agenda, a print list and facilitator tips (#20).

- **Phone guide** on Start here and in both READMEs: save to the Home Screen on iPhone (iOS 26) and Android, finding your way, offline, text size, PDF. A QR code is shown on large screens (#24).
- **Mobile experience:** a ☰ Sections menu, Previous/Next on every section, a back-to-top button (plus Contents in the reading version), collapsible troubleshooting entries, larger tap targets, a compact header, iPhone safe areas, a scroll shadow on the tab bar, and pages that open at the top. Install as an app (manifest, icons, theme colour) and work offline (network-first service worker) (#25).

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

[1.0.0]: https://github.com/xudaniel/webmethods-bpms-academy/releases/tag/v1.0.0
