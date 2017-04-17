import { is } from "../utils";

function unset(target, key, object) {
    if (is.box(target)) return target(unset, key);

    return Reflect.deleteProperty(target, key);
}

export default unset;
