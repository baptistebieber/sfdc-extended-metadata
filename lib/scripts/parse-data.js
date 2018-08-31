'use strict';
const dirTree = require('directory-tree');
const fs = require('fs-extra');

const metadata = require('../utils/metadata');
const TypeFactory = require('../factories/type-factory.js');
const moveFile = require('../utils/move-file');

const PLUGIN_NAME = 'parse-data';

module.exports = (inputFolder, outputFolder, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null || typeof outputFolder === 'undefined' || outputFolder === null) {
    throw new Error('Not enough config options');
  }

  return new Promise((resolve, reject) => {
    const typeFactory = new TypeFactory();
    Promise.all(
      dirTree(inputFolder)
      .children
      .filter(child => metadata[child.name] !== undefined && child.children != undefined && child.children.length > 0)
      .sort((a,b) => metadata[a.name].xmlName.localeCompare(metadata[b.name].xmlName))
      .map(elem => typeFactory.getType(elem, inputFolder, outputFolder, options).parse())
    ).then(result => {
      let aFile = {
        'type': 'file',
        'path': inputFolder + '/package.xml',
        'content': fs.readFileSync(inputFolder + '/package.xml', 'utf8')
      };
      moveFile(aFile, inputFolder, outputFolder, options);
      fs.removeSync(inputFolder);
      resolve()
    }).catch(err => {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      reject()
    });
  });
}
