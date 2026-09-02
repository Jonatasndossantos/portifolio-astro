const fs = require('fs');

const filesToPatch = [
    'src/content/projects/vitanexus.mdx',
    'src/content/projects/pt/vitanexus.mdx',
    'src/content/projects/en/vitanexus.mdx',
    'src/dictionaries/portfolio/en-GB.json',
    'src/dictionaries/portfolio/fr.json',
    'src/dictionaries/portfolio/es.json'
];

filesToPatch.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/https:\/\/github\.com\/user-attachments\/assets\/b4de6b35-398c-4e82-b6f8-6dfcf5f71103/g, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97');
        fs.writeFileSync(filePath, content);
    } catch (e) {
        console.error("Error patching " + filePath, e);
    }
});
