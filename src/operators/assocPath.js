import isNil from "./isNil"
import curry from "../curry"
import assoc from "./assoc"
import has from "./has"
import is from "../is"

/**
 *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
 *
 *      // Any missing or non-object keys in path will be overridden
 *      R.assocPath(['a', 'b', 'c'], 42, {a: 5}); //=> {a: {b: {c: 42}}}
 */
export default curry(function assocPath(path, val, obj) {
    if (path.length === 0) {
        return val
    }
    var idx = path[0]
    if (path.length > 1) {
        var nextObj = !isNil(obj) && has(idx, obj) ? obj[idx] : is.integer(path[1]) ? [] : {}
        val = assocPath(Array.prototype.slice.call(path, 1), val, nextObj)
    }
    if (is.integer(idx) && is.array(obj)) {
        var arr = [].concat(obj)
        arr[idx] = val
        return arr
    } else {
        return assoc(idx, val, obj)
    }
})
