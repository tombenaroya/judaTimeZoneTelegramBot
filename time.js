const moment = require('moment');

const calcMinhaSaturdayEvening = hadlaka => {
  const minha = moment(hadlaka).add(15, 'minutes');
  const remainingTime = minha.minutes() % 5 === 0 ? 5 : minha.minutes() % 5;
  return minha.subtract(remainingTime, 'm');
};

const calcSaturdayMinha = hadlaka => {
  const minha = moment(hadlaka).subtract(10, 'minutes');
  const remainingTime = minha.minutes() % 5 === 0 ? 0 : minha.minutes() % 5;
  return minha.subtract(remainingTime, 'm');
};

const calcEveningYetzia = yetzia =>
  yetzia.minutes() % 5 === 0
    ? yetzia.minutes()
    : moment(yetzia).subtract(yetzia.minutes() % 5, 'm');

module.exports = {
  calcMinhaSaturdayEvening,
  calcSaturdayMinha,
  calcEveningYetzia
};
