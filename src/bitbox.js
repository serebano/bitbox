import factory from "./factory"

/**
 * bitbox(...) -> box()
 *
 * @param  {Array}
 * @return {Function}
 */

function bitbox(box, ...args) {
    return factory(box, args)
}

export default bitbox
