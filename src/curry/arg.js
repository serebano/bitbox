import create from "./create"
import is from "../is"
import * as operators from "../operators"
import has from "../operators/has"
import get from "../operators/get"
import apply from "../operators/apply"
import curry from "."

function arg(handler, ...args) {
    if (is.func(handler)) {
        function $(value) {
            const result = apply(handler, args.concat(value))
            console.log(`$ ->`, handler, value, result)
            return result
        }

        $["@@functional/placeholder"] = true
        $.isHandler = true
        $.displayName = handler.displayName
        $.toString = () => `${handler.displayName || handler}`

        return $
    }

    return arg(defaulTo(handler))
}
arg.toString = () => "arg"
arg["@@functional/placeholder"] = true

const defaulTo = curry(function defaultTo(d, v) {
    return v == null || v !== v ? d : v
})

arg.default = defaulTo
// d =>
//     function defaultTo(v) {
//         return v == null || v !== v ? d : v
//     }, d)

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
