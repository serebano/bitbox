import { observable } from "./observer";
import Path from "./path";
import Map from "./map";
import is from "./utils/is";

/**
 *  bit(object, mapping)
 *
 *  o = bit({count:0,app:{}})
 *  bit(o) === bit(o)
 *  bit(o).app === bit.app(o)
 *  bit(o).count === bit.count(o)
 *
 *  i = state.count(bit.store, num => num + 10)
 *  i(o)
 */

export default Path(function bit(path, target, value) {
    const size = path.length;
    const isSet = arguments.length === 3;

    if (!size) {
        // level 0, object and path factory
        if (is.path(target)) return Path.extend(target, value);
        if (is.function(target)) return Path(target);
        if (arguments.length === 3) return new Map(observable(target), value);

        return observable(target);
    }

    // target path
    if (is.path(target)) {
        if (target.$resolve.target) {
            return isSet ? bit(path, target(), value) : bit(path, target());
        } else {
            return target(object => isSet ? bit(path, object, value) : bit(path, object));
        }
    }

    if (is.function(target)) {
        const args = [...arguments].slice(1);
        path.push(...args);

        return path;
    }

    if (isSet && is.path(value)) value = value(target);

    return path.reduce(
        (obj, key, idx) => {
            if (is.path(key)) key = key(target);
            if (is.function(key)) {
                if (isSet) return obj;
                const res = key(obj);
                return is.path(res) ? res(target) : res;
            }
            if (isSet) {
                if (idx === size - 1) {
                    let res = typeof value === "function" ? value(obj[key]) : value;
                    res = is.path(res) ? res(target) : res;
                    if (is.undefined(res)) delete obj[key];
                    else obj[key] = res;
                    return obj[key];
                } else {
                    if (is.object(obj) && !(key in obj)) {
                        obj[key] = {};
                    }
                }
            }
            return obj && obj[key];
        },
        target
    );
});
