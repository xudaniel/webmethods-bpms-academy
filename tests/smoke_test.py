"""Smoke test: serves the site locally, opens every section at phone width,
runs the simulator and the Agent Scan Lab, and fails on any JavaScript error.

Usage:  pip install playwright && playwright install chromium
        python3 tests/smoke_test.py            (run from the repo root)
"""
import asyncio, functools, http.server, sys, threading
from playwright.async_api import async_playwright

SECTIONS = ["start", "overview", "knowledge", "howto", "lab", "trouble", "teach", "lifecycle", "architecture", "bpmn", "patterns", "cases",
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
        if "v1.0.0" not in await page.inner_text("#version"):
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
        # Reading version (issue #5): all text rendered, five diagrams, quiz + key
        page2 = await browser.new_page(viewport={"width": 390, "height": 844})
        page2.on("pageerror", lambda e: errors.append("read.html: " + str(e)))
        await page2.goto("http://127.0.0.1:8765/read.html")
        if await page2.locator("figure svg").count() != 5:
            failures.append("read.html should have 5 diagrams")
        if await page2.locator("#r-q > li").count() != await page2.locator("#r-a > li").count() or await page2.locator("#r-a > li").count() < 10:
            failures.append("read.html quiz and answer key mismatch")
        if await page2.locator("#r-ch h3").count() != 4 or await page2.locator("#r-tr h3").count() != 4 or await page2.locator("#r-teach-agenda tr").count() < 9:
            failures.append("read.html troubleshooting, cheat sheets or teach section missing")
        if await page2.locator("#r-lab-stages h3").count() != 8:
            failures.append("read.html lab sheet missing")
        if await page2.locator("#r-roles h3").count() != 4 or await page2.locator("#r-demo li").count() != 6:
            failures.append("read.html how-to guides or demo script missing")
        if await page2.locator("#r-kb h3").count() < 6 or await page2.locator("#r-family tr").count() < 8:
            failures.append("read.html knowledge base or family table missing")
        for sel in ["#r-kb-count", "#r-arch-list", "#r-pat", "#r-gloss", "#r-guard-table", "#r-src"]:
            if len(await page2.inner_text(sel)) < 50:
                failures.append(f"read.html {sel} empty")
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
