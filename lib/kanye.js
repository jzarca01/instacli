const axios = require('axios');
const { getQuote } = require('drake-quotes');

const getKanyeCaption = async () => {
  const kanye = await axios({
    method: 'GET',
    url: 'https://api.kanye.rest'
  });
  const { quote } = kanye.data;
  return quote;
};

module.exports = {
  getKanyeCaption,
  getDrakeCaption: getQuote
};
