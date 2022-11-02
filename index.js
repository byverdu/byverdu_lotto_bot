require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const debug = require('debug')('node-telegram-bot-api');

const {
  scrapper,
  utils: {logErrorBuilder},
} = require('./lib');

const name = 'byverdu_lotto_bot';
const {TELEGRAM_TOKEN, TELEGRAM_GROUP_CHAT_ID, LUCKY_NUMBERS, HEADLESS_CHROME} =
  process.env;
let tryErrorsCount = 0;

debug('booting', name);
debug(
  'set telegram Token =>',
  TELEGRAM_TOKEN !== undefined
    ? '👍 TOKEN PROVIDED 👍'
    : ' 👎 NO TOKEN PROVIDED 👎'
);

if (!TELEGRAM_TOKEN) {
  process.exit(0);
}

const bot = new TelegramBot(TELEGRAM_TOKEN);
const luckyNumbers = LUCKY_NUMBERS.split(',');
let groupId;
let telegramError;

(async () => {
  try {
    const botUpdate = await bot.getUpdates();

    // Check if the groupId could have changed
    debug('Getting Chat Id');
    groupId =
      botUpdate.length === 0
        ? TELEGRAM_GROUP_CHAT_ID
        : botUpdate.find((items) => items.message.chat.type === 'group').message
            .chat.id;
  } catch (e) {
    logErrorBuilder(`Error fetching botGroupId\n ${e}`)
      .then(() => {
        telegramError = 'fetching botGroupId Error logged';
        debug('fetching botGroupId Error logged');
      })
      .catch((err) => debug(err));
    throw new Error(telegramError);
  }
})().then(() => {
  scrapper({debug, headless: JSON.parse(HEADLESS_CHROME), luckyNumbers})
    .then(() => {
      debug('Sending Picture');
      bot.sendPhoto(groupId, './lotto_results.png').then((resp) => {
        debug('Picture sent', resp);
        process.exit(0);
      });
    })
    .catch((err) => {
      logErrorBuilder(`Error in scrapper\n ${err}`)
        .then(() => {
          bot.sendMessage(groupId, `${err}`).then(() => {
            debug('Scrapper Error sent');
            process.exit(0);
          });
        })
        .catch((err) => debug(err));
    });
});
