const {
  promises: {appendFile},
} = require('fs');

/**
 * @param {String} errorType
 *
 * @returns string
 */
function errorHandler(errorType, errorStack) {
  const BASE_ERROR = 'Something went wrong';
  const error =
    {
      network: `${errorType} => ${BASE_ERROR} visiting https://national-lottery.co.uk`,
      closeModal: `${errorType} => ${BASE_ERROR} closing the cookies modal`,
      fillingInput: `${errorType} => ${BASE_ERROR} adding raffle numbers`,
      daySelection: `${errorType} => ${BASE_ERROR} selecting raffle date`,
      checkResults: `${errorType} => ${BASE_ERROR} checking the results`,
      showPrize: `${errorType} => ${BASE_ERROR} checking the prize`,
    }[errorType] || 'Error not handled';

  return `${error}\n${errorStack}`;
}

/**
 *
 * @param {Function} selectorMethod
 * @param {Number} innerCount - iteration counter
 * @param {Array<String>} luckyNumbers - User raffle numbers
 */
async function fillRaffleNumbers(selectorMethod, innerCount, luckyNumbers) {
  return new Promise(async (resolve, reject) => {
    const poolSelector = innerCount < 5 ? '0' : '1';
    const colSelector =
      innerCount < 5 ? innerCount : innerCount === 5 ? '0' : '1';
    const selector = `#euromillions_resultschecker_line_0_pool_${poolSelector}_col_${colSelector}`;

    await selectorMethod(selector)
      .then((input) => {
        input.type(luckyNumbers[innerCount]);
        resolve();
      })
      .catch((e) => {
        const error = new Error(e);
        const errorMsg = `${errorHandler('fillingInput', error.stack)}`;

        reject(errorMsg);
      });

    innerCount++;
    if (innerCount < luckyNumbers.length) {
      setTimeout(
        () => fillRaffleNumbers(selectorMethod, innerCount, luckyNumbers),
        500
      );
    }
  });
}

function logErrorBuilder(text) {
  const errorLog = `${new Date()}
${text}
${'='.repeat(60)}\n`;

  return appendFile('./log-error.txt', errorLog);
}

module.exports = {
  errorHandler,
  fillRaffleNumbers,
  logErrorBuilder,
};
