import fs from 'fs';
import path from 'path';

const contentDir = path.resolve('c:/Users/Eunice/OneDrive/Documentos/Jhon/projetos/test-astro/verdant-visual/src/content');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else {
            if (filePath.endsWith('.md') || filePath.endsWith('.mdx')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walk(contentDir);
let changedCount = 0;

for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fmMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
    if (!fmMatch) continue;

    const fmStr = fmMatch[1];
    const keys = ["relatedTopics", "tags", "relatedServices", "relatedPosts", "relatedProject", "ctaService"];
    const links = new Set();
    
    const lines = fmStr.split(/\r?\n/);
    let currentKey = null;

    for (const line of lines) {
        const keyMatch = line.match(/^([a-zA-Z0-9_]+):/);
        if (keyMatch) {
            if (keys.includes(keyMatch[1])) {
                currentKey = keyMatch[1];
                let val = line.substring(keyMatch[0].length).trim();
                val = val.replace(/^['"]|['"]$/g, '');
                if (val) links.add(val);
            } else {
                currentKey = null;
            }
            continue;
        }

        if (currentKey && line.trim().startsWith('-')) {
            let val = line.trim().substring(1).trim();
            val = val.replace(/^['"]|['"]$/g, '');
            if (val) links.add(val);
        }
    }

    if (links.size > 0) {
        const formattedLinks = Array.from(links).map(l => `[[${l}]]`).join(' ');
        const section = `\n\n<!-- Obsidian Graph Connections (Hidden in Astro) -->\n<div style="display: none;" aria-hidden="true">\n${formattedLinks}\n</div>\n`;
        
        // Remove existing if any
        let cleanContent = content.replace(/\n\n<!-- Obsidian Graph Connections \([\s\S]+?<\/div>\n/g, '');
        
        fs.writeFileSync(file, cleanContent + section, 'utf-8');
        changedCount++;
        console.log(`Updated ${path.basename(file)} com ${links.size} conexões`);
    }
}

console.log(`Finalizado! ${changedCount} arquivos atualizados.`);
