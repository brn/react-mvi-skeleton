"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.async = async;
/**
 * @fileoverview
 * @author Taketoshi Aono
 */

function async(generator, opt_context) {
  return new Promise(function (resolve, reject) {
    var gen = generator.call(opt_context);

    (function loop(result) {
      var next = gen.next(result);
      if (!next.done) {
        if (next.value && next.value.then) {
          next.value.then(function (result) {
            return loop(result);
          }, function (e) {
            return reject(e);
          });
        } else {
          loop(next.value);
        }
      } else {
        if (next.value && next.value.then) {
          next.value.then(function (result) {
            return resolve(result);
          }, function (e) {
            return reject(e);
          });
        } else {
          resolve(next.value);
        }
      }
    })();
  });
}