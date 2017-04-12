import Project from "../bits/project";
import Compute from "../bits/compute";
import { isObservable } from "../observer";

const traps = ["resolve", "get", "set", "has", "apply", "deleteProperty"];

const is = {
    bit: arg => is.object(arg) && isObservable(arg),
    box: arg => is.function(arg) && Reflect.has(arg, Symbol.for("bitbox.keys")),
    project: arg => Project.isProject(arg),
    compute: arg => arg && Compute.isCompute(arg),
    trap: arg => is.function(arg) && traps.includes(arg.name),
    bitbox: arg => is.function(arg) && Reflect.has(arg, Symbol.for("bitbox.keys")),
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
