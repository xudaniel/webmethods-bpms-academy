"""Smoke test: serves the site locally, opens every section at phone width,
runs the simulator and the Agent Scan Lab, and fails on any JavaScript error.

Usage:  pip install playwright && playwright install chromium
        python3 tests/smoke_test.py            (run from the repo root)
"""
import asyncio, functools, http.server, sys, threading
from playwright.async_api import async_playwright

SECTIONS = ["start", "crash", "basics", "overview", "knowledge", "controls", "howto", "lab", "decisions", "puzzles", "trouble", "teach", "lifecycle", "architecture", "bpmn", "patterns", "cases",
            "simulator", "scan", "market", "glossary", "quiz"]

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def serve(port=8765):
    handler = functools.partial(QuietHandler, directory=".")
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

async def main():
    srv = serve()
    errors, failures = [], []
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" and "Failed to load resource" not in m.text else None)
        await page.goto("http://127.0.0.1:8765/index.html")
        for s in SECTIONS:
            await page.click(f"nav button[data-section={s}]")
            if not await page.is_visible(f"#{s}") or len(await page.inner_text(f"#{s}")) < 200:
                failures.append(f"section {s} empty or hidden")
        # Knowledge base (issues #7, #8): IBM branding, counter, family, cited topics
        if "v2.2.0" not in await page.inner_text("#version"):
            failures.append("footer should show the release version")
        if not (await page.title()).startswith("IBM webMethods"):
            failures.append("title should lead with IBM webMethods")
        await page.click("nav button[data-section=start]")
        if await page.locator("#kb-counter .kb-stat").count() != 6:
            failures.append("knowledge-at-a-glance counter missing")
        if await page.locator("#kb-family tr").count() < 8:
            failures.append("IBM webMethods family table missing")
        if await page.locator("#kb-topics .kb-topic").count() < 6:
            failures.append("knowledge topics missing")
        if "Volatile Tracking" not in await page.inner_text("#kb-engine"):
            failures.append("Process Engine QoS topic missing")
        if await page.locator("#kb-topics .kb-topic .sources a").count() < 10:
            failures.append("knowledge topics should cite sources")
        # How to use (issues #10, #11): beginner path, role guides, demo script
        if await page.locator("#beginner-path li").count() != 5:
            failures.append("beginner path missing")
        await page.click("nav button[data-section=howto]")
        for role, word in [("user", "Accept"), ("dev", "Execution Enabled"), ("analyst", "Hot Deploy"), ("ops", "Resubmit"), ("demo", "Say:")]:
            await page.click(f"#howto-tabs [data-role={role}]")
            if word not in await page.inner_text("#howto-body"):
                failures.append(f"how-to guide {role} missing '{word}'")
        # Hands-on lab (issue #16): stages, sources, progress tracker
        await page.click("nav button[data-section=lab]")
        if await page.locator("#lab-stages .lab-stage").count() != 8:
            failures.append("lab should have 8 stages")
        if await page.locator("#lab-stages .sources a").count() < 8:
            failures.append("lab stages should cite sources")
        await page.click("#lab-stages input[data-k] >> nth=0")
        if not (await page.inner_text("#lab-count")).startswith("1 /"):
            failures.append("lab progress tracker did not update")
        await page.click("#lab-reset")
        if not (await page.inner_text("#lab-count")).startswith("0 /"):
            failures.append("lab reset did not clear progress")
        # Troubleshooting, cheat sheets, teach (issues #18-#20)
        await page.click("nav button[data-section=trouble]")
        total = await page.locator("#tr-list .trouble").count()
        if total < 12:
            failures.append("troubleshooting should list at least 12 problems")
        await page.fill("#tr-search", "hot deploy")
        if not 0 < await page.locator("#tr-list .trouble").count() < total:
            failures.append("troubleshooting search did not filter")
        await page.fill("#tr-search", "")
        await page.click("#tr-areas [data-area='Tasks']")
        if await page.locator("#tr-list .trouble").count() >= total:
            failures.append("troubleshooting area filter did not filter")
        await page.click("nav button[data-section=howto]")
        await page.click("#howto-tabs [data-role=ops]")
        if await page.locator("#howto-body .cheat-sheet").count() != 1:
            failures.append("cheat sheet missing under role guide")
        await page.click("#howto-body .self-check .quiz-q >> nth=0 >> button >> nth=1")
        if "1 / 3" not in await page.inner_text("#sc-score"):
            failures.append("role self-check did not score")
        await page.click("nav button[data-section=teach]")
        if "180" not in await page.inner_text("#teach-agenda"):
            failures.append("teach agenda should total 180 minutes")
        await page.click("nav button[data-section=start]")
        await page.click("#ex-toggle button[data-mode=with]")
        if "audit trail" not in await page.inner_text("#ex-story"):
            failures.append("explainer before/after toggle")
        await page.click("#ex-sort .quiz-q >> nth=0 >> button[data-o=process]")
        if "1 / 1" not in await page.inner_text("#ex-sort-score"):
            failures.append("explainer sorting game")
        await page.fill("#ex-limit", "3000")
        if "rule_version=v2" not in await page.inner_text("#ex-guard-log"):
            failures.append("explainer decision guard did not re-evaluate")
        await page.click("#ex-timeline .tile >> nth=4")
        if "end of maintenance" not in await page.inner_text("#ex-timeline-detail"):
            failures.append("explainer timeline")
        await page.click("nav button[data-section=simulator]")
        await page.click("#sim-start")
        for _ in range(3):
            await page.click("#sim-next")
        if await page.is_visible("#sim-human"):
            await page.click("#sim-human button[data-v=APPROVE]")
        await page.click("#sim-next")
        if "status=COMPLETED" not in await page.inner_text("#sim-log"):
            failures.append("simulator did not complete")
        await page.click("nav button[data-section=scan]")
        await page.click("#scan-sample")
        if "Rule candidate" not in await page.inner_text("#scan-out"):
            failures.append("scan lab produced no rule candidate")
        # Reading time, diagrams, fun (issues #27-#29)
        n_sec = await page.locator("main > .section").count()
        if await page.locator("main > .section > .readtime").count() != n_sec:
            failures.append("every section should show a reading time")
        if await page.locator("#menu-sheet .menu-item .rt").count() < 15:
            failures.append("menu should show reading times")
        if await page.locator("#kb-engine .qos").count() != 1:
            failures.append("interactive QoS diagram missing")
        await page.evaluate("location.hash='knowledge'")
        await page.click("#kb-engine [data-q=vt]")
        if "Not visible in Monitor" not in await page.inner_text("#kb-engine .qos-out"):
            failures.append("QoS diagram did not react to Volatile Tracking")
        if await page.locator("#kb-topics img[src$='.svg']").count() != 2:
            failures.append("knowledge SVG diagrams not rendered")
        await page.evaluate("location.hash='lab'")
        if await page.locator("#lab figure.dg svg").count() != 1:
            failures.append("lab BPMN diagram missing")
        if await page.locator("#trouble figure.dg").count() != 1 or await page.locator("#teach .tl-seg").count() < 8:
            failures.append("troubleshooting flowchart or workshop timeline missing")
        await page.evaluate("location.hash='howto'")
        for role in ["user", "dev", "analyst", "ops"]:
            await page.click(f"#howto-tabs [data-role={role}]")
            if await page.locator("#howto-body figure.dg").count() != 1:
                failures.append(f"how-to {role} diagram missing")
        if await page.locator("#fun-badges .badge.earned").count() < 1:
            failures.append("no badge unlocked after changing the agent policy")
        if "sections explored" not in await page.inner_text("#fun-count"):
            failures.append("explorer progress missing")
        if len(await page.inner_text("#dyk-text")) < 20:
            failures.append("did-you-know fact missing")
        # Role paths and the map (issues #31, #32)
        await page.evaluate("location.hash='start'")
        await page.wait_for_timeout(100)
        if await page.locator("#role-chips .role-chip").count() != 7:
            failures.append("role picker should offer 7 roles")
        await page.click(".role-chip[data-r=dev]")
        if "Hands-on lab" not in await page.inner_text("#beginner-path"):
            failures.append("developer path missing the lab")
        await page.click("#beginner-path a[data-step='2']")
        await page.wait_for_timeout(250)
        if await page.evaluate("location.hash") != "#howto" or await page.evaluate("document.querySelector('#howto-tabs .tile.selected').dataset.role") != "dev":
            failures.append("path step did not open the developer guide")
        if "Next: Hands-on lab" not in await page.inner_text("#howto .path-next"):
            failures.append("path next-step banner missing")
        await page.evaluate("location.hash='start'")
        await page.wait_for_timeout(100)
        if await page.locator("#beginner-path li.done-step").count() < 1:
            failures.append("path step not ticked")
        if await page.locator("#bpms-map a.map-node").count() != 9:
            failures.append("map should have 9 clickable boxes")
        await page.click("#bpms-map a.map-node[data-k=enable]")
        await page.wait_for_timeout(300)
        if await page.evaluate("location.hash") != "#trouble" or not await page.evaluate("document.querySelector('#trouble details.dg-more').open"):
            failures.append("map 'Enable' box should open the won't-start flowchart")
        # 10-minute course (issue #64): five steps with pictures, Back/Next, three checks, finish card
        await page.evaluate("location.hash='crash'")
        await page.wait_for_timeout(150)
        if await page.locator("#crash .cc-step").count() != 6 or await page.locator("#crash figure.dg svg").count() != 5:
            failures.append("10-minute course should have 5 steps with pictures plus a check step")
        if not await page.is_visible("#crash .cc-step[data-i='0']") or await page.is_visible("#crash .cc-step[data-i='1']"):
            failures.append("10-minute course should show one step at a time")
        for _ in range(5):
            await page.click("#crash-nav .cc-next")
        if not await page.is_visible("#crash .cc-step[data-i='5']") or await page.is_visible("#crash-nav .cc-next"):
            failures.append("Next should reach the checks and then hide")
        for i in range(3):
            await page.click(f"#crash .cc-check[data-i='{i}'] button[data-j='1']")
        if "3 / 3" not in await page.inner_text("#cc-done"):
            failures.append("10-minute course finish card should show 3 / 3")
        await page.click("#crash-nav .cc-back")
        if not await page.is_visible("#crash .cc-step[data-i='4']"):
            failures.append("Back should return to step 5")
        if "10-minute course" not in await page.inner_text("#beginner-path") and "10-minute course" not in await page.inner_text("nav"):
            failures.append("10-minute course not linked")
        # Basics 101 (issue #40): seven lessons, pictures, checks, progress
        await page.evaluate("location.hash='basics'")
        await page.wait_for_timeout(150)
        if await page.locator("#basics .basics-lesson").count() != 7 or await page.locator("#basics figure.dg").count() != 7:
            failures.append("Basics 101 should have 7 lessons, each with a picture")
        await page.click("#b-process .basics-check button[data-j='0']")
        if "Not quite" not in await page.inner_text("#b-process .explain") or not (await page.inner_text("#basics-count")).startswith("0 /"):
            failures.append("a wrong Basics answer should explain and not count")
        await page.click("#b-process .b-retry")
        await page.click("#b-process .basics-check button[data-j='1']")
        if not (await page.inner_text("#basics-count")).startswith("1 / 7"):
            failures.append("a right Basics answer should count")
        await page.click("#b-process .b-next")
        if not await page.evaluate("document.querySelector('#b-workers').open"):
            failures.append("Next lesson should open lesson 2")
        await page.click("#basics-reset")
        # More diagrams (issue #44): every section that teaches a structure has a picture
        for key, sec in [("arch-map", "architecture"), ("lifecycle-loop", "lifecycle"), ("bpmn-gateways", "bpmn"), ("bpmn-lanes", "bpmn"),
                         ("agent-pattern", "patterns"), ("case-0", "cases"), ("case-1", "cases"), ("case-2", "cases"), ("sim-loan", "simulator"),
                         ("scan-method", "scan"), ("decision-table", "decisions")]:
            if await page.locator(f'#{sec} figure[data-dg="{key}"] svg').count() != 1:
                failures.append(f"diagram {key} missing in {sec}")
        # Mia's request (issue #48): one story through the course
        if await page.locator("main .story-card").count() != 17 or await page.locator("#story-cast li").count() != 5:
            failures.append("story cards or cast missing")
        await page.evaluate("location.hash='trouble'")
        await page.wait_for_timeout(100)
        await page.click("#trouble .story-next")
        await page.wait_for_timeout(200)
        if await page.evaluate("location.hash") != "#patterns" or not await page.is_visible("#patterns .story-card"):
            failures.append("Next in Mia's story should open the next chapter")
        # Fix the diagram (issue #52): solve level 1, fail level 2 on purpose
        await page.evaluate("location.hash='puzzles'")
        await page.wait_for_timeout(100)
        if await page.locator("#pz-chips .pz-chip").count() != 5:
            failures.append("puzzles should have 5 levels")
        await page.click("#pz-chips [data-l='1']")
        await page.click("#pz-1 .pz-piece[data-k='end']")
        await page.click("#pz-1 .pz-run")
        try:
            await page.wait_for_selector("#pz-1 .pz-ok", timeout=6000)
        except Exception:
            failures.append("level 1 should be solved with the end event")
        await page.click("#pz-chips [data-l='2']")
        await page.click("#pz-2 .pz-piece[data-k='x']")
        await page.click("#pz-2 .pz-run")
        try:
            await page.wait_for_selector("#pz-2 .pz-bad", timeout=6000)
        except Exception:
            failures.append("level 2 should fail with an exclusive gateway")
        if not (await page.inner_text("#pz-count")).startswith("1 / 5"):
            failures.append("puzzle progress should count level 1")
        await page.click("#pz-reset")
        # Controls for regulated industries (issue #58)
        await page.evaluate("location.hash='controls'")
        await page.wait_for_timeout(100)
        if await page.locator("#controls .ctl-row").count() != 7 or await page.locator("#controls .fw").count() != 6:
            failures.append("control map should have 7 controls and 6 frameworks")
        if await page.locator("#controls .fw .sources a").count() != 6 or await page.locator("#controls .ctl-row .sources a").count() < 7:
            failures.append("every framework and control should cite a source")
        if "not legal or compliance advice" not in await page.inner_text("#controls"):
            failures.append("control map needs its disclaimer")
        await page.click("#ctl-trace .fw-pill >> nth=0")
        await page.wait_for_timeout(300)
        if await page.evaluate("location.hash") != "#controls":
            failures.append("framework jump should stay on the Controls section")
        # Professional mode, executive briefs, review dates (issue #59)
        ctx = await browser.new_context(viewport={"width": 390, "height": 844})
        pro = await ctx.new_page()
        pro.on("pageerror", lambda e: errors.append("pro: " + str(e)))
        await pro.goto("http://127.0.0.1:8765/index.html?mode=pro#start")
        await pro.wait_for_timeout(300)
        if not await pro.evaluate("document.body.classList.contains('pro')") or await pro.is_visible("#start .story-card") or await pro.is_visible("#fun-card"):
            failures.append("?mode=pro should hide the story and the badges")
        await pro.click("#pro-toggle")
        if not await pro.is_visible("#start .story-card"):
            failures.append("turning professional mode off should bring the story back")
        await pro.evaluate("location.hash='knowledge'")
        await pro.wait_for_timeout(100)
        if await pro.locator("#knowledge .kb-reviewed").count() < 8:
            failures.append("knowledge topics should show a last-reviewed date")
        await pro.goto("http://127.0.0.1:8765/brief.html")
        await pro.wait_for_timeout(300)
        for ind in ["banking", "insurance"]:
            if await pro.locator(f"#{ind} tr").count() != 6 or await pro.locator(f"#{ind} .foot li").count() < 8 or await pro.locator(f"#{ind} figure svg").count() != 1:
                failures.append(f"{ind} brief incomplete")
        await ctx.close()
        # Hotfix (issue #41): index.html must be the real page, and the Decision lab must work
        html = open("index.html", encoding="utf-8").read()
        if len(html) < 10000 or "$(cat" in html:
            failures.append("index.html looks truncated or overwritten")
        await page.evaluate("location.hash='decisions'")
        await page.wait_for_timeout(100)
        await page.click("#dt-run")
        if "REFER" not in await page.inner_text("#dt-result"):
            failures.append("decision table lab should refer a 690 score")
        await page.click("#ag-run")
        if "Hot Deploy" not in await page.inner_text("#ag-log"):
            failures.append("agility comparison did not run")
        if await page.locator("#rules-pitfalls tr").count() < 6:
            failures.append("rules pitfalls table missing")
        if await page.locator("#rules-pitfalls td a[href^='https://documentation.softwareag.com']").count() < 6:
            failures.append("every factual rules pitfall should cite a public source")
        for kb in ["monitor", "upgrade"]:
            if await page.locator(f"#kb-{kb} .sources a").count() < 4:
                failures.append(f"knowledge topic {kb} missing or uncited")
        # Plain words and Beginner mode (issue #38)
        await page.evaluate("location.hash='lab'")
        await page.wait_for_timeout(150)
        if await page.locator("#lab .term").count() < 8:
            failures.append("lab should underline key terms")
        await page.click("#lab .term[data-t=enable] >> nth=0")
        if not await page.is_visible("#term-pop") or "on-switch" not in await page.inner_text("#term-pop"):
            failures.append("tapping a term should explain it in plain words")
        await page.keyboard.press("Escape")
        if await page.is_visible("#term-pop"):
            failures.append("Escape should close the term explanation")
        if await page.locator("#glossary-list .term, .quiz-q .term").count() != 0:
            failures.append("glossary and quiz text should not be underlined")
        await page.click("#bm-toggle")
        if await page.is_visible("nav button[data-section=market]") or not await page.is_visible("#lab .plain-box"):
            failures.append("Beginner mode should hide advanced tabs and show plain-words boxes")
        if "Decision lab" not in await page.inner_text("#lab .prevnext") or "Teach" in await page.inner_text("#trouble .prevnext"):
            failures.append("Beginner mode previous/next should skip advanced sections")
        await page.click("#bm-toggle")
        if not await page.is_visible("nav button[data-section=market]"):
            failures.append("turning Beginner mode off should restore every tab")
        # Mobile experience (issues #24, #25): menu, previous/next, back to top, phone guide, no overflow at 360 px
        if "Add to Home Screen" not in await page.inner_text("#phone-guide-body"):
            failures.append("phone guide missing iPhone steps")
        await page.click("#menu-btn")
        if not await page.is_visible("#menu-sheet"):
            failures.append("sections menu did not open")
        await page.click("#menu-sheet [data-goto=lab]")
        await page.wait_for_timeout(150)
        if await page.is_visible("#menu-sheet") or not await page.is_visible("#lab"):
            failures.append("sections menu did not navigate")
        n_sections = await page.locator("main > .section").count()
        if await page.locator(".prevnext").count() != n_sections:
            failures.append("every section should end with previous/next")
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(300)
        if "show" not in (await page.get_attribute(".fab", "class") or ""):
            failures.append("back-to-top button did not appear")
        small = await browser.new_page(viewport={"width": 360, "height": 740})
        small.on("pageerror", lambda e: errors.append("360px: " + str(e)))
        await small.goto("http://127.0.0.1:8765/index.html")
        for s2 in SECTIONS:
            await small.evaluate(f"location.hash = '{s2}'")
            await small.wait_for_timeout(60)
            if await small.evaluate("document.documentElement.scrollWidth - innerWidth") > 0:
                failures.append(f"horizontal overflow at 360 px in {s2}")
        await small.close()
        import json, os
        man = json.load(open("manifest.webmanifest"))
        for ic in man["icons"]:
            if not os.path.exists(ic["src"]):
                failures.append(f"manifest icon missing: {ic['src']}")
        if not os.path.exists("sw.js"):
            failures.append("service worker missing")
        # Reading version (issue #5): all text rendered, five diagrams, quiz + key
        page2 = await browser.new_page(viewport={"width": 390, "height": 844})
        page2.on("pageerror", lambda e: errors.append("read.html: " + str(e)))
        await page2.goto("http://127.0.0.1:8765/read.html")
        if await page2.locator("#r-paths tr").count() != 8 or await page2.locator("#r-why figure svg").count() < 1:
            failures.append("read.html role table or map missing")
        if "interactive version" in (await page2.inner_text("#r-paths")).replace("Run a process (interactive version)", ""):
            failures.append("read.html role table should use chapter numbers")
        if await page2.locator("figure svg").count() < 13:
            failures.append("read.html should have at least 13 diagrams (5 original + new)")
        if await page2.locator("main section.card .readtime").count() < 20 or await page2.locator("nav.toc .readtime.total").count() != 1:
            failures.append("read.html reading times missing")
        if await page2.locator("#r-q > li").count() != await page2.locator("#r-a > li").count() or await page2.locator("#r-a > li").count() < 10:
            failures.append("read.html quiz and answer key mismatch")
        if await page2.locator("#r-ch h3").count() != 4 or await page2.locator("#r-tr h3").count() != 4 or await page2.locator("#r-teach-agenda tr").count() < 9:
            failures.append("read.html troubleshooting, cheat sheets or teach section missing")
        if await page2.locator("#r-lab-stages h3").count() != 8:
            failures.append("read.html lab sheet missing")
        if await page2.locator("#r-roles h3").count() != 4 or await page2.locator("#r-demo li").count() != 6:
            failures.append("read.html how-to guides or demo script missing")
        if await page2.locator('figure[data-dg="lifecycle-loop"], figure[data-dg="bpmn-gateways"], figure[data-dg="bpmn-lanes"], figure[data-dg="agent-pattern"], figure[data-dg="scan-method"], figure[data-dg^="case-"]').count() != 7:
            failures.append("read.html should show the 7 new diagrams")
        if await page2.locator("#r-basics figure.dg").count() != 7 or "Answer key" not in await page2.inner_text("#r-basics"):
            failures.append("read.html Basics 101 chapter missing pictures or answer key")
        if await page2.locator("main .story-card").count() != 15 or await page2.locator("#story-cast li").count() != 5:
            failures.append("read.html story boxes or cast missing")
        if await page2.locator("#r-controls .ctl-row").count() != 7 or not (await page2.inner_text("#r-kb h3 >> nth=0")).startswith("4.1"):
            failures.append("read.html controls chapter or knowledge numbering wrong")
        if await page2.locator("main .term").count() < 40:
            failures.append("read.html should underline key terms")
        if await page2.locator("#r-kb h3").count() < 6 or await page2.locator("#r-family tr").count() < 8:
            failures.append("read.html knowledge base or family table missing")
        for sel in ["#r-kb-count", "#r-arch-list", "#r-pat", "#r-gloss", "#r-guard-table", "#r-src"]:
            if len(await page2.inner_text(sel)) < 50:
                failures.append(f"read.html {sel} empty")
        # 中文版 (issue #68): own context so the remembered language does not leak into the English checks
        zctx = await browser.new_context(viewport={"width": 390, "height": 844})
        zp = await zctx.new_page()
        zp.on("pageerror", lambda e: errors.append("zh: " + str(e)))
        await zp.goto("http://127.0.0.1:8765/index.html?lang=zh#start")
        await zp.wait_for_timeout(500)
        if await zp.evaluate("document.documentElement.lang") != "zh-CN" or (await zp.inner_text("nav button[data-section='start']")) != "从这里开始":
            failures.append("zh: language or nav not switched")
        missing = await zp.evaluate("[...document.querySelectorAll('[data-i18n]')].map(e => e.dataset.i18n).filter(k => !(k in ZH.page))")
        if missing:
            failures.append(f"zh: page keys without a translation: {missing}")
        if "认识一下登场人物" not in await zp.inner_text("#story-cast") or await zp.locator("#start .zh-note").count() != 0:
            failures.append("zh: Start here not translated")
        if await zp.locator("#overview .zh-note").count() != 1:
            failures.append("zh: untranslated sections should say so")
        if "画出流程" not in await zp.inner_text("#bpms-map"):
            failures.append("zh: map labels not translated")
        await zp.evaluate("location.hash='crash'")
        await zp.wait_for_timeout(150)
        if "BPMS 是什么" not in await zp.inner_text("#crash .cc-step[data-i='0']") or "流程模型" not in await zp.inner_text("#crash figure.dg >> nth=0"):
            failures.append("zh: 10-minute course or its diagram not translated")
        for _ in range(5):
            await zp.click("#crash-nav .cc-next")
        for i in range(3):
            await zp.click(f"#crash .cc-check[data-i='{i}'] button[data-j='1']")
        if "答对 3 / 3" not in await zp.inner_text("#cc-done"):
            failures.append("zh: 10-minute course finish card")
        await zp.evaluate("location.hash='basics'")
        await zp.wait_for_timeout(150)
        if await zp.locator("#basics .basics-lesson").count() != 7 or "流程就是一份" not in await zp.inner_text("#b-process summary"):
            failures.append("zh: Basics 101 not translated")
        await zp.click("#lang-toggle")
        await zp.wait_for_timeout(600)
        if await zp.evaluate("document.documentElement.lang") != "en" or (await zp.inner_text("nav button[data-section='start']")) != "Start here":
            failures.append("zh: switching back to English failed")
        await zctx.close()
        await browser.close()
    srv.shutdown()
    # Diagram images referenced by knowledge topics must exist (missing ones are hidden on the page, but reported here)
    import os, re
    for img in re.findall(r'image:\s*"([^"]+)"', open("js/knowledge.js").read()):
        if not os.path.exists(img):
            print(f"WARN: knowledge diagram not in repo yet: {img} (hidden on the page)")
    if os.path.getsize("js/app.js") < 5000:
        failures.append("js/app.js looks truncated")
    problems = failures + [f"js error: {e}" for e in errors]
    print("\n".join(problems) if problems else "OK: all sections, simulator and scan lab passed, including the knowledge base")
    sys.exit(1 if problems else 0)

asyncio.run(main())
