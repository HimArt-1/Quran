import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5174/');
  
  // Wait for the React app to render the header
  await page.waitForSelector('.header-content');
  
  await page.screenshot({ path: 'preview.png' });
  
  // Click first day to see progress update
  await page.click('.day-card');
  await page.waitForTimeout(500); // Wait for transition
  await page.screenshot({ path: 'preview-clicked.png' });
  
  await browser.close();
})();
