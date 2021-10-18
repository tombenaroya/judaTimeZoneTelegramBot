require('dotenv').config();

const express = require('express');
const app = express();

const port = 3000;

const { api } = require('./api');
const { parse } = require('node-html-parser');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const GROUP_CHAT_ID = -766161903;

app.get('/', async (req, res) => {
	const htmlResponse = await api.get();
	const root = parse(htmlResponse.data);

	const parasha = root.querySelector('#content_parshaNameAndDetails').innerText;
	const hadlaka = root.querySelector('#content_hadlaka').innerText.substring(11);
	const yetzia = root.querySelector('#content_yetzia').innerText.substring(11);

	const messageToBot = `
	שבת פרשת ${parasha}

	הדלקת נרות ${hadlaka}

	מנחה ערב שבת XXX ומיד לאחר מכן קבלת שבת
	שיעור חסידות XXX
	שחרית XXX
	מנחה בשבת XXX
	ערבית צאת שבת XXX
	מוצאי שבת בשעה ${yetzia}
	`;

	res.send({ hadlaka, yetzia, parasha, messageToBot });
});

app.listen(port, () => {
	console.log(`app is listening on port ${port}`);
});
