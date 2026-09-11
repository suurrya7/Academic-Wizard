const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 [Keep-Alive] Checking Streamlit container at https://academic-wizard.streamlit.app/ ...');
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000);

    // 1. Visit main URL
    await page.goto('https://academic-wizard.streamlit.app/', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 5000));

    // Detect and click wake button if sleeping
    const wakeClicked = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const wakeBtn = buttons.find(b => b.innerText && b.innerText.toLowerCase().includes('get this app back up'));
      if (wakeBtn) {
        wakeBtn.click();
        return true;
      }
      return false;
    });

    if (wakeClicked) {
      console.log('⚡ Found sleeping container! Clicked "Get this app back up!" button. Waiting 15s for boot...');
      await new Promise(r => setTimeout(r, 15000));
    } else {
      console.log('✅ Container is running.');
    }

    // 2. Visit embed iframe URL to ensure WebSocket session is active
    await page.goto('https://academic-wizard.streamlit.app/~/+/?embed=true#academic-wizard', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 5000));

    const pageText = await page.evaluate(() => document.body.innerText || '');
    if (pageText.includes('Academic Wizard') || pageText.includes('Enter Your Text') || pageText.includes('Run Academic Wizard')) {
      console.log('🎉 Streamlit Humanizer is ACTIVE, WARM, and FUNCTIONAL!');
    } else {
      console.log('ℹ️ Streamlit ping completed.');
    }
  } catch (err) {
    console.warn('⚠️ Keep-alive notice:', err.message);
  } finally {
    if (browser) await browser.close();
    console.log('🏁 Keep-alive check completed.');
  }
})();
