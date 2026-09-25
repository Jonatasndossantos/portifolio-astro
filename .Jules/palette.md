## 2026-09-25 - [Contact Form Accessibility Improvements]
**Learning:** Added ARIA live regions and busy states to the form submit button for better screen reader feedback, along with a visual spinner for sighted users.
**Action:** When making async forms in Astro, ensure to manage loading states visually and via ARIA attributes manually since hydration is avoided.
