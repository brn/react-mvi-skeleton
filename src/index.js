/**
 * @fileoverview
 * @author Taketoshi Aono
 */

import "babel-polyfill";
import fs from 'fs-extra';
import readline from 'readline';
import childProcess from 'child_process';
import {
  async
}         from './async';
import {
  exec
} from './exec';
import ejs from 'ejs';
import program from 'commander';


const BASE_PACKAGE_JSON = fs.readFileSync(`${__dirname}/../package.json.base`, 'utf8');
const JSPM_ROOT = fs.readFileSync(`${__dirname}/../jspm.config.js.base`, 'utf8');
const JSPM_BROWSER = fs.readFileSync(`${__dirname}/../jspm.browser.js.base`, 'utf8');
const TS_CONFIG = fs.readFileSync(`${__dirname}/../tsconfig.json.base`, 'utf8');
const INDEX_HTML = fs.readFileSync(`${__dirname}/../index.html.base`, 'utf8');
const GULPFILE = fs.readFileSync(`${__dirname}/../gulpfile.js.base`, 'utf8');
const TYPINGS_JSON_BASE = `${__dirname}/../typings.json.base`;
const IGNORE_BASE = `${__dirname}/../gitignore.base`;
const CERTS_DIR_TEMPLATE = `${__dirname}/../certs_dir_template`;
const PLUGIN_DIR = `${__dirname}/../plugins_dir_template`;
const SRC_DIR = `${__dirname}/../src_dir_template`;


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const {writeFileSync, copySync} = fs;
fs.writeFileSync = (name, content, encode) => {
  if (!program.dryrun) {
    writeFileSync.call(fs, name, content, encode);
  } else {
    console.log(`[DRY-RUN] fs.writeFileSync("${name}", "${content.toString().replace('\n', '\\n').slice(0, 8) + (content.length > 8? '...': '')}", "${encode}")`);
  }
};


fs.copySync = (src, dst) => {
  if (!program.dryrun) {
    copySync.call(fs, src, dst);
  } else {
    console.log(`[DRY-RUN] fs.copySync("${src}", "${dst}")`);
  }
};


const question = (questionMessage, defaultValue, isError, errorMessage, repeat) => {
  return new Promise((resolve, reject) => {
    rl.question(defaultValue? `${questionMessage}(Default ${defaultValue}) `: questionMessage, v => {
      const error = isError(v);
      if (!error || defaultValue) {
        resolve(v || defaultValue);
      } else if (error) {
        if (repeat) {
          question.call(null, questionMessage, defaultValue, isError, errorMessage, repeat).then(resolve, reject);
        } else {
          reject(errorMessage);
        }
      }
    });
  });
};


class Project {
  constructor(name, version, desc, author, license = 'MIT') {
    this.name = name;
    this.version = version;
    this.desc = desc;
    this.author = author;
    this.license = license;
  }
}


const createNpmConfig = () => {
  return async(function *() {
    const name = yield question('Project name: ', null, v => !v, 'Invalid Project name.', true);
    const version = yield question('Project version: ', '1.0.0', v => !v, 'Invalid Project version.', true);
    const desc = yield question('Project description: ', '', v => false);
    const author = yield question('Project author: ', '', v => !v, 'Invalid Author.', true);
    const license = yield question('Project license: ', 'MIT', v => false);
    return {project: new Project(name, version, desc, author, license)};
  }).catch(e => {throw e});
};


const writeConfigs = () => {
  async(function *() {
    const project = yield createNpmConfig();
    fs.writeFileSync('package.json', ejs.render(BASE_PACKAGE_JSON, project), 'utf8');
    fs.writeFileSync('jspm.config.js', ejs.render(JSPM_ROOT, project), 'utf8');
    fs.writeFileSync('jspm.browser.js', ejs.render(JSPM_BROWSER, project), 'utf8');
    fs.writeFileSync('tsconfig.json', TS_CONFIG, 'utf8');
    fs.writeFileSync('index.html', INDEX_HTML, 'utf8');
    fs.copySync(IGNORE_BASE, './.gitignore');
    fs.copySync(PLUGIN_DIR, './plugins');
    fs.copySync(SRC_DIR, './src');
    fs.copySync(CERTS_DIR_TEMPLATE, './certs');
    fs.copySync(TYPINGS_JSON_BASE, './src/typings.json');
    fs.writeFileSync('gulpfile.js', GULPFILE, 'utf8');
    exec('npm install @react-mvi/core @react-mvi/http @react-mvi/event rxjs --save');
    exec('npm install jspm@beta typings express gulp gulp-typescript typescript del gulp-sourcemaps serve-static body-parser --save-dev');
    exec('node node_modules/.bin/jspm install -y rxjs react react-dom ts @react-mvi/core=npm:@react-mvi/core @react-mvi/event=npm:@react-mvi/event @react-mvi/http=npm:@react-mvi/http');
    process.chdir('src');
    exec('node ../node_modules/.bin/typings install');
    process.exit(0);
  }).catch(e => {throw e});
};


export default function init() {
  writeConfigs();
}
