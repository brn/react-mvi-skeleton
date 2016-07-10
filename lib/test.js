'use strict';

require('babel-polyfill');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _async = require('./async');

var _exec = require('./exec');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview
 * @author Taketoshi Aono
 */

(function () {
  (0, _exec.exec)('npm pack');
  process.chdir('test');
  try {
    console.log('Remove node_modules.');
    _fsExtra2.default.removeSync('./node_modules');
  } catch (e) {}
  try {
    console.log('Remove test-project.');
    _fsExtra2.default.removeSync('test-project');
  } catch (e) {}
  console.log('Install react-mvi/skelton');
  (0, _exec.exec)('npm install ../react-mvi-skelton-0.0.1.tgz');
  console.log('Create test-project');
  _fsExtra2.default.mkdirSync('test-project');
  process.chdir('test-project');
  (0, _exec.exec)('node ../node_modules/.bin/rmvi init');
  process.exit(0);
})();