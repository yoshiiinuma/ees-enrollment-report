
import fs from 'fs';
import util from 'util';
import readline from 'readline';
import Logger from './logger.js';

const regexCsv =/^(\w+),(\d+),(("[^"]+")|([^,]+)),/;
const regexWd = /^\d+$/;
const regexSc = /; */;

/**
 * CSV Format:
 *
 *   org: must be UH or DOE
 *   wd:  must be 3 digit number
 *   email:
 *     1) non-quoted single (e.g. xxx@aaa.com)
 *     2) double-quoted, comma separated (e.g. "xxx@aaa.com,yyy@bbb.com")
 *     3) non-quoted, semicolon separated (e.g. xxx@aaa.com; yyy@bbb.com)
 *
 * SAMPLE CSV ENTRIES:
 *
 *     DOE,025,xxx@aaa.com,,,,,,,,,,,,,,,,,,,,
 *     DOE,025,xxx@aaa.com;yyy@bbb.com,,,,,,,,,,,,,,,,,,,,
 *     UH,025,"xxx@aaa.com,yyy@bbb.com",,,,,,,,,,,,,,,,,,,,
 *
 **/
export const genAddressList = (file) => {
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
      const matched = regexCsv.exec(l);
      if (matched) {
        const org = matched[1];
        const wd = matched[2];
        const key = org + wd.padStart(5, 0);

        let emails;
        if (matched[4]) {
          emails = matched[4].slice(1, -1).split(',');
        } else if (matched[5]) {
          if (regexSc.test(matched[5])) {
            emails = matched[5].split(regexSc);
          } else {
            emails = [matched[5]];
          }
        }
        list[key] = { wd, org, emails };
      }
    });
  });
};

export const getEmailToCodeMap = (list) => {
  return new Promise((resolve, reject) => {
    let map = {};
    for(let key in list) {
      const val = list[key];
      const emails = val.emails.join();
      //console.log(key + ' ### ' + util.inspect(emails));
      map[emails] = { org: val.org, wd: val.wd };
    }
    resolve(map);
  });
};

