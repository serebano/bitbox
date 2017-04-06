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

export default (path, ...args) => {
    args = is.path(path) ? args : [path].concat(args);

    function set(target, key, obj) {
        target[key] = Object.assign(
            target[key],
            ...args.map(arg => getValue(obj, target[key], arg))
        );
    }

    return is.path(path) ? path(set) : set;
};

function getValue(obj, oldValue, value) {
    return is.path(value) || is.compute(value)
        ? value(obj)
        : is.function(value) ? value(oldValue) : value;
}
