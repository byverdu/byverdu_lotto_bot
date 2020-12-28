const { getChatId } = require('./utils');

const TelegramBot = require('node-telegram-bot-api');
const debug = require('debug')('node-telegram-bot-api');
const dotenv = require('dotenv');
const name = 'byverdu_lotto_bot';

dotenv.config();

debug('booting', name);

const { TELEGRAM_TOKEN, TELEGRAM_GROUP_CHAT_ID } = process.env;

debug('set telegram Token =>', TELEGRAM_TOKEN !== undefined ? '👍 TOKEN PROVIDED 👍' : ' 👎 NO TOKEN PROVIDED 👎');

if (!TELEGRAM_TOKEN) {
  process.exit(1)
}

const bot = new TelegramBot(TELEGRAM_TOKEN);

(async () => {
  try {
    const botUpdate = await getChatId(TELEGRAM_TOKEN)

    if (!Array.isArray(botUpdate)) {
      throw new Error('result from getChatId is not an Array')
    }

    // Check if the groupId could have changed
    const groupId = botUpdate.length === 0 ?
      TELEGRAM_GROUP_CHAT_ID :
      botUpdate.find(items => items.chat.type === 'group').chat.id;


    // bot.sendMessage(groupId, 'Marlita I love U').then(resp => debug('sendMsg Resp', resp))
  } catch (e) {
    throw new Error(e)
  }
})()
