'use strict';
const path = require('path');
const xmlbuilder = require('xmlbuilder');
const listFilepaths = require('list-filepaths');

const xmlOptions = require('../utils/xml-options.js');
const metadata = require('../utils/metadata.js');
const TypeFactory = require('../factories/type-factory.js');
const saveFile = require('../utils/save-file');

const PACKAGE_XML_FILE_NAME = 'package.xml';

const PLUGIN_NAME = 'generate-package-from-list';

module.exports = (inputFolder, outputFolder, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null) {
    throw new Error('Not enough config options');
  }
  if(typeof outputFolder === 'undefined' || outputFolder === null) {
    throw new Error('Not enough config options');
  }

  return new Promise((resolve, reject) => {
    const typeFactory = new TypeFactory();

    listFilepaths(inputFolder, {reject: /\-meta.xml$/})
    .then(filepaths => {
      Promise.all(filepaths
      .map(elem => { return path.relative(inputFolder, elem)})
      .filter(elem => metadata.hasOwnProperty(elem.split(path.sep)[0]))
      .map(elem => { return typeFactory.getType(elem.split(path.sep)[0], elem, inputFolder, outputFolder, options).package() })
      ).then(result => {
        let packageList = {}
        result.forEach(type => {
          for (let key in type) {
            if(!packageList.hasOwnProperty(key)) {
              packageList[key] = [];
            }
            packageList[key].push(...type[key]);
          }
        });

        let types = []
        Object.keys(packageList)
        .sort((a,b) => a.localeCompare(b))
        .forEach(key => {
          let type = {members:[], name: key};
          packageList[key]
          .filter((v, i, a) => a.indexOf(v) === i)
          .forEach(members => {
            type.members.push(members);
          })
          types.push(type);
        });
        let data = {
          "@xmlns": "http://soap.sforce.com/2006/04/metadata",
          types: types
        };

        let xmlContent = xmlbuilder.create('Package', { encoding: 'UTF-8' }).ele(data).end(xmlOptions);
        saveFile(outputFolder + '/' + PACKAGE_XML_FILE_NAME, xmlContent, options);
        resolve()
      })
    })
    .catch((err) => {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      reject()
    });
  });
};