
import nodemailer from 'nodemailer'
import fs from 'fs';
import util from 'util';

import Logger from './logger.js';
import { sendMail, sendMailToEthereal, generateMail } from './mailer.js';
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

App.testEmail = (opt) => {
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

  return generateMail(users, opt).then((mail) => sendMail({ mail, smtpConf }));
}

App.testEmailByEthereal = (opt) => {
  let users = [
    { firstName: 'Aaaaa', lastName: 'Bbbbb' },
    { firstName: 'Ccccc', lastName: 'Ddddd' },
    { firstName: 'Eeeee', lastName: 'Fffff' },
    { firstName: 'Ggggg', lastName: 'Hhhhh' },
    { firstName: 'Iiiii', lastName: 'Jjjjj' },
  ];
  console.log(util.inspect(opt));
  return generateMail(users, opt).then((mail) => sendMailToEthereal(mail));
};

App.sendNotifications = (notEnrolledList, addressList) => {
  let addrs;
  let people;

  return genAddressList(addressList)
    .then((list) => {
      addrs = list;
      return parse(notEnrolledList);
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
    .then(() => {
      console.log(people);
    })
    .catch((e) => console.log(e));

};
export default App;

