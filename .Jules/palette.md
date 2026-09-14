## 2024-05-18 - Keyboard Accessibility for Global Search Bars
**Learning:** Adding a visible keyboard shortcut (like `<kbd>/</kbd>`) to search inputs and corresponding `keydown` listener makes global search components significantly more accessible and pleasant for power users, but it's crucial to check `document.activeElement?.tagName` to avoid hijacking normal text entry in other inputs.
**Action:** Always include a visual hint and a `keydown` listener for `/` when implementing search bars, checking for active input elements.
