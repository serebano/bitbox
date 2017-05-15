import create from "./create"
import resolve from "./resolve"
import observable from "./observer/observable"
import observe from "./observer/observe"
import construct from "./construct"

import mapping from "./mapping"
import map from "./map"
import bitbox from "./bitbox"
import * as operators from "./operators"

import * as api from "./api/map.2"

//export * from "./operators"

/**
 * operators
 */
bitbox.map = map
bitbox.create = create
bitbox.construct = construct
bitbox.resolve = resolve
bitbox.observe = observe
bitbox.observable = observable
bitbox.operators = operators
bitbox.mapping = mapping
bitbox.version = ["bitbox", 1, 2, 32, "@may4"]

function dev(box) {
    typeof window !== "undefined" &&
        Object.assign(window, operators, api, { box, operators, bitbox }) &&
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

bitbox(map(dev)).version(Object.assign({}, bitbox))

export default bitbox
/* ... */
