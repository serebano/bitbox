import compute from "../compute";
import is from "../utils/is";

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

        const mapping = Object.keys(object).reduce(
            (map, key) => {
                if (is.map(object[key]) || is.compute(object[key]) || is.path(object[key]))
                    map[key] = object[key];
                else if (is.array(object[key])) map[key] = compute(...object[key]);
                else if (is.object(object[key])) map[key] = new Map(target, object[key]);

                return map;
            },
            this
        );

        return new Proxy(mapping, {
            get(map, key, receiver) {
                const res = Reflect.get(map, key, receiver);
                //const o = Object.assign({}, target, { props });

                if (key === "$") return map;
                if (is.map(res)) return res;
                if (is.path(res)) return res(target);
                if (is.compute(res)) return res(target);

                return res;
            }
            // set(map, key, value) {
            //     if (is.map(value) || is.compute(value) || is.path(value))
            //         return Reflect.set(map, key, value);
            //
            //     if (Reflect.has(map, key)) {
            //         if (is.path(map[key])) map[key](target, value);
            //         //else target[key] = value;
            //
            //         return true;
            //     }
            // }
        });
    }
}

export default Map;
