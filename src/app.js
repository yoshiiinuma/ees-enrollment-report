
import nodemailer from 'nodemailer'
import fs from 'fs';
import Logger from './logger.js';
import { sendMail, sendMailToEthereal } from './mailer.js';
import { parse } from './parser.js';
import { generateCsv } from './report.js';
import { genAddressList } from './address-list.js';

const App = {};

App.initApp = (opt) => {
  let conf = App.loadConfig(opt);
  if (!conf) return null;
  let arg = Object.assign(conf, opt);

  setUncaughtExceptionHandler();
  Logger.initialize(arg);
  return arg;
};

/**
 * arg: { env }
 */
App.config = (arg) => {
  return './config/' + arg.env + '.json';
};

/**
 * arg: { env }
 */
App.loadConfig = (arg) => {
  let confFile = App.config(arg);
  return App.jsonToObject(confFile);
};

App.jsonToObject = (file) => {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file));
};

const setUncaughtExceptionHandler = () => {
  process.on('uncaughtException', (err) => {
    Logger.fatal('########################################################################');
    Logger.fatal('Uncaught Exception');
    Logger.fatal(err);
    Logger.fatal('########################################################################');
  });
  process.on('unhandledRejection', (reason, p) => {
    Logger.fatal('########################################################################');
    Logger.fatal('Unhandled Rejection');
    Logger.fatal(reason);
    Logger.fatal(p);
    Logger.fatal('########################################################################');
  });
};

App.testEmail = () => {
  let smtpConf = {
    host: 'localhost',
    port: 1025,
    secure: false
  };

  let users = [
    { firstName: 'Aaaaa', lastName: 'Bbbbb' },
    { firstName: 'Ccccc', lastName: 'Ddddd' },
    { firstName: 'Eeeee', lastName: 'Fffff' },
    { firstName: 'Ggggg', lastName: 'Hhhhh' },
    { firstName: 'Iiiii', lastName: 'Jjjjj' },
  ];
  const makeCsv = (accum, cur) => accum + "\n" + cur.firstName + ',' + cur.lastName;
  let csv = users.reduce(makeCsv, 'FirstName,LastName');

  let mail = {
    from: '"Fred Foo" <foo@example.com>',
    to: 'bar@example.com, baz@example.com',
    subject: 'Hello Test',
    text: 'Hello world?',
    html: '<h1>Hello world?</h1>',
    attachments: [ {
      filename: 'HawaiiPay_NotEnrolledList.csv',
      content: csv
    }]
  };

  sendMail({ mail, smtpConf });
}

App.testEmailByEthereal = () => {
  let users = [
    { firstName: 'Aaaaa', lastName: 'Bbbbb' },
    { firstName: 'Ccccc', lastName: 'Ddddd' },
    { firstName: 'Eeeee', lastName: 'Fffff' },
    { firstName: 'Ggggg', lastName: 'Hhhhh' },
    { firstName: 'Iiiii', lastName: 'Jjjjj' },
  ];
  generateCsv(users)
    .then((csv) => {
      let mail = {
        from: '"Fred Foo" <foo@example.com>',
        to: 'bar@example.com, baz@example.com',
        subject: 'Hello Test',
        text: 'Hello world?',
        html: '<h1>Hello world?</h1>',
        attachments: [ {
          filename: 'HawaiiPay_NotEnrolledList.csv',
          content: csv
        }]
      };
      sendMailToEthereal(mail);
    });
};

App.sendNotifications = (notEnrolledList, addressList) => {
  let addrs;
  let people;

  genAddressList(addressList)
    .then((list) => {
      addrs = list;
      parse(notEnrolledList);
    })
    .then((list) => {
      people = list;
    })
    .then(() => {
      console.log(addrs);
    })
    .then(() => {
      console.log(people);
    })
    .catch((e) => console.log(e));

};
export default App;

