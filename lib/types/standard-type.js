const xmlbuilder = require('xmlbuilder');

const readFileAsync = require('../utils/async-read-file');
const metadata = require('../utils/metadata');
const moveFile = require('../utils/move-file');

module.exports = class StandardType {

  constructor(child, inputFolder, outputFolder, options) {
    this.child = child;
    this.inputFolder = inputFolder;
    this.outputFolder = outputFolder;
    this.metadata = metadata;
    this.options = options;
  }

  parse(){
    const promise = new Promise((resolve, reject) => {
      if(this.child.children.length == 0) {
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
        .sort((a,b) => (a.type == b.type ? 0 : (a.type == 'directory' ? 1 :  -1 ) + (b.type == 'directory' ? 1 : -1)))
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
      const children = this.child.children.filter(elem => elem.extension && elem.extension != '.xml' && !elem.name.startsWith('.'))
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


  compose(){
    const promise = new Promise((resolve, reject) => {
      if(this.child.children.length == 0) {
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
        .sort((a,b) => (a.type == b.type ? 0 : (a.type == 'directory' ? 1 :  -1 ) + (b.type == 'directory' ? 1 : -1)))
        .forEach( aFile => {
          moveFile(aFile, this.inputFolder, this.outputFolder, this.options);
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }
}