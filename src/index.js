import create from "./bitbox/create"
import resolve from "./bitbox/resolve"
import map from "./bitbox/map"
import observable from "./bitbox/observer/observable"
import observe from "./bitbox/observer/observe"
import construct from "./bitbox/construct"
import mapping from "./bitbox/mapping"

import * as operators from "./operators"
export * from "./operators"

/**
 * bitbox(...)
 * Constructor
 * @param  {Array}
 * @return {Function}
 */

function bitbox(...keys) {
    return create(keys)
}

/**
 * operators
 */

bitbox.create = create
bitbox.resolve = resolve
bitbox.observe = observe
bitbox.observable = observable
bitbox.operators = operators
bitbox.mapping = mapping
bitbox.version = ["bitbox", 1, 2, 32, "@may4"]

function dev(box, operators) {
    typeof window !== "undefined" &&
        Object.assign(window, operators, { box, operators, bitbox }) &&
        console.dir(bitbox)

    const { keys, join } = operators

    return {
        operators: box.operators(target => {
            return keys(target).map(key =>
                String(target[key]).split("{\n").shift().split("function ").pop().trim()
            )
        }),
        version: box.version(join, ".")(print)
    }
}

bitbox(dev).version(Object.assign({}, bitbox))

export default bitbox
/* ... */
