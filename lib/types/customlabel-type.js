const js2xmlparser = require('js2xmlparser');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

const xml2jsAsync = require('../utils/async-xml-parser');
const readFileAsync = require('../utils/async-read-file');
const saveFile = require('../utils/save-file');
const StandardType = require('./standard-type');

module.exports = class CustomLabelType extends StandardType {
  
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
          if(typeof aFile.content.CustomLabels.labels == 'object' && aFile.content.CustomLabels.labels.length > 0) {
            aFile.content.CustomLabels.labels.forEach(label => {
              var xmlContent = js2xmlparser.parse('labels', label);
              saveFile(this.outputFolder + '/' + relativePath.replace(aFile.extension,'') + '/' + label.fullName + '.xml', xmlContent, this.options);
            });
          }
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
          let relativePath = path.relative(this.inputFolder, aFile.path);
          if(typeof aFile.children == 'object' && aFile.children.length > 0) {
            let labels = [];
            aFile.children.forEach(label => {
              labels.push(label.content.labels);
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
            let data = {
              "@": {
                "xmlns":"http://soap.sforce.com/2006/04/metadata"
              },
              'labels': labels
            }
            let xmlContent = js2xmlparser.parse('CustomLabels', data, xmlOptions);
            saveFile(this.outputFolder + '/' + relativePath + '.labels', xmlContent, this.options);
          }
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }

}