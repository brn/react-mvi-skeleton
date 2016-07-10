#!/usr/bin/env node
'use strict';

/**
 * @fileoverview
 * @author Taketoshi Aono
 */

var program = require('commander');

program
  .option('-d, --dryrun', 'Dry run program.')
  .parse(process.argv);

require('./lib/index')['default']();
