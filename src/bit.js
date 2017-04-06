import is from "./utils/is";
import Path from "./path";
import Project from "./bits/project";
import Observer from "./observer";
import { $set } from "./bits/set";

/**
 *  bit(object)
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

    let [method, value] = args;
    let target = object;
    let keys = Array.from(path);

    // create observable
    if (!keys.length) {
        if (arguments.length === 3 && is.object(arguments[1]))
            return new Project(Observer.observable(object), arguments[1]);

        if (arguments.length === 2) return Observer.observable(object);
    }

    if (args.length) {
        if (method === $set) {
            path.$args = [...args];
        } else {
            path = path.$push(...args);
        }
    }

    if (!is.object(object)) return path;

    // setter
    if (is.function(method) && method === $set) {
        const key = path.$pop();

        for (let key of path) {
            key = is.path(key) ? key(object) : key;
            target = target && key in target ? target[key] : (target = (target[key] = {}));
        }

        method(target, key, resolve(target, key, value, object), object);
        return;
    }

    // getter
    for (let key of path) {
        key = is.path(key) ? key(object) : key;
        target = is.function(key) ? key(target) : target[key];
    }

    return target;
}

function resolve(target, key, value, obj) {
    if (is.path(value) || is.compute(value)) return value(obj);
    return is.function(value) ? value(Reflect.get(target, key)) : value;
}

export default Path.create(
    Object.assign(bit, {
        keys() {
            return Path.get(this, "keys");
        },
        set(value, obj) {
            return this($set, value, obj);
        }
    })
);
