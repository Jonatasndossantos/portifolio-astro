const fs = require('fs');
const filesToPatch = [
    'src/content/projects/pt/jynsge-news.mdx',
    'src/content/projects/en/jynsge-news.mdx',
    'src/content/projects/jynsge-news.mdx',
    'src/dictionaries/portfolio/en-GB.json',
    'src/dictionaries/portfolio/fr.json',
    'src/dictionaries/portfolio/es.json'
];

filesToPatch.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/https:\/\/github\.com\/user-attachments\/assets\/33006547-eee8-445c-a724-4b0af26f1cb4/g, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97');
        fs.writeFileSync(filePath, content);
    } catch (e) {
        console.error("Error patching " + filePath, e);
    }
});
