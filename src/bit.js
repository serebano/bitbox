import is from "./utils/is";
import Path from "./path";
import Project from "./bits/project";
import Observer from "./observer";
import setters from "./bits/methods";
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

    let target = object;
    let keys = Array.from(path);

    // create observable
    if (!keys.length) {
        if (arguments.length === 3 && is.object(arguments[1]))
            return new Project(Observer.observable(object), arguments[1]);

        if (arguments.length === 2) return Observer.observable(object);
    }

    if (args.length) {
        if (setters.has(args[0])) {
            path[Path.setter] = [...args];
        } else {
            path = path.$push(...args);
        }
    }

    if (!is.object(object)) {
        return path;
    }

    // setter
    if (path[Path.setter]) {
        const keys = [...path];
        const key = keys.pop();
        let [method, value] = path[Path.setter];

        for (let key of keys) {
            key = is.path(key) ? key(object) : key;
            target = target && key in target ? target[key] : (target = (target[key] = {}));
        }

        const resolved = resolve(target, key, value, object);
        method(target, key, resolved, object);

        //console.log(`${method.name}(%s, %o)`, str, resolved, value);
        return;
    }

    // getter
    let prevTarget;

    return Array.from(path).reduce(
        (target, key, index, keys) => {
            key = is.path(key) ? key(object) : key;
            if (is.function(key)) {
                return key.name.charAt(0) === "$"
                    ? key(prevTarget, keys[index - 1], object)
                    : key(target);
            }

            prevTarget = target;

            return target && target[key];
        },
        object
    );
}

function resolve(target, key, value, obj) {
    if (is.path(value) || is.compute(value)) return value(obj);
    return is.function(value) ? value(Reflect.get(target, key)) : value;
}

export default Path.create(
    Object.assign(bit, {
        setters() {
            return setters;
        },
        keys() {
            return Path.get(this, "keys");
        },
        set(value, obj) {
            return this($set, value, obj);
        }
    })
);
