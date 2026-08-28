## 2024-08-28 - Async Form Button Loading State and Accessibility
**Learning:** For async form submissions, users and screen readers often lack feedback that an action is in progress. Just changing text is not enough. Adding `aria-live="polite"`, hiding default icons to reduce visual noise, and showing a loading spinner provides a much better and accessible experience.
**Action:** Always add `aria-live="polite"`, a `loading-spinner`, and explicit state text for async submission buttons. Hide default icons during flight.
