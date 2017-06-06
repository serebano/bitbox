import { getArgNames, toCamelCase } from "../utils"

export default function curry(fn) {
    const length = fn.length
    next.argNames = getArgNames(fn)
    next.toString = () => `function ${fn.name}(${next.argNames.join(", ")}) {}`

    function next(...args) {
        if (args.length >= length) {
            return fn.call(this, ...args)
        }

        const f = (...rest) => next.call(this, ...args, ...rest)

        f._name = fn.name
        f._args = args
        f._length = args.length
        f._expectedLength = length - args.length
        f.argNames = next.argNames.slice(0, args.length)
        f.toString = () => `function ${fn.name}(${args.map(String).join(", ")}) {}`

        return f
    }

    return next
}
