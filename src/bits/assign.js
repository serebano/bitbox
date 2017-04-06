import is from "../utils/is";

/**
 * assign()
 * @param  {Array} args
 * @return {Object}
 *
 * assign({name: 'bitbox'}) -> (obj)
 *
 * assign(bit.state, {name: 'bitbox'}) -> (obj)
 * bit.state(assign({name: 'bitbox'})) -> (obj)
 */

export function $assign(target, key, args, obj) {
    return Reflect.set(
        target,
        key,
        Object.assign(target[key], ...args.map(arg => getValue(obj, target[key], arg)))
    );
}

export default (path, ...args) => {
    return is.path(path) ? path($assign, args) : $assign;
};

function getValue(obj, oldValue, value) {
    return is.path(value) || is.compute(value)
        ? value(obj)
        : is.function(value) ? value(oldValue) : value;
}
