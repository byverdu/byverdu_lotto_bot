const https = require('https');

module.exports = {
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
  getChatId: async (token) => new Promise((resolve, reject) => {
    https.get(`https://api.telegram.org/bot${token}/getUpdates`, (response) => {
      response.on('data', (chunk) => {
        const data = JSON.parse(chunk)

        return data.ok ? resolve(data.result) : reject(data)
      })
    })
  })
}