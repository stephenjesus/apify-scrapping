
// API_FY_SDK
const Apify = require('apify');

// HTML SELECTOR
const { selector } = require("./selector");

// URL
const { URL } = require("./url");

Apify.main(async () => {

  const browser = await Apify.launchPuppeteer({ launchOptions: { headless: true } });

  const page = await browser.newPage();

  await page.goto(URL.HACKER_NEWS, { waitUntil: selector.IDLE });

  const latestNews = await fetchBlogDetails(page , selector);

  await Apify.setValue("LATEST_NEWS", latestNews);

});

const removeEmptyArray = (result) => { return result.filter(e => e && e.length) };

const fetchBlogDetails = async (page , selector) => {
  const result = await page.evaluate((selector) =>
  Array.from(document.querySelectorAll(selector.title), row =>
  Array.from(row.querySelectorAll(`${selector.storyLink}`),
  cell => cell && cell.innerText)), selector);

  return removeEmptyArray(result);
}