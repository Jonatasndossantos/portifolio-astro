## 2025-02-12 - Added ARIA Live Regions for Contact Form Feedback
**Learning:** Dynamic success and error messages in forms need `aria-live` and `role="status"` to ensure screen readers announce them automatically when they appear, preventing users from missing important feedback.
**Action:** Always add `aria-live="polite"` and `role="status"` to containers that render dynamic success/error alerts in forms.
