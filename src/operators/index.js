import is from "../is"
import resolve from "../resolve"
import { observe } from "../observer"
import print from "./print"
import _curry1 from "../internal/curry1"
import _curry2 from "../internal/curry2"
import invoke from "./invoke"

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
export { default as bx } from "./bx"

export { default as path } from "./path"
export { default as invoke } from "./invoke"
export { default as props } from "./props"
export { default as pluck } from "./pluck"
export { default as toString } from "./toString"

export const id = _curry1(function _id(arg) {
    return arg
})

export const obs = _curry2(function(func, target) {
    const o = () => func(target, o)
    o.toString = () => `function ${func.displayName || func.name} (target) {}`

    return observe(o)
})
export const join = invoke(1, "join")
export const or = _curry2(function or(a, b) {
    return a || b
})

export const eq = _curry2(function eq(a, b) {
    return a === b
})

export const lt = _curry2(function lt(a, b) {
    return a < b
})
export const gt = _curry2(function gt(a, b) {
    return a > b
})

export const tap = _curry2(function tap(fn, x) {
    fn(x)
    return x
})

export const proxy = _curry2(function proxy(handler, target) {
    return new Proxy(target, handler)
})
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
