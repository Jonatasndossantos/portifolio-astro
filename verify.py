from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to global search page
    page.goto("http://localhost:4321/search")
    page.wait_for_timeout(2000)

    # Take screenshot of the visual hint shortcut `<kbd>/</kbd>` on the search bar
    page.screenshot(path="/home/jules/verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

    # Simulate keyboard shortcut
    page.keyboard.press("/")
    page.wait_for_timeout(500)

    # Type something to ensure focus happened
    page.keyboard.type("React")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
