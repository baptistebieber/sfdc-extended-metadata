# sfdc-extended-metadata

[![Build Status](https://travis-ci.org/baptistebieber/sfdc-extended-metadata.svg?branch=master)](https://travis-ci.org/baptistebieber/sfdc-extended-metadata)

Inspired from [sfdc-generate-package](https://github.com/scolladon/sfdc-generate-package) by **Sebastien Colladon**

**/!\ It is a bêta version /!\\**
**/!\ The Gulp Sequence functionality doesn't work /!\\**

`sfdc-extended-metadata` is a package to add mor functionalities to `jsforce-metadata-tools`.


## Why ?
There are many Salesforce project using versionning. Theses projects used the Metadata API.
It's perfect for classes ou tiggers but not for the CustomObject or CustomLabel because to send to Salesforce we need to tell what information contain the CustomObject.
`sfdc-extended-metadata` split the metadata to small part of metadata.


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

* retrieve: Retrieve data from the `SF_SRC + /package.xml` (or from a file passed using relative path with the option `-p` or `-package`) to `SF_TMP`
* deploy: Deploy data from `SF_TMP`
* parse-data: Parse data (split) from `SF_TMP` to `SF_SRC`
* compose-data: Combine data from `SF_SRC` to `SF_TMP`
* generate-package: Generate `package.xml` from `SF_TMP`


## Usage Example

### Retrieve data and parse
You need to have the file `package.xml` into the SRC folder.
Then:
```
$ gulp retrieve
$ gulp parse-data
```

### After having done modifications: deploy
```
$ gulp compose-data
$ gulp generate-package
$ gulp deploy
```

### Retrieve data from a specific package
You need to have the file `./package-perso.xml` into the SRC folder.
Then:
```
$ gulp retrieve -p ./package-perso.xml
```


## Configuration
copy the .env_sample file to a .env file in the root directory.
It contains the definition of each required parameters with aen example value.
Here is what each line is used for and where:

**SF_VERSION**
Used for: defining the Salesforce API version used
Type of value: float one decimal precision (ex: 43.0)
Used in:
* retrieve
* deploy
* generate-package

**SF_USERNAME**
Used for: connecting to Salesforce
Type of value: string email format
Used in:
* retrieve
* deploy

**SF_PASSWORD**
Used for: connecting to Salesforce. Combine Password + Token
Type of value: string
Used in:
* retrieve
* deploy

**SF_SERVERURL**
Used for: connecting to Salesforce
Type of value: string url format
Used in:
* retrieve
* deploy

**SF_SRC_PATH**
Used for: defining the path to the src folder
Type of value: string absolute or relative path from this folder
Used in:
* retrieve
* deploy
* generate-package
* parse-data
* compose-data

**SF_TMP_PATH**
Used for: defining the path to the temporary folder
Type of value: string absolute or relative path from this folder
Used in:
* retrieve
* deploy
* generate-package
* parse-data
* compose-data

Here is the list of optional parameters with their default value :
* SF_VERBOSE : (boolean) used in deploy. Default: true


## Built With

* [archiver](https://github.com/archiverjs/node-archiver) - A streaming interface for archive generation.
* [decompress](https://github.com/kevva/decompress) - Extracting archives made easy.
* [directory-tree](https://github.com/mihneadb/node-directory-tree) - Creates a JavaScript object representing a directory tree.
* [envalid](https://github.com/af/envalid) - Environment variable validation for Node.js.
* [fancy-log](https://github.com/js-cli/fancy-log) - Log things, prefixed with a timestamp.
* [gulp](https://github.com/gulpjs/gulp) - The streaming build system.
* [gulp-jsforce-exec-anon](https://github.com/scolladon/gulp-jsforce-exec-anon) - Execute anonymous using JSforce.
* [gulp-load-plugins](https://github.com/jackfranklin/gulp-load-plugins) - Automatically load in gulp plugins.
* [gulp-rename](https://github.com/hparra/gulp-rename) - Rename files easily.
* [gulp-sequence](https://github.com/teambition/gulp-sequence) - Run a series of gulp tasks in order.
* [gulp-zip](https://github.com/sindresorhus/gulp-zip) - ZIP compress files.
* [jsforce-metadata-tools](https://github.com/jsforce/jsforce-metadata-tools) - Tools for deploying/retrieving package files using Metadata API via JSforce.
* [merge](https://github.com/yeikos/js.merge) - Merge multiple objects into one.
* [plugin-error](https://github.com/gulpjs/plugin-error) - Error handling for Vinyl plugins.
* [fs-extra](https://github.com/jprichardson/node-fs-extra) - extra methods for the fs object like copy(), remove(), mkdirs().
* [sfdc-generate-package](https://github.com/scolladon/sfdc-generate-package) - Generation of the package.xml
* [through2](https://github.com/rvagg/through2) - A tiny wrapper around Node streams.
* [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) - Simple XML to JavaScript object converter.
* [xmlbuilder](https://github.com/oozcitak/xmlbuilder-js) - An XML builder for node.js similar to java-xmlbuilder.


## Versioning

[SemVer](http://semver.org/) is used for versioning.


## Authors

* **Baptiste Bieber** - *Initial work* - [baptistebieber](https://github.com/baptistebieber)


## Special Thanks

* **Sebastien Colladon** - *Base of the structure* - [scolladon](https://github.com/scolladon)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
