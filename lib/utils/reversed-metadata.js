'use strict';
const metadata = require('../utils/metadata');

const reserveMetadata = () => {
  let new_metadata = {};
  Object.keys(metadata)
  .map(key => {
    new_metadata[metadata[key].xmlName] = metadata[key];
    new_metadata[metadata[key].xmlName].key = key;
    if(new_metadata[metadata[key].xmlName].hasOwnProperty('children') && Object.keys(new_metadata[metadata[key].xmlName].children).length > 0) {
      Object.keys(new_metadata[metadata[key].xmlName].children)
      .map(child => {
        new_metadata[metadata[key].children[child].xmlName] = metadata[key].children[child];
        new_metadata[metadata[key].children[child].xmlName].key = child;
        new_metadata[metadata[key].children[child].xmlName].parent = metadata[key];;
      });
    }
  });
  return new_metadata;
}

module.exports = reserveMetadata();