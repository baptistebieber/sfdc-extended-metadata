const xmlbuilder = require('xmlbuilder');
const path = require('path');
const sad = require('sfdc-authent-delegate');

const StandardType = require('./standard-type');

module.exports = class InFolderType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
  }

  package(){
    const promise = new Promise((resolve, reject) => {
      let type = this.child.split(path.sep)[0];
      let name = this.child.substr(type.length+1).replace(path.extname(this.child),'').replace(path.sep, '/')
      const types = {}
      types[this.metadata[type].xmlName] = [name];
      resolve(types)
    });
    return promise;
  }


  sanitizePackage(conn) {
    return new Promise((resolve, reject) => {
      if(this.child.members.indexOf('*') != -1) {
        this.child.members = [];
        var folder_types = [{type: this.reversedMetadata[this.child.name].metadataTypeFolder, folder: null}];
        conn.metadata.list(folder_types, this.options.version, (err, res) => {
          if (err) { reject(err); }
          if(typeof res !== 'undefined') {
            var types = [];
            if(!Array.isArray(res)) res = [res];
            res.map(mdata => {
              this.child.members.push(mdata.fullName); 
              types.push({type: this.child.name, folder: mdata.fullName});
            });

            conn.metadata.list(types, this.options.version, (err, res) => {
              if (err) { reject(err); }
              if(typeof res !== 'undefined') {
                if(!Array.isArray(res)) res = [res];
                res.map(mdata => {this.child.members.push(mdata.fullName)});
              }
              resolve(this.child);
            });
          }
          else {
            resolve(this.child);
          }
        });
      }
      else {
        resolve(this.child);
      }
    });
  }

}