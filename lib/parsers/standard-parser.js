const metadata = require('../utils/metadata');
const dirTree = require('directory-tree');
const xml2jsAsync = require('../utils/async-xml-parser');
const readFileAsync = require('../utils/async-read-file');
const saveFile = require('../utils/save-file');
const path = require('path');
const js2xmlparser = require("js2xmlparser");

module.exports = class StandardParser {

  constructor(child, inputFolder, outputFolder) {
    console.log(child);
    this.child = child;
    this.inputFolder = inputFolder;
    this.outputFolder = outputFolder;
    this.metadata = metadata;
  }

  build(){
    const promise = new Promise((resolve, reject) => {
      if(this.child.children.length == 0) {
        resolve();
      }
      Promise.all(
        this.child.children
        .sort((a,b) => a.name.localeCompare(b.name))
        .map( aNode => {
          return readFileAsync(aNode,'utf8')
        })
      ).then(result => {
        result.forEach( aFile => {
          let relativePath = path.relative(this.inputFolder, aFile.path);
          saveFile(this.outputFolder + '/' + relativePath, aFile.content);
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }
}