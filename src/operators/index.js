import { observe, observable } from "../observer"
import _curry1 from "../internal/curry1"
import _curry2 from "../internal/curry2"
import invoke from "./invoke"
import print from "./print"
import R from "ramda"

export { default as __ } from "./__"
export { default as delay } from "./delay"
export { default as print } from "./print"
export { default as add } from "./add"
export { default as inc } from "./inc"
export { default as dec } from "./dec"
export { default as pipe } from "./pipe"
export { default as compose } from "./compose"
export { default as prop } from "./prop"
export { default as asProp } from "./asProp"
export { default as ife } from "./ifElse"
export { default as map } from "./map"
export { default as o } from "./o"

export { default as get } from "./get"
export { default as set } from "./set"
export { default as has } from "./has"
export { default as use } from "./use"
export { default as times } from "./times"
export { default as view } from "./view"

export { default as path } from "./path"
export { default as invoke } from "./invoke"
export { default as props } from "./props"
export { default as pluck } from "./pluck"
export { default as toString } from "./toString"

const { bind, assoc, apply, assocPath, project } = R
export { bind, assoc, apply, assocPath, project }

export const log = (...args) => {
    print(args)
    return args[0]
}

export const id = _curry1(function _id(arg) {
    return arg
})

export const obs = _curry2(function(func, target) {
    const obj = observable(target)
    const o = () => func(obj)
    observe(o)
    return obj
})
export const join = invoke(1, "join")
export const push = invoke(1, "push")
export const concat = invoke(1, "concat")
export const filter = invoke(1, "filter")
export const sort = invoke(1, "sort")
export const reduce = invoke(2, "reduce")

export const or = _curry2(function or(a, b) {
    return a || b
})

export const eq = _curry2(function eq(a, b) {
    return a === b
})

export const lt = _curry2(function lt(a, b) {
    return a > b
})
export const gt = _curry2(function gt(a, b) {
    return a < b
})

export const tap = _curry2(function tap(fn, x) {
    fn(x)
    return x
})

export const proxy = _curry2(function proxy(handler, target) {
    return new Proxy(target, handler)
})
export function _toUpper(target) {
    return target.toUpperCase()
}
export const toUpper = _curry1(_toUpper)

export function _toLower(target) {
    return target.toLowerCase()
}
export const toLower = _curry1(_toLower)
export const assign = _curry2((object, target) => Object.assign(target, object))

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
