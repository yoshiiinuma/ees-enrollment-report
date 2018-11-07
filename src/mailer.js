
import nodemailer from 'nodemailer'

export const sendMail = (opts) => {
  const smtp = nodemailer.createTransport(opts.smtpConf);

  smtp.sendMail(opts.mail, (err, info) => {
    if (err) {
      console.log(err);
      return; 
    }

    console.log('Message sent: %s', info.messageId);
    console.log(info);
  });
};

export const sendMailToEthreal = (opts) => {
  nodemailer.createTestAccount((err, account) => {
    let smtp = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    smtp.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return; 
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: sent: %s', nodemailer.getTestMessageUrl(info));
    });
  });

}

const getMailer = () => {
  nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethreal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });

    let mailOptions = {
      from: '"Fred Foo" <foo@example.com>',
      to: 'bar@example.com, baz@example.com',
      subject: 'Hello Test',
      text: 'Hello world?',
      html: '<h1>Hello world?</h1>'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return; 
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: sent: %s', nodemailer.getTestMessageUrl(info));
    });
  });

  return {

  };
};




