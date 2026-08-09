import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeReport() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    console.log('Navigating to SEOptimer...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://www.seoptimer.com/academicwizard.online', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log('Waiting for the report to generate (20 seconds)...');
    // Wait for the report generation progress bar to finish or just wait a fixed time
    await new Promise(r => setTimeout(r, 20000));
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: path.join(__dirname, 'seoptimer_screenshot.png'), fullPage: true });
    
    console.log('Extracting text content...');
    const textContent = await page.evaluate(() => {
        // Try to get the main content, or fallback to body text
        const content = document.querySelector('.container') || document.body;
        return content.innerText;
    });
    
    fs.writeFileSync(path.join(__dirname, 'seoptimer_report.txt'), textContent);
    console.log('Report saved to seoptimer_report.txt');
    
    await browser.close();
}

scrapeReport().catch(console.error);
