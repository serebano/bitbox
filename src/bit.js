import { observable } from "./observer";
import Path from "./path";
import Map from "./map";
import is from "./utils/is";

/**
 *  bit([object, function])
 *
 *  o = bit({count:0,app:{}})
 *  bit(o) === bit(o)
 *  bit(o).app === bit.app(o)
 *  bit(o).count === bit.count(o)
 *
 *  i = bit.count(bit.store, num => num + 1)
 *  i = bit.store.count(obj, num => num + 1)
 */

export default Path(function bit(path, target, value) {
    if (!path.length) {
        // level 0, object and path factory
        if (is.path(target)) return Path.extend(target, value);
        //if (is.function(target)) return Path(target);
        if (arguments.length === 3) return new Map(observable(target), value);

        return observable(target);
    }

    const isSet = arguments.length === 3;

    if (is.path(target)) {
        if (target.$resolve.target) {
            target = target();
        } else {
            return target(object => isSet ? bit(path, object, value) : bit(path, object));
        }
    }

    if (is.function(target)) {
        path.push(...[...arguments].slice(1));

        return path;
    }

    const size = path.length;
    const getValue = arg => is.path(arg) ? arg(target) : arg;

    if (isSet) {
        value = getValue(value);

        return path.reduce(
            (obj, key, index) => {
                if (is.path(key)) key = key(target);
                if (is.function(key)) return obj;

                if (index === size - 1) {
                    obj[key] = getValue(is.function(value) ? value(obj[key]) : value);
                    if (is.undefined(obj[key])) delete obj[key];
                } else if (is.object(obj) && !(key in obj)) {
                    obj[key] = {};
                }

                return obj[key];
            },
            target
        );
    }

    return path.reduce(
        (obj, key, index) => {
            if (is.path(key)) key = key(target);
            if (is.function(key)) return getValue(key(obj));

            return obj[key];
        },
        target
    );
});
