const fs = require('fs');
const pagesSearchPath = 'src/components/pages/search/Index.astro';
let pagesSearchContent = fs.readFileSync(pagesSearchPath, 'utf8');

// Use right-4 since the clear button only shows when input has content.
// Since the hint will hide `group-focus-within:hidden`, it will disappear before clear button has any content, so no clash will happen!

pagesSearchContent = pagesSearchContent.replace(
    '<div class="absolute right-12 top-1/2 -translate-y-1/2 px-2 py-1 bg-base-300/50 rounded-lg text-[10px] font-bold opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none uppercase tracking-tighter flex items-center gap-1 group-focus-within:hidden">\n                        <kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd>\n                    </div>',
    '<div class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-base-300/50 rounded-lg text-[10px] font-bold opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none uppercase tracking-tighter flex items-center gap-1 group-focus-within:hidden">\n                        <kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd>\n                    </div>'
);

fs.writeFileSync(pagesSearchPath, pagesSearchContent);
