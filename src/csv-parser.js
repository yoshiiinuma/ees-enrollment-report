
import fs from 'fs';
import readline from 'readline';
import Logger from './logger.js';


/**
 *  Report Format:
 *
 *  112233,First,Last,60000,DOE,DOE,0E00383C,0,001
 */

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
      let [empId, firstName, lastName, d1, org, d2, d3, payrollId, wd] = l.split(',');
      if (wd) {
        const r = {
          firstName: firstName,
          lastName: lastName,
          payrollId: payrollId.trim(),
          org: org,
          wd: wd.padStart(3, '0')
        };
        const key = r.org + r.wd.padStart(5, '0');
        if (!list[key]) list[key] = [];
        list[key].push(r);
        Logger.debug(r);
      } else {
        Logger.debug('Parser#readReport: UNMATCHED: ' + l);
      }
    });
  });
};
