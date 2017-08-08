import arity from "./arity"
import is from "./is"
import { getArgNames } from "./utils"

const merge = (dest, origin) => {
    const newArgs = dest.map(i => {
        let elem = i
        if (is.placeholder(i) && origin[0]) {
            elem = i.name !== "__" ? i(origin.shift()) : origin.shift()
        }
        return elem
    })

    return newArgs.concat(origin)
}

const actualLength = arr => arr.reduce((len, curr) => (is.placeholder(curr) ? len : len + 1), 0)

const containsPlaceholder = args => args.some(is.placeholder)
function fnToString(fn) {
    return fn.displayName || fn.name || fn.toString()
}

function curry(fn, ...initialArgs) {
    const len = is.integer(initialArgs[0])
        ? initialArgs[0]
        : containsPlaceholder(initialArgs) ? initialArgs.length : fn.length
    if (is.integer(initialArgs[0])) initialArgs = []
    const argNames = fn.argNames || getArgNames(fn)
    const name = fn.displayName || fn.name

    const _curry = (...args) => {
        const f = (...newArgs) => {
            if (!newArgs.length) return fx
            const concatedArgs = merge(args, newArgs)
            return actualLength(concatedArgs) >= len ? fn(...concatedArgs.slice(0, len)) : _curry(...concatedArgs)
        }

        const fx = arity(len - actualLength(args), f)

        fx[Symbol.for("functional/curryable")] = true
        fx.displayName = name
        fx.argNames = argNames.slice(fx.length)
        fx.args = args

        fx.toString = () => fnToString(fn) + "(" + args.map(String).join(", ") + ")"

        return fx
    }

    return _curry(...initialArgs)()
}

export default curry
