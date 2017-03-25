import { observable } from "./observer";
import Path from "./path";
import Map from "./map";
import box from "./box";

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
 * bit({}, {count:bit.count}, map => map.count)
 */

function bit(object, map, fn) {
    if (arguments.length === 2) return new Map(observable(object), map);
    if (arguments.length === 3) return box(fn, new Map(observable(object), map));
    return observable(object);
}

export default new Proxy(bit, {
    get(target, key) {
        if (Reflect.has(target, key)) return Reflect.get(target, key);

        return Path({}, [key]);
    }
});
