import create from "./create"
import is from "../is"
import curry from "./curry.x"
import { apply, get, has, defaultTo, pipe } from "../operators"

const pKey = "@@functional/placeholder"

function __(fn, ...args) {
    if (!is.func(fn)) return __(defaultTo(fn))
    const f = args.length ? fn(__, ...args) : fn
    if (!is.func(f)) return f
    const $ = arg => (is.placeholder(arg) ? __(f(arg)) : f(arg))

    $.toString = (...a) => `${f.toString(...a)}`
    $[pKey] = true
    $["@@isHandler"] = true

    return $
}

__[pKey] = true
__.toString = a => (a ? a : "__")

export default __
