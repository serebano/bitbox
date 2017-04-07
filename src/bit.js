import is from "./utils/is";
import Path from "./path";
import Project from "./bits/project";
import Observer from "./observer";
import set from "./bits/set";

/**
 *  bit()
 *
 *  o = bit({count:0,app:{}})
 *  bit(o) === bit(o)
 *  bit(o).app === bit.app(o)
 *  bit(o).count === bit.count(o)
 *
 *  i = bit.count(bit.store, num => num + 1)
 *  i = bit.store.count(obj, num => num + 1)
 */

function bit(path, ...args) {
    const object = is.object(args[args.length - 1]) ? args.pop() : undefined;

    // create observable
    if (!path.length && object) {
        if (args.length === 1 && is.object(args[0]))
            return new Project(Observer.observable(object), args[0]);
        if (args.length === 0) return Observer.observable(object);
    }

    /**
     * $trap(target, key, [...args], object)
     */

    if (args.length) path = path.$push(...args);
    if (!object) return path;

    let parent;

    return Array.from(path).reduce(
        (target, key, index, keys) => {
            key = is.path(key) ? key(object) : key;

            if (is.trap(key)) {
                const result = key(parent, keys[index - 1], keys.splice(index + 1), object);

                return object.execution ? undefined : result;
            }

            if (is.function(key)) return key(target);

            parent = target;

            return target && target[key];
        },
        object
    );
}

export default Path.create(
    Object.assign(bit, {
        toArray() {
            return Array.from(this);
        },
        set(value, object) {
            return this(set, value, object);
        }
    })
);
