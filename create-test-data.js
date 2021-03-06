
import fs from 'fs';
import util from 'util';
import { genAddressList, getEmailToCodeMap } from './src/address-list.js';

const output = 'test-data.rtf';
const addSrc = './address-prod.csv';

const l1 = '{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1033{\\fonttbl{\\f0\\fnil\\fcharset0 Calibri;}}' + "\n";
const l2 = '{\\*\\generator Riched20 10.0.17134}\\viewkind4\\uc1' + "\n";
const l3 = '\\pard\\sa200\\sl276\\slmult1\\f0\\fs22\\lang9 ';

const l4 = '}';
const l5 = ' ';

let address;


genAddressList(addSrc)
  .then((list) => {
    const address = list;
    return list;
  })
  .then((list) => getEmailToCodeMap(list))
  .then((map) => {
    const out = fs.createWriteStream(output);
    out.on('finish', () => console.log('Complete'));
    out.on('error', (e) => console.log(e));

    out.write(l1);
    out.write(l2);
    out.write(l3);
    for(let emails in map) {
      const val = map[emails];
      console.log(emails + ' => ' + util.inspect(val));
      out.write('00000000\\tab Aaaaa\\tab Bbbbb\\tab 00000\\tab ' + val.org + '\\tab 00000\\tab 00000000\\tab 00\\tab ' + val.wd + "\\par\n");
      out.write('00000000\\tab Ccccc\\tab Ddddd\\tab 00000\\tab ' + val.org + '\\tab 00000\\tab 00000000\\tab 00\\tab ' + val.wd + "\\par\n");
      out.write('00000000\\tab Eeeee\\tab Fffff\\tab 00000\\tab ' + val.org + '\\tab 00000\\tab 00000000\\tab 00\\tab ' + val.wd + "\\par\n");
      out.write('00000000\\tab Ggggg\\tab Hhhhh\\tab 00000\\tab ' + val.org + '\\tab 00000\\tab 00000000\\tab 00\\tab ' + val.wd + "\\par\n");
      out.write('00000000\\tab Iiiii\\tab Jjjjj\\tab 00000\\tab ' + val.org + '\\tab 00000\\tab 00000000\\tab 00\\tab ' + val.wd + "\\par\n");
    }
    out.write(l4);
    out.write(l5);
    out.end();

    
  })
  .catch((e) => console.log(e));
