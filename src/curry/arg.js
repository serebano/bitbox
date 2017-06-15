import is from "../is"
import { defaultTo } from "../operators"

const key = "@@functional/placeholder"

export default function __(fn, ...args) {
    if (!is.func(fn)) return __(defaultTo(fn))

    const f = args.length ? fn(__, ...args) : fn
    const $ = arg => (is.placeholder(arg) ? __(f(arg)) : f(arg))

    $.toString = (...a) => `${f.toString(...a)}`
    $[key] = true
    $["@@isHandler"] = true

    return $
}

__[key] = true
__.toString = a => a || "__"
