const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../src/app/globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace top font-faces with Clash Grotesk
const newFontFaces = `@import "tailwindcss";

@font-face {
  font-family: 'Clash Grotesk';
  src: url('/fonts/ClashGrotesk-Medium.woff2') format('woff2'),
       url('/fonts/ClashGrotesk-Medium.woff') format('woff'),
       url('/fonts/ClashGrotesk-Medium.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: 'ClashGrotesk-Medium';
  src: url('/fonts/ClashGrotesk-Medium.woff2') format('woff2'),
       url('/fonts/ClashGrotesk-Medium.woff') format('woff'),
       url('/fonts/ClashGrotesk-Medium.ttf') format('truetype');
  font-weight: 500;
  font-display: swap;
  font-style: normal;
}

/* Fallback & backwards compatibility mapping: all existing font-family calls use Clash Grotesk */
@font-face {
  font-family: 'Zodiak';
  src: url('/fonts/ClashGrotesk-Medium.woff2') format('woff2'),
       url('/fonts/ClashGrotesk-Medium.woff') format('woff'),
       url('/fonts/ClashGrotesk-Medium.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: 'Zodiak-Variable';
  src: url('/fonts/ClashGrotesk-Medium.woff2') format('woff2'),
       url('/fonts/ClashGrotesk-Medium.woff') format('woff'),
       url('/fonts/ClashGrotesk-Medium.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: 'Expose-Medium';
  src: url('/fonts/ClashGrotesk-Medium.woff2') format('woff2'),
       url('/fonts/ClashGrotesk-Medium.woff') format('woff'),
       url('/fonts/ClashGrotesk-Medium.ttf') format('truetype');
  font-weight: 500;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: 'Expose';
  src: url('/fonts/ClashGrotesk-Medium.woff2') format('woff2'),
       url('/fonts/ClashGrotesk-Medium.woff') format('woff'),
       url('/fonts/ClashGrotesk-Medium.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}

*, *::before, *::after {
  font-synthesis: none !important;
}

/* Typography Classes with Exact User Weights (500 / 325 / 225) */
.font-clash, .font-zodiak {
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif !important;
  font-synthesis: none !important;
}

.clash-title, .zodiak-title {
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif !important;
  font-weight: 500 !important;
  font-variation-settings: 'wght' 500 !important;
  font-synthesis: none !important;
}

.clash-subtitle, .zodiak-subtitle {
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif !important;
  font-weight: 325 !important;
  font-variation-settings: 'wght' 325 !important;
  font-synthesis: none !important;
}

.clash-desc, .zodiak-desc {
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif !important;
  font-weight: 225 !important;
  font-variation-settings: 'wght' 225 !important;
  font-synthesis: none !important;
}

.font-numbers, .font-expose {
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif !important;
  font-weight: 500 !important;
  font-style: normal;
  font-synthesis: none !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'tnum' on, 'lnum' on;
}

/* Global HTML Tag Hierarchy */
h1 {
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif;
  font-weight: 500 !important;
  font-variation-settings: 'wght' 500 !important;
  font-synthesis: none !important;
  color: #040989;
}

h2, h3, h4, h5, h6, button, [role="tab"], .btn {
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif;
  font-weight: 325 !important;
  font-variation-settings: 'wght' 325 !important;
  font-synthesis: none !important;
  color: #040989;
}

p, label, li, input, textarea {
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif;
  font-weight: 225;
  font-variation-settings: 'wght' 225;
  font-synthesis: none !important;
  color: #040989;
}
`;

// Replace from beginning to @theme
const themeIdx = css.indexOf('@theme {');
if (themeIdx !== -1) {
    const afterTheme = css.slice(themeIdx);
    css = newFontFaces + '\n' + afterTheme;
}

// Update @theme to official 6-color palette
css = css.replace(/--color-background:\s*[^;]+;/g, '--color-background: #F5F7FA;');
css = css.replace(/--color-foreground:\s*[^;]+;/g, '--color-foreground: #040989;');
css = css.replace(/--color-primary:\s*[^;]+;/g, '--color-primary: #004BFA;');
css = css.replace(/--color-primary-foreground:\s*[^;]+;/g, '--color-primary-foreground: #F5F7FA;');
css = css.replace(/--color-secondary:\s*[^;]+;/g, '--color-secondary: #D6E4FF;');
css = css.replace(/--color-secondary-foreground:\s*[^;]+;/g, '--color-secondary-foreground: #040989;');
css = css.replace(/--color-accent:\s*[^;]+;/g, '--color-accent: #004BFA;');
css = css.replace(/--color-accent-foreground:\s*[^;]+;/g, '--color-accent-foreground: #F5F7FA;');
css = css.replace(/--color-muted:\s*[^;]+;/g, '--color-muted: #F5F7FA;');
css = css.replace(/--color-muted-foreground:\s*[^;]+;/g, '--color-muted-foreground: #5B80FF;');
css = css.replace(/--color-border:\s*[^;]+;/g, '--color-border: #D6E4FF;');
css = css.replace(/--color-input:\s*[^;]+;/g, '--color-input: #D6E4FF;');

// Update body in globals.css
css = css.replace(/body\s*\{[\s\S]*?font-family:\s*[^;]+;[\s\S]*?\}/g, `body {
  background: #F5F7FA;
  color: #040989;
  font-family: 'Clash Grotesk', 'ClashGrotesk-Medium', sans-serif;
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('globals.css successfully updated with Clash Grotesk and FinAi PDF color palette.');
