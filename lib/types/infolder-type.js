const xmlbuilder = require('xmlbuilder');

const StandardType = require('./standard-type');

module.exports = class InFolderType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
  }

}