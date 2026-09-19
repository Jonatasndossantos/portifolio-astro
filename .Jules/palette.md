## 2026-09-19 - Async submit buttons pattern
**Learning:** When making submit buttons async, it's critical to provide explicit visual and screen reader feedback. Simply changing text and disabling the button is insufficient for users navigating with assistive tech or who miss the text change.
**Action:** Use a combination of `aria-live="polite"` on the button, `aria-busy="true"` during flight, a visual loading spinner, and hide default icons to clarify the loading state. This pattern is particularly important in vanilla JS implementations (like Astro) where state isn't handled by a framework.
