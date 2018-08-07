const metadata = require('../utils/metadata');
const dirTree = require('directory-tree');
const xml2jsAsync = require('../utils/async-xml-parser');
const readFileAsync = require('../utils/async-read-file');
const saveFile = require('../utils/save-file');
const path = require('path');
const js2xmlparser = require('js2xmlparser');
const xmlbuilder = require('xmlbuilder');
const StandardType = require('./standard-type');

module.exports = class AuraType extends StandardType {
  
  constructor(child, inputFolder, outputFolder) {
    super(child, inputFolder, outputFolder);
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
      type.ele('name').t(metadata[this.child.name].xmlName);
      types.push(type)
      resolve(types)
    });
    return promise;
  }

}