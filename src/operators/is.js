import { isObservable } from "../observer"
import { symbol } from "../create"
import mapping from "../mapping"

const is = {
    box: arg => is.func(arg) && Reflect.has(arg, symbol.path),
    map: arg => mapping.has(arg), //is.object(arg) && Reflect.has(arg, symbol.map),
    observable: arg => isObservable(arg),
    func: arg => typeof arg === "function",
    object: arg => typeof arg === "object" && arg !== null && !Array.isArray(arg),
    complexObject: arg => typeof arg === "object" && arg !== null,
    array: arg => Array.isArray(arg),
    promise: arg => arg instanceof Promise,
    string: arg => typeof arg === "string",
    number: arg => typeof arg === "number",
    symbol: arg => typeof arg === "symbol",
    undefined: arg => typeof arg === "undefined",
    null: arg => arg === null
}

export default is
