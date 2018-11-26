
/**
 * data: [ { firstName, lastName, org, wd } ]
 *
 **/
export const generateCsv = (data) => {
  return new Promise((resolve, reject) => {
    const header = 'FirstName,LastName,PayrollId';
    const csv = data.reduce((accum, i) => {
      return accum + "\n" + i.firstName + ',' + i.lastName + ',' + i.payrollId;
    }, header);
    return resolve(csv);
  });
};

/**
 * people: [ { firstName, lastName, org, wd, payrollId } ]
 *
 **/
export const printPeople = (people) => {
  people.forEach((h) => {
    console.log(h.org + h.wd.padStart(5, '0') + ' ' + h.payrollId.padStart(2, ' ') + ' ' +
      h.firstName.padStart(20, ' ') + ', ' +
      h.lastName.padStart(20, ' '));
  });
};

/**
 * rslts: { total: 0, err: 0, sent: 0, totalUsers: 0, sentUsers: 0, errUsers: 0, data: [] }
 *  data: [ { key, size, people: [{ firstName, lastName, org, wd }] } ]
 *
 **/
export const printResults = (rslts) => {
  console.log("\n [ Results ]\n");
  rslts.data.forEach( (r) => {
    if (r.error) {
      console.log(r.key.padStart(9, ' ') + ': ' + r.size.toString().padStart(5, ' ') + ' NOT ENROLLED; ERROR: ' + r.error)
    } else {
      console.log(r.key.padStart(9, ' ') + ': ' + r.size.toString().padStart(5, ' ') + ' NOT ENROLLED; SENT TO: ' + r.to)
    }
  });
  console.log("\n Total: " + rslts.total + ', Sent: ' + rslts.sent + ', Error: ' + rslts.err +
  "\n TotalUsers: " + rslts.totalUsers + ', SentUsers: ' + rslts.sentUsers + ', ErrorUsers: ' + rslts.errUsers + "\n");
};

