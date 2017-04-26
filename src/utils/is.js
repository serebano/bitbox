import { isObservable } from "../bitbox/observer"
import { symbol } from "../bitbox/create"

const is = {
    func: arg => typeof arg === "function",
    box: arg => is.func(arg) && Reflect.has(arg, symbol.path),
    observable: arg => isObservable(arg),
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
