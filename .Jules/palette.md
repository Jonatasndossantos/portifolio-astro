## 2024-09-30 - Keyboard Shortcuts and Input Padding
**Learning:** When adding absolutely positioned visual hints inside input fields (like `<kbd>` for shortcuts), the text in the input can under-flow and overlap the absolute element if the input's padding is insufficient.
**Action:** Always adjust the input's padding (e.g., `pr-[70px]`) when placing absolutely positioned elements inside it to ensure the typed text does not visually overlap the element.
