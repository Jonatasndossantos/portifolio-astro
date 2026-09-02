const fs = require('fs');

const uiSearchFiltersPath = 'src/components/ui/SearchFilters.astro';
let uiSearchFiltersContent = fs.readFileSync(uiSearchFiltersPath, 'utf8');

// Fix ts(18047) activeElement possibly null
uiSearchFiltersContent = uiSearchFiltersContent.replace(
    'if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {',
    'if (e.key === "/" && document.activeElement && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {'
);

fs.writeFileSync(uiSearchFiltersPath, uiSearchFiltersContent);

const pagesSearchPath = 'src/components/pages/search/Index.astro';
let pagesSearchContent = fs.readFileSync(pagesSearchPath, 'utf8');

pagesSearchContent = pagesSearchContent.replace(
    'if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {',
    'if (e.key === "/" && document.activeElement && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {'
);

fs.writeFileSync(pagesSearchPath, pagesSearchContent);
