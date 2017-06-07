import create from "./create"
import is from "../is"
import * as operators from "../operators"
import has from "../operators/has"
import get from "../operators/get"
import apply from "../operators/apply"

import curry from "."

function arg(handler, ...rest) {
    if (is.func(handler)) {
        function $(value, index, args, receiver) {
            console.log(`$ ->`, { handler, value, index, args, receiver })
            return apply(handler, [value].concat(rest))
        }

        $["@@functional/placeholder"] = true
        $.displayName = `$(${handler.displayName || handler.name || handler}, ${rest.map(String)})`

        return $
    }

    return arg.default(handler)
}

arg["@@functional/placeholder"] = true
arg.displayName = "$"

const defaulTo = curry(function defaultTo(d, v) {
    return v == null || v !== v ? d : v
})

arg.default = value => arg(defaulTo(value))

// defaultArg["@@functional/placeholder"] = true
// defaultArg.displayName = `$(${handler})`

export default new Proxy(arg, {
    get(target, key, receiver) {
        if (key in target) {
            return target[key]
        }
        if (has(key, operators)) {
            return (...args) => target(get(key, operators), ...args)
        }
        return target(key) //{ "@@functional/placeholder": true }
    }
})

//export default arg
