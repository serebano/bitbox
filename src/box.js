import is from "./is"
import create from "./create"
import resolve from "./resolve"

/**
 * [GET] box.one({ one: 1 }) -> 1
 * [SET] box.one({ one: 1 }, 2) -> 2
 * [SET] box({ one: 1 }).one++ -> 2
 * [MOD] box(observable, is.observable)({ one: 1 })
 *
 * @param  {Array}
 * @return {Function}
 */

function box(path, target, ...args) {
    if (is.func(target)) {
        return create(box, path.concat(target, ...args))
    }

    return resolve(target, path, ...args)
}

export default create(box)
