import * as operators from "./operators"
import * as observer from "./observer"
import curry from "./curry"

export * from "./operators"
export { default as is } from "./is"
export { default as box } from "./box"
export { default as curry } from "./curry"
export { default as resolve } from "./resolve"
export { observer, operators }
export { observable, isObservable, unobserve, unqueue, exec } from "./observer/observer"

export function Demo(key, value, object) {
    return { key, value, object }
}

export function g(a, b, c) {
    return [ a, b, c ]
}

export function args(...args) {
  return args
}

export const x = curry(g)
