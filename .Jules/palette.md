## 2026-10-03 - Contact Form Loading State & View Transitions
**Learning:** In Astro, when View Transitions are active, `astro:page-load` fires on both navigation AND the initial page load. Calling an init function immediately AND adding it as an event listener for `astro:page-load` causes duplicate event binding, leading to double form submissions.
**Action:** Only bind vanilla JS initialization logic to the `astro:page-load` event. Do not manually invoke the function in the global script scope alongside the listener.
