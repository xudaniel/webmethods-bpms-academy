"""Smoke test: serves the site locally, opens every section at phone width,
runs the simulator and the Agent Scan Lab, and fails on any JavaScript error.

Usage:  pip install playwright && playwright install chromium
        python3 tests/smoke_test.py            (run from the repo root)
"""
import asyncio, functools, http.server, sys, threading
from playwright.async_api import async_playwright

SECTIONS = ["start", "crash", "basics", "overview", "knowledge", "controls", "howto", "lab", "decisions", "capstone", "puzzles", "swipe", "trouble", "drills", "teach", "lifecycle", "architecture", "bpmn", "patterns", "cases",
            "simulator", "scan", "market", "glossary", "quiz", "review"]

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
        if "v2.7.0" not in await page.inner_text("#version"):
            failures.append("footer should show the release version")
        if not (await page.title()).startswith("IBM webMethods"):
            failures.append("title should lead with IBM webMethods")
        await page.click("nav button[data-section=start]")
        if await page.locator("#kb-counter .kb-stat").count() != 6:
            failures.append("knowledge-at-a-glance counter missing")
        if await page.locator("#kb-family tr").count() < 8:
            failures.append("IBM webMethods family table missing")
        if await page.locator("#kb-iwhi").count() != 1 or "Hybrid control plane".lower() not in (await page.inner_text("#kb-iwhi")).lower():
            failures.append("knowledge base: IWHI topic missing")
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
        sc_right = await page.evaluate("SUPPORT.cheats.find(c => c.id === 'ops').check[0].c")
        await page.click(f"#howto-body .self-check .quiz-q >> nth=0 >> button >> nth={sc_right}")
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
        if "end of support" not in await page.inner_text("#ex-timeline-detail"):
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
        # Instance time machine (issue #51): replay the finished instance from its audit rows
        if not await page.is_visible("#tm"):
            failures.append("time machine: should appear when the instance completes")
        else:
            await page.evaluate("const r = document.getElementById('tm-slider'); r.value = 3; r.dispatchEvent(new Event('input', { bubbles: true }))")
            on = await page.locator("#tm-rows li.tm-on").get_attribute("data-k")
            cx = await page.evaluate("document.querySelector('#simulator .tm-tok').getAttribute('cx')")
            if on != "3" or not cx or "4 / " not in await page.inner_text("#tm-now"):
                failures.append("time machine: scrubbing to row 4 should highlight it and move the token")
            await page.focus("#tm .tm-ctl .btn")
            await page.keyboard.press("ArrowRight")
            if await page.locator("#tm-rows li.tm-on").get_attribute("data-k") != "4":
                failures.append("time machine: arrow keys should step through rows")
            await page.check("#tm-vt")
            if not await page.is_visible("#tm-vt-note"):
                failures.append("time machine: volatile tracking note missing")
            await page.uncheck("#tm-vt")
        await page.click("#sim-start")
        if await page.is_visible("#tm"):
            failures.append("time machine: a new instance should hide the old replay")
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
            cc_right = await page.evaluate(f"CRASH_LIVE.checks[{i}].c")
            await page.click(f"#crash .cc-check[data-i='{i}'] button[data-j='{cc_right}']")
        if "3 / 3" not in await page.inner_text("#cc-done"):
            failures.append("10-minute course finish card should show 3 / 3")
        await page.click("#crash-nav .cc-back")
        if not await page.is_visible("#crash .cc-step[data-i='4']"):
            failures.append("Back should return to step 5")
        if "10-minute course" not in await page.inner_text("#beginner-path") and "10-minute course" not in await page.inner_text("nav"):
            failures.append("10-minute course not linked")
        # Swipe sort (issue #53): answers come from the scan lab's rule; buttons and arrow keys both answer
        await page.evaluate("location.hash='swipe'")
        await page.wait_for_timeout(120)
        mism = await page.evaluate("""SWIPE_CARDS.filter(c => { const k = SCAN_CLASSIFY({type:'user_task', err:0, det:c.det, top:c.top, work:c.work, wait:c.wait});
            return (k.startsWith('Rule') ? 'rule' : k.startsWith('Agent') ? 'agent' : 'human') !== c.answer; }).length""")
        kinds = await page.evaluate("[...new Set(SWIPE_CARDS.map(c => c.answer))].sort().join(',')")
        if mism or kinds != "agent,human,rule" or await page.evaluate("SWIPE_CARDS.length") != 20:
            failures.append("swipe sort: 20 cards covering rule, agent and human, matching the scan lab")
        await page.click("#sw-start")
        first = await page.evaluate("SWIPE_CARDS[+document.getElementById('sw-card').dataset.i].answer")
        await page.click(f"#swipe-game .sw-btns [data-a='{first}']")
        await page.wait_for_timeout(400)
        await page.keyboard.press("ArrowUp")
        await page.wait_for_timeout(400)
        if "1 /" in await page.inner_text("#sw-card") or not (await page.inner_text("#sw-score")).endswith(("1", "2")) or "✅" not in await page.inner_text("#sw-why") and "❌" not in await page.inner_text("#sw-why"):
            failures.append("swipe sort: buttons or arrow keys did not score and explain")
        # Capstone: one markdown request through agent, rules, manager and process (hand-checked numbers)
        await page.evaluate("location.hash='capstone'")
        await page.wait_for_timeout(120)
        ev = await page.evaluate("""[[6,15],[12,35],[20,50]].map(([w,d]) => { const e = CAPSTONE_EVAL({price:120, cost:50, weeks:w, disc:d, mult:1.3, auto:30}); return [e.route, e.after, e.floor, e.cap, e.max]; })""")
        if ev != [["auto", 10200, 6500, 20, 20], ["manager", 7800, 6500, 40, 40], ["return", 6000, 6500, 60, 45]]:
            failures.append(f"capstone: rule outcomes wrong {ev}")
        await page.click("#cap-styles [data-i='0']")
        if "Approved automatically" not in await page.inner_text("#cap-verdict") or "$102" not in await page.inner_text("#cap-log"):
            failures.append("capstone: W-031 should be approved automatically at $102")
        await page.click("#cap-styles [data-i='2']")
        if "at most 45% ($66)" not in await page.inner_text("#cap-verdict"):
            failures.append("capstone: W-117 should be returned with at most 45% ($66)")
        await page.click("#cap-actions [data-act='repropose']")
        await page.click("#cap-actions [data-act='timeout']")
        logt = await page.inner_text("#cap-log")
        if "Buying director" not in logt or "$120 → $66" not in logt or await page.locator("#cap-flow li.on").count() < 6:
            failures.append("capstone: re-proposal, escalation and price change not shown")
        await page.click("#cap-styles [data-i='1']")
        await page.click("#cap-actions [data-act='approve']")
        if "33.3%" not in await page.inner_text("#cap-log") or "25 a week" not in await page.inner_text("#cap-log"):
            failures.append("capstone: W-204 reason and two-week review missing")
        # On-call drills (issue #50): ideal path, a wrong turn, debrief sources, and the badge for three clean runs
        await page.evaluate("location.hash='drills'")
        await page.wait_for_timeout(120)
        async def play(did, wrong_first=False):
            await page.click(f"#drills-body .dr-pick[data-d='{did}']")
            steps = await page.evaluate(f"DRILLS.find(d => d.id === '{did}').steps.map(s => s.choices.findIndex(c => c[2]))")
            for k, good in enumerate(steps):
                if wrong_first and k == 0:
                    await page.click(f"#drills-body .dr-choice[data-c='{1 if good == 0 else 0}']")
                    if "❌" not in await page.inner_text("#dr-run"):
                        failures.append("drills: a wrong choice should explain and cost time")
                await page.click(f"#drills-body .dr-choice[data-c='{good}']")
            return await page.inner_text("#drills-body")
        txt = await play("rule", wrong_first=True)
        if "Solved" not in txt or "wrong turn" not in txt or await page.locator("#drills-body .dr-debrief a").count() < 3:
            failures.append("drills: debrief after a wrong turn should show the cost and cited sources")
        await page.click("#drills-body .dr-quit")
        for did in ["start", "rule", "monitor"]:
            txt = await play(did)
            if "ideal path" not in txt:
                failures.append(f"drills: {did} should be solved on the ideal path")
            await page.click("#drills-body .dr-quit")
        if await page.locator("#fun-badges .badge.earned:has-text('On-call hero')").count() != 1:
            failures.append("drills: three clean runs should unlock the On-call hero badge")
        # Basics 101 (issue #40): seven lessons, pictures, checks, progress
        await page.evaluate("location.hash='basics'")
        await page.wait_for_timeout(150)
        if await page.locator("#basics .basics-lesson").count() != 7 or await page.locator("#basics figure.dg").count() != 7:
            failures.append("Basics 101 should have 7 lessons, each with a picture")
        b_right = await page.evaluate("BASICS_LIVE.lessons.find(l => l.id === 'process').check.c")
        await page.click(f"#b-process .basics-check button[data-j='{(b_right + 1) % 3}']")
        if "Not quite" not in await page.inner_text("#b-process .explain") or not (await page.inner_text("#basics-count")).startswith("0 /"):
            failures.append("a wrong Basics answer should explain and not count")
        await page.click("#b-process .b-retry")
        await page.click(f"#b-process .basics-check button[data-j='{b_right}']")
        if not (await page.inner_text("#basics-count")).startswith("1 / 7"):
            failures.append("a right Basics answer should count")
        await page.click("#b-process .b-next")
        if not await page.evaluate("document.querySelector('#b-workers').open"):
            failures.append("Next lesson should open lesson 2")
        await page.click("#basics-reset")
        # Review book (issue #76): wrong answers elsewhere land here and come back on a schedule
        saved = await page.evaluate("REVIEW.ids()")
        if "basics|process" not in saved or "drill|rule:0" not in saved:
            failures.append(f"review book: wrong answers in Basics 101 and the drills should be saved, got {saved}")
        if await page.evaluate("REVIEW.dueIds().length") != 0:
            failures.append("review book: a new item should be due tomorrow, not today")
        await page.evaluate("Object.values(REVIEW.state.items).forEach(it => it.due = '2000-01-01')")
        await page.evaluate("location.hash='review'")
        await page.wait_for_timeout(150)
        box = page.locator("#review-body .rv-q[data-id='basics|process']")
        right = await page.evaluate("BASICS_LIVE.lessons.find(l => l.id === 'process').check.c")
        await box.locator(f"button[data-j='{right}']").click()
        if "3 days" not in await box.inner_text() or await page.evaluate("REVIEW.state.items['basics|process'].box") != 1:
            failures.append("review book: a right answer should schedule the next check in 3 days")
        await page.evaluate("REVIEW.state.items['basics|process'].due = '2000-01-01'")
        await page.click("#rv-all")
        await page.click("#rv-all")
        await page.locator("#review-body .rv-q[data-id='basics|process']").locator(f"button[data-j='{right}']").click()
        if "basics|process" in await page.evaluate("REVIEW.ids()"):
            failures.append("review book: two right answers should remove the item")
        if await page.evaluate("REVIEW.answer('drill|rule:0', false)") != "again" or await page.evaluate("[REVIEW.answer('drill|rule:0', true), REVIEW.answer('drill|rule:0', true), REVIEW.answer('drill|rule:0', true)].join()") != "3,7,done":
            failures.append("review book: a lapse should add a 7-day check before the item leaves")
        await page.evaluate("location.hash='start'")
        await page.wait_for_timeout(100)
        if await page.evaluate("REVIEW.ids().length") and not await page.is_visible("#review-home"):
            failures.append("review book: Start here should show the review card")
        # Site search (issue #77): "/" opens it; a fact, a symptom and a term each open the right place
        await page.evaluate("location.hash='start'")
        await page.wait_for_timeout(100)
        await page.keyboard.press("/")
        if not await page.is_visible("#search-sheet"):
            failures.append("search: / should open the search sheet")
        await page.fill("#search-q", "nsp://localhost")
        await page.wait_for_timeout(80)
        await page.keyboard.press("Enter")
        await page.wait_for_timeout(500)
        if await page.evaluate("location.hash") != "#knowledge":
            failures.append("search: a knowledge fact should open the knowledge base")
        await page.click("#search-btn")
        await page.fill("#search-q", "greyed out")
        await page.wait_for_timeout(80)
        await page.click("#search-results .search-hit >> nth=0")
        await page.wait_for_timeout(400)
        if await page.evaluate("location.hash") != "#trouble" or not await page.evaluate("[...document.querySelectorAll('#tr-list details')].some(d => d.open && /greyed out/.test(d.textContent))"):
            failures.append("search: a troubleshooting symptom should open its entry")
        await page.click("#search-btn")
        await page.fill("#search-q", "transition document")
        await page.wait_for_timeout(80)
        if "Glossary" not in await page.inner_text("#search-results"):
            failures.append("search: glossary terms should be found")
        await page.fill("#search-q", "zzqqxx")
        await page.wait_for_timeout(80)
        if "No match" not in await page.inner_text("#search-results"):
            failures.append("search: no-match message")
        await page.keyboard.press("Escape")
        if await page.is_visible("#search-sheet"):
            failures.append("search: Esc should close")
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
        if "IBM Integration" not in await page.inner_text("#kb-iwhi") or "Pre-Upgrade Analyzer" not in await page.inner_text("#kb-upgrade"):
            failures.append("knowledge: IBM Integration rename or upgrade analyzer fact missing")
        if "86,400 seconds" not in await page.inner_text("#kb-cloud-deploy") or "1,000 variables" not in await page.inner_text("#kb-cloud-deploy"):
            failures.append("knowledge: Code Engine and Decision Optimization topic missing")
        if "Step Iterations Exceeded" not in await page.inner_text("#kb-process-design") or "16 matching votes" not in await page.inner_text("#kb-tasks"):
            failures.append("knowledge: process design topic or task voting fact missing")
        # Knowledge base, hands-on (kb-play.js): join lab, vote calculator, task life cycle, guess-first questions
        await page.evaluate("location.hash='knowledge'")
        await page.wait_for_timeout(200)
        await page.click("#kb-process-design .kbp-join [data-p=b]")
        if "never be satisfied" not in await page.inner_text("#kb-process-design .kbp-join .kbp-out") or await page.locator("#kb-process-design .kb-facts li.kb-hit").count() != 1:
            failures.append("join lab: an AND join with a failed path should say it can never be satisfied and light up its fact")
        await page.click("#kb-process-design .kbp-join input[value=OR]")
        if "still runs" not in await page.inner_text("#kb-process-design .kbp-join .kbp-out"):
            failures.append("join lab: an OR join with one path left should still run")
        await page.locator("#kb-tasks .kbp-vote [data-v=n]").fill("30")
        if "16" not in await page.inner_text("#kb-tasks .kbp-vote .kbp-big"):
            failures.append("vote calculator: 30 assignees at 51% should need 16 votes")
        await page.locator("#kb-tasks .kbp-vote [data-v=n]").fill("300")
        if "153" not in await page.inner_text("#kb-tasks .kbp-vote .kbp-big"):
            failures.append("vote calculator: 300 assignees at 51% should need 153 votes")
        await page.click("#kb-tasks .kbp-life [data-to=Active]")
        await page.click("#kb-tasks .kbp-life [data-to=Suspended]")
        if "Task List Management" not in await page.inner_text("#kb-tasks .kbp-life"):
            failures.append("task life cycle: a suspended task should be shown only on Task List Management")
        await page.click("#kb-tasks .kbp-life [data-to=Active]")
        await page.click("#kb-tasks .kbp-life [data-to=Completed]")
        await page.click("#kb-tasks .kbp-life [data-to=Deleted]")
        if "Delete Task" not in await page.inner_text("#kb-tasks .kbp-life") or await page.locator("#kb-tasks .kbp-life [data-to]").count() != 0:
            failures.append("task life cycle: seven days after completion the Delete Task rule should remove it")
        await page.click("#kb-cloud-deploy .kbp-ce [data-ce='40|min']")
        ce = await page.inner_text("#kb-cloud-deploy .kbp-ce .kbp-fit")
        if "too long: at most 120" not in ce or "too long: 600" not in ce or "raise the time limit" in ce or "only a job fits" not in await page.inner_text("#kb-cloud-deploy .kbp-pick"):
            failures.append("Code Engine picker: a 40-minute run should fit only a job, within its default limit")
        await page.locator("#kb-cloud-deploy .kbp-ce [data-c=v]").fill("1260")
        if "over the Community Edition limit" not in await page.inner_text("#kb-cloud-deploy .kbp-cplex"):
            failures.append("Code Engine picker: 1,260 variables should be over the Community Edition limit")
        await page.locator("#kb-rules-in-practice .kbp-csv [data-v=r]").fill("20")
        if "4 + 20 = 24" not in await page.inner_text("#kb-rules-in-practice .kbp-csv"):
            failures.append("CSV import: 4 rules plus 20 imported should make 24")
        await page.click("#kb-rules-in-practice .kbp-csv [data-x=order]")
        if await page.locator("#kb-rules-in-practice .kbp-csv tr.kbp-wrong").count() == 0 or "by position" not in await page.inner_text("#kb-rules-in-practice .kbp-csv"):
            failures.append("CSV import: columns in another order should land in the wrong columns")
        await page.select_option("#kb-monitor .kbp-rs [data-r=at]", "3")
        rs = await page.inner_text("#kb-monitor .kbp-rs .kbp-fit")
        if "re-runs from Check" not in rs or "first resubmit-enabled step" not in rs:
            failures.append("resubmit lab: Book failed and only Check enabled, so Closest and Earliest should start at Check")
        await page.click("#kb-monitor .kbp-rs [data-en='3']")
        if "re-runs from Book, the failed step" not in await page.inner_text("#kb-monitor .kbp-rs .kbp-fit"):
            failures.append("resubmit lab: an enabled failed step should be where Closest starts")
        if await page.locator("#knowledge a.kbp-quest[href='play.html']").count() != 1 or await page.locator("a.kbp-quest[href='play.html']").count() != 2:
            failures.append("knowledge base should link to BPMS Quest")
        rel = page.locator("#kb-releases .kbp-rel [data-v=m]")
        await rel.fill("60")  # Nov 2022 + 60 months = Nov 2027
        if "Paid extended support" not in await page.inner_text("#kb-releases .kbp-rel .kbp-big"):
            failures.append("release lab: November 2027 should be in paid extended support")
        await rel.fill("59")  # Oct 2027, the last month of standard support
        if "Standard support" not in await page.inner_text("#kb-releases .kbp-rel .kbp-big") or "1 month including" not in await page.inner_text("#kb-releases .kbp-rel"):
            failures.append("release lab: October 2027 should be the last month of standard support")
        await page.select_option("#kb-correlation .kbp-corr [data-k=id]", "PO-104")
        if "matches no running instance" not in await page.inner_text("#kb-correlation .kbp-corr"):
            failures.append("correlation lab: PO-104 should match no running instance")
        await page.click("#kb-correlation .kbp-corr [data-k=flt]")
        if "No trigger available" not in await page.inner_text("#kb-correlation .kbp-corr"):
            failures.append("correlation lab: a changed subscription filter should warn about the trigger error")
        await page.click("#kb-audit-retention .kbp-arch input[value=DELETE]")
        if "keeps no copy" not in await page.inner_text("#kb-audit-retention .kbp-arch"):
            failures.append("archive lab: DELETE should keep no copy")
        await page.select_option("#kb-audit-retention .kbp-arch [data-a=p]", "SERVICE_ARCHIVE")
        if not await page.evaluate("document.querySelector(\"#kb-audit-retention .kbp-arch option[value='1024']\").disabled"):
            failures.append("archive lab: Stopped (1024) applies to processes only")
        await page.click("#kb-deploy .kbp-dep input[value=down]")
        if "v1 ends up enabled" not in await page.inner_text("#kb-deploy .kbp-dep .kbp-big"):
            failures.append("deploy lab: deploying v3, v2, v1 with all enabled should leave v1 enabled")
        for n in range(6):
            c = await page.evaluate(f"KB_PLAY.CARDS[{n}][1]")
            await page.locator(f"#kb-task-rules .kbp-sort .kbp-guess[data-n='{n}'] button[data-j='{c}']").click()
        if "6 / 6" not in await page.inner_text("#kb-task-rules .kbp-score"):
            failures.append("task rule sorter: six right answers should score 6 / 6")
        for kid in ["process-design", "tasks"]:
            g = page.locator(f"#kb-{kid} .kbp-guess").first
            right = await page.evaluate(f"KB_PLAY.{'PD' if kid == 'process-design' else 'TK'}_GUESS[0].c")
            await g.locator(f"button[data-j='{right}']").click()
            if "Right" not in await g.inner_text() or await g.locator(".kbp-btn.ok").count() != 1:
                failures.append(f"guess-first question in {kid} did not mark the right answer")
        for kb in ["monitor", "upgrade", "agents", "cloud-deploy", "process-design", "tasks"]:
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
        read_key = await page2.evaluate("ACADEMY.quiz.map(q => q.c).join(',')")
        site_key = await page.evaluate("ACADEMY.quiz.map(q => q.c).join(',')")
        spread = [read_key.split(',').count(str(k)) for k in range(4)]
        if read_key != site_key or max(spread) > 2 * min(spread) or min(spread) == 0:
            failures.append(f"quiz answers should be spread over all four positions and match the printed key, got {spread}")
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
        if await zp.locator(".zh-note").count():
            failures.append("zh: every section should be translated now (a 'being translated' note is showing)")
        if "画出流程" not in await zp.inner_text("#bpms-map"):
            failures.append("zh: map labels not translated")
        await zp.evaluate("location.hash='crash'")
        await zp.wait_for_timeout(150)
        if "BPMS 是什么" not in await zp.inner_text("#crash .cc-step[data-i='0']") or "流程模型" not in await zp.inner_text("#crash figure.dg >> nth=0"):
            failures.append("zh: 10-minute course or its diagram not translated")
        for _ in range(5):
            await zp.click("#crash-nav .cc-next")
        for i in range(3):
            cc_right = await zp.evaluate(f"CRASH_LIVE.checks[{i}].c")
            await zp.click(f"#crash .cc-check[data-i='{i}'] button[data-j='{cc_right}']")
        if "答对 3 / 3" not in await zp.inner_text("#cc-done"):
            failures.append("zh: 10-minute course finish card")
        await zp.evaluate("location.hash='basics'")
        await zp.wait_for_timeout(150)
        if await zp.locator("#basics .basics-lesson").count() != 7 or "流程就是一份" not in await zp.inner_text("#b-process summary"):
            failures.append("zh: Basics 101 not translated")
        # 中文版 batch 2: knowledge base, how-to guides, lab, troubleshooting, teach
        for sec, needle in [("knowledge", "服务质量"), ("howto", "接受任务"), ("lab", "30 分钟做出你的第一个流程"), ("trouble", "个问题"), ("teach", "半天工作坊")]:
            await zp.evaluate(f"location.hash='{sec}'")
            await zp.wait_for_timeout(120)
            if needle not in await zp.inner_text(f"#{sec}") or await zp.locator(f"#{sec} .zh-note").count():
                failures.append(f"zh: {sec} not translated")
        if "更有保证" not in await zp.inner_text("#kb-engine .qos") or "在 Monitor 里" not in await zp.inner_text("#kb-engine .qos-out"):
            failures.append("zh: quality-of-service widget not translated")
        await zp.evaluate("location.hash='trouble'")
        await zp.wait_for_timeout(120)
        await zp.click("#tr-areas [data-area='Tasks']")
        if (await zp.inner_text("#tr-areas .selected")) != "任务" or "显示 4 / 16" not in await zp.inner_text("#tr-count"):
            failures.append("zh: troubleshooting area filter")
        await zp.evaluate("location.hash='howto'")
        await zp.wait_for_timeout(120)
        await zp.click("#howto-tabs [data-role='dev']")
        if "流程开发人员速查卡" not in await zp.inner_text("#howto-body") or "从模型到运行中的实例" not in await zp.inner_text("#howto-body figure.dg"):
            failures.append("zh: developer guide, cheat sheet or diagram not translated")
        # 中文版 batch 3a: content sections, simulator, scan lab, glossary, quiz
        for sec, needle in [("overview", "最需要记住的一句话"), ("lifecycle", "2027 年 10 月"), ("architecture", "Process Audit 表"), ("bpmn", "排他网关"),
                            ("patterns", "Agent 提议，规则决定"), ("cases", "物流异常"), ("market", "分析机构"), ("glossary", "决策敏捷"), ("quiz", "得分")]:
            await zp.evaluate(f"location.hash='{sec}'")
            await zp.wait_for_timeout(120)
            if needle not in await zp.inner_text(f"#{sec}") or await zp.locator(f"#{sec} .zh-note").count():
                failures.append(f"zh: {sec} not translated")
        if await zp.locator("#bpmn figure[data-dg='bpmn-gateways'] svg").count() != 1 or "三种网关" not in await zp.inner_text("#bpmn"):
            failures.append("zh: BPMN diagrams missing after translation")
        if await zp.locator("#cases figure.dg").count() != 3 or await zp.locator("#cases figure[data-dg='case-2'] rect.warn").count() < 1:
            failures.append("zh: case diagrams missing or lost their colours")
        if await zp.evaluate("ZH && Object.keys(ZH.quiz).length") != await zp.locator("#quiz .quiz-q").count() or "Where does" in await zp.inner_text("#quiz"):
            failures.append("zh: every quiz question needs a translation")
        if "Volatile" in (await zp.inner_text("#glossary-list")).replace("Volatile Tracking", "") :
            failures.append("zh: glossary has untranslated entries")
        await zp.evaluate("location.hash='simulator'")
        await zp.wait_for_timeout(120)
        await zp.click("#sim-start")
        if "收到申请" not in await zp.inner_text("#sim-steps"):
            failures.append("zh: simulator steps not translated")
        await zp.evaluate("location.hash='scan'")
        await zp.wait_for_timeout(120)
        await zp.click("#scan-sample")
        if "规则候选" not in await zp.inner_text("#scan-out"):
            failures.append("zh: scan lab results not translated")
        await zp.evaluate("location.hash='swipe'")
        await zp.wait_for_timeout(120)
        await zp.click("#sw-start")
        if "合成数据" not in await zp.inner_text("#sw-card") or "规则" not in await zp.inner_text("#swipe .sw-btns"):
            failures.append("zh: swipe sort not translated")
        await zp.evaluate("location.hash='capstone'")
        await zp.wait_for_timeout(120)
        await zp.click("#cap-styles [data-i='1']")
        if "女装店" not in await zp.inner_text("#capstone") or "要区域经理批" not in await zp.inner_text("#cap-verdict") or "综合练习" not in await zp.inner_text("nav"):
            failures.append("zh: capstone not translated")
        await zp.evaluate("location.hash='drills'")
        await zp.wait_for_timeout(120)
        await zp.click("#drills-body .dr-pick[data-d='start']")
        if "你先查什么" not in await zp.inner_text("#dr-run") or "决定 1 / 2" not in await zp.inner_text("#dr-run"):
            failures.append("zh: on-call drills not translated")
        await zp.evaluate("REVIEW.miss('crash', 1); Object.values(REVIEW.state.items).forEach(it => it.due = '2000-01-01'); location.hash='review'")
        await zp.wait_for_timeout(150)
        if "复习本" not in await zp.inner_text("#review") or "什么都没启动" not in await zp.inner_text("#review-body"):
            failures.append("zh: review book should show its questions in Chinese")
        await zp.click("#search-btn")
        await zp.fill("#search-q", "启用执行")
        await zp.wait_for_timeout(80)
        if "知识库" not in await zp.inner_text("#search-results") and "故障排查" not in await zp.inner_text("#search-results"):
            failures.append("zh: search should find Chinese text")
        await zp.keyboard.press("Escape")
        # 中文版 batch 3b: controls, decision lab, fix the diagram
        await zp.evaluate("location.hash='controls'")
        await zp.wait_for_timeout(120)
        if "四眼审批" not in await zp.inner_text("#controls") or "GDPR 第 22 条" not in await zp.inner_text("#controls"):
            failures.append("zh: controls not translated")
        await zp.evaluate("location.hash='decisions'")
        await zp.wait_for_timeout(120)
        await zp.click("#dt-run")
        if "转人工" not in await zp.inner_text("#dt-result") or "规则配置的坑" not in await zp.inner_text("#decisions"):
            failures.append("zh: decision lab not translated")
        await zp.evaluate("location.hash='puzzles'")
        await zp.wait_for_timeout(120)
        await zp.click("#pz-chips .pz-chip[data-l='1']")
        await zp.click("#pz-1 .pz-piece[data-k='end']")
        await zp.click("#pz-1 .pz-run")
        await zp.wait_for_timeout(2500)
        if "修好了" not in await zp.inner_text("#pz-1 .pz-out") or "第 1 关" not in await zp.inner_text("#pz-1 h3") or "点下面的一个零件" not in await zp.inner_text("#pz-1 figure"):
            failures.append("zh: fix-the-diagram not translated")
        await zp.click("#lang-toggle")
        await zp.wait_for_timeout(600)
        if await zp.evaluate("document.documentElement.lang") != "en" or (await zp.inner_text("nav button[data-section='start']")) != "Start here":
            failures.append("zh: switching back to English failed")
        await zctx.close()
        # 中文版 batch 4: a Chinese browser opens in Chinese; reading version and executive briefs are translated
        cctx = await browser.new_context(viewport={"width": 390, "height": 844}, locale="zh-CN")
        cp = await cctx.new_page()
        cp.on("pageerror", lambda e: errors.append("zh read: " + str(e)))
        await cp.goto("http://127.0.0.1:8765/read.html")
        await cp.wait_for_timeout(600)
        if await cp.evaluate("document.documentElement.lang") != "zh-CN":
            failures.append("zh: a Chinese-language browser should open in Chinese")
        if not (await cp.inner_text("#r-why h2")).startswith("1. 为什么值得关心") or "目录" not in await cp.inner_text("nav.toc"):
            failures.append("zh: reading version headings not translated")
        if not (await cp.inner_text("#r-roles h3 >> nth=0")).startswith("6.1") or not (await cp.inner_text("#r-lab-stages h3 >> nth=0")).startswith("7.1") or not (await cp.inner_text("#r-ch h3 >> nth=0")).startswith("9.1"):
            failures.append("read.html sub-sections should follow their chapter numbers")
        if "答案" not in await cp.inner_text("#r-basics") or "没有 BPMS" not in await cp.inner_text("#r-story") or "转人工" not in await cp.inner_text("#r-guard-table"):
            failures.append("zh: reading version body not translated")
        if await cp.locator('#r-kb figure[data-dg="qos"], #r-roles figure[data-dg="task-lifecycle"], #r-roles figure[data-dg="instance-states"]').count() != 3:
            failures.append("zh: reading version diagrams should still find their topics")
        if "我该读哪几章" not in await cp.inner_text("#r-why") or "执行数据的三个存储" not in await cp.inner_html("#r-history"):
            failures.append("zh: reading version map table or figures not translated")
        await cp.goto("http://127.0.0.1:8765/brief.html")
        await cp.wait_for_timeout(400)
        await cp.goto("http://127.0.0.1:8765/index.html#knowledge")
        await cp.wait_for_timeout(400)
        if "混合控制平面" not in await cp.inner_text("#kb-iwhi"):
            failures.append("zh: IWHI knowledge topic not translated")
        if "人工任务" not in await cp.inner_text("#kb-agents") or "Task Engine" not in await cp.inner_text("#kb-agents"):
            failures.append("zh: agents knowledge topic not translated")
        if "合流" not in await cp.inner_text("#kb-process-design") or "16 张相同的票" not in await cp.inner_text("#kb-tasks"):
            failures.append("zh: process design or task topic not translated")
        await cp.click("#kb-process-design .kbp-join [data-p=b]")
        zh_play = [await cp.inner_text(f"#kb-{k}") for k in ["tasks", "cloud-deploy", "rules-in-practice", "monitor", "releases", "correlation", "audit-retention", "deploy", "task-rules"]]
        if "永远满足不了" not in await cp.inner_text("#kb-process-design .kbp-join .kbp-out") or any("动手试试" not in t for t in zh_play):
            failures.append("zh: knowledge base hands-on blocks not translated")
        if "部署决策服务" not in await cp.inner_text("#kb-cloud-deploy") or "86,400 秒" not in await cp.inner_text("#kb-cloud-deploy"):
            failures.append("zh: Code Engine knowledge topic not translated")
        await cp.goto("http://127.0.0.1:8765/brief.html")
        await cp.wait_for_timeout(400)
        if "银行的流程和决策自动化" not in await cp.inner_text("#banking") or "最重要的管控" not in await cp.inner_text("#insurance") or await cp.locator("#banking tr").count() != 6:
            failures.append("zh: executive briefs not translated")
        await cp.click("#lang-toggle")
        await cp.wait_for_timeout(500)
        await cp.goto("http://127.0.0.1:8765/read.html")
        if await cp.evaluate("document.documentElement.lang") != "en":
            failures.append("zh: choosing English should win over the browser language")
        await cctx.close()
        # optimization primer page: two demos, English and Chinese
        op = await browser.new_page(viewport={"width": 390, "height": 844})
        op.on("pageerror", lambda e: errors.append("optimization: " + str(e)))
        await op.goto("http://127.0.0.1:8765/optimization.html?lang=en")
        await op.wait_for_timeout(300)
        if "best happiness 12: cola, chips" not in await op.inner_text("#bb-out"):
            failures.append("optimization: snack demo should find 12 (cola, chips) at budget 10")
        if await op.locator("#algos .card").count() != 8:
            failures.append("optimization: expected 8 algorithm cards")
        await op.click("#p-mon")
        if "FAIL" not in await op.inner_text("#cp-out"):
            failures.append("optimization: guessing A = Mon should fail")
        await op.click("#p-tue")
        if "SOLVED: A = Tue, B = Wed, C = Mon" not in await op.inner_text("#cp-out"):
            failures.append("optimization: guessing A = Tue should solve the roster")
        if "total cost 380" not in await op.inner_text("#ro-out") or "380 − 375 = 5" not in await op.inner_text("#ro-out"):
            failures.append("optimization: rules demo should cost 380 with the rule (price 5)")
        await op.click("#rule-on")
        if "total cost 375" not in await op.inner_text("#ro-out"):
            failures.append("optimization: rules demo should cost 375 without the rule")
        await op.click("#rule-on")
        await op.click("#b-zh")
        await op.wait_for_timeout(200)
        if "最大开心 12" not in await op.inner_text("#bb-out") or "解出来了" not in await op.inner_text("#cp-out"):
            failures.append("optimization: Chinese demo output missing")
        await op.close()
        # Unplugged classroom kit (#54): board, cards and log sheet in English and Chinese, linked from Teach a class
        # BPMS Quest (play.html): self-contained game course, both languages, all six levels to the certificate
        for lang in ["en", "zh"]:
            qp = await browser.new_page(viewport={"width": 360, "height": 780})
            qp.on("pageerror", lambda e: errors.append(f"play.html: {e}"))
            await qp.goto(f"http://127.0.0.1:8765/play.html?lang={lang}")
            await qp.evaluate("localStorage.clear()")
            await qp.goto(f"http://127.0.0.1:8765/play.html?lang={lang}")
            await qp.click("#app .btn[data-lvl='0']")
            async def qpick(j):
                await qp.click(f"#stage .opt[data-j='{j}']"); await qp.click("#next")
            await qpick(1); await qpick(2); await qp.click("#stage .btn")
            await qpick(1); await qp.click("#j-go")
            if await qp.locator("#next").count() != 0:
                failures.append(f"play.html ({lang}): an AND join with a failed path should not pass")
            await qp.click("#j-to"); await qp.click("#j-go"); await qp.click("#next"); await qp.click("#stage .btn")
            await qp.locator("#v-r").fill("16"); await qp.click("#v-go"); await qp.click("#next"); await qpick(1); await qp.click("#stage .btn")
            await qpick(1)
            for to in ["Suspended", "Active", "Completed", "Deleted"]:
                await qp.click(f"#stage [data-to='{to}']")
            await qp.click("#next"); await qp.click("#stage .btn")
            await qpick(1); await qp.click("#stage [data-en='3']"); await qp.click("#r-go"); await qp.click("#next"); await qp.click("#stage .btn")
            await qpick(0); await qp.click("input[name=ord][value=up]"); await qp.click("#d-go"); await qp.click("#next"); await qp.click("#stage .btn")
            if await qp.evaluate("Object.values(QUEST.state.stars).reduce((a, b) => a + b, 0)") != 18 or await qp.locator(".cert").count() != 1:
                failures.append(f"play.html ({lang}): a perfect run should earn 18 stars and a certificate")
            if lang == "zh" and "流程引擎读心师" not in await qp.inner_text(".cert"):
                failures.append("play.html: certificate not translated")
            if await qp.evaluate("document.documentElement.scrollWidth") > 360:
                failures.append(f"play.html ({lang}): page scrolls sideways at 360 px")
            if await qp.locator("link[rel=stylesheet], script[src]").count() != 0:
                failures.append("play.html must stay self-contained (no external CSS or JS)")
            await qp.close()

        for lang, word in [("en", "Unplugged classroom kit"), ("zh", "不插电课堂套件")]:
            kp = await browser.new_page(viewport={"width": 390, "height": 844})
            kp.on("pageerror", lambda e: errors.append(f"kit.html: {e}"))
            await kp.goto(f"http://127.0.0.1:8765/kit.html?lang={lang}")
            if word not in await kp.inner_text("#kit-intro"):
                failures.append(f"kit ({lang}): title missing")
            if await kp.locator("svg.kit-board").count() != 1:
                failures.append(f"kit ({lang}): board missing")
            if await kp.locator(".kcard.req").count() != 12 or await kp.locator(".kcard.event").count() != 8 or await kp.locator(".kcard.rule").count() != 3:
                failures.append(f"kit ({lang}): expected 12 request cards, 8 event cards and 3 rule/control cards")
            if await kp.locator(".kit-log tr").count() < 15:
                failures.append(f"kit ({lang}): audit log sheet missing")
            if await kp.evaluate("document.documentElement.scrollWidth") > 392:
                failures.append(f"kit ({lang}): page scrolls sideways at 390 px")
            key = await kp.inner_text(".kit-key")
            if ("v2" not in key) or (("four-eyes" if lang == "en" else "四眼原则") not in key):
                failures.append(f"kit ({lang}): answer key should cover rule version 2 and the four-eyes case")
            await kp.close()
        tp = await browser.new_page(viewport={"width": 390, "height": 844})
        await tp.goto("http://127.0.0.1:8765/index.html?lang=en#teach")
        await tp.click("nav button[data-section=teach]")
        if await tp.locator('#teach a[href="kit.html"]').count() != 1:
            failures.append("Teach a class should link to the classroom kit")
        await tp.close()
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
