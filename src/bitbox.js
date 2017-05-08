import create from "./create"
export { default as observable } from "./observer/observable"
export { default as observe } from "./observer/observe"

/**
 * bitbox(...)
 * Constructor
 * @param  {Array}
 * @return {Function}
 */

function bitbox(...keys) {
    return create(keys)
}

export default bitbox
