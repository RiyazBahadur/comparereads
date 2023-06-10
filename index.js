const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const { scrapeLogicNonFiction } = require("./scrapeLogicNonFiction");
const { scrapeLogicURL } = require("./scrapeLogicURL");
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape/fiction", (req, res) => {
  scrapeLogic(res);
});

app.get("/scrape/non-fiction", (req, res) => {
  scrapeLogicNonFiction(res);
});

app.get("/scrape/url",(req,res)=>{
scrapeLogicURL(res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
