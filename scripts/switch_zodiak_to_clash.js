const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
            results = results.concat(walk(fullPath));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('src');
let count = 0;
files.forEach(f => {
    let text = fs.readFileSync(f, 'utf8');
    let original = text;

    text = text.replace(/font-zodiak/g, 'font-clash');
    text = text.replace(/zodiak-title/g, 'clash-title');
    text = text.replace(/zodiak-subtitle/g, 'clash-subtitle');
    text = text.replace(/zodiak-desc/g, 'clash-desc');

    if (text !== original) {
        fs.writeFileSync(f, text, 'utf8');
        count++;
    }
});

console.log(`Updated typography classes to Clash Grotesk in ${count} files.`);
