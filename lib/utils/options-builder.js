const envalid = require('envalid');
const { str, url, bool, num } = envalid;

const env = envalid.cleanEnv(process.env, {
  SF_VERSION:         str(),
  SF_USERNAME:        str(),
  SF_PASSWORD:        str(),
  SF_SERVERURL:       url(),
  SF_SRC_PATH:        str(),
  SF_TMP_PATH:        str(),
})

module.exports = {
  'username': env.SF_USERNAME,
  'password': env.SF_PASSWORD,
  'loginUrl': env.SF_SERVERURL,
  'version': env.SF_VERSION,
  'src' : env.SF_SRC_PATH,
  'tmp' : env.SF_TMP_PATH,
  'pollTimeout': env.SF_POLLTIMEOUT || 5000*1000,
  'pollInterval': env.SF_POLLINTERVAL || 10*1000,
  'singlePackage' : env.SF_SINGLEPACKAGE || true,
  'verbose' : env.SF_VERBOSE || true,
  'indent': ' '.repeat(env.XML_INDENT || 4)
};
