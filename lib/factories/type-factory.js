'use strict';
const CustomLabel = require('../types/customlabel-type');
const SubDef = require('../types/subdefinition-type');
const Standard = require('../types/standard-type');
const InFolder = require('../types/infolder-type');
const Aura = require('../types/aura-type');
const metadata = require('../utils/metadata');

// TODO: AuraDefinitionBundle


const classes = {
  'CustomLabels' : CustomLabel,
  'Workflow' : SubDef,
  'CustomObject' : SubDef,
  'EmailTemplate' : InFolder,
  'Document' : InFolder,
  'Report' : InFolder,
  'Dashboard' : InFolder,
  'AuraDefinitionBundle': Aura,
};

module.exports = class Type {
  getType(elem, inputFolder, outputFolder){
    return !!classes[metadata[elem.name].xmlName] ? new (classes[metadata[elem.name].xmlName])(elem, inputFolder, outputFolder) : new Standard(elem, inputFolder, outputFolder);
  }
};