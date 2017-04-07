import { is } from "../";
import { observe } from "../observer";

/**
 * on()
 * @param  {Path} path
 * @param  {Function} cond
 * @param  {Function} observer
 * @param  {Object} object
 * @return {Object} observer
 *
 * on(state.count, gt(3), console.log, object)
 * on(state.count, gt(6), set(state.name, state.count(c => `The count is: ${c}`)), object)
 */

function $observe(target, key, [cond, observer], object) {
    const fn = is.path(observer) ? () => observer(object) : () => observer(target[key]);

    return observe(function on() {
        return cond(target[key]) && fn();
    });
}

function on(path, cond, observer, object) {
    return path($observe, cond, observer, object);
}

export default on;
