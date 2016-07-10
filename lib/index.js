'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

require('babel-polyfill');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _async = require('./async');

var _exec = require('./exec');

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * @fileoverview
                                                                                                                                                           * @author Taketoshi Aono
                                                                                                                                                           */

var BASE_PACKAGE_JSON = _fsExtra2.default.readFileSync(__dirname + '/../package.json.base', 'utf8');
var JSPM_ROOT = _fsExtra2.default.readFileSync(__dirname + '/../jspm.config.js.base', 'utf8');
var JSPM_BROWSER = _fsExtra2.default.readFileSync(__dirname + '/../jspm.browser.js.base', 'utf8');
var TS_CONFIG = _fsExtra2.default.readFileSync(__dirname + '/../tsconfig.json.base', 'utf8');
var INDEX_HTML = _fsExtra2.default.readFileSync(__dirname + '/../index.html.base', 'utf8');
var GULPFILE = _fsExtra2.default.readFileSync(__dirname + '/../gulpfile.js.base', 'utf8');
var TYPINGS_JSON_BASE = __dirname + '/../typings.json.base';
var IGNORE_BASE = __dirname + '/../gitignore.base';
var CERTS_DIR_TEMPLATE = __dirname + '/../certs_dir_template';
var PLUGIN_DIR = __dirname + '/../plugins_dir_template';
var SRC_DIR = __dirname + '/../src_dir_template';

var rl = _readline2.default.createInterface({
  input: process.stdin,
  output: process.stdout
});

var writeFileSync = _fsExtra2.default.writeFileSync;
var copySync = _fsExtra2.default.copySync;

_fsExtra2.default.writeFileSync = function (name, content, encode) {
  if (!_commander2.default.dryrun) {
    writeFileSync.call(_fsExtra2.default, name, content, encode);
  } else {
    console.log('[DRY-RUN] fs.writeFileSync("' + name + '", "' + (content.toString().replace('\n', '\\n').slice(0, 8) + (content.length > 8 ? '...' : '')) + '", "' + encode + '")');
  }
};

_fsExtra2.default.copySync = function (src, dst) {
  if (!_commander2.default.dryrun) {
    copySync.call(_fsExtra2.default, src, dst);
  } else {
    console.log('[DRY-RUN] fs.copySync("' + src + '", "' + dst + '")');
  }
};

var question = function question(questionMessage, defaultValue, isError, errorMessage, repeat) {
  return new Promise(function (resolve, reject) {
    rl.question(defaultValue ? questionMessage + '(Default ' + defaultValue + ') ' : questionMessage, function (v) {
      var error = isError(v);
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

var Project = function Project(name, version, desc, author) {
  var license = arguments.length <= 4 || arguments[4] === undefined ? 'MIT' : arguments[4];

  _classCallCheck(this, Project);

  this.name = name;
  this.version = version;
  this.desc = desc;
  this.author = author;
  this.license = license;
};

var createNpmConfig = function createNpmConfig() {
  return (0, _async.async)(regeneratorRuntime.mark(function _callee() {
    var name, version, desc, author, license;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return question('Project name: ', null, function (v) {
              return !v;
            }, 'Invalid Project name.', true);

          case 2:
            name = _context.sent;
            _context.next = 5;
            return question('Project version: ', '1.0.0', function (v) {
              return !v;
            }, 'Invalid Project version.', true);

          case 5:
            version = _context.sent;
            _context.next = 8;
            return question('Project description: ', '', function (v) {
              return false;
            });

          case 8:
            desc = _context.sent;
            _context.next = 11;
            return question('Project author: ', '', function (v) {
              return !v;
            }, 'Invalid Author.', true);

          case 11:
            author = _context.sent;
            _context.next = 14;
            return question('Project license: ', 'MIT', function (v) {
              return false;
            });

          case 14:
            license = _context.sent;
            return _context.abrupt('return', { project: new Project(name, version, desc, author, license) });

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })).catch(function (e) {
    throw e;
  });
};

var writeConfigs = function writeConfigs() {
  (0, _async.async)(regeneratorRuntime.mark(function _callee2() {
    var project;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return createNpmConfig();

          case 2:
            project = _context2.sent;

            _fsExtra2.default.writeFileSync('package.json', _ejs2.default.render(BASE_PACKAGE_JSON, project), 'utf8');
            _fsExtra2.default.writeFileSync('jspm.config.js', _ejs2.default.render(JSPM_ROOT, project), 'utf8');
            _fsExtra2.default.writeFileSync('jspm.browser.js', _ejs2.default.render(JSPM_BROWSER, project), 'utf8');
            _fsExtra2.default.writeFileSync('tsconfig.json', TS_CONFIG, 'utf8');
            _fsExtra2.default.writeFileSync('index.html', INDEX_HTML, 'utf8');
            _fsExtra2.default.copySync(IGNORE_BASE, './.gitignore');
            _fsExtra2.default.copySync(PLUGIN_DIR, './plugins');
            _fsExtra2.default.copySync(SRC_DIR, './src');
            _fsExtra2.default.copySync(CERTS_DIR_TEMPLATE, './certs');
            _fsExtra2.default.copySync(TYPINGS_JSON_BASE, './src/typings.json');
            _fsExtra2.default.writeFileSync('gulpfile.js', GULPFILE, 'utf8');
            (0, _exec.exec)('npm install @react-mvi/core @react-mvi/http @react-mvi/event rxjs --save');
            (0, _exec.exec)('npm install jspm@beta typings express gulp gulp-typescript typescript del gulp-sourcemaps serve-static body-parser --save-dev');
            (0, _exec.exec)('node node_modules/.bin/jspm install -y rxjs react react-dom ts @react-mvi/core=npm:@react-mvi/core @react-mvi/event=npm:@react-mvi/event @react-mvi/http=npm:@react-mvi/http');
            process.chdir('src');
            (0, _exec.exec)('node ../node_modules/.bin/typings install');
            process.exit(0);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })).catch(function (e) {
    throw e;
  });
};

function init() {
  writeConfigs();
}