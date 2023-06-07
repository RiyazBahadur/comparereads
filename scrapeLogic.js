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

    await page.goto("https://www.amazon.com/charts/2023-06-04/mostsold/fiction");

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });
    
    // const f = await page.$(".kc-vertical-rank-container")
   await page.$(".kc-vertical-rank-container")

    const innerTexts = await page.evaluate(
      () => {
        const nodes = [...document.querySelectorAll('.kc-rank-card')];
        const texts = nodes.map(node => [
          node.querySelector('.kc-wol')?.innerText,
          node.querySelector('.kc-rank-card-title')?.innerText,
          node.querySelector('.kc-rank-card-author')?.innerText,
          node.querySelector('.kc-rank-card-publisher')?.innerText,
          node.querySelector('a.kc-cover-link')?.getAttribute('href'),
          node.querySelector('a.kc-cover-link>img')?.getAttribute('src')
        ]);
        return texts;
      }
    );
    console.log(innerTexts);

    // Print the full title
    // const logStatement = `The title of this blog post is ${text}`;
    // console.log(logStatement);
    // res.send(logStatement);
    res.send(innerTexts);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
