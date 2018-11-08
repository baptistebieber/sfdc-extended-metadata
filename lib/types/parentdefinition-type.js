const path = require('path');

const StandardType = require('./standard-type');

module.exports = class ParentDefinitionType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
  }

  toPath() {
    return this.child.members
    .map(elem => 
        this.reversedMetadata[this.child.name].key
        + path.sep
        + elem
        + path.sep
        + elem
        + '.' 
        + this.reversedMetadata[this.child.name].extension
    );
  }

}