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
            console.log(`$ ->`, handler, value, rest)
            return apply(handler, [value].concat(rest))
        }

        $["@@functional/placeholder"] = true
        $.toString = () => `${handler.displayName || handler}`

        return $
    }

    return arg.default(handler)
}

arg["@@functional/placeholder"] = true

const defaulTo = curry(function defaultTo(d, v) {
    return v == null || v !== v ? d : v
})

arg.default = value => arg(defaulTo(value))

arg.$ = new Proxy(arg, {
    get(target, key, receiver) {
        if (key in target) {
            return target[key]
        }
        if (has(key, operators)) {
            return (...args) => target(get(key, operators), ...args)
        }
        //return target(key) //{ "@@functional/placeholder": true }
    }
})

export default arg
