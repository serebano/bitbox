import { resolve } from ".";
import { is } from "../";

/**
 * set()
 *
 * state.name(set, 'bitbox')
 * set(state.name, 'bitbox')
 */

function set(target, key, value, object) {
    if (is.box(target)) return factory(...arguments);

    Reflect.set(target, key, resolve(target, key, value, object));
}

function factory(box, ...args) {
    return box(set, ...args);
}

export default set;
