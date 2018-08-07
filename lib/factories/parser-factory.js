'use strict';
const SubDef = require('../parsers/subdefinition-parser');
const Standard = require('../parsers/standard-parser');
const metadata = require('../utils/metadata');

// TODO CustomObject
// TODO email template and report dashboard and Document

const classes = {
  'CustomObject' : SubDef,
};

module.exports = class Parser {
  getParser(type, inputFolder, outputFolder){
    return !!classes[metadata[type.name].xmlName] ? new (classes[metadata[type.name].xmlName])(type, inputFolder, outputFolder) : new Standard(type, inputFolder, outputFolder);
  }
};