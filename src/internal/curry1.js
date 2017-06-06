import _isPlaceholder from "./isPlaceholder"
import desc from "./desc"

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

export default function _curry1(fn) {
    function f1(a) {
        if (arguments.length === 0 || _isPlaceholder(a)) {
            return f1
        } else {
            return fn.apply(this, arguments)
        }
    }

    return desc(fn, f1, 1)
}
