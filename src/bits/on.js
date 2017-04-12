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

function $on(target, key, cond, observer, object) {
    if (is.box(target)) return on(...arguments);

    return observe(function() {
        const value = is.undefined(key) ? target : target[key];
        cond(value) && is.box(observer) ? observer(object) : observer(value);
    });
}

function on(box, cond, observer, target) {
    return box($on, cond, observer, target);
}
function factory(box, cond, observer, o) {
    return box(
        function get(target, key, object) {
            return observe(function() {
                const value = is.undefined(key) ? target : target[key];
                cond(value) && is.box(observer) ? observer(object) : observer(value);
            });
        },
        o
    );
}
export default factory;
