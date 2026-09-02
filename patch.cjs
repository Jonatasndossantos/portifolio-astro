const fs = require('fs');

const uiSearchFiltersPath = 'src/components/ui/SearchFilters.astro';
let uiSearchFiltersContent = fs.readFileSync(uiSearchFiltersPath, 'utf8');

// Replace visual hint text
uiSearchFiltersContent = uiSearchFiltersContent.replace(
    'Search\n        </div>',
    '<span class="flex items-center gap-1">Search <kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd></span>\n        </div>'
);

// Add event listener in script
uiSearchFiltersContent = uiSearchFiltersContent.replace(
    '        searchInput.addEventListener("input", (e) => {',
    `        document.addEventListener("keydown", (e) => {
            if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
                e.preventDefault();
                searchInput.focus();
            }
        });

        searchInput.addEventListener("input", (e) => {`
);

fs.writeFileSync(uiSearchFiltersPath, uiSearchFiltersContent);

const pagesSearchPath = 'src/components/pages/search/Index.astro';
let pagesSearchContent = fs.readFileSync(pagesSearchPath, 'utf8');

// The global search page has no explicit div for search hint so we might need to add one
// Actually, it doesn't have a label. Let's add the KBD shortcut directly to the input wrapper in Index.astro

pagesSearchContent = pagesSearchContent.replace(
    '                        class="btn btn-ghost btn-sm btn-circle mr-3 hidden"',
    `                        class="btn btn-ghost btn-sm btn-circle mr-3 hidden"
                    >
                        <Icon name="lucide:x" class="size-4" />
                    </button>
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-base-300 rounded-lg text-[10px] font-bold opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none uppercase tracking-tighter flex items-center gap-1">
                        <kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd>
                    </div>`
);

// We need to clean up the existing clear button because I just inserted the x icon, let's look closer at the original code.
