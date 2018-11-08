
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
}

/**
 * arg: { env }
 */
App.config = (arg) => {
  return './config/' + arg.env + '.json';
}

/**
 * arg: { env }
 */
App.loadConfig = (arg) => {
  let confFile = App.config(arg);
  return App.jsonToObject(confFile);
}

App.jsonToObject = (file) => {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file));
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
}

//parse('./Document.rtf');
/*
genAddressList('./WarrantDistributionContacts.csv')
  .then((list) => console.log(list))
  .catch((e) => console.log(el));
*/
/*
let smtpConf = {
  host: 'localhost',
  port: 1025,
  //auth: {
  //  user: 'email@example.com',
  //  pass: 'password'
  //}
  secure: false
};

let mail = {
  from: '"Fred Foo" <foo@example.com>',
  to: 'bar@example.com, baz@example.com',
  subject: 'Hello Test',
  text: 'Hello world?',
  html: '<h1>Hello world?</h1>'
};


sendMail({ mail, smtpConf });
*/
export default App;

