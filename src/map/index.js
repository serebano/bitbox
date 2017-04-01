import Compute from "../compute";
import is from "../is";

/**
 *  foo = { count: bit.state.count, name: bit.state.name }
 *  map = bit(target, foo)
 *  box(() => console.log(map.count, map.name))
 *
 *  map.count++
 */

class Map {
    constructor(target, object) {
        if (!is.object(object)) throw new Error(`bit.map argument#1 must be an object`);

        Object.keys(object).reduce(
            (map, key) => {
                if (is.path(object[key]) || is.map(object[key]) || is.compute(object[key]))
                    map[key] = object[key];
                else if (is.array(object[key])) map[key] = new Compute(...object[key]);
                else if (is.object(object[key])) map[key] = new Map(target, object[key]);

                return map;
            },
            this
        );

        return new Proxy(this, {
            get(map, key) {
                if (key === "$") return map;
                if (is.path(map[key])) return map[key](target);
                if (is.compute(map[key])) return map[key].get(target);
                if (is.map(map[key])) return map[key];

                return target[key];
            },
            set(map, key, value) {
                if (is.path(value) || is.map(value) || is.compute(value))
                    return Reflect.set(map, key, value);

                if (Reflect.has(map, key)) {
                    if (is.path(map[key])) map[key](target, value);
                    else target[key] = value;

                    return true;
                }
            }
        });
    }
}

export default Map;
