const fs = require('fs');

const readFileAsync = (file) => {
  const promise = new Promise((resolve, reject) => {
    if(file.type == 'directory' && file.children.length > 0) {
      Promise.all(
        file.children
        .sort((a,b) => a.name.localeCompare(b.name))
        .map( aNode => {
          return readFileAsync(aNode)
        })
      )
      .then(result => {
        file.children = result;
        resolve(file);
      }).catch(reject);
    }
    else {
      fs.readFile(file.path, 'utf8', (err, data) => {
        if (err) reject(err);
        file.content = data;
        resolve(file);
      });
    }
  });
  return promise;
};
module.exports = readFileAsync;