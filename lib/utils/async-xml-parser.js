const xml2js = require('xml2js');

const parseStringAsync = (file) => {
  const promise = new Promise((resolve, reject) => {
    if(file.type == 'directory' && file.children.length > 0) {
      Promise.all(
        file.children
        .sort((a,b) => a.name.localeCompare(b.name))
        .map( aNode => {
          return parseStringAsync(aNode)
        })
      )
      .then(result => {
        file.children = result;
        resolve(file);
      }).catch(reject);
    }
    else {
      const parser = new xml2js.Parser();
      parser.parseString(file.content, (err, result) => {
        if (err) reject(err);
        file.content = result;
        resolve(file);
      });
    }
  });
  return promise;
};
module.exports = parseStringAsync;