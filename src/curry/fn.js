import curryTo from "./to"

function curryFn(...args) {
    const body = "return " + args.pop()
    const fn = Function(...args, body)

    return curryTo(fn.length, fn)
}

export default curryFn
