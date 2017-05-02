import Mapping from "../bitbox/mapping"
import resolve from "../bitbox/resolve"
import { is } from "../utils"

export { default as delay } from "./delay"
export { default as print } from "./print"

proxy.args = [[`target`, is.object], [`handler`, is.object, is.undefined]]

export function proxy(target, handler) {
    return new Proxy(target, handler)
}

map.args = [
    [`target`, is.object],
    [`mapping`, is.object, is.func],
    [`context`, is.object, is.undefined]
]

export function map(target, mapping, context) {
    return new Proxy(new Mapping(mapping, context), {
        get(map, key) {
            if (Reflect.has(map, key)) {
                return resolve(target, Reflect.get(map, key))
            }
        },
        set(map, key, value) {
            if (Reflect.has(map, key)) {
                return resolve(target, Reflect.get(map, key), Reflect.set, value)
            }
        }
    })
}

compute.args = [[`target`, is.object]]

export function compute(target, ...args) {
    return args.reduce((result, arg, idx) => {
        if (idx === args.length - 1)
            return is.box(arg) ? resolve(target, arg) : is.func(arg) ? arg(result) : arg

        return is.box(arg)
            ? [...result, resolve(target, arg)]
            : is.func(arg) ? [...result, arg(...result)] : [...result, arg]
    }, [])
}

export function keys(target) {
    return Object.keys(target)
}

export function assign(target, ...args) {
    return Object.assign(target, ...args)
}

export function join(target, separator) {
    return target.join(separator)
}

export function concat(target, ...args) {
    return target.concat(...args)
}

export function push(target, ...args) {
    return target.push(...args)
}

export function pop(target) {
    return target.pop()
}

export function unshift(target, ...args) {
    return target.unshift(...args)
}

export function shift(target) {
    return target.shift()
}

export function slice(target, ...args) {
    return target.slice(...args)
}

export function splice(target, ...args) {
    return target.splice(...args)
}

export function stringify(target, tab = 4) {
    return JSON.stringify(target, null, tab)
}

export function split(target, sep) {
    return target.split(sep)
}

export function toUpper(target) {
    return target.toUpperCase()
}

export function toLower(target) {
    return target.toLowerCase()
}

/** ... */

export function inc(target) {
    return target + 1
}

export function dec(target) {
    return target - 1
}

export function toggle(target) {
    return !target
}

export function eq(target, value) {
    return target === value
}

export function gt(target, value) {
    return target > value
}

export function lt(target, value) {
    return target < value
}

export function type(target, value) {
    return typeof target === value
}
