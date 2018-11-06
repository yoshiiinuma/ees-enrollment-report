
import nodemailer from 'nodemailer'

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



export default getMailer;

