import Map from "../map";
import { isPath } from "../path";
import { isCompute } from "../compute";
import { isObservable } from "../observer";

const is = {
    bit: arg => arg && isObservable(arg),
    map: arg => arg instanceof Map,
    path: arg => arg && isPath(arg),
    compute: arg => arg && isCompute(arg),
    promise: arg => arg instanceof Promise,
    array: arg => Array.isArray(arg),
    string: arg => typeof arg === "string",
    number: arg => typeof arg === "number",
    object: arg => typeof arg === "object" && !is.array(arg),
    function: arg => typeof arg === "function",
    undefined: arg => typeof arg === "undefined",
    null: arg => arg === null
};

export default is;
