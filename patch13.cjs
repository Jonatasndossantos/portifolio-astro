const fs = require('fs');
const path = 'src/components/ui/SearchFilters.astro';
let content = fs.readFileSync(path, 'utf8');

// I notice it is still showing the word SEARCH inside the box placeholder, with an icon. We need to override it more aggressively.
// It seems the word SEARCH in the placeholder is coming from: `searchPlaceholder` which could be `Search projects...`
// I need to change the word `Search` inside the visual label to make it just show `<kbd>/</kbd>` instead of `Search /` to make it simpler and cleaner, and avoid duplicate "SEARCH" texts.

content = content.replace(
    '<span class="flex items-center gap-1">Search <kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd></span>',
    '<span class="flex items-center gap-1"><kbd class="kbd kbd-xs bg-base-100 font-sans border-base-content/20">/</kbd></span>'
);

fs.writeFileSync(path, content);
