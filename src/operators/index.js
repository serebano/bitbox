import is from "./is"
import resolve from "../bitbox/resolve"

export { is }
export { default as box } from "../bitbox/box"
export { default as map } from "../bitbox/map"
export { default as create } from "../bitbox/create"
export { default as resolve } from "../bitbox/resolve"
export { default as observe } from "../bitbox/observer/observe"
export { default as observable } from "../bitbox/observer/observable"
export { default as delay } from "./delay"
export { default as print } from "./print"

export function action(box) {
    return target => (...args) => box(target, ...args)
}

export function set(box, value) {
    return target => box(target, value)
}

export function proxy(handler) {
    return target => new Proxy(target, handler)
}

export function compute(...args) {
    return target =>
        args.reduce((result, arg, idx) => {
            if (idx === args.length - 1)
                return is.box(arg) ? resolve(arg) : is.func(arg) ? arg(result) : arg

            return is.box(arg)
                ? [...result, resolve(arg)]
                : is.func(arg) ? [...result, arg(...result)] : [...result, arg]
        }, [])
}

export function assign(...args) {
    return target => Object.assign(...args)
}

export function join(separator) {
    return target => target.join(separator)
}

export function concat(...args) {
    return target => target.concat(...args)
}

export function push(...args) {
    return target => target.push(...args)
}

export function pop(target) {
    return target => target.pop()
}

export function unshift(...args) {
    return target => target.unshift(...args)
}

export function shift(target) {
    return target => target.shift()
}

export function slice(...args) {
    return target => target.slice(...args)
}

export function splice(...args) {
    return target => target.splice(...args)
}

export function stringify(tab = 4) {
    return target => JSON.stringify(target, null, tab)
}

export function split(sep) {
    return target => target.split(sep)
}

/** ... */

export function toUpper(target) {
    return target.toUpperCase()
}

export function toLower(target) {
    return target.toLowerCase()
}

export function keys(target) {
    return Object.keys(target)
}

export function inc(target) {
    return target + 1
}

export function dec(target) {
    return target - 1
}

export function toggle(target) {
    return !target
}

export function eq(value) {
    return target => target === value
}

export function gt(value) {
    return target => target > value
}

export function lt(value) {
    return target => target < value
}
