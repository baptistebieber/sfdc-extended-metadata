const fs = require('fs');
const path = require('path');

const ensureDirectoryExistence = (filePath) => {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname, 0o755);
}

module.exports = (fileName, xmlContent) => {
  ensureDirectoryExistence(fileName);
  fs.writeFileSync(fileName, xmlContent, {mode: 0o755 });
};