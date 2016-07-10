/**
 * @fileoverview
 * @author Taketoshi Aono
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exec = undefined;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = exports.exec = function exec(cmd) {
  if (_commander2.default.dryrun) {
    console.log('[DRY-RUN] exec ' + cmd);
    return '';
  }
  return _child_process2.default.execSync(cmd, { stdio: 'inherit' });
};