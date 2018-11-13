
const fs = require('fs-extra');
const sad = require('sfdc-authent-delegate');
const xmlbuilder = require('xmlbuilder');

const xml2jsAsync = require('../utils/async-xml-parser');
const reversedMetadata = require('../utils/reversed-metadata');
const TypeFactory = require('../factories/type-factory.js');
const xmlOptions = require('../utils/xml-options.js');
const saveFile = require('../utils/save-file');


module.exports = (packageXmlPath, folderToExtract, options) => {

  return new Promise((resolve, reject) => {
    xml2jsAsync({content:fs.readFileSync(packageXmlPath)})
    .then(res => {
      sad.getSession(options)
      .then(conn => {
        let packageXml = res.content.Package;
        const typeFactory = new TypeFactory();
        Promise.all(
          packageXml.types
          .map(elem => {return {name: elem.name[0], members: elem.members}})
          .filter(elem => reversedMetadata.hasOwnProperty(elem.name))
          .sort((a,b) => a.name.localeCompare(b.name))
          .map(elem => typeFactory.getReverseType(elem.name, elem, '', '', options).sanitizePackage(conn))
        ).then(data => {
          data['@xmlns'] = 'http://soap.sforce.com/2006/04/metadata';
          let xmlContent = xmlbuilder.create('Package', { encoding: 'UTF-8' })
          .ele({'types':data})
          .end(xmlOptions);
          saveFile(folderToExtract + '/package.xml', xmlContent, options);
          resolve(folderToExtract + '/package.xml');
        })
      });
    })
  });
}