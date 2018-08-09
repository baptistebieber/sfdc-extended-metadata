'use strict';
const fs = require('fs');
const dirTree = require('directory-tree');
const metadata = require('../utils/metadata');
const xmlbuilder = require('xmlbuilder');
const TypeFactory = require('../factories/type-factory.js');

const PACKAGE_XML_FILE_NAME = 'package.xml';

module.exports = (inputFolder, outputFolder, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null) {
    throw new Error('Not enough config options');
  }

  const promise = new Promise((resolve, reject) => {
    const typeFactory = new TypeFactory();
    Promise.all(
      dirTree(inputFolder)
      .children
      .filter(child => metadata[child.name] !== undefined && child.children != undefined && child.children.length > 0)
      .sort((a,b) => metadata[a.name].xmlName.localeCompare(metadata[b.name].xmlName))
      .map(elem => typeFactory.getType(elem, inputFolder, outputFolder, options).package())
    ).then(result => {
      const xml = xmlbuilder.create('Package')
      .att('xmlns', 'http://soap.sforce.com/2006/04/metadata')
      .dec('1.0', 'UTF-8');

      [].concat(...result).filter(elem => !!elem).forEach(elem => xml.importDocument(elem));
      xml.ele('version')
      .t(options.version);
      const xmlContent = xml.end({ pretty: true, indent: '    ', newline: '\n' });
      fs.writeFileSync(outputFolder + '/' + PACKAGE_XML_FILE_NAME, xmlContent);
      resolve();
    }).catch(reject);
  });
  return promise;
};