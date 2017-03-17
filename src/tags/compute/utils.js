import Path from "../../Path";
import ComputeArray from "./array";
import ComputeObject from "./object";

export function ensure(arg) {
    if (arg instanceof Path) return arg;

    if (Array.isArray(arg)) return new ComputeArray(arg);

    if (typeof arg === "object") return new ComputeObject(arg);

    return arg;
}
