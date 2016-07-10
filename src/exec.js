/**
 * @fileoverview
 * @author Taketoshi Aono
 */


'use strict';


import program from 'commander';
import childProcess from 'child_process';


export const exec = (cmd) => {
  if (program.dryrun) {
    console.log(`[DRY-RUN] exec ${cmd}`);
    return '';
  }
  return childProcess.execSync(cmd, {stdio: 'inherit'});
};
