import Project from "../bits/project";
import Compute from "../bits/compute";
import { isObservable } from "../observer";
import { symbol } from "../bitbox";

const handler = ["resolve", "get", "set", "has", "apply", "unset"];

const is = {
    observable: arg => is.object(arg) && isObservable(arg),
    box: arg => is.function(arg) && Reflect.has(arg, symbol.keys),
    trap: arg => is.function(arg) && handler.includes(arg.name),
    project: arg => Project.isProject(arg),
    compute: arg => arg && Compute.isCompute(arg),
    promise: arg => arg instanceof Promise,
    array: arg => Array.isArray(arg),
    string: arg => typeof arg === "string",
    number: arg => typeof arg === "number",
    object: arg => typeof arg === "object", // && !is.array(arg),
    function: arg => typeof arg === "function",
    undefined: arg => typeof arg === "undefined",
    null: arg => arg === null
};

export default is;
