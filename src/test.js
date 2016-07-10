/**
 * @fileoverview
 * @author Taketoshi Aono
 */


import "babel-polyfill";
import fs from 'fs-extra';
import {async} from './async';
import {exec} from './exec';


(function () {
  exec('npm pack');
  process.chdir('test');
  try {
    console.log('Remove node_modules.');
    fs.removeSync('./node_modules');
  } catch(e) {}
  try {
    console.log('Remove test-project.');
    fs.removeSync('test-project');
  } catch(e) {}
  console.log('Install react-mvi/skelton');
  exec('npm install ../react-mvi-skelton-0.0.1.tgz');
  console.log('Create test-project');
  fs.mkdirSync('test-project');
  process.chdir('test-project');
  exec('node ../node_modules/.bin/rmvi init');
  process.exit(0);
})();

