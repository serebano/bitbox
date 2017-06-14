import desc from "./desc"
//import curry from "./curry.x"
import is from "../is"
import print from "../operators/print"
import { isCurryable } from "./isCurryable"

export function createFn(length, fn) {
    switch (length) {
        case 0:
            return function f() {
                return fn.apply(this, arguments)
            }
        case 1:
            return function f1(a0) {
                return fn.apply(this, arguments)
            }
        case 2:
            return function f2(a0, a1) {
                return fn.apply(this, arguments)
            }
        case 3:
            return function f3(a0, a1, a2) {
                return fn.apply(this, arguments)
            }
        case 4:
            return function f4(a0, a1, a2, a3) {
                return fn.apply(this, arguments)
            }
        case 5:
            return function f5(a0, a1, a2, a3, a4) {
                return fn.apply(this, arguments)
            }
        case 6:
            return function f6(a0, a1, a2, a3, a4, a5) {
                return fn.apply(this, arguments)
            }
        case 7:
            return function f7(a0, a1, a2, a3, a4, a5, a6) {
                return fn.apply(this, arguments)
            }
        case 8:
            return function f8(a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.apply(this, arguments)
            }
        case 9:
            return function f9(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.apply(this, arguments)
            }
        case 10:
            return function f10(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.apply(this, arguments)
            }
        default:
            throw new Error("First argument to arity must be a non-negative integer no greater than ten")
    }
}

function create(length, nextFn, targetFn, args, argNames = [], argMap = []) {
    const fn = (nextFn.fn = createFn(length, nextFn))
    const name = targetFn.displayName || targetFn.name
    const rest = argNames.filter((name, idx) => is.placeholder(args[idx]) || !argMap.includes(name))

    fn.args = args
    fn.rest = rest
    fn.argNames = argNames
    fn.displayName = name

    const toPrimitive = a => {
        const receivedLen = args.length
        //console.log(`toPrimitive`, name, receivedLen, a, argNames, args, rest)
        return `${name}(${argNames
            .map((name, idx) => {
                if (receivedLen > idx) {
                    const argName = a[idx] || name
                    const argValue = args[idx]
                    //console.log(`received-arg ->`, idx, argName, argValue)
                    if (is.placeholder(argValue)) {
                        return argValue.toString(argName)
                    }
                    return is.string(argValue) ? `"${argValue}"` : argValue
                }
                const argName = a[idx - receivedLen] || name
                //console.log(`arg->`, idx, idx - receivedLen, argName)
                return argName
            })
            .join(", ")})`
    }

    fn.toString = (...x) => {
        if (x.length) return toPrimitive(x)
        const receivedLen = args.length
        return `(${rest.join(", ")}) => ${name}(${argNames
            .map((arg, idx) => {
                if (receivedLen > idx) {
                    const value = args[idx]
                    if (is.placeholder(value)) return value.toString(arg)
                    return is.string(value) ? `"${value}"` : value
                }
                return arg
            })
            .join(", ")})`
    }
    fn[isCurryable] = true
    return fn
}

export default create
