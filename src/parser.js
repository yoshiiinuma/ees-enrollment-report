
import fs from 'fs';
import readline from 'readline';
import Logger from './logger.js';


/**
 *  Report Format:
 *
 *  00004204\tab Abcn\tab Zywre\tab 00029\tab DOE\tab 08243\tab 00041345\tab 13\tab 002\par
 *  00036748\tab Bcdan\tab Yxv\tab DOE\tab DOE\tab DOE\tab 0M999999\tab  \tab 004\par
 */

const regex = /(\d{8})\\tab ([^\\]+)\\tab ([^\\]+)\\tab (\w+)\\tab (\w+)\\tab (\w+)\\tab (\w+)\\tab (\w+| )\\tab (\w+)\\par$/;

export const parse = (file) => {
  return new Promise((resolve, reject) => {
    let list = {};
    if (!fs.existsSync(file)) {
      return reject('File Not Found: ' + file);
    }
    const rl = readline.createInterface({
      input: fs.createReadStream(file),
      terminal: false
    });
    rl.on('close', () => resolve(list));
    rl.on('error', (err) => reject(err));
    rl.on('line', (l) => {
      const matched = regex.exec(l);
      if (matched) {
        const r = {
          firstName: matched[2],
          lastName: matched[3],
          org: matched[5],
          wd: matched[9]
        };
        const key = r.org + r.wd.padStart(5, 0);
        if (!list[key]) list[key] = [];
        list[key].push(r);
        Logger.debug(r);
      } else {
        Logger.debug('Parser#readReport: UNMATCHED: ' + l);
      }
    });
  });
};
