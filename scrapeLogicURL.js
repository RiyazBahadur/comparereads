const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogicURL = async (res) => {
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

    await page.goto("https://www.amazon.com/Awaken-Giant-Within-Immediate-Emotional/dp/0671791540");

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // const f = await page.$(".kc-vertical-rank-container")
    await page.$(".swatchElement")
    // document.querySelector("#a-autoid-4-announce > span:nth-child(1)")
    const innerTexts = await page.evaluate(
      () => {
        const nodes = [...document.querySelectorAll('#tmmSwatches > ul > li')];
        const texts = nodes.map(node => [
          node.querySelector('.a-button-inner>a>span:nth-child(1)')?.innerText,
          node.querySelector('.a-button-inner>a>span>span')?.innerText,
          node.querySelector('.a-button-inner>a')?.getAttribute('href')
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

module.exports = { scrapeLogicURL };
