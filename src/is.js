import { proxies } from "./observer/store"

const is = {
    box: arg => is.func(arg) && Reflect.has(arg, Symbol.for("box/path")),
    observable(object) {
        return is.complexObject(object) && proxies.get(object) === object
    },
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
