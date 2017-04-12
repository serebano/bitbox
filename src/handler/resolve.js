import { symbol } from "../bitbox";
import { is } from "../utils";

function resolve(object, path = []) {
    const keys = Array.from(path);

    if (is.trap(keys[0])) {
        path[symbol.root] = [];
        const [trap, ...args] = path[symbol.keys].splice(0);
        if (trap.name === "resolve") return trap(resolve, object, args);
        if (trap.name === "get") return trap(object);

        throw new Error(`${trap.name} is not valid for root`);
    }

    return keys.reduce(
        (target, key, index, keys) => {
            if (is.array(key)) key = resolve(object, key);

            if (is.trap(keys[index + 1])) {
                const [fn, ...args] = keys.splice(index + 1);
                if (fn.name === "resolve") return fn(resolve, target[key], args);
                if (fn.name === "set") return fn(target, key, args[0], object);
                return fn(target, key, object);
            }

            if (is.function(key)) {
                return key(
                    is.object(target)
                        ? new Proxy(target, {
                              set(target, key, value) {
                                  return Reflect.set(
                                      target,
                                      key,
                                      is.box(value) ? value(object) : value
                                  );
                              }
                          })
                        : target
                );
            }

            return target && target[key];
        },
        object
    );
}

export default resolve;
