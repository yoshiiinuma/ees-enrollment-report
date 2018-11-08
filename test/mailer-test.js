
import util from 'util';
import { expect } from 'chai';

import { generateMail } from '../src/mailer.js';

describe('Mailer#sendMail', () => {
  before((done) => {
    Promise.resolve()
      .then(() => done())
      .catch(err => console.log(err));
  });

  after((done) => {
    Promise.resolve()
      .then(() => done())
      .catch(err => console.log(err));
  });

  it('writes test', (done) => {
    Promise.resolve()
      .then(() => done())
      .catch(err => console.log(err));
  })
});


describe('mailer#generateMail', () => {
  context('with multiple records', () => {
    const people = [
     { firstName: 'Aaaaa', lastName: 'Bbbbb', org: 'DOE', wd: '002' },
     { firstName: 'Ccccc', lastName: 'Ddddd', org: 'DOE', wd: '002' },
     { firstName: 'Eeeee', lastName: 'Fffff', org: 'DOE', wd: '002' } ];
    const csv = "FirstName,LastName\nAaaaa,Bbbbb\nCcccc,Ddddd\nEeeee,Fffff";
    const opt = {
      from: '"Fred Foo" <foo@example.com>',
      to: 'bar@example.com, baz@example.com',
      subject: 'Email Subject',
      text: './templates/sample.txt',
      html: './templates/sample.html',
      attachment: 'filename.csv'
    };
    const exp = {
      from: '"Fred Foo" <foo@example.com>',
      to: 'bar@example.com, baz@example.com',
      subject: 'Email Subject',
      text: "Sample Email Title\n\nSample email body.\n",
      html: "<h1>Sample Email Title</h1>\n\n<p>Sample email body.</p>\n",
      attachments: [{
        filename: 'filename.csv',
        content: csv
      }]
    };

    it('generates mail', (done) => {
      generateMail(people, opt)
        .then((r) => {
          expect(r).to.eql(exp);
          done();
        })
        .catch((e) => {
          console.log(e);
          done();
        })
    });
  });
});

