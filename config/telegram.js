import TelegramBot from 'node-telegram-bot-api'
import * as dotenv from 'dotenv'

dotenv.config()

const token = process.env.TELEGRAM_TOKEN
const bot = new TelegramBot(token)

export function sendNoticeToTelegram(error) {
  bot.sendMessage(process.env.MY_CHAT_ID_DIALOG, error)
}
