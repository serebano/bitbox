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
export { default as observe } from "./observe"
export { default as delay } from "./delay"

import * as array from "./array"
import * as object from "./object"
import * as primitive from "./primitive"

export { array, object, primitive }

/**
 * The Operators
 */

export function or(...args) {
    function operator(target, args) {
        return args.find(arg => typeof arg !== "undefined")
    }
    operator.args = args
    return operator
}

export function and(...args) {
    function operator(target, args) {
        return args.every(arg => arg(target))
    }
    operator.args = args
    return operator
}

export function not(...args) {
    function operator(target, args) {
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
