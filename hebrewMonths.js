const hebrewMonths = {
  0: 'ניסן',
  1: 'אייר',
  2: 'סיוון',
  3: 'תמוז',
  4: 'אב',
  5: 'אלול',
  6: 'תשרי',
  7: 'מרחשוון',
  8: 'כסלו',
  9: 'טבת',
  10: 'שבט',
  11: 'אדר'
};

const getNextMonth = currMonthNumber => hebrewMonths[(currMonthNumber + 1) % 12];

module.exports = {
  getNextMonth
};
