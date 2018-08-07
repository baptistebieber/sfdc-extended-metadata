'use strict';
const SubDef = require('../types/subdefinition-type');
const Standard = require('../types/standard-type');
const InFolder = require('../types/infolder-type');
const metadata = require('../utils/metadata');

// TODO: CustomLabels, AuraDefinitionBundle


const classes = {
  'Workflow' : SubDef,
  'CustomObject' : SubDef,
  'EmailTemplate' : InFolder,
  'Document' : InFolder,
  'Report' : InFolder,
  'Dashboard' : InFolder,
};

module.exports = class Type {
  getType(elem, inputFolder, outputFolder){
    return !!classes[metadata[elem.name].xmlName] ? new (classes[metadata[elem.name].xmlName])(elem, inputFolder, outputFolder) : new Standard(elem, inputFolder, outputFolder);
  }
};