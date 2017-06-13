import desc from "./desc"
//import curry from "./curry.x"
import is from "../is"
import print from "../operators/print"

function createFn(length, fn) {
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
    const receiverFn = createFn(length, nextFn)
    receiverFn.argNames = argNames
    receiverFn.args = args
    receiverFn.box = (...args) => createFn(args.length, (...rest) => console.log({ args, rest, targetFn, nextFn }))
    nextFn.fn = receiverFn

    const name = targetFn.displayName || targetFn.name
    const rest = argNames.filter((name, idx) => is.placeholder(args[idx]) || !argMap.includes(name))
    receiverFn.rest = rest

    receiverFn.toString = () => {
        if (!argMap.length) return `function ${name}(${rest.join(", ")}) {...}`
        return `(${rest.join(", ")}) => ${name}(${argNames
            .map((arg, idx) => `${arg}${args.length > idx && !is.placeholder(args[idx]) ? ":" + args[idx] : ""}`)
            .join(", ")})`
    }

    return receiverFn
}

export default create
