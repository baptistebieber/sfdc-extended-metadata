const dirTree = require('directory-tree');
const xml2jsAsync = require('../utils/async-xml-parser');
const readFileAsync = require('../utils/async-read-file');
const saveFile = require('../utils/save-file');
const path = require('path');
const js2xmlparser = require('js2xmlparser');
const xmlbuilder = require('xmlbuilder');
const StandardType = require('./standard-type');

const merge = require('merge');

module.exports = class SubDefinitionType extends StandardType {
  
  constructor(child, inputFolder, outputFolder) {
    super(child, inputFolder, outputFolder);
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
          return readFileAsync(aNode,'utf8').then(xml2jsAsync)
        })
      ).then(result => {
        result.forEach( aFile => {
          console.log(aFile.content.CustomObject.fields);   
          let relativePath = path.relative(this.inputFolder, aFile.path);
          const objectName = Object.keys(aFile.content)[0];
          const keep = {};
          for(let childDef in aFile.content[objectName]) {
            if(this.metadata[this.child.name].children.hasOwnProperty(childDef)) {
              let rootPath = this.outputFolder + '/' + relativePath.replace(aFile.extension,'')+'/'+childDef;
              aFile.content[objectName][childDef].forEach(
                cc => {
                  var xmlContent = js2xmlparser.parse(childDef, cc);
                  saveFile(rootPath + '/' + cc[this.metadata[this.child.name].children[childDef].name][0] + '.xml', xmlContent);
                }
              )
            }
            else if(childDef != '$') {
              keep[childDef] = aFile.content[objectName][childDef];
            }
          }
          saveFile(this.outputFolder + '/' + relativePath.replace(aFile.extension,'') + '/' + aFile.name, js2xmlparser.parse(objectName, keep));
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }

  package(){
    const promise = new Promise((resolve, reject) => {
      if(this.child.children.length == 0) {
        resolve();
      }
      Promise.all(
        this.child.children
        .sort((a,b) => a.name.localeCompare(b.name))
        .map( aNode => readFileAsync(aNode,'utf8').then(xml2jsAsync))
      ).then(result => {
        const struct = {}
        struct[this.metadata[this.child.name].xmlName] = [];
        result.forEach( aFile => {
          struct[this.metadata[this.child.name].xmlName].push(aFile.name.replace(/\.[^/.]+$/,''));
          const objectName = Object.keys(aFile.content)[0];
          for(let childDef in aFile.content[objectName]) if(this.metadata[this.child.name].children.hasOwnProperty(childDef)) {
            struct[this.metadata[this.child.name].children[childDef].typeName] = struct[this.metadata[this.child.name].children[childDef].typeName] || [];
            aFile.content[objectName][childDef].forEach(elem => struct[this.metadata[this.child.name].children[childDef].typeName].push(aFile.name.replace(/\.[^/.]+$/,'') + '.' + elem[this.metadata[this.child.name].children[childDef].name][0]));
          }
        })

        const types = []
        Object.keys(struct).sort().forEach(aStruc => {
          const type = xmlbuilder.create('types');
          struct[aStruc].sort().forEach(elem => {
            type.ele('members')
            .t(elem); 
          })
          type.ele('name').t(aStruc);
          types.push(type);
        })
        
        resolve(types.length == 0 ? undefined : types);
      }).catch(reject);
    });
    return promise;
  }

}