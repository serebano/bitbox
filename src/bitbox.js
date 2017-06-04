import * as operators from "./operators"
import * as observer from "./observer"

export * from "./operators"
export { default as is } from "./is"
export { default as box } from "./box"
export { default as curry } from "./curry"
export { default as resolve } from "./resolve"
export { observer, operators }
export { observable, isObservable, observe, unobserve, unqueue, exec } from "./observer/observer"

export function Demo(key, value, object) {
    return { key, value, object }
}
