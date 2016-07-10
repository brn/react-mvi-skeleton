/**
 * @fileoverview
 * @author Taketoshi Aono
 */


export function async(generator, opt_context) {
  return new Promise((resolve, reject) => {
    let gen = generator.call(opt_context);

    (function loop(result) {
      const next = gen.next(result);
      if (!next.done) {
        if (next.value && next.value.then) {
          next.value.then(result => loop(result), e => reject(e));
        } else {
          loop(next.value);
        }
      } else {
        if (next.value && next.value.then) {
          next.value.then(result => resolve(result), e => reject(e));
        } else {
          resolve(next.value);
        }
      }
    })();
  });
}
