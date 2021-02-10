const puppeteer = require('puppeteer');
const {errorHandler, fillRaffleNumbers} = require('./utils');
const {HEADLESS_CHROME, GLOBAL_PATH = ''} = process.env;

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
module.exports = async function ({debug, headless, luckyNumbers}) {
  const puppeteerConfig = {
    headless,
    defaultViewport: null,
    ...(GLOBAL_PATH.includes('gitRepos')
      ? {executablePath: 'chromium-browser'}
      : {}),
  };
  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();
  const modalSelector = '.cuk_cookie_consent_accept_all';
  const daySelector = new Date().getDay() === 3 ? '#fri_dd' : '#tue_dd';
  const checkResultSelector = '#euromillions_results_confirm';
  const showPrizeSelector = '.accordion > div > div';

  try {
    debug('Visiting the lotto Page');
    await page
      .goto('https://www.national-lottery.co.uk/results/euromillions/checker')
      .catch((e) => {
        const error = new Error(e);
        throw new Error(errorHandler('network', error.stack));
      });

    await page.waitForTimeout(500);

    debug('Closing Cookies modal');
    if (HEADLESS_CHROME) {
      await page
        .evaluate(
          (selector) => document.querySelector(selector).click(),
          modalSelector
        )
        .catch((e) => {
          const error = new Error(e);
          throw new Error(errorHandler('closeModal', error.stack));
        });
    } else {
      await page.click(modalSelector).catch((e) => {
        const error = new Error(e);
        throw new Error(errorHandler('closeModal', error.stack));
      });
    }

    debug('Filling Raffle Numbers');
    /**
     *
     * @param {String} sel - html selector for Page
     *
     * @returns {Promise<ElementHandle<Element>>}
     */
    function $Wrapper(sel) {
      return page.$(sel);
    }
    let counter = 0;

    try {
      await fillRaffleNumbers($Wrapper, counter, luckyNumbers);

      await page.waitForTimeout(5000);

      debug('Selecting raffle day');
      await page.click(daySelector).catch((e) => {
        const error = new Error(e);
        throw new Error(errorHandler('daySelection', error.stack));
      });

      debug('Checking results');
      await page.click(checkResultSelector).catch((e) => {
        const error = new Error(e);
        throw new Error(errorHandler('checkResults', error.stack));
      });

      await page.waitForTimeout(5000);

      debug('Showing Breakdown price');
      if (HEADLESS_CHROME) {
        await page
          .evaluate(
            (selector) => document.querySelector(selector).click(),
            showPrizeSelector
          )
          .catch((e) => {
            const error = new Error(e);
            throw new Error(errorHandler('showPrize', error.stack));
          });
      } else {
        await page.click(showPrizeSelector).catch((e) => {
          const error = new Error(e);
          throw new Error(errorHandler('showPrize', error.stack));
        });
      }

      await page.waitForTimeout(5000);

      debug('Taking screenshot');
      await page.screenshot({path: 'lotto_results.png', fullPage: true});

      if (HEADLESS_CHROME) {
        await browser.close();
      }

      debug('picture has been taken');
    } catch (e) {
      throw new Error(e);
    }
  } catch (errToLog) {
    throw new Error(errToLog);
  }
};
