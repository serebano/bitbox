import arity from "./arity"
import is from "./is"

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

function curry(fn, ...initialArgs) {
    const len = is.integer(initialArgs[0])
        ? initialArgs[0]
        : containsPlaceholder(initialArgs) ? initialArgs.length : fn.length
    if (is.integer(initialArgs[0])) initialArgs = []

    const _curry = (...args) => {
        const f = (...newArgs) => {
            const concatedArgs = merge(args, newArgs)
            return actualLength(concatedArgs) >= len ? fn(...concatedArgs.slice(0, len)) : _curry(...concatedArgs)
        }

        return arity(len - actualLength(args), f)
    }

    return _curry(...initialArgs)()
}

export default curry
