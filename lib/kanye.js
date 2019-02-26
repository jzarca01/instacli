const axios = require('axios');

const getKanyeCaption = async () => {
  const kanye = await axios({
    method: 'GET',
    url: 'https://api.kanye.rest'
  });
  const { quote } = kanye.data;
  return quote;
};

module.exports = {
  getKanyeCaption
};
