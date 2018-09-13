const xmlbuilder = require('xmlbuilder');
const path = require('path');

const readFileAsync = require('../utils/async-read-file');
const metadata = require('../utils/metadata');
const reversedMetadata = require('../utils/reversed-metadata');
const moveFile = require('../utils/move-file');
const xmlOptions = require('../utils/xml-options.js');

module.exports = class StandardType {

  constructor(child, inputFolder, outputFolder, options) {
    this.child = child;
    this.inputFolder = inputFolder;
    this.outputFolder = outputFolder;
    this.metadata = metadata;
    this.reversedMetadata = reversedMetadata;
    this.options = options;
    this.xmlOptions = xmlOptions;
  }

  parse(){
    const promise = new Promise((resolve, reject) => {
      if(this.child.children.length === 0) {
        resolve();
      }
      Promise.all(
        this.child.children
        .sort((a,b) => a.name.localeCompare(b.name))
        .map( aNode => {
          return readFileAsync(aNode)
        })
      ).then(result => {
        result
        .sort((a,b) => (a.type === b.type ? 0 : (a.type === 'directory' ? 1 :  -1 ) + (b.type === 'directory' ? 1 : -1)))
        .forEach( aFile => {
          moveFile(aFile, this.inputFolder, this.outputFolder, this.options);
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }

  compose(){
    const promise = new Promise((resolve, reject) => {
      if(this.child.children.length === 0) {
        resolve();
      }
      Promise.all(
        this.child.children
        .sort((a,b) => a.name.localeCompare(b.name))
        .map( aNode => {
          return readFileAsync(aNode);
        })
      ).then(result => {
        result
        .sort((a,b) => (a.type === b.type ? 0 : (a.type === 'directory' ? 1 :  -1 ) + (b.type === 'directory' ? 1 : -1)))
        .forEach( aFile => {
          moveFile(aFile, this.inputFolder, this.outputFolder, this.options);
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }

  package(){  
    const promise = new Promise((resolve, reject) => {
      let type = this.child.split(path.sep)[0];
      let name = path.basename(this.child).replace(path.extname(this.child),'');
      let types = {};
      types[this.metadata[type].xmlName] = [name];
      resolve(types);
    });
    return promise;
  }

  toPath() {
    // console.log(this.child)
    // console.log(this.child.name)
    // console.log(this.reversedMetadata[this.child.name])
    // console.log('')
    return this.child.members.map(elem => this.reversedMetadata[this.child.name].key + path.sep + elem);
  }

}