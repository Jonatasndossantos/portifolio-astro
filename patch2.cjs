const fs = require('fs');

const pagesSearchPath = 'src/components/pages/search/Index.astro';
let pagesSearchContent = fs.readFileSync(pagesSearchPath, 'utf8');

// The Index search has a clear button with icon x. Let's add the KBD shortcut directly after the clear button
pagesSearchContent = pagesSearchContent.replace(
    '                        <Icon name="lucide:x" class="size-5" />\n                    </button>\n                </div>\n            </div>',
    `                        <Icon name="lucide:x" class="size-5" />\n                    </button>\n                    <div class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-base-300/50 rounded-lg text-[10px] font-bold opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none uppercase tracking-tighter flex items-center gap-1 group-focus-within:hidden">\n                        <kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd>\n                    </div>\n                </div>\n            </div>`
);

// We need to also add the keyboard shortcut for "/" here
pagesSearchContent = pagesSearchContent.replace(
    '    searchInput?.addEventListener("input", (e) => {',
    `    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
            e.preventDefault();
            searchInput.focus();
        }
    });

    searchInput?.addEventListener("input", (e) => {`
);

fs.writeFileSync(pagesSearchPath, pagesSearchContent);
