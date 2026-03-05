const { chromium } = require('playwright');

(async () => {

  const browser = await chromium.launch({ headless:true });

  const context = await browser.newContext({
    storageState: 'auth.json'
  });

  const page = await context.newPage();

  // STEP 1 — get total goals
  await page.goto("https://www.charityextra.com/bymctehillathon/admin/communities");

  await page.waitForSelector("#my-ajax-grid");

  const goals = await page.$$eval(
    "#my-ajax-grid tbody tr td:nth-child(7)",
    els => els.map(e => e.innerText.trim())
  );

  const numbers = goals
    .map(g => parseInt(g.replace(/,/g,'')))
    .filter(n => !isNaN(n));

  const total = numbers.reduce((a,b) => a + b, 0);

  console.log("Total goal:", total);


  // STEP 2 — open CSS page
  await page.goto("https://www.charityextra.com/bymctehillathon/admin/details/advance");

  await page.waitForSelector("#input-customCss");


  // STEP 3 — read CSS
  let css = await page.$eval("#input-customCss", el => el.value);


  // STEP 4 — replace the number
  css = css.replace(
    /content:\s*"\d+\s*פרקים of תהלים already said"/,
    `content: "${total} פרקים of תהלים already said"`
  );


  // STEP 5 — write CSS back
  await page.fill("#input-customCss", css);


  // STEP 6 — save
await page.click('.submit_admin_post');

  console.log("CSS updated.");


})();
