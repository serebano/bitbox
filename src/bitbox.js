import is from "./is"
import create from "./create"
import resolve from "./resolve"

/**
 * bitbox(...) -> box()
 *
 * @param  {Array}
 * @return {Function}
 */

function bitbox(box, ...args) {
    return create(box, args)
}

export default bitbox

export const box = create(function box(path, target, ...args) {
    if (is.func(target)) {
        return create(box, path.concat(target, ...args))
    }

    return resolve(target, path, ...args)
})
