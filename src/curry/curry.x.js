import { getArgNames, toCamelCase, toDisplayName } from "../utils"

export default function curry(fn) {
    const length = fn.length
    next.argNames = getArgNames(fn)
    next.toString = () => toDisplayName(fn.name, next.argNames) //`function ${fn.name}(${next.argNames.join(", ")}) {}`

    function next(...args) {
        if (args.length >= length) {
            return fn.call(this, ...args)
        }

        const f = (...rest) => next.call(this, ...args, ...rest)

        f._name = fn.name
        f._args = args
        f._length = args.length
        f._expectedLength = length - args.length
        f.argNames = next.argNames.slice(f._expectedLength)
        f.toString = () => toDisplayName(f._name, f.argNames, args) //`function ${fn.name}(${args.map(String).join(", ")}) {}`

        return f
    }

    return next
}

// function curryN(length, received, fn) {
//     function N() {
//         let combined = []
//         let argsIdx = 0
//         let left = length
//         let combinedIdx = 0
//
//         while (combinedIdx < received.length || argsIdx < arguments.length) {
//             let result
//             if (
//                 combinedIdx < received.length &&
//                 (!is.placeholder(received[combinedIdx]) || argsIdx >= arguments.length)
//             ) {
//                 result = received[combinedIdx]
//             } else {
//                 result = arguments[argsIdx]
//                 argsIdx += 1
//             }
//             combined[combinedIdx] = result
//             if (!is.placeholder(result)) left -= 1
//             combinedIdx += 1
//         }
//
//         if (left <= 0) return fn.apply(this, combined)
//
//         const f = create(left, curryN(length, combined, fn))
//
//         return desc(fn, f, combined, length, left)
//     }
//
//     return desc(fn, N, received, length)
// }
