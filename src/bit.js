import { observable } from "./observer";
import Path from "./path";
import Map from "./map";
import is from "./is";

/**
 *  bit(object, mapping)
 *
 *  o = bit({count:0,app:{}})
 *  bit(o) === bit(o)
 *  bit(o).app === bit.app(o)
 *  bit(o).count === bit.count(o)
 */

export default Path(function bit(path, target, value) {
    if (!path.length) {
        if (arguments.length === 3) return new Map(observable(target), value);

        return observable(target);
    }

    if (is.function(target)) {
        path.push(target);

        return this;
    }

    const isSet = arguments.length === 3;
    const size = path.length - 1;
    if (isSet && is.path(value)) value = value(target);

    return path.reduce(
        (obj, key, idx) => {
            if (is.path(key)) key = key(target);
            if (is.function(key)) return isSet ? obj : key(obj);
            if (idx === size && isSet)
                return (obj[key] = typeof value === "function" ? value(obj[key]) : value);

            return obj[key];
        },
        target
    );
});
