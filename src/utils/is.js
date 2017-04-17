import { isObservable } from "../observer";
import { symbol } from "../bitbox";

const handler = ["resolve", "get", "set", "has", "apply", "unset"];

const is = {
    box: arg => is.function(arg) && Reflect.has(arg, symbol.path),
    trap: arg => is.function(arg) && handler.includes(arg.name),
    observable: arg => is.object(arg) && isObservable(arg),
    promise: arg => arg instanceof Promise,
    array: arg => Array.isArray(arg),
    string: arg => typeof arg === "string",
    number: arg => typeof arg === "number",
    object: arg => typeof arg === "object" && arg !== null && !Array.isArray(arg),
    function: arg => typeof arg === "function",
    undefined: arg => typeof arg === "undefined",
    null: arg => arg === null
};

export default is;
