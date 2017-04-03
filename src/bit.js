import { observable } from "./observer";
import Path, { extend, resolve } from "./path";
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
    // level 0, object and path factory
    if (!path.length) {
        if (is.path(target)) return extend(target, value);
        if (is.object(target) || is.undefined(target))
            return arguments.length === 3 ? new Map(observable(target), value) : observable(target);
    }

    const isSet = arguments.length === 3;

    if (is.path(target)) return target(obj => isSet ? bit(path, obj, value) : bit(path, obj));
    if (is.promise(target)) return target.then(result => bit(path, result));
    if (is.function(target)) return Path(bit, path.concat([...arguments].slice(1)));

    if (isSet) {
        value = resolve(value, target);

        if (is.promise(value)) {
            return value.then(result => {
                return bit(path, target, result);
            });
        }

        const keys = path.filter(p => is.path(p) || is.compute(p) || !is.function(p));
        const keyIndex = keys.length - 1;
        const reducers = is.function(value)
            ? path.filter(p => is.function(p) && keys.indexOf(p) === -1)
            : [];
        const reduce = value => reducers.reduce((value, reducer) => reducer(value), value);

        return keys.reduce(
            (obj, key, index) => {
                if (is.path(key) || is.compute(key)) key = key(target);
                if (index === keyIndex) {
                    obj[key] = is.function(value)
                        ? resolve(value(reduce(obj[key])), target)
                        : value;
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
            if (is.path(key) || is.compute(key)) key = key(target);
            if (is.function(key)) return resolve(key(obj), target);

            return obj && obj[key];
        },
        target
    );
});
