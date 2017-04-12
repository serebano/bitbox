import { is } from "../utils";

/**
 * set()
 *
 * state.name(set, 'bitbox')
 * set(state.name, 'bitbox')
 */

function set(target, key, value, object) {
    if (is.box(target)) return target(set, key, value);

    const resolved = is.box(value) || is.compute(value)
        ? value(object)
        : is.function(value) && !(value.resolve === false)
              ? value(Reflect.get(target, key))
              : value;

    Reflect.set(target, key, resolved);
}

export default set;
