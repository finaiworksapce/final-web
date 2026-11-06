const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/globals.css');
let code = fs.readFileSync(filePath, 'utf8');

// Replace Expose @font-face font-weight 100 900 with 500 to prevent faux bold smearing
code = code.replace(/font-family: 'Expose';\s+src: [^;]+;\s+font-weight: 100 900;/g, `font-family: 'Expose';
  src: url('/fonts/Expose-Medium.woff2') format('woff2'),
       url('/fonts/Expose-Medium.woff') format('woff'),
       url('/fonts/Expose-Medium.ttf') format('truetype');
  font-weight: 500;`);

code = code.replace(/\/\* Expose-Medium for numbers within Zodiak font stack across all pages \*\/[\s\S]*?unicode-range: U\+0030-0039, U\+0025, U\+20BA; \/\* Digits 0-9, %, ₺ \*\/\s*\}/g, `/* Expose-Medium for numbers within Zodiak font stack across all pages */
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
}`);

// Add font-synthesis: none to prevent browser artificial bold smearing
code = code.replace(/\.font-numbers, \.font-expose \{[\s\S]*?\}/g, `.font-numbers, .font-expose {
  font-family: 'Expose-Medium', 'Expose', sans-serif !important;
  font-weight: 500 !important;
  font-style: normal;
  font-synthesis: none !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'tnum' on, 'lnum' on;
}`);

code = code.replace(/\.font-zodiak \{[\s\S]*?\}/g, `.font-zodiak {
  font-family: 'Zodiak', 'Zodiak-Variable', Georgia, serif !important;
  font-synthesis: none !important;
}`);

// Replace old colors in @theme
code = code.replace(/--color-foreground: #142B50;/g, '--color-foreground: #0E1E38;');
code = code.replace(/--color-primary: #142B50;/g, '--color-primary: #0E1E38;');
code = code.replace(/--color-secondary: #78B8F5;/g, '--color-secondary: #0E1E38;');
code = code.replace(/--color-secondary-foreground: #142B50;/g, '--color-secondary-foreground: #ffffff;');
code = code.replace(/--color-accent: #78B8F5;/g, '--color-accent: #0E1E38;');
code = code.replace(/--color-accent-foreground: #142B50;/g, '--color-accent-foreground: #ffffff;');
code = code.replace(/--color-border: #78B8F5;/g, '--color-border: #E2E8F0;');
code = code.replace(/--color-input: #78B8F5;/g, '--color-input: #E2E8F0;');

// Update body in globals.css
code = code.replace(/color: #142B50;/g, 'color: #0E1E38;');

fs.writeFileSync(filePath, code, 'utf8');
console.log('globals.css updated.');
