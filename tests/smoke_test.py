"""Smoke test: serves the site locally, opens every section at phone width,
runs the simulator and the Agent Scan Lab, and fails on any JavaScript error.

Usage:  pip install playwright && playwright install chromium
        python3 tests/smoke_test.py            (run from the repo root)
"""
import asyncio, functools, http.server, sys, threading
from playwright.async_api import async_playwright

SECTIONS = ["overview", "lifecycle", "architecture", "bpmn", "patterns", "cases",
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
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        await page.goto("http://127.0.0.1:8765/index.html")
        for s in SECTIONS:
            await page.click(f"nav button[data-section={s}]")
            if not await page.is_visible(f"#{s}") or len(await page.inner_text(f"#{s}")) < 200:
                failures.append(f"section {s} empty or hidden")
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
        await browser.close()
    srv.shutdown()
    problems = failures + [f"js error: {e}" for e in errors]
    print("\n".join(problems) if problems else "OK: all sections, simulator and scan lab passed")
    sys.exit(1 if problems else 0)

asyncio.run(main())
