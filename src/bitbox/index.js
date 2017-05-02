import create from "./create"
import resolve from "./resolve"
import * as observer from "./observer"
import observable from "./observer/observable"
import * as operators from "../operators"

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
 * operators
 */

export * from "../operators"

export { default as resolve } from "./resolve"
export { default as observable } from "./observer/observable"
export function observe(target, fn) {
    return observer.observe(fn, target)
}

bitbox.observable = observable
bitbox.observe = observe
bitbox.create = create
bitbox.resolve = resolve
bitbox.operators = operators

/* ... */
