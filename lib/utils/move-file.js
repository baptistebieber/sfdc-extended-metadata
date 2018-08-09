const path = require('path');

const saveFile = require('../utils/save-file');

const moveFile = (aFile, inputFolder, outputFolder) => {
  if(aFile.type == 'directory' && aFile.children.length > 0) {
    aFile.children.forEach( aChild => {
      moveFile(aChild, inputFolder, outputFolder);
    });
  }
  else {
    let relativePath = path.relative(inputFolder, aFile.path);
    saveFile(outputFolder + '/' + relativePath, aFile.content);
  }
}

module.exports = moveFile;