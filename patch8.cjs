const fs = require('fs');
const pagesSearchPath = 'src/components/pages/search/Index.astro';
let pagesSearchContent = fs.readFileSync(pagesSearchPath, 'utf8');

// I notice the / symbol isn't showing up because it is positioned absolutely, overlapping with the clear button or other elements, maybe we need to place it differently. Let's see...

// Let's replace the position.

pagesSearchContent = pagesSearchContent.replace(
    '<div class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-base-300/50 rounded-lg text-[10px] font-bold opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none uppercase tracking-tighter flex items-center gap-1 group-focus-within:hidden">\n                        <kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd>\n                    </div>',
    '<div class="absolute right-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-base-300/50 rounded-lg text-[10px] font-bold opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none uppercase tracking-tighter flex items-center gap-1 group-focus-within:hidden">\n                        <kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd>\n                    </div>'
);

fs.writeFileSync(pagesSearchPath, pagesSearchContent);
