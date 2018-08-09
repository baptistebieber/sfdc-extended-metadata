'use strict';
const dirTree = require('directory-tree');
const fs = require('fs-extra');

const metadata = require('../utils/metadata');
const TypeFactory = require('../factories/type-factory.js');

module.exports = (inputFolder, outputFolder, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null || typeof outputFolder === 'undefined' || outputFolder === null) {
    throw new Error('Not enough config options');
  }
  fs.removeSync(outputFolder);

  const promise = new Promise((resolve, reject) => {
    const typeFactory = new TypeFactory();
    Promise.all(
      dirTree(inputFolder)
      .children
      .filter(child => metadata[child.name] !== undefined && child.children != undefined && child.children.length > 0)
      .sort((a,b) => metadata[a.name].xmlName.localeCompare(metadata[b.name].xmlName))
      .map(elem => typeFactory.getType(elem, inputFolder, outputFolder, options).compose())
    ).then(result => {
      options.logger.info('OK');
    }).catch(reject);
  });
}
