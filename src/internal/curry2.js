import _curry1 from "./curry1"
import _isPlaceholder from "./isPlaceholder"

/**
 * Optimized internal two-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

export default function _curry2(fn) {
    function f2(a, b) {
        switch (arguments.length) {
            case 0:
                return f2
            case 1:
                return _isPlaceholder(a)
                    ? f2
                    : _curry1(function(_b) {
                          return fn(a, _b)
                      })
            default:
                return _isPlaceholder(a) && _isPlaceholder(b)
                    ? f2
                    : _isPlaceholder(a)
                          ? _curry1(function(_a) {
                                return fn(_a, b)
                            })
                          : _isPlaceholder(b)
                                ? _curry1(function(_b) {
                                      return fn(a, _b)
                                  })
                                : fn(a, b)
        }
    }

    f2.displayName = fn.displayName || fn.name

    return f2
}
