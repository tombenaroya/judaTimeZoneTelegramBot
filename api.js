const axios = require('axios');

const api = axios.create({
	baseURL: 'https://calendar.2net.co.il/parasha.aspx?city=%D7%A6%D7%95%D7%A4%D7%99%D7%9F',
	Headers: {
		'Content-Type': 'application/json',
	},
});

module.exports = { api };
