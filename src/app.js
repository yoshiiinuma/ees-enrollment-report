
import fs from 'fs';
import Logger from './logger.js';

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

export default App;

