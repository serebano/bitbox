import { resolve } from ".";
import { is } from "../";

/**
 * set()
 *
 * state.name(set, 'bitbox')
 * set(state.name, 'bitbox')
 */

export function $set(target, key, args, obj) {
    if (is.path(target)) return target($set, key, args);

    const value = resolve(target, key, args[0], obj);

    return Reflect.set(target, key, value);
}

export function set(path, value, obj) {
    return path($set, value, obj);
}

export default $set;
