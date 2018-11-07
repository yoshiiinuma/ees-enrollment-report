
import fs from 'fs';
import readline from 'readline';
import Logger from './logger.js';


//00004204\tab Firstname\tab Lastname\tab 00029\tab SOH\tab 08243\tab 00041345\tab 13\tab 225\par
//00106007\tab Firstname\tab Lastname\tab 10000\tab LEG\tab LEG\tab Y225871E\tab  \tab 020\par
const regex = /(\d{8})\\tab ([^\\]+)\\tab ([^\\]+)\\tab (\w+)\\tab (\w+)\\tab (\w+)\\tab (\w+)\\tab (\w+| )\\tab (\w+)\\par$/;

export const readReport = (file) => {
  return new Promise((resolve, reject) => {
    let list = [];
    const rl = readline.createInterface({
      input: fs.createReadStream(file),
      terminal: false
    });
    rl.on('close', () => resolve(list));
    rl.on('error', (err) => reject(err));
    rl.on('line', (l) => {
      const matched = regex.exec(l);
      if (matched) {
        const r = { id: matched[1], fname: matched[2], lname: matched[3] };
        console.log(r);
      } else {
        Logger.debug('Parser#readReport: UNMATCHED: ' + l);
      }
      list.push(l)
    });
  });
};
