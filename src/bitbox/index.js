import create from "./create"
import resolve from "./resolve"
import map from "./map"
import observable from "./observer/observable"
import observe from "./observer/observe"
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

bitbox.map = map
bitbox.observable = observable
bitbox.observe = observe
bitbox.create = create
bitbox.operators = operators

/* ... */
