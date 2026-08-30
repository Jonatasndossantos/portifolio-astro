## 2026-08-30 - Adding Keyboard Shortcuts to Search Inputs
**Learning:** Relying solely on a mouse to focus a search bar slows down power users and affects keyboard accessibility. Adding a visible keyboard hint (like `/`) paired with a hotkey event listener enhances the interface's discoverability and navigation efficiency.
**Action:** Add a visible `<kbd>/</kbd>` cue and a `keydown` listener checking for `e.key === '/'` (avoiding interception if an input is already focused) when implementing global search bars.
