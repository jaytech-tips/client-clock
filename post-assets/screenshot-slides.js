const { chromium } = require('playwright');
const path = require('path');
const dir = __dirname;

const slides = ['slide1-hero','slide2-light','slide3-dark','slide4-invoice','slide5-cta'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const name of slides) {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
    const htmlPath = 'file://' + path.join(dir, name + '.html');
    await page.goto(htmlPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(dir, name + '.png'), fullPage: false });
    await page.close();
    console.log('Saved', name + '.png');
  }
  await browser.close();
})();
