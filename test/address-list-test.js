
import util from 'util';
import { expect } from 'chai';

import { genAddressList } from '../src/address-list.js';

const infile = './test/address-list.csv';
const badfile = 'not-exist';

describe('#genAddressList', () => {
  context('with a valid file', () => {
    it('converts csv file into address list object', (done) => {
      genAddressList(infile)
        .then((list) => {
          expect(list).to.eql({
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
          });
          done();
        })
        .catch((e) => {
          console.log(e);
          done();
        });
    });
  });

  context('with a non-existent file', function() {
    it('throws an exception', function(done) {
      genAddressList(badfile)
        .catch((e) => {
          expect(e).to.equal('File Not Found: ' + badfile);
          done();
        });
    });
  });
});
