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
        } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk('src');
let changedCount = 0;
files.forEach(f => {
    let text = fs.readFileSync(f, 'utf8');
    if (text.includes('#142B50') || text.includes('142B50')) {
        text = text.replace(/#142B50/g, '#0E1E38');
        fs.writeFileSync(f, text, 'utf8');
        changedCount++;
    }
});

console.log(`Replaced #142B50 with #0E1E38 in ${changedCount} files.`);
