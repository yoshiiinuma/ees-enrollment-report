
import fs from 'fs';
import util from 'util';
import App from './app.js';

const usage = () => {
  console.log("\n Usage: npm run exec <DATA> <ADDRESSBOOK>  -- [OPTIONS]");
  console.log(" Usage: node dist/index.js <DATA> <ADDRESSBOOK> [OPTIONS]");
  console.log();
  console.log("   DATA:            path to data file; expect rich text (.rtf) file");
  console.log("   ADDRESSBOOK:     path to address book file; expect CSV file");
  console.log();
  console.log("   OPTIONS");
  console.log("     -e or --env:     development|production DEFAULT development");
  console.log("     --ethereal:      use Ethereal as SMTP server; preferred to --dry & --run");
  console.log("     --run:           send emails if specified");
  console.log("     --dry:           NOT send emails if specified; DEFAULT");
  console.log("     -h or --help:    show this message");
  console.log();
};

const exitProgram = (msg) => {
  if (msg) console.log(msg);
  usage();
  process.exit();
}

let opt = {
  env: 'development',
  app: { dry: true }
};

let args = process.argv.slice(2);

if (args.length < 2) {
  exitProgram('Specify DATA and ADDRESSBOOK files');
}
const dataFile = args.shift();
const addressFile = args.shift();

if (!fs.existsSync(dataFile)) {
  exitProgram('DATA File Not Found: ' + dataFile);
}
if (!fs.existsSync(addressFile)) {
  exitProgram('ADDRESSBOOK File Not Found: ' + addressFile);
}

while(args.length > 0) {
  let arg = args.shift();
  if (arg === '-h' || arg === '--help') {
    exitProgram();
  } else if (arg === '-e' || arg === '--env') {
    opt.env = args.shift();
  } else if (arg === '--run') {
    opt.app.run = true;
    opt.app.dry = false;
  } else if (arg === '--dry') {
    opt.app.run = false;
    opt.app.dry = true;
  } else if (arg === '--ethereal') {
    opt.app.ethereal = true;
  } else {
    exitProgram('Invalid Argument: ' + arg);
  }
}

if (opt.app.dry) {
  opt.app.run = false;
}
if (opt.app.ethereal) {
  opt.app.dry = false;
}
if (!App.checkEnv(opt)) {
  exitProgram(" Invalid Environment: " + opt.env);
}


let arg = App.initApp(opt);
console.log(util.inspect(arg));

App.sendNotifications(dataFile, addressFile, arg);

