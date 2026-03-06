const { chromium } = require('playwright');

(async () => {

  const browser = await chromium.launch({ headless:false });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://www.charityextra.com/account/login");

  console.log("Login, then press ENTER here.");

  process.stdin.once("data", async () => {

    await context.storageState({ path: "auth.json" });

    console.log("auth.json saved");

    await browser.close();
    process.exit();

  });

})();