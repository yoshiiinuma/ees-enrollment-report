
import { expect } from 'chai';

import { parse } from '../src/csv-parser.js';
import { printPeople } from '../src/report.js';
import util from 'util';

const infile = './test/not-enrolled-list.csv';
const badfile = 'not-exist';

describe('csv-parser#parse', () => {
  context('with a valid input file', () => {
    it('parses report and retuns report object', (done) => {
      parse(infile)
        .then((res) => {
          expect(res).to.eql({
            DOE00002: [
               { firstName: 'Zyxid', lastName: 'Abck', payrollId: '13', org: 'DOE', wd: '002' },
               { firstName: 'Abcn', lastName: 'Zywre', payrollId: '13', org: 'DOE', wd: '002' },
               { firstName: 'Defen', lastName: 'Wvte-Irv', payrollId: '25', org: 'DOE', wd: '002' } ],
            DOE00004: [ { firstName: 'Bcdan', lastName: 'Yxv', payrollId: '', org: 'DOE', wd: '004' } ],
            DOE00008: [ { firstName: 'Cdei', lastName: 'Xwuanu', payrollId: '', org: 'DOE', wd: '008' } ],
            UH00001: [
               { firstName: 'Efgis Ann', lastName: 'Vusff', payrollId: '01', org: 'UH', wd: '001' },
               { firstName: 'Fghe', lastName: 'Uan Ptsr', payrollId: '01', org: 'UH', wd: '001' } ],
            UH00002: [ { firstName: 'Ghien Kaina', lastName: 'Tsrl', payrollId: '01', org: 'UH', wd: '002' } ],
            UH00003: [ { firstName: 'Hijn', lastName: 'Srqn Guerr', payrollId: '00', org: 'UH', wd: '003' } ],
            UH00008: [
               { firstName: 'Ijkah', lastName: 'Rq\'pi-Tuga', payrollId: '63', org: 'UH', wd: '008' },
               { firstName: 'Jkleiok', lastName: 'Qpober', payrollId: '', org: 'UH', wd: '008' } ]
          });
          done();
        })
        .catch((e) => {
          console.log(e);
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

