const fs = require('fs');
const path = require('path');

console.log("=== APPLYING GLOBAL TYPOGRAPHY RULES ACROSS ALL PAGES ===");

// 1. globals.css
const cssPath = path.join(__dirname, '../src/app/globals.css');
let css = fs.readFileSync(cssPath, 'utf-8');

// Ensure Expose font handles numbers within Zodiak font family via unicode-range
const unicodeRangeBlock = `
/* Expose-Medium for numbers within Zodiak font stack across all pages */
@font-face {
  font-family: 'Zodiak';
  src: url('/fonts/Expose-Medium.woff2') format('woff2'),
       url('/fonts/Expose-Medium.woff') format('woff'),
       url('/fonts/Expose-Medium.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
  unicode-range: U+0030-0039, U+0025, U+20BA; /* Digits 0-9, %, ₺ */
}

@font-face {
  font-family: 'Zodiak-Variable';
  src: url('/fonts/Expose-Medium.woff2') format('woff2'),
       url('/fonts/Expose-Medium.woff') format('woff'),
       url('/fonts/Expose-Medium.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
  unicode-range: U+0030-0039, U+0025, U+20BA; /* Digits 0-9, %, ₺ */
}
`;

if (!css.includes("unicode-range: U+0030-0039")) {
    css = css.replace(
        "/* Zodiak Variable Typography Classes (User specification) */",
        `${unicodeRangeBlock}\n/* Zodiak Variable Typography Classes (User specification) */`
    );
}

// Add global tag selectors for 500, 325, 225 weight rules
const globalTagRules = `
/* Global Typography Hierarchy Rules (500 / 325 / 225) across all pages */
h1 {
  font-family: 'Zodiak', 'Zodiak-Variable', Georgia, serif;
  font-weight: 500 !important;
  font-variation-settings: 'wght' 500 !important;
}

h2, h3, h4, h5, h6, button, [role="tab"], .btn {
  font-family: 'Zodiak', 'Zodiak-Variable', Georgia, serif;
  font-weight: 325 !important;
  font-variation-settings: 'wght' 325 !important;
}

p, label, li, input, textarea {
  font-family: 'Zodiak', 'Zodiak-Variable', Georgia, serif;
  font-weight: 225;
  font-variation-settings: 'wght' 225;
}
`;

if (!css.includes("/* Global Typography Hierarchy Rules")) {
    css = css.replace(
        ".zodiak-desc {",
        `${globalTagRules}\n.zodiak-desc {`
    );
}

// Update body font in globals.css
css = css.replace(
    "font-family: var(--font-inter), system-ui, -apple-system, sans-serif;",
    "font-family: 'Zodiak', 'Zodiak-Variable', Georgia, serif;"
);

fs.writeFileSync(cssPath, css, 'utf-8');
console.log("Updated globals.css with global unicode-range and tag hierarchies");

// 2. layout.tsx
const layoutPath = path.join(__dirname, '../src/app/layout.tsx');
let layout = fs.readFileSync(layoutPath, 'utf-8');

layout = layout.replace(
    'className="antialiased font-sans text-slate-900 bg-background selection:bg-brand-primary/20 selection:text-brand-primary min-h-screen"',
    'className="antialiased font-zodiak text-slate-900 bg-background selection:bg-brand-primary/20 selection:text-brand-primary min-h-screen"'
);

fs.writeFileSync(layoutPath, layout, 'utf-8');
console.log("Updated layout.tsx to apply font-zodiak globally on body");
