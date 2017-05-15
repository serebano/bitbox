import create from "./create"

export { default as observable } from "./observer/observable"
export { default as observe } from "./observer/observe"
export { default as construct } from "./construct"
export { default as resolve } from "./resolve"
export { default as create } from "./create"
export { default as map } from "./map"

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
