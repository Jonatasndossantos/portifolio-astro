const fs = require('fs');
const path = 'src/components/ui/SearchFilters.astro';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
    '<div class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-base-200 rounded-lg text-[10px] font-bold opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none uppercase tracking-tighter">',
    '<div class="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-base-200 rounded-lg text-[10px] font-bold opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none uppercase tracking-tighter group-focus-within:opacity-0">'
);

fs.writeFileSync(path, content);
