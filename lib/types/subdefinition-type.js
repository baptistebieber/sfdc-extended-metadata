const js2xmlparser = require('js2xmlparser');
const merge = require('merge');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

const StandardType = require('./standard-type');
const xml2jsAsync = require('../utils/async-xml-parser');
const readFileAsync = require('../utils/async-read-file');
const saveFile = require('../utils/save-file');


module.exports = class SubDefinitionType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
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
        result
        .sort((a,b) => (a.type == b.type ? 0 : (a.type == 'directory' ? 1 :  -1 ) + (b.type == 'directory' ? 1 : -1)))
        .forEach( aFile => {
          let relativePath = path.relative(this.inputFolder, aFile.path);
          const objectName = Object.keys(aFile.content)[0];
          const keep = {};
          for(let childDef in aFile.content[objectName]) {
            if(this.metadata[this.child.name].children.hasOwnProperty(childDef)) {
              let rootPath = this.outputFolder + '/' + relativePath.replace(aFile.extension,'')+'/'+childDef;
              aFile.content[objectName][childDef].forEach(
                cc => {
                  var xmlContent = js2xmlparser.parse(childDef, cc);
                  saveFile(rootPath + '/' + cc[this.metadata[this.child.name].children[childDef].name][0] + '.xml', xmlContent, this.options);
                }
              )
            }
            else if(childDef != '$') {
              keep[childDef] = aFile.content[objectName][childDef];
            }
          }
          saveFile(this.outputFolder + '/' + relativePath.replace(aFile.extension,'') + '/' + aFile.name, js2xmlparser.parse(objectName, keep), this.options);
        });
        resolve();
      }).catch(reject);
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
          return readFileAsync(aNode).then(xml2jsAsync)
        })
      ).then(result => {
        result
        .sort((a,b) => (a.type == b.type ? 0 : (a.type == 'directory' ? 1 :  -1 ) + (b.type == 'directory' ? 1 : -1)))
        .forEach( aFile => {
          let relativePath = path.relative(this.inputFolder, aFile.path).replace(aFile.name, '');
          let filename = '';
          let data = {
            "@": {
              "xmlns":"http://soap.sforce.com/2006/04/metadata"
            }
          };
          aFile.children.forEach(aChild => {
            if(aChild.type == 'directory') {
              if(this.metadata[this.child.name].children.hasOwnProperty(aChild.name)) {
                data[aChild.name] = [];
                aChild.children.forEach(aChildChild => {
                  data[aChild.name].push(aChildChild.content[aChild.name]);
                });
              }
            }
            else {
              data = merge(data, aChild.content[this.metadata[this.child.name].xmlName]);
              filename = aChild.name;
            }
          });
          let xmlOptions = {
            declaration: {
              encoding: "UTF-8",
            },
            format: {
              doubleQuotes: true,
              indent: "    ",
              newline: "\n",
              pretty: true
            },
          };
          let xmlContent = js2xmlparser.parse(this.metadata[this.child.name].xmlName, data, xmlOptions);
          saveFile(this.outputFolder + '/' + relativePath + '/' + filename, xmlContent, this.options);
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }

}