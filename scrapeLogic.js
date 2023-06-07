const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://www.amazon.com/charts/2023-06-04/mostread/fiction");

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    
    const f = await page.$(".kc-rank-card-title")
   //obtain text
   const text = await (await f.getProperty('textContent')).jsonValue()
   console.log("Text is: " + text)

    // Print the full title
    const logStatement = `The title of this blog post is ${text}`;
    console.log(logStatement);
    res.send(logStatement);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
