'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

(function resolve(dirpath, _exports) {
  _.forEach(fs.readdirSync(dirpath), filename => {
    if (path.extname(filename) === '.js' && filename !== 'index.js') {
      const jsname = path.basename(filename, '.js');
      _exports[jsname] = require('./' + filename);
    }
  });
})(__dirname, exports);
