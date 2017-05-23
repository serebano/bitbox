import is from "../is"
import resolve from "../resolve"
import observe from "../observe"
import print from "./print"

export { default as delay } from "./delay"
export { default as print } from "./print"

export function log(...args) {
    print({ context: this, args })
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
    const op = target => Object.assign(target, ...args)
    op.displayName = `assign(${args.map(String)})`
    return op
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
export function toString(tab = 4) {
    return JSON.stringify(this, null, tab)
}
export function stringify(box, tab = 4) {
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

export function inc(key = "value", value = 0) {
    return function inc() {
        this[key] = !(key in this) ? value + 1 : this[key] + 1
        return this[key]
    }
}

export function dec(key = "value", value = 0) {
    return function dec() {
        this[key] = !(key in this) ? value - 1 : this[key] - 1
        return this[key]
    }
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
