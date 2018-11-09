
import fs from 'fs';
import nodemailer from 'nodemailer'
import util from 'util';

import { generateCsv } from './report.js';
import Logger from './logger.js';

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
export const bulkSend = (data, address, mailOpts, smtpOpts, opts) => {
  return new Promise((resolve, reject) => {
    return Object.entries(data).reduce((promise, [key, people]) => {
      if (!address[key] || !address[key].emails) {
        Logger.error('Mailer#bulkSend:  No Address Found with Key ' + key);
        console.log('ERROR: No Email Address Found ' + key);
        return promise.then(() => Promise.resolve());
      }
      const emails = address[key].emails;
      const subject = mailOpts.subject + ' - ' + address[key].org + address[key].wd.padStart(3, '0');
      const to = { to: emails.join(', '), subject  };
      return promise.then(() => sendCsvTo(people, { ...mailOpts, ...to }, smtpOpts, opts, key));
    }, Promise.resolve());
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
  let handler = dryHandler;
  if (opts.run) {
    handler = sendMail;
  }
  if (opts.ethereal) {
    handler = sendMailToEthereal;
  }
  return generateMail(people, mailOpts)
    .then((mail) => {
      Logger.info('Mailer#sendCsvTo: START ' + key + ' TOTAL ' + people.length)
      console.log('SENDING START ' + key + ' TOTAL ' + people.length)
      if (opts.display) {
        console.log('---< ' + key + ' >--------------------------------------');
        console.log(mail);
        people.forEach((h) => {
          console.log(key + ' ' + h.firstName.padStart(20, ' ') + ', ' + h.lastName.padStart(20, ' '));
        });
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

export const sendMailToEthereal = (mail) => {
  return createEtherealConf()
    .then((smtpConf) => {
      return sendMail(mail, smtpConf)
    })
    .then((info) => {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: sent: %s', nodemailer.getTestMessageUrl(info));
      return info;
    });
};

