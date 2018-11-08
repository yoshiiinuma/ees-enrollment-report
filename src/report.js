
export const generateCsv = (data) => {
  return new Promise((resolve, reject) => {
    const header = 'FirstName,LastName';
    const csv = data.reduce((accum, i) => {
      return accum + "\n" + i.firstName + ',' + i.lastName;
    }, header);
    return resolve(csv);
  });
};

