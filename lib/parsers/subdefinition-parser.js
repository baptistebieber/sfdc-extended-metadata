const metadata = require('../utils/metadata');
const dirTree = require('directory-tree');
const xml2jsAsync = require('../utils/async-xml-parser');
const readFileAsync = require('../utils/async-read-file');
const saveFile = require('../utils/save-file');
const path = require('path');
const js2xmlparser = require("js2xmlparser");
const StandardParser = require('./standard-parser');

module.exports = class SubDefinitionParser extends StandardParser {
  
  constructor(child, inputFolder, outputFolder) {
    super(child, inputFolder, outputFolder);
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
          return readFileAsync(aNode,'utf8').then(xml2jsAsync)
        })
      ).then(result => {
        result.forEach( aFile => {
          let relativePath = path.relative(this.inputFolder, aFile.path);
          const objectName = Object.keys(aFile.content)[0];
          const keep = {};
          for(let childDef in aFile.content[objectName]) {
            if(this.metadata[this.child.name].children.hasOwnProperty(childDef)) {
              let rootPath = this.outputFolder + '/' + relativePath.replace(aFile.extension,'')+'/'+this.metadata[this.child.name].children[childDef].typeName;
              aFile.content[objectName][childDef].forEach(
                cc => {
                  var xmlContent = js2xmlparser.parse(this.metadata[this.child.name].children[childDef].typeName, cc);
                  saveFile(rootPath + '/' + cc[this.metadata[this.child.name].children[childDef].name][0] + '.xml', xmlContent);
                }
              )
            }
            else if(childDef != '$') {
              keep[childDef] = aFile.content[objectName][childDef];
            }
          }
          saveFile(this.outputFolder + '/' + relativePath, js2xmlparser.parse(objectName, keep));
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }

}