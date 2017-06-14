import create from "./create"
import is from "../is"
import * as operators from "../operators"
import { apply, get, has, defaultTo, pipe } from "../operators"
import resolve from "../resolve"

const pKey = "@@functional/placeholder"

function __(fn, ...args) {
    //const $ = arg => apply(fn, [arg].concat(args))
    const $ = apply(fn, [__].concat(args))

    // $.toString = arg => {
    //     //if (arg && fn.toPrimitive) return fn.toPrimitive(arg)
    //     //if (arg) return `${fn.displayName || fn.name || "(" + fn + ")"}(${arg})`
    //     return fn.toString(arg)
    // }

    //$.fn = fn
    //$.args = args
    if (is.func($)) {
        $[pKey] = true
        $["@@isHandler"] = true
    }

    return $
}

__[pKey] = true
__.toString = a => (a ? "__" + "(" + a + ")" : "__")

function _(i) {
    const $ = (idx, args) => {
        const arg = args[idx]
        console.log(`_`, { i, idx, args, arg })
        return arg
    }
    $.index = i
    $["@@_"] = true
    $[pKey] = true

    return $
}
_[pKey] = true
_.toString = () => "_(i)"

export { _ }
export default __
