const path = require('path');

const StandardType = require('./standard-type');

module.exports = class ParentDefinitionType extends StandardType {
  
  constructor(child, inputFolder, outputFolder, options) {
    super(child, inputFolder, outputFolder, options);
  }

  toPath() {
    return this.child.members
    .map(elem => 
        this.reversedMetadata[this.child.name].key
        + path.sep
        + elem
        + path.sep
        + elem
        + '.' 
        + this.reversedMetadata[this.child.name].extension
    );
  }

  sanitizePackage(conn) {
    return new Promise((resolve, reject) => {
      this.child.members = [];
      var types = [{type: this.child.name, folder: null}];
      conn.metadata.list(types, this.options.version, (err, res) => {
        if (err) { return reject(err); }
        if(typeof res !== 'undefined') {
          if(!Array.isArray(res)) res = [res];
          res.map(mdata => {this.child.members.push(mdata.fullName)});
        }
        resolve(this.child);
      });
    });
  }

}