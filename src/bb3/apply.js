export default function apply(fn, ...args) {
    return (..._args) => {
        return fn(...args, ..._args)
    }
}
