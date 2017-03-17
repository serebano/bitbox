import Path from "../../Path";
import array, { ComputeArray } from "./array";
import object, { ComputeObject } from "./object";
import * as tags from "../";

function compute(args) {
    if (!arguments.length) throw new Error(`Missing targets`);

    if (arguments.length === 1) {
        if (args instanceof Path) return args;
        if (typeof args === "function") return compute(args(tags));
        if (Array.isArray(args)) return new ComputeArray(args);
        if (typeof args === "object") return new ComputeObject(args);
    }

    return new ComputeArray(Array.from(arguments));
}

compute.array = array;
compute.object = object;

export default compute;
