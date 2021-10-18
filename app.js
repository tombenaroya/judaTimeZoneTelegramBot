require('dotenv').config();

const express = require('express');
const app = express();

const port = 3000;

const { api } = require('./api');
const { parse } = require('node-html-parser');
const moment = require('moment');
const { calcMinhaSaturdayEvening, calcSaturdayMinha, calcEveningYetzia } = require('./time');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const CHAT_ID = -766161903;

app.get('/', async (req, res) => {
  const htmlResponse = await api.get();
  const root = parse(htmlResponse.data);

  const parasha = root.querySelector('#content_parshaNameAndDetails').innerText;
  const hadlaka = moment(root.querySelector('#content_hadlaka').innerText.substring(11), 'HH:mm');
  const eveningMinha = calcMinhaSaturdayEvening(hadlaka).format('HH:mm');
  const saturedayMinha = calcSaturdayMinha(hadlaka).format('HH:mm');
  const yetzia = moment(root.querySelector('#content_yetzia').innerText.substring(11), 'HH:mm');
  const eveningYetzia = calcEveningYetzia(yetzia).format('HH:mm');

  const messageToBot = `
	שבת פרשת ${parasha}

	הדלקת נרות ${hadlaka.format('HH:mm')}

	מנחה ערב שבת ${eveningMinha} ומיד לאחר מכן קבלת שבת
	שיעור חסידות 8:30
	שחרית 9:00
	מנחה בשבת ${saturedayMinha}
	ערבית צאת שבת ${eveningYetzia}
	מוצאי שבת בשעה ${yetzia.format('HH:mm')}
	`;

  bot.sendMessage(CHAT_ID, messageToBot);
  res.send();
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
