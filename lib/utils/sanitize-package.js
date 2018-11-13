
const fs = require('fs-extra');
const xml2jsAsync = require('../utils/async-xml-parser');
const reversedMetadata = require('../utils/reversed-metadata');
const TypeFactory = require('../factories/type-factory.js');

const sad = require('sfdc-authent-delegate');

module.exports = (packageXmlPath, folderToExtract, options) => {

  return new Promise((resolve, reject) => {
    Promise.all([xml2jsAsync({content:fs.readFileSync(packageXmlPath)})])
    .then(res => {
      sad.getSession(options)
      .then(conn => {
        let packageXml = res[0].content.Package;
        const typeFactory = new TypeFactory();
        Promise.all(
          packageXml.types
          .map(elem => {return {name: elem.name[0], members: elem.members}})
          .filter(elem => reversedMetadata.hasOwnProperty(elem.name))
          .sort((a,b) => a.name.localeCompare(b.name))
          .map(elem => typeFactory.getReverseType(elem.name, elem, '', '', options).sanitizePackage(conn))
        ).then(res => {
          console.log(res);
        })
      });
    })
  });
}