
import fs from 'fs';
import nodemailer from 'nodemailer'

import { generateCsv, printPeople } from './report.js';
import Logger from './logger.js';

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * data: return value from parser#parse; { key: [ { firstName, lastName, org, wd } ] }
 * address: return value from address-list#genAddressList; { key: { org, wd, emails } }
 * mailOpts: mail options
 *   {
 *     from:           sender email address
 *     to:             receiver email addresses
 *     text:           path to text email template
 *     html:           path to html email template
 *     attachment:     attachment file name
 *   }
 *
 * smtpOpts: smtp options
 *   { host, port, auth: { user, pass }, secure }
 *
 * opts: other options
 *     dry: NOT send emails if true
 *     ethereal: send emails to ethereal if true
 *
 */
export const bulkSend = async (data, address, mailOpts, smtpOpts, opts) => {
  let results = { total: 0, err: 0, sent: 0, totalUsers: 0, sentUsers: 0, errUsers: 0, data: [] };

  return new Promise((resolve, reject) => {
    Object.entries(data).reduce((promise, [key, people]) => {
      if (!address[key] || !address[key].emails) {
        results.data.push({ error: 'No Address Found', key, people, size: people.length });
        results.totalUsers += people.length;
        results.errUsers += people.length;
        results.total += 1;
        results.err += 1;
        Logger.error('Mailer#bulkSend:  No Address Found with Key ' + key);
        console.log('ERROR: No Email Address Found ' + key);
        return promise.then(() => Promise.resolve(results));
      }
      const emails = address[key].emails;
      //const subject = mailOpts.subject + ' - ' + address[key].org + address[key].wd.padStart(3, '0');
      const subject = mailOpts.subject + ' - ' + address[key].wd.padStart(3, '0');
      const to = { to: emails.join(', '), subject  };
      results.data.push({ key, people, size: people.length, to: emails.join(', ') });
      results.totalUsers += people.length;
      results.sentUsers += people.length;
      results.total += 1;
      results.sent += 1;

      await sleep(1000);
      return promise.then(() => sendCsvTo(people, { ...mailOpts, ...to }, smtpOpts, opts, key));
    }, Promise.resolve()).then(() => resolve(results));
  });
};

/**
 * mailOpts: mail options
 *   {
 *     from:           sender email address
 *     to:             receiver email addresses
 *     text:           path to text email template
 *     html:           path to html email template
 *     attachment:     attachment file name
 *   }
 *
 * smtpOpts: smtp options
 *   { host, port, auth: { user, pass }, secure }
 *
 * opts: other options
 *     dry: NOT send emails if true
 *     ethereal: send emails to ethereal if true
 */
export const sendCsvTo = (people, mailOpts, smtpOpts, opts, key) => {
  const handler = selectMailHandler(opts);

  return generateMail(people, mailOpts)
    .then((mail) => {
      Logger.info('Mailer#sendCsvTo: START ' + key + ' TOTAL ' + people.length)
      console.log('SENDING START ' + key + ' TOTAL ' + people.length)
      if (opts.display) {
        console.log('---< ' + key + ' >------------------------------------------');
        console.log(mail);
        console.log('--------------------------------------------------------');
        printPeople(people);
        console.log('--------------------------------------------------------');
      }
      return mail;
    })
    .then((mail) => handler(mail, smtpOpts, key))
    .then((info) => {
      Logger.info('Mailer#sendCsvTo: END   ' + key + ' TOTAL ' + people.length);
      console.log('SENDING END   ' + key + ' TOTAL ' + people.length);
      return info;
    });
};

const selectMailHandler = (opts) => {
  let handler = dryHandler;
  if (opts.run) {
    handler = sendMail;
  }
  if (opts.ethereal) {
    handler = sendMailToEthereal;
  }
  return handler;
};

export const generateMail = (people, opt) => {
  return generateCsv(people)
    .then((csv) => {
      return {
        from: opt.from,
        to: opt.to,
        subject: opt.subject,
        text: fs.readFileSync(opt.text).toString(),
        html: fs.readFileSync(opt.html).toString(),
        attachments: [ {
          filename: opt.attachment,
          content: csv
        }]
      };
    });
}

export const dryHandler = (mail, smtpConf, key) => { return Promise.resolve(key); };

export const sendMail = (mail, smtpConf) => {
  return new Promise((resolve, reject) => {
    const smtp = nodemailer.createTransport(smtpConf);

    smtp.sendMail(mail, (err, info) => {
      if (err) {
        return reject(err);
      }
      resolve(info);
    });
  });
};

export const sendMailToEthereal = (mail) => {
  return createEtherealConf()
    .then((smtpConf) => {
      return sendMail(mail, smtpConf);
    })
    .then((info) => {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: sent: %s', nodemailer.getTestMessageUrl(info));
      return info;
    });
};

export const createEtherealConf = () => {
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.log('Cannot Create Ethereal Test Account');
        throw err;
      }
      resolve({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });
    });
  });
};

