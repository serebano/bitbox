import { symbol } from "../bitbox";
import { is } from "../utils";

function resolve(object, path = []) {
    const keys = is.array(path) ? path : Array.from(path);

    if (is.trap(keys[0])) {
        path[symbol.root] = [];
        const [fn, ...args] = path[symbol.keys].splice(0);

        if (fn.name === "resolve") return fn(resolve, object, args);
        if (fn.name === "get") return fn(object);

        throw new Error(`${fn.name} is not valid for root`);
    }

    return keys.reduce(
        (target, key, index) => {
            if (is.array(key)) {
                key = resolve(object, key);
            }
            if (is.object(key)) {
                return target;
            }
            if (is.function(key)) {
                return key(target);
            }

            if (is.trap(keys[index + 1])) {
                const [fn, ...args] = keys.splice(index + 1);

                if (fn.name === "resolve") return fn(resolve, target[key], args);
                if (fn.name === "set") return fn(target, key, args[0], object);

                return fn(target, key, object);
            }

            return Reflect.get(target, key);
        },
        object
    );
}

export default resolve;
