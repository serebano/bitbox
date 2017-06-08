import create from "./create"
import is from "../is"
import * as operators from "../operators"
import { get, has, defaultTo } from "../operators"
import resolve from "../resolve"
const pKey = "@@functional/placeholder"

function __(...args) {
    const $ = resolve(args)
    $[pKey] = true
    $.displayName = "(arg) => $(" + args.map(arg => arg.displayName || String(arg)).join(", ") + ")"
    $.toString = () => `function $(value) => $(${args.map(arg => arg.displayName || String(arg)).join(", ")})`

    return $
}
__[pKey] = true
__.toString = () => "__"

__.$ = new Proxy(__, {
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

export default __
