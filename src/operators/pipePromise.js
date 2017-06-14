import tail from "./tail"
import reduce from "./reduce"
import { createFn } from "../curry/create"

export function _pipePromise(f, g) {
    return function u() {
        const ctx = this
        return f.apply(ctx, arguments).then(function(x) {
            return g.call(ctx, x)
        })
    }
}

export default function pipePromise() {
    if (arguments.length === 0) {
        throw new Error("pipePromise requires at least one argument")
    }
    return createFn(arguments[0].length, reduce(_pipePromise, arguments[0], tail(arguments)))
}
