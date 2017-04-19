export { default as get } from "./get"
export { default as set } from "./set"
export { default as has } from "./has"
export { default as map } from "./map"
export { default as keys } from "./keys"
export { default as unset } from "./unset"
export { default as apply } from "./apply"
export { default as call } from "./call"
export { default as compute } from "./compute"
export { default as template } from "./template"
//export { default as signal } from "./signal"

/**
 * The Operators
 */

export function or(value) {
    function operator(target) {
        return typeof target === "undefined" ? value : target
    }
    operator.displayName = `or(${value})`
    return operator
}

export function eq(value) {
    function operator(state) {
        return state === value
    }
    operator.displayName = `eq(${value})`
    return operator
}

export function gt(value) {
    function operator(state) {
        return state > value
    }
    operator.displayName = `gt(${value})`
    return operator
}

export function lt(value) {
    function operator(state) {
        return state < value
    }
    operator.displayName = `lt(${value})`
    return operator
}

export function type(value) {
    function operator(state) {
        return typeof state === value
    }
    operator.displayName = `type(${value})`
    return operator
}

export function concat(value) {
    function operator(state) {
        return state.concat(value)
    }
    operator.displayName = `concat(${value})`
    return operator
}

export function join(separator) {
    function operator(array) {
        return array.join(separator)
    }
    operator.displayName = `join(${separator})`
    return operator
}

export function arrayMap(fn) {
    function operator(array) {
        return array.map(fn)
    }
    operator.displayName = `map(${fn.displayName || fn.name})`
    return operator
}

export function stringify(target) {
    return JSON.stringify(target, null, 4)
}

export function toUpper(value) {
    return value.toUpperCase()
}

export function toLower(value) {
    return value.toLowerCase()
}

export function object(obj) {
    return Object.assign({}, obj)
}

export function inc(number) {
    return number + 1
}

export function dec(number) {
    return number - 1
}

export function toggle(value) {
    return !value
}
