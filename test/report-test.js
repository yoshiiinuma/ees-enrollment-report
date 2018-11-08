
import { expect } from 'chai';

import { generateCsv } from '../src/report.js';

const addrs = {
  DOE00002: { wd: '002', org: 'DOE', emails: [ 'Xyristine_Abaw@test.m2.com' ] },
  DOE00004: { wd: '004', org: 'DOE', emails: [ 'Pqnne_Gz9aga@test.m2.com' ] },
  DOE00005: { wd: '005', org: 'DOE', emails: [ 'Regpn_Pascua@test.m2.com' ] },
  DOE00008: { wd: '008', org: 'DOE', emails: [ 'Pqnne_Gz9aga@test.m2.com' ] },
  DOE00024: { wd: '024', org: 'DOE', emails: [ 'zzzra_hmmqdy@test.m2.com' ] },
  DOE00025: { wd: '025', org: 'DOE', emails: [ 'Aberry_Hegvvts-Tccc@test.m2.com' ] },
  DOE00039: { wd: '039', org: 'DOE', emails: [ 'wyl.agena@test.gov',
                                               'wyl_agena@test.m2.com' ] },
  DOE00065: { wd: '065', org: 'DOE',
     emails: [ 'xdsty_gwio@test.m2.com',
               'krrrs_cplqg@test.m2.com',
               'sdne_xaoxxld@test.m2.com' ] },
  DOE00711: { wd: '711', org: 'DOE', emails: [ 'zonn.au@test.m2.com' ] },
  UH00001: { wd: '001', org: 'UH',
     emails: [ 'uyyyo@test.m2.edu', 'ddd@test.m2.edu' ] },
  UH00002: { wd: '002', org: 'UH',
     emails: [ 'buuuin@test.m2.edu', 'asderyl@test.m2.edu' ] },
  UH00003: { wd: '003', org: 'UH',
     emails: [ 'buuuin@test.m2.edu', 'asderyl@test.m2.edu' ] },
  UH00007: { wd: '007', org: 'UH',
     emails: [ 'raenakam@test.m2.edu', 'dyamane@test.m2.edu' ] },
  UH00008: { wd: '008', org: 'UH',
     emails: [ 'buuuin@test.m2.edu', 'asderyl@test.m2.edu' ] },
  UH00012: { wd: '012', org: 'UH', emails: [ 'kmmqis@test.m2.edu' ] },
  UH00850: { wd: '850', org: 'UH', emails: [ 'adnat@test.m2.edu' ] },
  UH00900: { wd: '900', org: 'UH',
     emails: [ 'monique4@test.m2.edu', 'atama@test.m2.edu' ] },
  UH00997: { wd: '997', org: 'UH', emails: [ 'sticio@test.m2.edu' ] },
  UH00999: { wd: '999', org: 'UH',
     emails: [ 'buuuin@test.m2.edu', 'asderyl@test.m2.edu' ] }
};

const data = {
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
};

describe('report#generateCsv', () => {
  context('with multiple records', () => {
    const data1 = [
     { firstName: 'Aaaaa', lastName: 'Bbbbb', org: 'DOE', wd: '002' },
     { firstName: 'Ccccc', lastName: 'Ddddd', org: 'DOE', wd: '002' },
     { firstName: 'Eeeee', lastName: 'Fffff', org: 'DOE', wd: '002' } ];
    const exp1 = "FirstName,LastName\nAaaaa,Bbbbb\nCcccc,Ddddd\nEeeee,Fffff";

    it('generates csv', (done) => {
      generateCsv(data1)
        .then((r) => {
          expect(r).to.equal(exp1);
          done();
        })
        .catch((e) => {
          console.log(e);
          done();
        })
    });
  });

  context('with a single record', () => {
    const data2 = [{ firstName: 'Aaaaa', lastName: 'Bbbbb', org: 'DOE', wd: '002' }];
    const exp2 = "FirstName,LastName\nAaaaa,Bbbbb";

    it('generates csv', (done) => {
      generateCsv(data2)
        .then((r) => {
          expect(r).to.equal(exp2);
          done();
        })
        .catch((e) => {
          console.log(e);
          done();
        })
    });
  });

  context('with no records', () => {
    const data3 = [];
    const exp3 = "FirstName,LastName";

    it('generates csv', (done) => {
      generateCsv(data3)
        .then((r) => {
          expect(r).to.equal(exp3);
          done();
        })
        .catch((e) => {
          console.log(e);
          done();
        })
    });
  });
});

