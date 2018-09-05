const xmlbuilder = require('xmlbuilder');
const path = require('path')

const StandardType = require('./standard-type');

module.exports = class AuraType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
  }

  package(){  
    const promise = new Promise((resolve, reject) => {
      let type = this.child.split(path.sep)[0];
      let name = this.child.split(path.sep)[1];
      let types = {}
      types[this.metadata[type].xmlName] = [name];
      resolve(types)
    });
    return promise;
  }

}