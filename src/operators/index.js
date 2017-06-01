import is from "../is"
import resolve from "../resolve"
import { observe } from "../observer"
import print from "./print"
import _curry2 from "../internal/curry2"

export { default as delay } from "./delay"
export { default as print } from "./print"
export { default as add } from "./add"
export { default as inc } from "./inc"
export { default as dec } from "./dec"
export { default as prop } from "./prop"
export { default as props } from "./props"

export const o = _curry2((o, t) => observe(() => o(t)) && t)

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
