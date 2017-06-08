import create from "./create"
import is from "../is"
import * as operators from "../operators"
import { get, has, apply, defaultTo } from "../operators"
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

    return arg(defaultTo(handler))
}

arg.toString = () => "arg"
arg["@@functional/placeholder"] = true
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
