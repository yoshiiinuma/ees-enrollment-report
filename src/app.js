
import nodemailer from 'nodemailer'
import fs from 'fs';
import Logger from './logger.js';
import { sendMail } from './mailer.js';
import { parse } from './parser.js';
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
  console.log(csv);

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

  nodemailer.createTestAccount((err, account) => {
    let smtp = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    smtp.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: sent: %s', nodemailer.getTestMessageUrl(info));
    });
  });
};

App.sendNotifications = (notEnrolledList, addressList) => {
  let addrs;
  let people;

  genAddressList(addressList)
    .then((list) => {
      addrs = list;
      console.log(addrs);
      parse(notEnrolledList);
    })
    .then((list) => {
      people = list;
      console.log(people);
    })
    .catch((e) => console.log(e));

};
export default App;

