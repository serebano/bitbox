import bitbox from "."
import resolve from "./resolve"
import Mapping from "./mapping"
import observer from "./observer"
import { is } from "../utils"

export function get(box) {
    return target => resolve(target, box)
}

export function set(box, value) {
    return target => resolve(target, box, Reflect.set, value)
}

export function has(box) {
    return target => resolve(target, box, Reflect.has)
}

export function unset(box) {
    return target => resolve(target, box, Reflect.deleteProperty)
}

export function map(mapping, context, strict) {
    return new Mapping(mapping, context, strict)
}

export function proxy(handler) {
    return target => new Proxy(target, handler)
}

export function compute(...args) {
    return function compute(target) {
        return args.reduce((result, arg, idx) => {
            if (idx === args.length - 1)
                return is.box(arg) ? resolve(target, arg) : is.func(arg) ? arg(result) : arg

            return is.box(arg)
                ? [...result, resolve(target, arg)]
                : is.func(arg) ? [...result, arg(...result)] : [...result, arg]
        }, [])
    }
}
