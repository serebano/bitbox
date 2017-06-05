import { isObservable } from "./observer"
import isPlaceholder from "./internal/isPlaceholder"

const is = Object.assign(
    function is(Ctor, val) {
        return (val != null && val.constructor === Ctor) || val instanceof Ctor
    },
    {
        box: arg => is.func(arg) && Reflect.has(arg, Symbol.for("box/path")),
        observable: arg => isObservable(arg),
        placeholder: arg => arg && isPlaceholder(arg),
        func: arg => typeof arg === "function",
        object: arg => typeof arg === "object" && arg !== null && !Array.isArray(arg),
        complexObject: arg => typeof arg === "object" && arg !== null,
        array: arg => Array.isArray(arg),
        promise: arg => arg instanceof Promise,
        string: arg => typeof arg === "string",
        number: arg => typeof arg === "number",
        numeric: arg => !is.symbol(arg) && !isNaN(arg),
        symbol: arg => typeof arg === "symbol",
        undefined: arg => typeof arg === "undefined",
        null: arg => arg === null
    }
)

export default is
