const fs = require('fs');

const filePath = 'src/components/sections/About.astro';

try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/https:\/\/github\.com\/Jonatasndossantos\/Jonatasndossantos\/blob\/main\/src\/perfil\.jfif\?raw=true/g, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97');
    fs.writeFileSync(filePath, content);
} catch (e) {
    console.error("Error patching " + filePath, e);
}
