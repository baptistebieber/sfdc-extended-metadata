# sfdc-extended-retrieve

[![Build Status](https://travis-ci.org/baptistebieber/sfdc-extended-metadata.svg?branch=master)](https://travis-ci.org/baptistebieber/sfdc-extended-metadata)

Inspired from [sfdc-generate-package](https://github.com/scolladon/sfdc-generate-package) by **Sebastien Colladon**

**/!\ The Gulp Sequence functionality doesn't work /!\\**

`sfdc-extended-retrieve` is a package to add mor functionalities to `jsforce-metadata-tools`.

## Why ?
There are many Salesforce project using versionning. Theses projects used the Metadata API.
It's perfect for classes ou tiggers but not for the CustomObject or CustomLabel because to send to Salesforce we need to tell what information contain the CustomObject.
`sfdc-extended-retrieve` split the metadata to small part of metadata.

## Getting Started

### Installing

```
$ cd /your//repo
$ git clone https://github.com/baptistebieber/sfdc-extended-metadata.git
# Or :
$ wget https://github.com/baptistebieber/sfdc-extended-metadata/archive/master.zip
$ unzip master.zip

# Then :
$ npm install
```

### Tasks prepackaged
```javascript
"scripts": {
  "retrieve": "gulp retrieve",
  "deploy": "gulp deploy",
  "parse-data": "gulp parse-data",
  "compose-data": "gulp compose-data",
  "generate-package": "gulp generate-package"
}
```

* retrieve: Retrieve data from the `SF_SRC + /package.xml` to `SF_TMP`
* deploy: Deploy data from `SF_TMP`
* parse-data: Parse data (split) from `SF_TMP` to `SF_SRC`
* compose-data: Combine data from `SF_SRC` to `SF_TMP`
* generate-package: Generate `package.xml` from `SF_TMP`

## Usage Example

