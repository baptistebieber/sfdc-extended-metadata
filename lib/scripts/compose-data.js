'use strict';
const dirTree = require('directory-tree');
const fs = require('fs-extra');

const metadata = require('../utils/metadata');
const TypeFactory = require('../factories/type-factory.js');

const PLUGIN_NAME = 'compose-data';

module.exports = (inputFolder, outputFolder, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null || typeof outputFolder === 'undefined' || outputFolder === null) {
    throw new Error('Not enough config options');
  }
  
  fs.removeSync(outputFolder);
  return new Promise((resolve, reject) => {
    const typeFactory = new TypeFactory();
    Promise.all(
      dirTree(inputFolder)
      .children
      .filter((child) => metadata.hasOwnProperty(child.name) && child.hasOwnProperty('children') && child.children.length > 0)
      .sort((a,b) => metadata[a.name].xmlName.localeCompare(metadata[b.name].xmlName))
      .map((elem) => typeFactory.getType(elem.name, elem, inputFolder, outputFolder, options).compose())
    ).then((result) => {
      resolve();
    }).catch((err) => {
      options.logger.log('Error '+PLUGIN_NAME+': '+err.message);
      reject();
    });
  });
}
