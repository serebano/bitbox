import { isObservable } from "../observer"
import { symbol } from "../bitbox"

const is = {
    box: arg => is.function(arg) && Reflect.has(arg, symbol.path),
    observable: arg => isObservable(arg),
    object: arg => typeof arg === "object" && arg !== null && !Array.isArray(arg),
    complexObject: arg => typeof arg === "object" && arg !== null,
    function: arg => typeof arg === "function",
    array: arg => Array.isArray(arg),
    promise: arg => arg instanceof Promise,
    string: arg => typeof arg === "string",
    number: arg => typeof arg === "number",
    symbol: arg => typeof arg === "symbol",
    undefined: arg => typeof arg === "undefined",
    null: arg => arg === null
}

export default is
