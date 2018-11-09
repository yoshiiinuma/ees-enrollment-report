
import nodemailer from 'nodemailer'
import fs from 'fs';

import Logger from './logger.js';
import { bulkSend } from './mailer.js';
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

App.checkEnv = (arg) => {
  return fs.existsSync(App.config(arg));
}

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

App.sendNotifications = (notEnrolledList, addressList, opts) => {
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
      return bulkSend(people, addrs, opts.mail, opts.smtp, opts.app);
    })
    .catch((e) => console.log(e));

};
export default App;

