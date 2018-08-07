const metadata = require('../utils/metadata');
const dirTree = require('directory-tree');
const xml2jsAsync = require('../utils/async-xml-parser');
const readFileAsync = require('../utils/async-read-file');
const saveFile = require('../utils/save-file');
const path = require('path');
const xmlbuilder = require('xmlbuilder');
const js2xmlparser = require('js2xmlparser');

module.exports = class StandardType {

  constructor(child, inputFolder, outputFolder) {
    this.child = child;
    this.inputFolder = inputFolder;
    this.outputFolder = outputFolder;
    this.metadata = metadata;
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
        result.forEach( aFile => {
          if(aFile.type == 'directory' && aFile.children.length > 0) {
            aFile.children.forEach( aChild => {
              let relativePath = path.relative(this.inputFolder, aChild.path);
              console.log(relativePath);
              saveFile(this.outputFolder + '/' + relativePath, aChild.content);
            });
          }
          else {
            let relativePath = path.relative(this.inputFolder, aFile.path);
            saveFile(this.outputFolder + '/' + relativePath, aFile.content);
          }
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
      type.ele('name').t(metadata[this.child.name].xmlName);
      types.push(type)
      resolve(types)
    });
    return promise;
  }
}