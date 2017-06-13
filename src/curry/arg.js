import create from "./create"
import is from "../is"
import * as operators from "../operators"
import { apply, get, has, defaultTo, pipe } from "../operators"
import resolve from "../resolve"
const pKey = "@@functional/placeholder"

function __(...args) {
    const $ = resolve(args)
    $.args = args
    $["@@isHandler"] = true
    $.toString = () => `${args.map(String).join(", ")}`
    $[pKey] = true

    return $
}
__[pKey] = true
__.toString = () => "__"

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
