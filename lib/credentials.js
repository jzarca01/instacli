const Configstore = require('configstore');
const conf = new Configstore('instacli');

module.exports = {
  isCredentialsSet: () => !!conf.get('username'),
  getCredentials: () => ({
    username: conf.get('username'),
    password: conf.get('password')
  }),
  resetCredentials: () => {
    conf.delete('username');
    conf.delete('password');
  },
  setCredentials: credentials => conf.set(credentials)
};
