import is from "../is"

const key = "@@functional/placeholder"
__[key] = true

export default function __(fn, ...args) {
    if (!is.func(fn)) return __(v => (v == null || v !== v ? fn : v))

    const $ = arg => (is.placeholder(arg) ? __(fn(arg, ...args)) : fn(arg, ...args))
    $[key] = true
    $["@@isHandler"] = true
    $.target = [fn, args]
    $.__ = arg => __(fn(arg, ...args))

    return $
}

//use(set, [__(toString), add])('x', 1, obj)
