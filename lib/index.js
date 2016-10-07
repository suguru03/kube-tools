'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

_.forEach(fs.readdirSync(__dirname), filename => {
  if (filename === 'index.js') {
    return;
  }
  const jsname = path.basename(filename, '.js');
  exports[jsname] = require('./' + filename);
});
