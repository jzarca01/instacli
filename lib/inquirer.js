const inquirer = require('inquirer');
const _ = require('lodash');
const fs = require('fs');
const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

module.exports = {
  askInstaCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your Instagram username:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your username.';
          }
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: function(value) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter your password.';
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  },
  askUploadDetails: () => {
    const questions = [
      {
        type: 'list',
        name: 'filename',
        message: 'Select which file to upload :',
        choices: filelist,
        validate: value => {
          if (value.length === 1) {
            return true;
          }
          return 'Please select a file';
        }
      },
      {
        type: 'confirm',
        name: 'kanye',
        message: 'Do you want to activate Kanye mode ?'
      },
      {
        type: 'confirm',
        name: 'drake',
        message: 'Do you want to activate Drake mode ?'
      },
      {
        type: 'list',
        name: 'drakeType',
        choices: [
          'bae',
          'scorpion',
          'broskies',
          'lit',
          'simp',
          'idfwu',
          'moreLife',
          'savage',
          'scary',
          'other',
          'any will be fine'
        ],
        message: 'What kind of Drake caption would you like ?',
        when: answers => answers.drake
      },
      {
        type: 'input',
        name: 'caption',
        message: 'Optionally enter a description for the photo : ',
        when: answers => !(answers.kanye || answers.drake)
      },
      {
        type: 'input',
        name: 'hashtags',
        message:
          'Optionally enter 1-3 hashtags, separated with a comma, for the photo (# sign not needed) : '
      }
    ];
    return inquirer.prompt(questions);
  }
};
