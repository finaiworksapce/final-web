const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto('http://localhost:3016/dashboard', { waitUntil: 'networkidle2' });

    const samples = await page.evaluate(() => {
        const results = [];
        const targets = document.querySelectorAll('h1, h2, h3, h4, .font-numbers');
        for (const el of targets) {
            const text = (el.innerText || '').trim();
            if (text && el.children.length === 0) {
                const style = window.getComputedStyle(el);
                results.push({
                    tag: el.tagName,
                    text: text.slice(0, 35),
                    weight: style.fontWeight,
                    color: style.color,
                    font: style.fontFamily
                });
            }
        }
        return results;
    });

    console.log('Sample headings and numbers:');
    console.log(JSON.stringify(samples.slice(0, 20), null, 2));
    await browser.close();
})();
