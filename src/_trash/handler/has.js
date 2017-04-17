import { is } from "../utils";

function has(target, key, object) {
    if (is.box(target)) return target(has, key, object);

    return Reflect.has(target, key);
}

export default has;
