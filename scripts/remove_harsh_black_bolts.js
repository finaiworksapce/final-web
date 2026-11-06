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
let modifiedCount = 0;

files.forEach(f => {
    let text = fs.readFileSync(f, 'utf8');
    let original = text;

    // Replace heavy black boldings with clean, elegant normal weight
    text = text.replace(/\bfont-black\b/g, 'font-normal');
    text = text.replace(/\bfont-extrabold\b/g, 'font-normal');
    
    // Replace harsh pitch-black text colors with midnight navy #0E1E38
    text = text.replace(/\btext-black\b/g, 'text-[#0E1E38]');
    text = text.replace(/\btext-slate-900\b/g, 'text-[#0E1E38]');
    text = text.replace(/\btext-gray-900\b/g, 'text-[#0E1E38]');

    if (text !== original) {
        fs.writeFileSync(f, text, 'utf8');
        modifiedCount++;
    }
});

console.log(`Cleaned heavy black bolding in ${modifiedCount} files.`);
