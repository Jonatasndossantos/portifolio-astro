## 2026-08-24 - Added type="button" to UI filter components
**Learning:** When placing buttons in generic UI components like SearchFilters that might be reused across different layouts (sometimes inside forms), it's important to specify `type="button"` to prevent accidental form submissions which disrupts UX.
**Action:** Always explicitly define `type="button"` for all non-submit button elements, especially in highly reusable UI components.
