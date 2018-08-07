const fs = require('fs');

const readFileAsync = (file) => {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(file.path, 'utf8', (err, data) => {
      if (err) reject(err);
      file.content = data;
      resolve(file);
    });
  });
  return promise;
};
module.exports = readFileAsync;