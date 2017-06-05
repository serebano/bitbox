export default function curry(fn) {
    const length = fn.length
    function next(...args) {
        if (args.length >= length) {
            return fn.call(this, ...args)
        }

        const f = (...rest) => next.call(this, ...args, ...rest)

        f._name = fn.name
        f._args = args
        f._length = args.length
        f._expectedLength = length

        return f
    }

    return next
}
