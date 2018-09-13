'use strict';
const CustomLabel = require('../types/customlabel-type');
const SubDef = require('../types/subdefinition-type');
const Standard = require('../types/standard-type');
const InFolder = require('../types/infolder-type');
const Aura = require('../types/aura-type');
const metadata = require('../utils/metadata');
const reversedMetadata = require('../utils/reversed-metadata');

const specialMetadata = {
  'CustomLabels' : CustomLabel,
  'Workflow' : SubDef,
  'CustomObject' : SubDef,
  'EmailTemplate' : InFolder,
  'Document' : InFolder,
  'Report' : InFolder,
  'Dashboard' : InFolder,
  'AuraDefinitionBundle': Aura,
};

const specialReversedMetadata = {
  // 'CustomField'
}

module.exports = class Type {
  getType(name, elem, inputFolder, outputFolder, options){
    return specialMetadata.hasOwnProperty(metadata[name].xmlName) ? new (specialMetadata[metadata[name].xmlName])(elem, inputFolder, outputFolder, options) : new Standard(elem, inputFolder, outputFolder, options);
  }

  getReverseType(name, elem, inputFolder, outputFolder, options) {
    return specialReversedMetadata.hasOwnProperty(name) ? new (specialReversedMetadata[name])(elem, inputFolder, outputFolder, options) : new Standard(elem, inputFolder, outputFolder, options);
  }

};