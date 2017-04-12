import { is } from "../utils";

/**
 * get()
 *
 * state.name(get)
 * get(state.name)
 */

function get(target, key, value, object) {
    if (is.box(target)) return target(get, key);

    return Reflect.get(target, key);
}

export default get;
