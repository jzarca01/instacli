#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const args = require('minimist')(process.argv.slice(2));

const log = console.log;

const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2');
const COOKIE_PATH = './cookies.json';

const Hashtagify = require('node-hashtagify');
const hash = new Hashtagify();

const { askInstaCredentials, askUploadDetails } = require('./lib/inquirer');
const {
  isCredentialsSet,
  getCredentials,
  resetCredentials,
  setCredentials
} = require('./lib/credentials');

const { getKanyeCaption, getDrakeCaption } = require('./lib/kanye');

clear();
console.log(
  chalk.yellow(figlet.textSync('#InstaCLI', { horizontalLayout: 'full' }))
);

const run = async () => {
  if (!isCredentialsSet()) {
    const credentials = await askInstaCredentials();
    setCredentials(credentials);
  }
  const details = await askUploadDetails();
  uploadToInstagram(details);
};

const uploadToInstagram = async details => {
  let spinner = new Spinner('Loading...');
  let caption;
  try {
    if (fs.existsSync(COOKIE_PATH)) {
      fs.unlink(COOKIE_PATH);
    }
    const cookieStore = new FileCookieStore(COOKIE_PATH);
    const client = new Instagram(getCredentials(), cookieStore);

    if (details.kanye) {
      caption = await getKanyeCaption();
    } else if (details.drake) {
      const drakeType =
        details.drakeType !== 'any will be fine' ? details.drakeType : null;
      const drakeCaption = await getDrakeCaption(drakeType);
      caption = drakeCaption.slice(0, 2).join(' - ');
    } else {
      caption = details.caption;
      const hashtags = details.hashtags.replace(/\s/g, '').split(',');

      if (hashtags.length) {
        spinner = new Spinner('Generating hashtags...');
        spinner.start();
        const related = await hash.getRelated(hashtags);
        related.map(tag => {
          return tag.related.map(
            hashtag => (caption = caption + ` #${hashtag.name}`)
          );
        });
        spinner.stop();
      }
    }

    spinner = new Spinner('Logging into Instagram account...');
    spinner.start();
    await client.login();
    spinner.stop();

    spinner = new Spinner('Uploading photo...');
    spinner.start();
    console.log(caption);
    const { media } = await client.uploadPhoto({
      photo: details.filename,
      caption
    });
    spinner.stop();

    log(
      chalk.green(`Photo uploaded : https://www.instagram.com/p/${media.code}/`)
    );
  } catch (err) {
    spinner.stop();
    log(chalk.red(err));
  }
};

if (args.reset) {
  log(chalk.green(`Credentials reset`));
  return resetCredentials();
}
return run();
