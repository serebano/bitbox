import { observe, observable } from "../observer"
import curry from "../curry"
import invoke from "./invoke"
import print from "./print"
import is from "../is"
import R from "ramda"

export { default as __ } from "./__"
export { default as arg } from "../curry/arg"
export { default as delay } from "./delay"
export { default as print } from "./print"
export { default as add } from "./add"
export { default as inc } from "./inc"
export { default as dec } from "./dec"
export { default as pipe } from "./pipe"
export { default as compose } from "./compose"
export { default as prop } from "./prop"
export { default as ife } from "./ifElse"
export { default as map } from "./map"
export { default as o } from "./o"
export { default as get } from "./get"
export { default as set } from "./set"
export { default as has } from "./has"
export { default as use } from "./use"
export { default as times } from "./times"
export { default as view } from "./view"
export { default as scan } from "./scan"
export { default as nth } from "./nth"
export { default as iis } from "./is"
export { default as last } from "./last"
export { default as invoke } from "./invoke"
export { default as props } from "./props"
export { default as pluck } from "./pluck"
export { default as slice } from "./slice"
export { default as apply } from "./apply"
export { default as toString } from "./toString"
export { default as type } from "./type"
export { default as lens } from "./lens"
export { default as observe } from "./observe"
export { default as tag } from "./template"
export { default as fromPairs } from "./fromPairs"
export { default as drop } from "./drop"
export { default as dropLast } from "./dropLast"
export { default as take } from "./take"

const { assoc, assocPath, project, sort, of, objOf, replace } = R
export { assoc, assocPath, project, sort, of, objOf, replace }

export const assocp = curry(function assoc(path, value, target) {
    return assocPath(path, value, target)
})
export const defaultTo = curry(function defaultTo(d, v) {
    return v == null || v !== v ? d : v
})
export const tap = curry(function tap(fn, x) {
    fn(x)
    return x
})
export const log1 = (...args) => {
    print(args.map(a => (is.func(a) ? a.toString() : a)))
    console.log(args)
    return args[1]
}
export const log = tap(print)
export const id = curry(function _id(arg) {
    return arg
})
export const as = curry(function as(key, value) {
    return {
        [key]: value
    }
})

export const obs = curry(function Observer(func, target) {
    const obj = observable(target)
    const o = () => func(obj)
    observe(o)
    return obj
})

export const join = invoke(["delimiter", "array"], "join")
export const push = invoke(["value", "array"], "push")
export const concat = invoke(["a", "b"], "concat")
export const filter = invoke(["fn", "array"], "filter")
//export const sort = invoke(1, "sort")
export const reduce = invoke(["fn", "initialValue", "array"], "reduce")

const toArray = curry(function toArray(arg) {
    return Array.prototype.slice.call(arg)
})

export const tail = curry(function tail(arg) {
    return Array.prototype.slice.call(arg, 1)
})

export const or = curry(function or(a, b) {
    return a || b
})

export const eq = curry(function eq(a, b) {
    return a === b
})

export const lt = curry(function lt(a, b) {
    return a > b
})
export const gt = curry(function gt(a, b) {
    return a < b
})

export const proxy = curry(function proxy(handler, target) {
    return new Proxy(target, handler)
})

export function _toUpper(target) {
    return target.toUpperCase()
}

export const toUpper = curry(_toUpper)

export function _toLower(target) {
    return target.toLowerCase()
}

export const toLower = curry(_toLower)
export const assign = curry((object, target) => Object.assign(target, object))

//
// export function compute(...args) {
//     return target =>
//         args.reduce((result, arg, idx) => {
//             if (idx === args.length - 1)
//                 return is.box(arg) ? resolve(arg) : is.func(arg) ? arg(result) : arg
//
//             return is.box(arg)
//                 ? [...result, resolve(arg)]
//                 : is.func(arg) ? [...result, arg(...result)] : [...result, arg]
//         }, [])
// }
//
// export function assign(...args) {
//     const op = target => Object.assign(target, ...args)
//     op.displayName = `assign(${args.map(String)})`
//     return op
// }
//
// export function join(separator) {
//     return target => target.join(separator)
// }
//
// export function concat(...args) {
//     return target => target.concat(...args)
// }
//
// export function push(...args) {
//     return target => target.push(...args)
// }
//
// export function pop(target) {
//     return target => target.pop()
// }
//
// export function unshift(...args) {
//     return target => target.unshift(...args)
// }
//
// export function shift(target) {
//     return target => target.shift()
// }
//
// export function slice(...args) {
//     return target => target.slice(...args)
// }
//
// export function splice(...args) {
//     return target => target.splice(...args)
// }
// export function toString(tab = 4) {
//     return JSON.stringify(this, null, tab)
// }
// export function stringify(box, tab = 4) {
//     return target => JSON.stringify(target, null, tab)
// }
//
// export function split(sep) {
//     return target => target.split(sep)
// }

/** ... */

// export function toUpper(target) {
//     return target.toUpperCase()
// }
//
// export function toLower(target) {
//     return target.toLowerCase()
// }
//
// export function keys(target) {
//     return Object.keys(target)
// }
//
// export function toggle(target) {
//     return !target
// }
