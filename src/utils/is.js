import Project from "../bits/project";
import Path from "../path";
import Compute from "../bits/compute";
import { isObservable } from "../observer";

const is = {
    bit: arg => arg && isObservable(arg),
    project: arg => Project.isProject(arg),
    path: arg => arg && Path.isPath(arg),
    compute: arg => arg && Compute.isCompute(arg),
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
