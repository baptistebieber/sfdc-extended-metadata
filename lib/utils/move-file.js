const path = require('path');

const saveFile = require('../utils/save-file');

const moveFile = (aFile, inputFolder, outputFolder, options) => {
  if(aFile.type == 'directory' && aFile.children.length > 0) {
    aFile.children.forEach( aChild => {
      moveFile(aChild, inputFolder, outputFolder, options);
    });
  }
  else {
    let relativePath = path.relative(inputFolder, aFile.path);
    saveFile(outputFolder + '/' + relativePath, aFile.content, options);
  }
}

module.exports = moveFile;