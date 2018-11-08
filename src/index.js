
import fs from 'fs';
import util from 'util';
import App from './app.js';

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


let arg = App.initApp(opt);
console.log(util.inspect(arg));
//App.testEmail();
App.testEmailByEthereal(arg.mail);
//App.sendNotifications('./test/not-enrolled-list.rtf', './test/address-list.csv');

