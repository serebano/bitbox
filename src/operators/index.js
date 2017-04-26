export { default as compute } from "./compute"
export { default as template } from "./template"
export { default as delay } from "./delay"

import * as array from "./array"
import * as object from "./object"
import * as string from "./string"

export { array, object, string }

/**
 * The Operators
 */

export function stringify(target) {
    return JSON.stringify(target, null, 4)
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

export function or(...args) {
    function operator(target, ...args) {
        return args.find(arg => typeof arg !== "undefined")
    }
    operator.args = args
    return operator
}

export function and(...args) {
    function operator(target, ...args) {
        return args.every(arg => arg(target))
    }
    operator.args = args
    return operator
}

export function not(...args) {
    function operator(target, ...args) {
        return args.every(arg => !arg(target))
    }
    operator.args = args
    return operator
}

export function eq(value) {
    function operator(state) {
        return state === value
    }
    return operator
}

export function gt(value) {
    function operator(state) {
        return state > value
    }
    return operator
}

export function lt(value) {
    function operator(state) {
        return state < value
    }
    return operator
}

export function type(test) {
    function operator(target) {
        return typeof target === test
    }
    return operator
}
