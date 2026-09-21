## 2026-09-21 - Async Submit Button Feedback
**Learning:** Async submission buttons must communicate their busy state to screen readers and visually to users. DaisyUI's `loading-spinner` should be used alongside explicit text, hiding default icons during flight.
**Action:** Always add `aria-live="polite"` and toggle `aria-busy="true"` on buttons triggering network requests, replacing the standard icon with a loading spinner.
