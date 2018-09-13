'use strict';
const metadata = require('../utils/metadata');

const reserveMetadata = () => {
  let new_metadata = {};
  Object.keys(metadata)
  .map(key => {
    new_metadata[metadata[key].xmlName] = metadata[key];
    new_metadata[metadata[key].xmlName].key = key;
  });
  return new_metadata;
}

module.exports = reserveMetadata();