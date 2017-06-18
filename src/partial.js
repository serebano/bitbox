import arity from "./arity"

// Apply left arbitrary number of arguments

function partial(fn, ...args) {
    return arity(Math.max(0, fn.length - args.length), (...rest) => fn(...args, ...rest))
}

export default partial
