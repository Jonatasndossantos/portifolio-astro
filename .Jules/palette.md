## 2024-09-22 - Hide Elements with Specificity in DaisyUI/Tailwind
**Learning:** When using JavaScript to toggle visibility on elements styled with layout classes like `inline-flex` (e.g., an icon container), simply adding the `hidden` class may not work due to CSS source order/specificity. The layout class often overrides `.hidden`.
**Action:** When adding `.hidden` to hide an element, explicitly remove the display class (like `.inline-flex` or `.flex`) using `.classList.remove("inline-flex")`, and restore it when removing `.hidden`.

## 2024-09-22 - Astro Page Load Events and Double Binding
**Learning:** Initializing Vanilla JS on `document.addEventListener("astro:page-load")` is necessary for ViewTransitions, but it can cause double-binding (e.g. duplicate form submissions) if the script executes twice (initial load + navigation). Conversely, if ViewTransitions are disabled, it might never fire on initial load unless explicitly called.
**Action:** Always add a guard attribute (e.g., `data-listener="true"`) to prevent double-binding when initializing elements within `astro:page-load` listeners.

## 2024-10-02 - Managing ARIA states on custom styled elements
**Learning:** When using custom class-toggled lists, tabs, or filter buttons (especially without native HTML `<input type="radio">` or `<select>`), screen readers rely on ARIA attributes to understand the state.
**Action:** Always add `aria-current="true"` (for navigation/lists) or `aria-pressed="true"/"false"` (for toggle buttons and tabs), and explicitly update these states via JavaScript when updating the visual active CSS classes.
