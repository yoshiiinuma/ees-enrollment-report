
import fs from 'fs';
import nodemailer from 'nodemailer'

import { generateCsv } from './report.js';

/**
 * data: return value from parser#parse
 * address: return value from address-list#genAddressList
 */
export const bulkSend = (data, address) => {
}

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

export const sendMail = (opts) => {
  return new Promise((resolve, reject) => {
    const smtp = nodemailer.createTransport(opts.smtpConf);

    smtp.sendMail(opts.mail, (err, info) => {
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
      return sendMail({ mail, smtpConf})
    })
    .then((info) => {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: sent: %s', nodemailer.getTestMessageUrl(info));
    });
};

