## 2025-02-27 - Added visually hidden loading states to async form buttons
**Learning:** Adding a visible loading spinner alongside text on a disabled async submission button, while communicating state effectively to screen readers via `aria-live="polite"`, creates a demonstrably superior UX pattern over just changing button text.
**Action:** Default to using DaisyUI's `loading-spinner` alongside explicit state text + `aria-live="polite"` + replacing default icons for all async submission buttons moving forward.
