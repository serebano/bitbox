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

export default function bitbox(...keys) {
    return create(keys)
}

/**
 * operators
 */

export * from "../operators"

bitbox.observe = function observe(target, fn) {
    return observer.observe(fn, target)
}

bitbox.observable = observable
bitbox.create = create
bitbox.resolve = resolve
bitbox.operators = operators

/* ... */
