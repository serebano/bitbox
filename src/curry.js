import is from "./is"
import __ from "./__"
import arity from "./arity"
import { getArgNames } from "./utils"

function fnToString(fn) {
    return fn.displayName || fn.name || fn.toString()
}

function curry(fn) {
    const length = arguments.length === 2 ? (is.integer(arguments[1]) ? arguments[1] : arguments[1].length) : fn.length
    const argNames = arguments.length === 2 && Array.isArray(arguments[1])
        ? arguments[1]
        : fn.argNames || getArgNames(fn)
    const name = fn.displayName || fn.name

    const fna = arity(length, function __fn1(...args) {
        let n = args.length
        let shortfall = length - n
        let idx = n

        while (--idx >= 0) {
            if (is.placeholder(args[idx])) shortfall += 1
        }

        if (shortfall <= 0) {
            return fn(...args)
        }

        const fnb = arity(shortfall, function __fn2(...rest) {
            return fna(
                ...args
                    .map(arg => (is.placeholder(arg) ? (arg !== __ ? arg(rest.shift()) : rest.shift()) : arg))
                    .concat(rest)
            )
        })

        fnb[Symbol.for("functional/curryable")] = true
        fnb.displayName = name
        fnb.argNames = argNames.slice(fnb.length)
        fnb.args = args

        fnb.toString = () => fnToString(fn) + "(" + args.map(String).join(", ") + ")"

        return fnb
    })

    fna[Symbol.for("functional/curryable")] = true

    fna.displayName = name
    fna.argNames = argNames
    fna.args = []

    fna.toString = () => fnToString(fn) + "(" + argNames.join(", ") + ")"

    return fna
}

export default curry
