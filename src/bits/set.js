import is from "../utils/is";

/**
 * set()
 *
 * set('name', 'bitbox') -> (obj)
 * set.name('bitbox') -> (obj)
 *
 * set.count(count => count + 1) -> (obj)
 *
 * set(bit.name, 'bitbox') -> (obj)
 * bit.name(set('bitbox')) -> (obj)
 */

export function $set(target, key, value) {
    return Reflect.set(target, key, value);
}

export default function set(path, value, obj) {
    return is.path(path) ? path($set, value, obj) : $set;
}
