require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const debug = require('debug')('node-telegram-bot-api');

const { getChatId } = require('./utils');
const { scrapper } = require('./lib')

const name = 'byverdu_lotto_bot';
const { TELEGRAM_TOKEN, TELEGRAM_GROUP_CHAT_ID, LUCKY_NUMBERS, HEADLESS_CHROME } = process.env;

debug('booting', name);
debug('set telegram Token =>', TELEGRAM_TOKEN !== undefined ? '👍 TOKEN PROVIDED 👍' : ' 👎 NO TOKEN PROVIDED 👎');

if (!TELEGRAM_TOKEN) {
  process.exit(0)
}

const bot = new TelegramBot(TELEGRAM_TOKEN);
const luckyNumbers = LUCKY_NUMBERS.split(',');
let groupId;

(async () => {
  try {
    const botUpdate = await getChatId(TELEGRAM_TOKEN)

    if (!Array.isArray(botUpdate)) {
      throw new Error('result from getChatId is not an Array')
    }

    // Check if the groupId could have changed
    debug('Getting Chat Id')
    groupId = botUpdate.length === 0 ?
      TELEGRAM_GROUP_CHAT_ID :
      botUpdate.find(items => items.chat.type === 'group').chat.id;

  } catch (e) {
    throw new Error(e)
  }
})()

scrapper({ debug, headless: JSON.parse(HEADLESS_CHROME), luckyNumbers })
  .then(() => {
    debug('Sending Picture')
    bot.sendPhoto(groupId, './lotto_results.png').then(resp => {
      debug('Picture sent', resp)
      process.exit(0)
    })
  });
