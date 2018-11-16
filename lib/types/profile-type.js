const merge = require('merge');
const path = require('path');
const xmlbuilder = require('xmlbuilder');

const StandardType = require('./standard-type');
const xml2jsAsync = require('../utils/async-xml-parser');
const readFileAsync = require('../utils/async-read-file');
const saveFile = require('../utils/save-file');

const escapeRegExp = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const replaceAll = (target, search, replacement) => {
    return target.replace(new RegExp(escapeRegExp(search), 'g'), replacement);
};

module.exports = class ProfileType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
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
          return readFileAsync(aNode,'utf8').then(xml2jsAsync)
        })
      ).then(result => {
        result
        .sort((a,b) => (a.type === b.type ? 0 : (a.type === 'directory' ? 1 :  -1 ) + (b.type === 'directory' ? 1 : -1)))
        .forEach( aFile => {
          let relativePath = path.relative(this.inputFolder, aFile.path);
          const objectName = Object.keys(aFile.content)[0];
          const keep = {};
          Object.keys(aFile.content[objectName])
          .forEach((childDef) => {
            if(this.metadata[this.child.name].children.hasOwnProperty(childDef)) {
              let rootPath = this.outputFolder + '/' + relativePath.replace(aFile.extension,'')+'/';
              aFile.content[objectName][childDef].forEach(
                cc => {
                  let xmlFilename = this.metadata[this.child.name].children[childDef].folderName + '.' + this.metadata[this.child.name].children[childDef].extension;
                  cc[this.metadata[this.child.name].children[childDef].name][0]
                  .split(this.metadata[this.child.name].children[childDef].split)
                  .map((elem, k) => { xmlFilename = replaceAll(xmlFilename,  '{'+k+'}', elem) })
                  // console.log(xmlFilename);
                  // console.log(this.metadata[this.child.name].children[childDef]);

                  let xmlContent = xmlbuilder.create(childDef, { encoding: 'UTF-8' }).ele(cc).end(this.xmlOptions);
                  // let xmlFilename = cc[this.metadata[this.child.name].children[childDef].name][0] + '.xml';
                  saveFile(rootPath + '/' + xmlFilename, xmlContent, this.options);
                }
              )
            }
            else if(childDef !== '$') {
              keep[childDef] = aFile.content[objectName][childDef];
            }
          });
          if(Object.keys(keep).length > 0) {
            let xml = xmlbuilder.create(objectName, { encoding: 'UTF-8' });
            xml.ele(keep);
            let xmlContent = xml.end(this.xmlOptions);
            saveFile(this.outputFolder + '/' + relativePath.replace(aFile.extension,'') + '/' + aFile.name, xmlContent, this.options);
          }
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
          return readFileAsync(aNode).then(xml2jsAsync)
        })
      ).then(result => {
        result
        .sort((a,b) => (a.type === b.type ? 0 : (a.type === 'directory' ? 1 :  -1 ) + (b.type === 'directory' ? 1 : -1)))
        .forEach( aFile => {
          let relativePath = path.relative(this.inputFolder, aFile.path).replace(aFile.name, '');
          let filename = '';
          let data = {
            "@xmlns": "http://soap.sforce.com/2006/04/metadata"
          };
          aFile.children.forEach(aChild => {
            if(aChild.type === 'directory') {
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

          let xmlContent = xmlbuilder.create(this.metadata[this.child.name].xmlName, { encoding: 'UTF-8' }).ele(data).end(this.xmlOptions);
          saveFile(this.outputFolder + '/' + relativePath + '/' + filename, xmlContent, this.options);
        });
        resolve();
      }).catch(reject);
    });
    return promise;
  }

  package(){  
    const promise = new Promise((resolve, reject) => {
      let arrayPath = this.child.split(path.sep);
      let type = arrayPath[0];
      let finalType = '';
      let name = '';
      if(arrayPath.length === 4) {
        let subType = arrayPath[2];
        if(!this.metadata[type].children.hasOwnProperty(subType)) {
          resolve({});
        }
        finalType = this.metadata[type].children[subType].xmlName;
        name = arrayPath[1] + '.' + path.basename(this.child).replace(path.extname(this.child),'');
      }
      else {
        finalType = this.metadata[type].xmlName;
        name = path.basename(this.child).replace(path.extname(this.child),'');
      }
      let types = {};
      types[finalType] = [name];
      resolve(types);
    });
    return promise;
  }

  toPath() {
    return this.child.members
    .map(elem => 
        this.reversedMetadata[this.child.name].parent.key
        + path.sep
        + elem.split('.')[0]
        + path.sep
        + this.reversedMetadata[this.child.name].key 
        + path.sep 
        + elem.split('.')[1] 
        + '.' 
        + this.reversedMetadata[this.child.name].extension
    );
  }

}