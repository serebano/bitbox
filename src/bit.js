import { observable, observe } from "./observer";
import Path from "./path";
import Map from "./map";
import box from "./box";
import is from "./is";

/**
 *  bit(object, mapping, listener)
 *
 *  count = bit.state.count.use(count => typeof count !== "number" ? 0 : count)
 *
 *  inc = count.set(count => count + 1)
 *  dec = count.set(count => count - 1)
 *
 *  bit.state.use(state => state.count++)
 *  bit.state.count.box(count => console.log(count))
 *
 *
 *  o = bit({count:0,app:{}})
 *  bit(o) === bit(o)
 *  bit(o).app === bit.app(o)
 *  bit(o).count === bit.count(o)
 *
 *
 * bit({}, {count:bit.count}, map => map.count)
 */

function bit(object, mapping) {
    if (typeof object === "function") return Path(resolve)(...arguments);
    if (arguments.length === 2) return new Map(observable(object), mapping);

    return observable(object);
}

function resolve(path, target, value) {
    if (typeof target === "function") return Path((...args) => target(resolve(...args)), path);
    if (is.path(value)) value = value(target);

    return path.reduce(
        (obj, key, idx, keys) => {
            if (is.path(key)) key = key(target);
            if (keys.length - 1 === idx && arguments.length === 3)
                return (obj[key] = typeof value === "function" ? value(obj[key]) : value);
            return obj[key];
        },
        target
    );
}

export default new Proxy(bit, {
    get(target, key) {
        return Path(resolve, [key]);
    }
});
