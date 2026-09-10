# Automated responsiveness tests (Playwright / Python).
# Runs against a dev/preview server (default http://localhost:8080).
# Usage:
#   BASE_URL=http://localhost:8080 python3 tests/responsive_test.py
import asyncio
import os
import sys

from playwright.async_api import async_playwright

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8080")

BREAKPOINTS = [
    ("mobile-320", 320, 720),
    ("mobile-375", 375, 812),
    ("mobile-390", 390, 844),
    ("mobile-430", 430, 932),
    ("tablet-portrait", 768, 1024),
    ("tablet-landscape", 1024, 768),
    ("laptop", 1280, 800),
    ("desktop", 1440, 900),
    ("desktop-xl", 1920, 1080),
]

ROUTES = [
    "/", "/modelos", "/sobre", "/contato", "/garantia",
    "/financiamento", "/comparar", "/privacidade", "/auth",
]

TOLERANCE = 1  # px – arredondamento subpixel

AUDIT_JS = r"""
(tolerance) => {
  const docW = document.documentElement.clientWidth;
  const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  const overflow = scrollW - docW;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right - docW > tolerance) {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' && s.visibility === 'hidden') continue;
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (typeof el.className === 'string' ? el.className : '').slice(0,120),
        overflowBy: Math.round((r.right - docW) * 100) / 100,
        width: Math.round(r.width),
      });
      if (offenders.length >= 5) break;
    }
  }
  const smallTargets = [];
  if (docW <= 768) {
    for (const el of document.querySelectorAll("button, [role='button'], input, select, textarea")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.height < 40 || r.width < 40) {
        smallTargets.push({
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').trim().slice(0,40),
          w: Math.round(r.width), h: Math.round(r.height),
        });
        if (smallTargets.length >= 5) break;
      }
    }
  }
  return { docW, scrollW, overflow, offenders, smallTargets };
}
"""

async def audit(page, url):
    await page.goto(url, wait_until="networkidle", timeout=20000)
    await page.wait_for_timeout(400)
    return await page.evaluate(AUDIT_JS, TOLERANCE)

async def main():
    failures = []
    checked = 0
    print(f"\nResponsive audit -> {BASE_URL}")
    print(f"Routes: {len(ROUTES)}  Breakpoints: {len(BREAKPOINTS)}\n")

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        for name, w, h in BREAKPOINTS:
            ctx = await browser.new_context(viewport={"width": w, "height": h})
            page = await ctx.new_page()
            for route in ROUTES:
                checked += 1
                url = f"{BASE_URL}{route}"
                try:
                    res = await audit(page, url)
                    ok = res["overflow"] <= TOLERANCE
                    tag = "ok  " if ok else "FAIL"
                    print(f"[{tag}] {name:<16} {route:<16} scroll+{res['overflow']}px")
                    if not ok:
                        failures.append((name, route, res))
                    if res["smallTargets"]:
                        t = res["smallTargets"][0]
                        print(f"        touch<40px: {len(res['smallTargets'])} (ex: '{t['text'] or t['tag']}' {t['w']}x{t['h']})")
                except Exception as e:
                    print(f"[ERR ] {name} {route}: {e}")
                    failures.append((name, route, {"error": str(e)}))
            await ctx.close()
        await browser.close()

    print(f"\nChecked {checked}. Failures: {len(failures)}")
    if failures:
        print("\n--- Overflow details ---")
        for name, route, res in failures:
            print(f"\n{name} {route}")
            if "error" in res:
                print(f"  error: {res['error']}"); continue
            print(f"  scroll: {res['overflow']}px (doc={res['docW']}, content={res['scrollW']})")
            for o in res.get("offenders", []):
                print(f"  -> <{o['tag']}> +{o['overflowBy']}px w={o['width']} class=\"{o['cls']}\"")
        sys.exit(1)
    sys.exit(0)

if __name__ == "__main__":
    asyncio.run(main())
