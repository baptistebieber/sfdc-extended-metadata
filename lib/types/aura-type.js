const xmlbuilder = require('xmlbuilder');

const StandardType = require('./standard-type');

module.exports = class AuraType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
  }

  package(){  
    const promise = new Promise((resolve, reject) => {
      const children = this.child.children.filter(elem => !elem.name.startsWith('.') && !elem.name.endsWith('-meta.xml'))
      if(children.length == 0) {
        resolve();
      }
      const types = []
      const type = xmlbuilder.create('types');
      children.sort((a,b) => a.name.localeCompare(b.name))
      .forEach(subChild => {
        type.ele('members')
        .t(subChild.name.replace(/\.[^/.]+$/,''));
      })
      type.ele('name').t(this.metadata[this.child.name].xmlName);
      types.push(type)
      resolve(types)
    });
    return promise;
  }

}