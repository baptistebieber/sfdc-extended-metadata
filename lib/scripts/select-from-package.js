'use strict';
const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const xml2jsAsync = require('../utils/async-xml-parser');
const reversedMetadata = require('../utils/reversed-metadata');

const TypeFactory = require('../factories/type-factory.js');

const PLUGIN_NAME = 'select-from-package';

module.exports = (inputPackage, inputFolder, outputFolder, options) => {
  return new Promise((resolve, reject) => {
    Promise.all([xml2jsAsync({content:fs.readFileSync(inputPackage)})])
    .then(res => {
      let packageXml = res[0].content.Package;
      const typeFactory = new TypeFactory();
      Promise.all(
        packageXml.types
        .map(elem => {return {name: elem.name[0], members: elem.members}})
        .filter(elem => reversedMetadata.hasOwnProperty(elem.name))
        .sort((a,b) => a.name.localeCompare(b.name))
        .map(elem => typeFactory.getReverseType(elem.name, elem, inputFolder, outputFolder, options).toPath())
      ).then(res => {
        console.log(res)
      })

    })
    // .catch((err) => {
    //   options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
    //   reject();
    // });
  });
};