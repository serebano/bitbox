import create from "./create"
import resolve from "./resolve"
import observe from "./observer/observe"
import observable from "./observer/observable"

/**
 * bitbox
 * Create new box
 * @param  {Array}
 * @return {Function}
 */

export default function bitbox() {
    return create(arguments)
}

/**
 * factories
 */

export * from "./factories"

export { default as resolve } from "./resolve"
export { default as observable } from "./observer/observable"
export { default as observe } from "./observer/observe"

bitbox.observable = observable
bitbox.observe = observe

/* ... */
