'use strict';
const SubDef = require('../parsers/subdefinition-type');
const Standard = require('../parsers/standard-type');
const metadata = require('../utils/metadata');

// TODO CustomObject
// TODO email template and report dashboard and Document

const classes = {
  'CustomObject' : SubDef,
};

module.exports = class Type {
  getType(elem, inputFolder, outputFolder){
    return !!classes[metadata[elem.name].xmlName] ? new (classes[metadata[elem.name].xmlName])(elem, inputFolder, outputFolder) : new Standard(elem, inputFolder, outputFolder);
  }
};