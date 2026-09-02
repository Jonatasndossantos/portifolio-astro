const fs = require('fs');
const glob = require('fs');

const filesToPatch = [
    'src/content/projects/plataforma-lumen.mdx',
    'src/content/projects/gov-docs-ai.mdx',
    'src/content/projects/pt/plataforma-lumen.mdx',
    'src/content/projects/pt/gov-docs-ai.mdx',
    'src/content/projects/en/plataforma-lumen.mdx',
    'src/content/projects/en/gov-docs-ai.mdx',
    'src/dictionaries/portfolio/en-GB.json',
    'src/dictionaries/portfolio/en.json',
    'src/dictionaries/portfolio/fr.json',
    'src/dictionaries/portfolio/es.json',
    'src/dictionaries/portfolio/pt.json'
];

filesToPatch.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/https:\/\/github\.com\/Jonatasndossantos\/Jonatasndossantos\/blob\/main\/src\/lumen\.png\?raw=true/g, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97');
        fs.writeFileSync(filePath, content);
    } catch (e) {
        console.error("Error patching " + filePath, e);
    }
});
