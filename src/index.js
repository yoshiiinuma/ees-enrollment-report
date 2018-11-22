
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
  console.log("     -e or --env:     development|production|test DEFAULT development");
  console.log("     --run:           run the program, send emails");
  console.log("     --dry:           run the program without sending emails");
  console.log("     --display:       display emails");
  console.log("     --ethereal:      use Ethereal as SMTP server; preferred to --dry & --run");
  console.log("     --conf:          just show configuration, not run the program; DEFAULT");
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
  app: { showconf: true }
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
  } else if (arg === '--dry') {
    opt.app.dry = true;
  } else if (arg === '--display') {
    opt.app.display = true;
  } else if (arg === '--ethereal') {
    opt.app.ethereal = true;
  } else if (arg === '--conf') {
    opt.app.showconf = true;
  } else {
    exitProgram('Invalid Argument: ' + arg);
  }
}

if (opt.app.dry) {
  opt.app.run = false;
  opt.app.showconf = false;
}
if (opt.app.run) {
  opt.app.showconf = false;
} else {
  opt.app.dry = true;
}
if (opt.app.ethereal) {
  opt.app.dry = false;
  opt.app.showconf = false;
}

if (!App.checkEnv(opt)) {
  exitProgram(" Invalid Environment: " + opt.env);
}

let arg = App.initApp(opt);
if (opt.app.showconf) {
  console.log(util.inspect(arg));
  console.log();
  console.log('You must specify --run or --dry or --ethereal to run the program');
  console.log();
  process.exit();
}

App.sendNotifications(dataFile, addressFile, arg);

