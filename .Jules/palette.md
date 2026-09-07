## 2024-05-18 - Async Form Submission Accessibility and Feedback
**Learning:** Adding `aria-live="polite"` directly to the submit button container alongside a visually toggling loading spinner ensures screen readers successfully announce the state change without losing focus context during an async form submission in Astro/VanillaJS.
**Action:** Always include a visual loading state (like DaisyUI spinner) and an `aria-live` region on primary action buttons that perform asynchronous requests to improve feedback for both visual and screen-reader users.
