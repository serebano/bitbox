import { is, toPrimitive } from "../utils";
import map from "./map";

const rootKey = Symbol("bitbox[resolve@root]");

/**
 * bitbox.resolve
 * Resolve target by path
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} trap
 * @param  {Any} args
 * @return {Any}
 */

function resolve(object, path = [], trap, ...args) {
    if (!is.array(path)) {
        throw new Error(`[bitbox.resolve] Path must be typeof array`);
    }

    function reducer(target, key, index, path) {
        key = is.array(key) ? resolve(object, key) : key;

        if (is.box(key)) return key(target);
        if (is.object(key)) return map(key, target);
        if (is.function(key)) return key(target);

        if (trap && (!path.length || index === path.length - 1)) {
            return trap.call(undefined, target, key, ...args);
        }

        if (is.undefined(target)) {
            throw new Error(
                `[bitbox.resolve] Cannot resolve path: [${path.map(toPrimitive)}] (key: ${key}, index: ${index})`
            );
        }

        return Reflect.get(target, key);
    }

    if (!path.length) path = [rootKey];
    else if (trap && trap.name === "set") path = path.filter(is.string);

    return path.reduce(reducer, object);
}

export default resolve;
