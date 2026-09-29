## 2026-09-29 - [Search Keyboard Shortcut]
**Learning:** Added a keyboard shortcut (`/`) to the search page. When adding absolute positioned elements (like a `<kbd>` hint) inside input fields, you must add right padding to the input so text doesn't flow underneath the hint. Also learned that when using javascript to hide/show tailwind elements, explicitly removing the display class (e.g. `sm:inline-flex`) before adding `hidden` is safer to avoid specificity issues.
**Action:** Always verify input padding and tailwind display class toggles when adding floating UI elements inside form fields.
