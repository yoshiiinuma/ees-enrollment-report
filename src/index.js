
import fs from 'fs';
import App from './app.js';
import Logger from './logger.js';
import { sendMail } from './mailer.js';
import { readReport } from './parser.js';
import { genAddressList } from './address-list.js';

const usage = () => {
  console.log("\n Usage: npm run exec -- [OPTIONS]");
  console.log(" Usage: node dist/index.js [OPTIONS]");
  console.log("\n   OPTIONS");
  console.log("     -e or --env:        development|production default development");
  console.log("     -h or --help:       show this message");
  console.log();
};

let opt = {
  env: 'development'
};

let args = process.argv.slice(2);

let exitProgram = (msg) => {
  if (msg) console.log(msg);
  usage();
  process.exit();
}

while(args.length > 0) {
  let arg = args.shift();
  if (arg === '-h' || arg === '--help') {
    exitProgram();
  } else if (arg === '-e' || arg === '--env') {
    opt.env = args.shift();
  } else {
    exitProgram('Invalid Argument: ' + arg);
  }
}

if (opt.env != 'development' && opt.env != 'production') {
  exitProgram(" Invalid Environment: " + opt.env);
}


//readReport('./Document.rtf');
genAddressList('./WarrantDistributionContacts.csv')
  .then((list) => console.log(list))
  .catch((e) => console.log(el));

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
