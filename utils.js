const https = require('https');

/**
   * @typedef {Object} Chat
   * @property {number} id - Chat ID
   * @property {"group"} type - Chat type
   *
   * @typedef {Object} BotUpdate
   * @property {Chat} chat
   *
   * @param {string} token - bot API token
  *  @returns {Promise<Array<BotUpdate>>}
   */
async function getChatId(token) {
  return new Promise((resolve, reject) => {
    https.get(`https://api.telegram.org/bot${token}/getUpdates`, (response) => {
      response.on('data', (chunk) => {
        const data = JSON.parse(chunk)

        return data.ok ? resolve(data.result) : reject(data)
      })
    })
  })
}

/**
 * 
 * @param {String} errorType
 * 
 * @returns {function(): Error}
 */
function errorHandler(errorType) {
  const BASE_ERROR = 'Something went wrong';
  const error = {
    network: `${errorType} => ${BASE_ERROR} visiting https://national-lottery.co.uk`,
    closeModal: `${errorType} => ${BASE_ERROR} closing the cookies modal`,
    fillingInput: `${errorType} => ${BASE_ERROR} adding raffle numbers`,
    daySelection: `${errorType} => ${BASE_ERROR} selecting raffle date`,
    checkResults: `${errorType} => ${BASE_ERROR} checking the results`,
    showPrize: `${errorType} => ${BASE_ERROR} checking the prize`,
  }[errorType] || 'Error not handled'

  return () => { throw new Error(error) }
}

/**
 * 
 * @param {Function} selectorMethod 
 * @param {Number} innerCount - iteration counter
 * @param {Array<String>} luckyNumbers - User raffle numbers
 */
async function fillRaffleNumbers(selectorMethod, innerCount, luckyNumbers) {

  const poolSelector = innerCount < 5 ? '0' : '1';
  const colSelector = innerCount < 5 ? innerCount : (innerCount === 5 ? '0' : '1');
  const selector = `#euromillions_resultschecker_line_0_pool_${poolSelector}_col_${colSelector}`

  await selectorMethod(selector)
    .then(input => input.type(luckyNumbers[innerCount]))
    .catch(errorHandler('fillingInput'));

  innerCount++;
  if (innerCount < (luckyNumbers.length)) {
    setTimeout(() => fillRaffleNumbers(selectorMethod, innerCount, luckyNumbers), 500);
  }
}

module.exports = {

  getChatId,
  errorHandler,
  fillRaffleNumbers
}