import { bit, is } from "./bitbox";
import { observe } from "./observer";

function box(fn, arg, object) {
    if (is.map(arg)) return observe(map => fn(Object.assign({}, map)), null, arg);
    if (is.bit(arg)) return observe(obj => fn(Object.assign({}, obj)), null, arg);

    if (is.path(arg) || is.compute(arg)) {
        if (!object) return object => observe(path => fn(path.get(object)), null, arg);
        return observe(path => fn(path.get(object)), null, arg);
    }

    if (arg) return observe(map => fn(Object.assign({}, map)), null, bit(object, arg));

    return observe(fn);
}

export default box;
