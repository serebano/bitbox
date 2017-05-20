import create from "./create"

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
