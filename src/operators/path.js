import _curry2 from "../internal/curry2"

/**
 * Retrieve the value at a given path.
 *
 * @func
 * @memberOf R
 * @since v0.2.0
 * @category Object
 * @typedefn Idx = String | Int
 * @sig [Idx] -> {a} -> a | Undefined
 * @param {Array} path The path to use.
 * @param {Object} obj The object to retrieve the nested property from.
 * @return {*} The data at `path`.
 * @see R.prop
 * @example
 *
 *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
 *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
 */
export default _curry2(function path(paths, obj) {
    let val = obj
    let idx = 0
    while (idx < paths.length) {
        if (val == null) {
            return
        }
        let key = paths[idx]
        if (Array.isArray(key)) key = path(key, obj)
        else if (typeof key === "function") val = key(val)
        else val = val[key]
        idx += 1
    }
    return val
})
