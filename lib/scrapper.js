const puppeteer = require('puppeteer');
const { errorHandler, fillRaffleNumbers } = require('../utils');
const { LUCKY_NUMBERS, HEADLESS_CHROME } = process.env;

/**
 * Scrapper Params
 * @typedef {Object} Scrapper
 * @property {boolean} headless - run Puppeteer in headless mode
 * @property {Array<string>} luckyNumbers - Numbers to check
 * @property {any} debug - Debugger
 */

/**
 * 
 * @param {Scrapper} Scrapper
 */
module.exports = async function ({ debug, headless, luckyNumbers }) {

  const browser = await puppeteer.launch({ headless, defaultViewport: null });
  const page = await browser.newPage();
  const modalSelector = '.cuk_cookie_consent_accept_all';
  const daySelector = new Date().getDay() === 3 ? '#fri_dd' : '#tue_dd';
  const checkResultSelector = '#euromillions_results_confirm';
  const showPrizeSelector = '.accordion > div > div';

  try {
    debug('Visiting the lotto Page');
    await page
      .goto('https://www.national-lottery.co.uk/results/euromillions/checker')
      .catch(errorHandler('network'));

    await page.waitForTimeout(500)

    debug('Closing Cookies modal');
    if (HEADLESS_CHROME) {
      await page
        .evaluate((selector) => document.querySelector(selector).click(), modalSelector)
        .catch(errorHandler('closeModal'));
    } else {
      await page
        .click(modalSelector)
        .catch(errorHandler('closeModal'));
    }

    debug('Filling Raffle Numbers');
    /**
     * 
     * @param {String} sel - html selector for Page
     * 
     * @returns {Promise<ElementHandle<Element>>}
     */
    function $Wrapper(sel) { return page.$(sel) }
    let counter = 0;

    setTimeout(() => fillRaffleNumbers($Wrapper, counter, luckyNumbers), 500);

    await page.waitForTimeout(5000);

    debug('Selecting raffle day');
    await page
      .click(daySelector)
      .catch(errorHandler('daySelection'));

    debug('Checking results');
    await page
      .click(checkResultSelector)
      .catch(errorHandler('checkResults'));

    await page.waitForTimeout(5000);

    debug('Showing Breakdown price');
    if (HEADLESS_CHROME) {
      await page
        .evaluate((selector) => document.querySelector(selector).click(), showPrizeSelector)
        .catch(errorHandler('showPrize'));
    } else {
      await page
        .click(showPrizeSelector)
        .catch(errorHandler('showPrize'));
    }

    debug('Taking screenshot');
    await page.screenshot({ path: 'lotto_results.png', fullPage: true });

    if (HEADLESS_CHROME) {
      await browser.close();
    }

    debug('picture has been taken');
  } catch (e) {
    console.log(e)
  }
}