import Map from "./map";
import Path from "./path";
import Compute from "./compute";
import Observe from "./observe";

const is = {
    bit: arg => arg && Observe.isObservable(arg),
    map: arg => arg instanceof Map,
    path: arg => Path.isPath(arg),
    compute: arg => arg instanceof Compute,
    array: arg => Array.isArray(arg),
    string: arg => typeof arg === "string",
    number: arg => typeof arg === "number",
    object: arg => typeof arg === "object" && !is.array(arg),
    function: arg => typeof arg === "function",
    undefined: arg => typeof arg === "undefined",
    null: arg => arg === null
};

export default is;
