import { is } from "../";

function resolve(target, key, value, obj) {
    if (is.path(value) || is.compute(value)) return value(obj);
    return is.function(value) ? value(Reflect.get(target, key)) : value;
}

export default resolve;
