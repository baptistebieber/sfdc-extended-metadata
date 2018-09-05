const xmlbuilder = require('xmlbuilder');
const path = require('path');

const StandardType = require('./standard-type');

module.exports = class InFolderType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
  }

  package(){
    const promise = new Promise((resolve, reject) => {
      let type = this.child.split(path.sep)[0];
      let name = this.child.substr(type.length+1).replace(path.extname(this.child),'').replace(path.sep, '/')
      const types = {}
      types[this.metadata[type].xmlName] = [name];
      resolve(types)
    });
    return promise;
  }

}