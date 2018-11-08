
//import util from 'util';
import { expect } from 'chai';

import { parse } from '../src/parser.js';

const infile = './test/report.rtf';
const badfile = 'not-exist';

describe('parser#parse', () => {
  context('with a valid input file', () => {
    it('parses report and retuns report object', (done) => {
      parse(infile)
        .then((res) => {
          //console.log(util.inspect(res));
          expect(res).to.eql({
            DOE00002: [
               { firstName: 'Zyxid', lastName: 'Abck', org: 'DOE', wd: '002' },
               { firstName: 'Abcn', lastName: 'Zywre', org: 'DOE', wd: '002' },
               { firstName: 'Defen', lastName: 'Wvte-Irv', org: 'DOE', wd: '002' } ],
            DOE00004: [ { firstName: 'Bcdan', lastName: 'Yxv', org: 'DOE', wd: '004' } ],
            DOE00008: [ { firstName: 'Cdei', lastName: 'Xwuanu', org: 'DOE', wd: '008' } ],
            UH00001: [
               { firstName: 'Efgis Ann', lastName: 'Vusff', org: 'UH', wd: '001' },
               { firstName: 'Fghe', lastName: 'Uan Ptsr', org: 'UH', wd: '001' } ],
            UH00002: [ { firstName: 'Ghien Kaina', lastName: 'Tsrl', org: 'UH', wd: '002' } ],
            UH00003: [ { firstName: 'Hijn', lastName: 'Srqn Guerr', org: 'UH', wd: '003' } ],
            UH00008: [
               { firstName: 'Ijkah', lastName: 'Rq\'pi-Tuga', org: 'UH', wd: '008' },
               { firstName: 'Jkleiok', lastName: 'Qpober', org: 'UH', wd: '008' } ]
          });
          done();
        })
        .catch((e) => {
          expect(e).to.equal('File Not Found: ' + badfile);
          done();
        });
    });
  });

  context('with a non-existent file', () => {
    it('throws an exception', (done) => {
      parse(badfile)
        .catch((e) => {
          expect(e).to.equal('File Not Found: ' + badfile);
          done();
        });
    });
  });
});

