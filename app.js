require('dotenv').config();

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const { api } = require('./api');
const { parse } = require('node-html-parser');
const moment = require('moment');
const { calcMinhaSaturdayEvening, calcSaturdayMinha, calcEveningYetzia } = require('./time');
const { getNextMonth } = require('./hebrewMonths');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const CHAT_ID = -1001761405645;

const Hebcal = require('hebcal');

app.get('/', async (req, res) => {
	const htmlResponse = await api.get();
	const root = parse(htmlResponse.data);

	const parasha = root.querySelector('#content_parshaNameAndDetails').innerText;
	const hadlaka = moment(root.querySelector('#content_hadlaka').innerText.substring(11), 'HH:mm');
	const eveningMinha = calcMinhaSaturdayEvening(hadlaka).format('HH:mm');
	const saturedayMinha = calcSaturdayMinha(hadlaka).format('HH:mm');
	const yetzia = moment(root.querySelector('#content_yetzia').innerText.substring(11), 'HH:mm');
	const eveningYetzia = calcEveningYetzia(yetzia).format('HH:mm');

	const date = root.querySelector('.selectedParasha > .parashaTime').innerText.match(/-(.*)/)[1];
	const hebrewDate = new Hebcal.HDate(moment(date, 'DD/MM/YYYY').toDate());

	const messageToBot = `
	*זמני תפילות מרכז "ואהבת" חב"ד צופים*
  שבת ${
		hebrewDate.day >= 23 ? `*מברכים* חודש ${getNextMonth(hebrewDate.month - 1)} ` : ''
	}פרשת ${parasha}:

	הדלקת נרות ${hadlaka.format('HH:mm')}

  *מנחה ערב שבת* ${eveningMinha} ומיד לאחר מכן קבלת שבת
  *שיעור חסידות* 8:30
	*שחרית* 9:00${hebrewDate.day >= 23 ? '\nומיד לאחר מכן קידוש חגיגי לכבוד שבת מברכים' : ''}
	*מנחה בשבת* ${saturedayMinha}
	*ערבית צאת שבת* ${eveningYetzia}
	מוצאי שבת בשעה ${yetzia.format('HH:mm')}
	`;

	bot.sendMessage(CHAT_ID, messageToBot);
	res.send(messageToBot);
});

app.listen(port, () => {
	console.log(`app is listening on port ${port}`);
});
