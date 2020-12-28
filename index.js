const TelegramBot = require('node-telegram-bot-api');
const debug = require('debug')('node-telegram-bot-api');
const dotenv = require('dotenv');
const name = 'byverdu_lotto_bot';

dotenv.config();

debug('booting', name);

const token = process.env.TELEGRAM_TOKEN;

debug('set telegram Token =>', token !== undefined ? '👍 TOKEN PROVIDED 👍' : ' 👎 NO TOKEN PROVIDED 👎');

if (!token) {
  process.exit(1)
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);

async function getChatId() {
  return await bot.getUpdates()
}

const { chat: { id } = { id: process.env.TELEGRAM_CHAT_ID } } = getChatId()

debug('getUpdates Resp', JSON.stringify(getChatId()))

// bot.sendMessage(id, 'hello there').then(resp => debug('sendMsg Resp', resp))
