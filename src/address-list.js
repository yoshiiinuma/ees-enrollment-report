
import fs from 'fs';
import readline from 'readline';
import Logger from './logger.js';


const regexCsv =/^(\w+),(\d+),(("[^"]+")|([^,]+)),/;
const regexWd = /^\d+$/;

export const genAddressList = (file) => {
  return new Promise((resolve, reject) => {

    let list = {};
    const rl = readline.createInterface({
      input: fs.createReadStream(file),
      terminal: false
    });
    rl.on('close', () => resolve(list));
    rl.on('error', (err) => reject(err));
    rl.on('line', (l) => {
      const matched = regexCsv.exec(l);
      if (matched) {
        const org = matched[1];
        const wd = matched[2];
        let emails;
        if (matched[4]) {
          emails = matched[4].slice(1, -1).split(',');
        } else if (matched[5]) {
          emails = [matched[5]];
        }
        list[wd] = { org, emails };
      }
    });
  });
};
